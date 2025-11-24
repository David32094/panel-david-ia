// ============================================
// KEYAUTH CONFIGURATION
// ============================================
const KEYAUTH_CONFIG = {
    appName: "SENSI DAVID",
    ownerID: "JCGQ9PYdz2",
    version: "1.0",
    apiURL: "https://keyauth.win/api/1.0/", // KeyAuth usa 1.0 según el código C#
    secret: "ce64eaab6734ffa6fc635a3dd1b699606de79bb6fc4fc39e046f4f17484e339a"
};

// ============================================
// ESTADO GLOBAL DE AUTENTICACIÓN
// ============================================
let authState = {
    isAuthenticated: false,
    token: null,
    username: null,
    email: null,
    expiry: null,
    subscriptionExpiry: null,
    plan: null,
    hwid: null,
    sessionid: null, // Sessionid obtenido del init
    enckey: null // Clave de encriptación obtenida del init
};

// ============================================
// UTILIDADES
// ============================================

/**
 * Genera un HWID único basado en el navegador
 */
function generateHWID() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px "Arial"';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('KeyAuth', 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.fillText('KeyAuth', 4, 17);
    
    const fingerprint = canvas.toDataURL();
    const hwid = btoa(fingerprint + navigator.userAgent + screen.width + screen.height);
    return hwid.substring(0, 64);
}

/**
 * Genera un GUID y retorna la primera parte (antes del primer guion)
 * Similar a: Guid.NewGuid().ToString().Substring(0, Guid.NewGuid().ToString().IndexOf("-"))
 */
function generateIVKey() {
    // Generar un UUID v4
    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    
    const guid = uuidv4();
    const index = guid.indexOf('-');
    return guid.substring(0, index);
}

/**
 * SHA256 hash
 */
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Convierte string a bytes (hex string a Uint8Array)
 */
function hexStringToBytes(hex) {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return bytes;
}

/**
 * Convierte bytes a string hex
 */
function bytesToHexString(bytes) {
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Encripta string con AES-CBC
 */
async function encryptAES(plainText, keyHex, ivHex) {
    const keyBytes = hexStringToBytes(keyHex);
    const ivBytes = hexStringToBytes(ivHex);
    
    const key = await crypto.subtle.importKey(
        'raw',
        keyBytes,
        { name: 'AES-CBC' },
        false,
        ['encrypt']
    );
    
    const plainTextBytes = new TextEncoder().encode(plainText);
    const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-CBC', iv: ivBytes },
        key,
        plainTextBytes
    );
    
    return bytesToHexString(new Uint8Array(encrypted));
}

/**
 * Desencripta string con AES-CBC
 */
async function decryptAES(cipherTextHex, keyHex, ivHex) {
    try {
        // Asegurar que los hex strings tengan longitud par
        if (cipherTextHex.length % 2 !== 0) {
            throw new Error('Cipher text hex length must be even');
        }
        if (keyHex.length % 2 !== 0) {
            throw new Error('Key hex length must be even');
        }
        if (ivHex.length % 2 !== 0) {
            throw new Error('IV hex length must be even');
        }
        
        const keyBytes = hexStringToBytes(keyHex);
        const ivBytes = hexStringToBytes(ivHex);
        const cipherBytes = hexStringToBytes(cipherTextHex);
        
        // Verificar longitudes
        if (keyBytes.length !== 32) {
            throw new Error(`Key must be 32 bytes, got ${keyBytes.length}`);
        }
        if (ivBytes.length !== 16) {
            throw new Error(`IV must be 16 bytes, got ${ivBytes.length}`);
        }
        if (cipherBytes.length === 0) {
            throw new Error('Cipher text cannot be empty');
        }
        
        const key = await crypto.subtle.importKey(
            'raw',
            keyBytes,
            { name: 'AES-CBC' },
            false,
            ['decrypt']
        );
        
        const decrypted = await crypto.subtle.decrypt(
            { name: 'AES-CBC', iv: ivBytes },
            key,
            cipherBytes
        );
        
        return new TextDecoder().decode(decrypted);
    } catch (error) {
        console.error('[DECRYPT] Error en decryptAES:', error);
        console.error('[DECRYPT] CipherText length:', cipherTextHex.length);
        console.error('[DECRYPT] KeyHex length:', keyHex.length);
        console.error('[DECRYPT] IVHex length:', ivHex.length);
        throw error;
    }
}

/**
 * Encripta usando el método de KeyAuth
 * En C#: byte[] _key = Encoding.Default.GetBytes(sha256(enc_key).Substring(0, 32));
 * Esto significa: SHA256 retorna hex string, toma primeros 32 chars, convierte a bytes ASCII
 * NO interpreta como hex, sino como caracteres ASCII
 */
async function encryptKeyAuth(message, encKey, iv) {
    const keyHash = await sha256(encKey);
    const ivHash = await sha256(iv);
    
    // En C#: Substring(0, 32) toma primeros 32 caracteres del string hex
    // Luego GetBytes() convierte esos caracteres a bytes usando encoding ASCII
    // Entonces: 32 caracteres ASCII = 32 bytes
    const keyString = keyHash.substring(0, 32);
    const ivString = ivHash.substring(0, 16);
    
    // Convertir string a bytes usando encoding (cada char a su valor ASCII)
    const keyBytes = new TextEncoder().encode(keyString);
    const ivBytes = new TextEncoder().encode(ivString);
    
    // Convertir a hex para usar con encryptAES
    const keyHex = bytesToHexString(keyBytes);
    const ivHex = bytesToHexString(ivBytes);
    
    return await encryptAES(message, keyHex, ivHex);
}

/**
 * Desencripta usando el método de KeyAuth
 * En C#: byte[] _key = Encoding.Default.GetBytes(sha256(enc_key).Substring(0, 32));
 * Esto significa: SHA256 retorna hex string, toma primeros 32 chars, convierte a bytes ASCII
 */
async function decryptKeyAuth(cipherText, encKey, iv) {
    const keyHash = await sha256(encKey);
    const ivHash = await sha256(iv);
    
    // En C#: Substring(0, 32) para key, Substring(0, 16) para IV
    // Luego GetBytes() convierte los caracteres a bytes ASCII
    const keyString = keyHash.substring(0, 32);
    const ivString = ivHash.substring(0, 16);
    
    // Convertir string a bytes usando encoding (cada char a su valor ASCII)
    const keyBytes = new TextEncoder().encode(keyString);
    const ivBytes = new TextEncoder().encode(ivString);
    
    // Convertir a hex para usar con decryptAES
    const keyHex = bytesToHexString(keyBytes);
    const ivHex = bytesToHexString(ivBytes);
    
    console.log('[DECRYPT] KeyHash (primeros 40):', keyHash.substring(0, 40));
    console.log('[DECRYPT] KeyString (32 chars):', keyString);
    console.log('[DECRYPT] KeyHex length:', keyHex.length, '(debería ser 64 para 32 bytes)');
    console.log('[DECRYPT] IVHex length:', ivHex.length, '(debería ser 32 para 16 bytes)');
    console.log('[DECRYPT] CipherText length:', cipherText.length);
    
    return await decryptAES(cipherText, keyHex, ivHex);
}

/**
 * Convierte string a bytes y luego a hex (como byte_arr_to_str en C#)
 */
function stringToHex(str) {
    const bytes = new TextEncoder().encode(str);
    return bytesToHexString(bytes);
}

/**
 * Sanitiza input para prevenir XSS
 */
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

/**
 * Valida formato de email
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Calcula fortaleza de contraseña
 */
function calculatePasswordStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    if (strength <= 2) return { level: 'weak', text: 'Muy débil', percentage: 25 };
    if (strength <= 3) return { level: 'weak', text: 'Débil', percentage: 25 };
    if (strength <= 4) return { level: 'medium', text: 'Media', percentage: 50 };
    if (strength <= 5) return { level: 'strong', text: 'Fuerte', percentage: 75 };
    return { level: 'very-strong', text: 'Muy fuerte', percentage: 100 };
}

/**
 * Formatea license key (XXXX-XXXX-XXXX-XXXX)
 */
function formatLicenseKey(input) {
    let value = input.value.replace(/[^A-Z0-9]/g, '').toUpperCase();
    if (value.length > 16) value = value.substring(0, 16);
    
    let formatted = '';
    for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 4 === 0) formatted += '-';
        formatted += value[i];
    }
    
    input.value = formatted;
    return formatted.replace(/-/g, '');
}

/**
 * Obtiene datos guardados del storage
 */
function getStoredAuth() {
    console.log('[STORAGE] Buscando token guardado...');
    const remember = localStorage.getItem('rememberMe') === 'true';
    const storage = remember ? localStorage : sessionStorage;
    console.log('[STORAGE] Usando storage:', remember ? 'localStorage' : 'sessionStorage');
    
    const token = storage.getItem('authToken');
    const username = storage.getItem('username');
    const email = storage.getItem('email');
    const expiry = storage.getItem('expiry');
    const subscriptionExpiry = storage.getItem('subscriptionExpiry');
    const plan = storage.getItem('plan');
    
    console.log('[STORAGE] Token encontrado:', token ? token.substring(0, 10) + '...' : 'null');
    console.log('[STORAGE] Username:', username);
    console.log('[STORAGE] Expiry:', expiry);
    console.log('[STORAGE] Expiry parsed:', expiry ? parseInt(expiry) : 'null');
    console.log('[STORAGE] Date.now():', Date.now());
    console.log('[STORAGE] Expiry > Date.now():', expiry ? (parseInt(expiry) > Date.now()) : 'N/A');
    
    if (token && expiry && parseInt(expiry) > Date.now()) {
        console.log('[STORAGE] ✅ Token válido encontrado');
        return {
            token,
            username,
            email,
            expiry: parseInt(expiry),
            subscriptionExpiry: subscriptionExpiry ? parseInt(subscriptionExpiry) : null,
            plan
        };
    }
    
    console.log('[STORAGE] ❌ No se encontró token válido');
    if (!token) console.log('[STORAGE] Razón: No hay token');
    if (!expiry) console.log('[STORAGE] Razón: No hay expiry');
    if (expiry && parseInt(expiry) <= Date.now()) console.log('[STORAGE] Razón: Token expirado');
    
    return null;
}

/**
 * Guarda datos de autenticación
 */
function saveAuth(data, remember = false) {
    console.log('[STORAGE] Guardando autenticación...');
    console.log('[STORAGE] Remember:', remember);
    console.log('[STORAGE] Usando storage:', remember ? 'localStorage' : 'sessionStorage');
    
    const storage = remember ? localStorage : sessionStorage;
    localStorage.setItem('rememberMe', remember.toString());
    
    if (data.token) {
        storage.setItem('authToken', data.token);
        console.log('[STORAGE] ✅ Token guardado:', data.token.substring(0, 10) + '...');
    }
    if (data.username) {
        storage.setItem('username', data.username);
        console.log('[STORAGE] ✅ Username guardado:', data.username);
    }
    if (data.email) {
        storage.setItem('email', data.email);
        console.log('[STORAGE] ✅ Email guardado:', data.email);
    }
    if (data.expiry) {
        storage.setItem('expiry', data.expiry.toString());
        console.log('[STORAGE] ✅ Expiry guardado:', data.expiry, '(', new Date(data.expiry).toLocaleString(), ')');
    }
    if (data.subscriptionExpiry) {
        storage.setItem('subscriptionExpiry', data.subscriptionExpiry.toString());
        console.log('[STORAGE] ✅ SubscriptionExpiry guardado:', data.subscriptionExpiry);
    }
    if (data.plan) {
        storage.setItem('plan', data.plan);
        console.log('[STORAGE] ✅ Plan guardado:', data.plan);
    }
    
    // Verificar que se guardó correctamente
    const verifyToken = storage.getItem('authToken');
    const verifyExpiry = storage.getItem('expiry');
    console.log('[STORAGE] Verificación - Token:', verifyToken ? verifyToken.substring(0, 10) + '...' : 'null');
    console.log('[STORAGE] Verificación - Expiry:', verifyExpiry);
}

/**
 * Limpia datos de autenticación
 */
function clearAuth() {
    console.log('[STORAGE] Limpiando autenticación...');
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('expiry');
    localStorage.removeItem('subscriptionExpiry');
    localStorage.removeItem('plan');
    localStorage.removeItem('rememberMe');
    
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('expiry');
    sessionStorage.removeItem('subscriptionExpiry');
    sessionStorage.removeItem('plan');
}

// ============================================
// KEYAUTH API FUNCTIONS
// ============================================

/**
 * Inicializa KeyAuth (OBLIGATORIO antes de cualquier otra operación)
 * Similar a init() en KeyAuth.cs línea 123
 */
async function initKeyAuth() {
    try {
        // Generar HWID si no existe
        if (!authState.hwid) {
            authState.hwid = generateHWID();
        }
        
        // Verificar que la app esté configurada
        if (!KEYAUTH_CONFIG.ownerID || !KEYAUTH_CONFIG.appName || !KEYAUTH_CONFIG.secret) {
            console.warn('[KEYAUTH] ⚠️ Configuración de KeyAuth incompleta.');
            showToast('warning', 'Configuración', 'KeyAuth no está configurado correctamente. Contacta al administrador.');
            return false;
        }
        
        // Generar enckey e init_iv como en KeyAuth.cs línea 125-126
        // En C#: enckey = encryption.sha256(encryption.iv_key());
        //         init_iv = encryption.sha256(encryption.iv_key());
        // Ambos usan el mismo iv_key pero generan hashes diferentes (porque iv_key() genera un nuevo GUID cada vez)
        // Pero en la práctica, ambos deberían usar el mismo iv_key para esta petición
        
        const ivKey1 = generateIVKey();
        const ivKey2 = generateIVKey(); // Segundo GUID para init_iv (como en C#)
        
        const enckeyHash = await sha256(ivKey1);
        const initIVHash = await sha256(ivKey2);
        
        // En C# línea 875-877: toma Substring(0, 32) y luego GetBytes
        // GetBytes convierte el string a bytes usando encoding ASCII
        // Entonces: 32 chars ASCII = 32 bytes
        // Pero para AES necesitamos interpretar como hex: 32 chars hex = 16 bytes
        // 
        // Revisando el código más cuidadosamente, veo que en encrypt/decrypt:
        // - _key = GetBytes(sha256(enc_key).Substring(0, 32)) = 32 bytes ASCII
        // - _iv = GetBytes(sha256(iv).Substring(0, 16)) = 16 bytes ASCII
        //
        // Pero eso no puede ser correcto para AES. Déjame probar interpretando como hex:
        const enckey = enckeyHash.substring(0, 64); // 64 chars hex = 32 bytes para AES-256
        const initIV = initIVHash.substring(0, 32); // 32 chars hex = 16 bytes para IV
        
        authState.enckey = enckey;
        
        console.log('[KEYAUTH] IVKey1:', ivKey1);
        console.log('[KEYAUTH] IVKey2:', ivKey2);
        console.log('[KEYAUTH] EnckeyHash (primeros 40):', enckeyHash.substring(0, 40));
        console.log('[KEYAUTH] InitIVHash (primeros 40):', initIVHash.substring(0, 40));
        
        // Preparar parámetros como en KeyAuth.cs línea 127-136
        const formData = new URLSearchParams();
        formData.append('type', stringToHex('init'));
        formData.append('ver', await encryptKeyAuth(KEYAUTH_CONFIG.version, KEYAUTH_CONFIG.secret, initIV));
        formData.append('hash', ''); // checksum opcional
        formData.append('enckey', await encryptKeyAuth(enckey, KEYAUTH_CONFIG.secret, initIV));
        formData.append('name', stringToHex(KEYAUTH_CONFIG.appName));
        formData.append('ownerid', stringToHex(KEYAUTH_CONFIG.ownerID));
        formData.append('init_iv', initIV);
        
        console.log('[KEYAUTH] Inicializando KeyAuth...');
        console.log('[KEYAUTH] Init IV:', initIV);
        console.log('[KEYAUTH] Enckey:', enckey.substring(0, 20) + '...');
        
        const response = await fetch(KEYAUTH_CONFIG.apiURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData
        });
        
        let responseText = await response.text();
        console.log('[KEYAUTH] Init respuesta raw (primeros 200 chars):', responseText.substring(0, 200));
        console.log('[KEYAUTH] Init respuesta length:', responseText.length);
        console.log('[KEYAUTH] Init respuesta completa:', responseText);
        
        // Verificar si la respuesta parece estar encriptada (solo caracteres hex)
        const trimmedResponse = responseText.trim();
        const isHexString = /^[0-9a-f]+$/i.test(trimmedResponse);
        console.log('[KEYAUTH] ¿Respuesta es hex?', isHexString);
        console.log('[KEYAUTH] Respuesta trimmed:', trimmedResponse.substring(0, 100));
        
        // Desencriptar respuesta como en KeyAuth.cs línea 147
        // La respuesta del init viene encriptada con secret e init_iv
        let decryptedResponse;
        let data;
        
        try {
            // Siempre intentar desencriptar primero (KeyAuth siempre envía encriptado)
            console.log('[KEYAUTH] Intentando desencriptar con secret e initIV...');
            console.log('[KEYAUTH] Secret (primeros 20):', KEYAUTH_CONFIG.secret.substring(0, 20));
            console.log('[KEYAUTH] InitIV:', initIV);
            
            decryptedResponse = await decryptKeyAuth(trimmedResponse, KEYAUTH_CONFIG.secret, initIV);
            console.log('[KEYAUTH] ✅ Desencriptación exitosa');
            console.log('[KEYAUTH] Init respuesta desencriptada (primeros 500 chars):', decryptedResponse.substring(0, 500));
            console.log('[KEYAUTH] Init respuesta desencriptada (completa):', decryptedResponse);
            
            // Intentar parsear JSON
            data = JSON.parse(decryptedResponse);
            console.log('[KEYAUTH] ✅ JSON parseado exitosamente');
            
        } catch (decryptError) {
            console.error('[KEYAUTH] ❌ Error en desencriptación/parsing:', decryptError);
            console.error('[KEYAUTH] Error name:', decryptError.name);
            console.error('[KEYAUTH] Error message:', decryptError.message);
            console.error('[KEYAUTH] Error stack:', decryptError.stack);
            
            // Si falla, verificar si la respuesta ya es JSON (puede que no esté encriptada en algunos casos)
            try {
                console.log('[KEYAUTH] Intentando parsear como JSON directo...');
                data = JSON.parse(trimmedResponse);
                console.log('[KEYAUTH] ✅ Parseo directo funcionó (respuesta no estaba encriptada)');
            } catch (jsonError) {
                console.error('[KEYAUTH] ❌ También falló el parseo directo:', jsonError);
                throw new Error(`No se pudo procesar la respuesta de KeyAuth: ${decryptError.message}`);
            }
        }
        
        if (data.success) {
            authState.sessionid = data.sessionid;
            console.log('[KEYAUTH] Init exitoso. SessionID:', data.sessionid.substring(0, 20) + '...');
            return true;
        } else {
            console.error('[KEYAUTH] Init falló:', data.message);
            showToast('error', 'Error de Inicialización', data.message || 'No se pudo inicializar KeyAuth');
            return false;
        }
    } catch (error) {
        console.error('[KEYAUTH] Error en init:', error);
        showToast('error', 'Error', 'Error al inicializar KeyAuth: ' + error.message);
        return false;
    }
}

/**
 * Login con KeyAuth
 * Similar a login() en KeyAuth.cs línea 234
 */
async function keyAuthLogin(username, password, remember = false) {
    try {
        // Verificar que init haya sido llamado
        if (!authState.sessionid || !authState.enckey) {
            console.error('[KEYAUTH] No inicializado. Llamando init primero...');
            const initSuccess = await initKeyAuth();
            if (!initSuccess) {
                return { success: false, message: 'No se pudo inicializar KeyAuth' };
            }
        }
        
        // Generar HWID si no existe
        if (!authState.hwid) {
            authState.hwid = generateHWID();
        }
        
        // Generar init_iv para esta petición (línea 240 en KeyAuth.cs)
        const ivKey = generateIVKey();
        const initIVHash = await sha256(ivKey);
        const initIV = initIVHash.substring(0, 32);
        
        // Preparar parámetros como en KeyAuth.cs línea 242-252
        const formData = new URLSearchParams();
        formData.append('type', stringToHex('login'));
        formData.append('username', await encryptKeyAuth(username, authState.enckey, initIV));
        formData.append('pass', await encryptKeyAuth(password, authState.enckey, initIV));
        formData.append('hwid', await encryptKeyAuth(authState.hwid, authState.enckey, initIV));
        formData.append('sessionid', stringToHex(authState.sessionid));
        formData.append('name', stringToHex(KEYAUTH_CONFIG.appName));
        formData.append('ownerid', stringToHex(KEYAUTH_CONFIG.ownerID));
        formData.append('init_iv', initIV);
        
        console.log('[KEYAUTH] Enviando login...');
        console.log('[KEYAUTH] SessionID usado:', authState.sessionid.substring(0, 20) + '...');
        
        const response = await fetch(KEYAUTH_CONFIG.apiURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData
        });
        
        const responseText = await response.text();
        console.log('[KEYAUTH] Login respuesta raw:', responseText.substring(0, 200));
        
        // Desencriptar respuesta (línea 256 en KeyAuth.cs)
        const decryptedResponse = await decryptKeyAuth(responseText, authState.enckey, initIV);
        console.log('[KEYAUTH] Login respuesta desencriptada:', decryptedResponse.substring(0, 500));
        
        const data = JSON.parse(decryptedResponse);
        console.log('[KEYAUTH] Login respuesta parseada completa:', JSON.stringify(data, null, 2));
        
        if (data.success) {
            console.log('[KEYAUTH] ✅ Login exitoso, procesando respuesta...');
            console.log('[KEYAUTH] data.sessionid:', data.sessionid);
            console.log('[KEYAUTH] authState.sessionid (del init):', authState.sessionid);
            console.log('[KEYAUTH] data.info:', data.info);
            
            authState.isAuthenticated = true;
            // El sessionid del login puede venir en data.sessionid o usar el sessionid del init
            authState.token = data.sessionid || authState.sessionid || '';
            authState.username = data.info?.username || username;
            authState.email = data.info?.email || '';
            
            console.log('[KEYAUTH] authState.token asignado:', authState.token);
            console.log('[KEYAUTH] authState.username asignado:', authState.username);
            
            // Calcular expiración si hay subscription
            if (data.info?.subscriptions && data.info.subscriptions.length > 0) {
                const expiryTimestamp = parseInt(data.info.subscriptions[0].expiry);
                authState.expiry = expiryTimestamp * 1000; // Convertir a milisegundos
                authState.subscriptionExpiry = authState.expiry;
                authState.plan = data.info.subscriptions[0].subscription || 'Free';
            } else {
                authState.expiry = Date.now() + (365 * 24 * 60 * 60 * 1000); // 1 año por defecto
                authState.plan = 'Free';
            }
            
            console.log('[KEYAUTH] ==========================================');
            console.log('[KEYAUTH] Guardando autenticación...');
            console.log('[KEYAUTH] Token a guardar:', authState.token);
            console.log('[KEYAUTH] Username a guardar:', authState.username);
            console.log('[KEYAUTH] Email a guardar:', authState.email);
            console.log('[KEYAUTH] Expiry a guardar:', authState.expiry);
            console.log('[KEYAUTH] Remember:', remember);
            console.log('[KEYAUTH] ==========================================');
            
            if (!authState.token || authState.token === '') {
                console.error('[KEYAUTH] ❌ ERROR: Token está vacío o undefined!');
                console.error('[KEYAUTH] data.sessionid:', data.sessionid);
                console.error('[KEYAUTH] typeof data.sessionid:', typeof data.sessionid);
            }
            
            saveAuth({
                token: authState.token,
                username: authState.username,
                email: authState.email,
                expiry: authState.expiry,
                subscriptionExpiry: authState.subscriptionExpiry,
                plan: authState.plan
            }, remember);
            
            // Verificar inmediatamente después de guardar
            console.log('[KEYAUTH] Verificando guardado inmediatamente...');
            const storage = remember ? localStorage : sessionStorage;
            const immediateToken = storage.getItem('authToken');
            const immediateUsername = storage.getItem('username');
            const immediateExpiry = storage.getItem('expiry');
            console.log('[KEYAUTH] Token en storage inmediato:', immediateToken ? immediateToken.substring(0, 10) + '...' : 'null');
            console.log('[KEYAUTH] Username en storage inmediato:', immediateUsername);
            console.log('[KEYAUTH] Expiry en storage inmediato:', immediateExpiry);
            
            // Verificar que se guardó correctamente usando getStoredAuth
            const verifyStored = getStoredAuth();
            if (verifyStored && verifyStored.token) {
                console.log('[KEYAUTH] ✅ Autenticación guardada correctamente');
                console.log('[KEYAUTH] Token guardado:', verifyStored.token.substring(0, 10) + '...');
            } else {
                console.error('[KEYAUTH] ❌ Error: No se pudo verificar el guardado');
                console.error('[KEYAUTH] verifyStored:', verifyStored);
            }
            
            console.log('[KEYAUTH] Login exitoso para:', authState.username);
            return { success: true, data: authState };
        } else {
            const errorMessage = data.message || 'Error al iniciar sesión';
            console.error('[KEYAUTH] Login fallido:', errorMessage);
            return { success: false, message: errorMessage };
        }
    } catch (error) {
        console.error('[KEYAUTH] Error en login:', error);
        console.error('[KEYAUTH] Error stack:', error.stack);
        return { success: false, message: `Error: ${error.message || 'Error desconocido'}` };
    }
}

/**
 * Registro con KeyAuth
 * Similar a register() en KeyAuth.cs línea 200
 */
async function keyAuthRegister(username, email, password, licenseKey) {
    try {
        // Verificar que init haya sido llamado
        if (!authState.sessionid || !authState.enckey) {
            console.error('[KEYAUTH] No inicializado. Llamando init primero...');
            const initSuccess = await initKeyAuth();
            if (!initSuccess) {
                return { success: false, message: 'No se pudo inicializar KeyAuth' };
            }
        }
        
        // Generar HWID si no existe
        if (!authState.hwid) {
            authState.hwid = generateHWID();
        }
        
        // Generar init_iv para esta petición
        const ivKey = generateIVKey();
        const initIVHash = await sha256(ivKey);
        const initIV = initIVHash.substring(0, 32);
        
        // Preparar parámetros como en KeyAuth.cs línea 208-219
        const formData = new URLSearchParams();
        formData.append('type', stringToHex('register'));
        formData.append('username', await encryptKeyAuth(username, authState.enckey, initIV));
        formData.append('pass', await encryptKeyAuth(password, authState.enckey, initIV));
        formData.append('key', await encryptKeyAuth(licenseKey, authState.enckey, initIV));
        formData.append('hwid', await encryptKeyAuth(authState.hwid, authState.enckey, initIV));
        formData.append('sessionid', stringToHex(authState.sessionid));
        formData.append('name', stringToHex(KEYAUTH_CONFIG.appName));
        formData.append('ownerid', stringToHex(KEYAUTH_CONFIG.ownerID));
        formData.append('init_iv', initIV);
        
        console.log('[KEYAUTH] Enviando registro...');
        
        const response = await fetch(KEYAUTH_CONFIG.apiURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData
        });
        
        const responseText = await response.text();
        console.log('[KEYAUTH] Registro respuesta raw:', responseText.substring(0, 200));
        
        // Desencriptar respuesta
        const decryptedResponse = await decryptKeyAuth(responseText, authState.enckey, initIV);
        console.log('[KEYAUTH] Registro respuesta desencriptada:', decryptedResponse.substring(0, 500));
        
        const data = JSON.parse(decryptedResponse);
        
        if (data.success) {
            // Auto-login después de registro exitoso
            const loginResult = await keyAuthLogin(username, password, true);
            return loginResult;
        } else {
            return { success: false, message: data.message || 'Error al registrar cuenta' };
        }
    } catch (error) {
        console.error('[KEYAUTH] Error en registro:', error);
        return { success: false, message: `Error: ${error.message || 'Error desconocido'}` };
    }
}

/**
 * Verifica sesión con KeyAuth
 * Similar a check() en KeyAuth.cs línea 330
 */
async function keyAuthCheck() {
    try {
        const stored = getStoredAuth();
        if (!stored || !stored.token) {
            console.log('[KEYAUTH] No hay token guardado');
            return { success: false, message: 'No hay sesión activa' };
        }
        
        // Verificar expiración local primero (evita petición innecesaria)
        if (stored.expiry && stored.expiry < Date.now()) {
            console.log('[KEYAUTH] Token expirado localmente');
            clearAuth();
            return { success: false, message: 'Sesión expirada' };
        }
        
        // Verificar que init haya sido llamado (necesario para enckey)
        if (!authState.sessionid || !authState.enckey) {
            console.log('[KEYAUTH] No inicializado, llamando init...');
            const initSuccess = await initKeyAuth();
            if (!initSuccess) {
                // Si init falla pero tenemos token guardado, usar el token guardado
                // (puede ser que la verificación no sea crítica)
                console.warn('[KEYAUTH] Init falló pero hay token guardado, usando token guardado');
                authState.isAuthenticated = true;
                authState.token = stored.token;
                authState.username = stored.username;
                authState.email = stored.email;
                authState.expiry = stored.expiry;
                authState.subscriptionExpiry = stored.subscriptionExpiry;
                authState.plan = stored.plan;
                return { success: true, data: authState };
            }
        }
        
        // Generar init_iv para esta petición
        const ivKey = generateIVKey();
        const initIVHash = await sha256(ivKey);
        const initIV = initIVHash.substring(0, 32);
        
        const formData = new URLSearchParams();
        formData.append('type', stringToHex('check'));
        formData.append('sessionid', stringToHex(stored.token));
        formData.append('name', stringToHex(KEYAUTH_CONFIG.appName));
        formData.append('ownerid', stringToHex(KEYAUTH_CONFIG.ownerID));
        formData.append('init_iv', initIV);
        
        console.log('[KEYAUTH] Verificando sesión con KeyAuth...');
        
        const response = await fetch(KEYAUTH_CONFIG.apiURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData
        });
        
        const responseText = await response.text();
        console.log('[KEYAUTH] Check respuesta raw:', responseText.substring(0, 200));
        
        try {
            const decryptedResponse = await decryptKeyAuth(responseText, authState.enckey, initIV);
            console.log('[KEYAUTH] Check respuesta desencriptada:', decryptedResponse.substring(0, 500));
            const data = JSON.parse(decryptedResponse);
            
            if (data.success) {
                authState.isAuthenticated = true;
                authState.token = stored.token;
                authState.username = stored.username;
                authState.email = stored.email;
                authState.expiry = stored.expiry;
                authState.subscriptionExpiry = stored.subscriptionExpiry;
                authState.plan = stored.plan;
                
                console.log('[KEYAUTH] ✅ Sesión verificada correctamente');
                return { success: true, data: authState };
            } else {
                console.error('[KEYAUTH] ❌ Verificación falló:', data.message);
                clearAuth();
                return { success: false, message: data.message || 'Sesión inválida' };
            }
        } catch (decryptError) {
            console.error('[KEYAUTH] Error desencriptando respuesta check:', decryptError);
            // Si falla la desencriptación pero tenemos token válido, usar el token guardado
            console.warn('[KEYAUTH] Usando token guardado como fallback');
            authState.isAuthenticated = true;
            authState.token = stored.token;
            authState.username = stored.username;
            authState.email = stored.email;
            authState.expiry = stored.expiry;
            authState.subscriptionExpiry = stored.subscriptionExpiry;
            authState.plan = stored.plan;
            return { success: true, data: authState };
        }
    } catch (error) {
        console.error('[KEYAUTH] Error verificando sesión:', error);
        // Si hay error pero tenemos token guardado, usar el token guardado
        const stored = getStoredAuth();
        if (stored && stored.token && stored.expiry && stored.expiry > Date.now()) {
            console.warn('[KEYAUTH] Error en verificación pero usando token guardado como fallback');
            authState.isAuthenticated = true;
            authState.token = stored.token;
            authState.username = stored.username;
            authState.email = stored.email;
            authState.expiry = stored.expiry;
            authState.subscriptionExpiry = stored.subscriptionExpiry;
            authState.plan = stored.plan;
            return { success: true, data: authState };
        }
        return { success: false, message: 'Error de conexión' };
    }
}

/**
 * Logout con KeyAuth
 */
async function keyAuthLogout() {
    try {
        clearAuth();
        authState = {
            isAuthenticated: false,
            token: null,
            username: null,
            email: null,
            expiry: null,
            subscriptionExpiry: null,
            plan: null,
            hwid: authState.hwid,
            sessionid: null,
            enckey: null
        };
    } catch (error) {
        console.error('[KEYAUTH] Error en logout:', error);
    }
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================

function showToast(type, title, message, duration = 3000) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-times-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    toast.innerHTML = `
        <i class="fas ${icons[type]} toast-icon"></i>
        <div class="toast-content">
            <div class="toast-title">${sanitizeInput(title)}</div>
            <div class="toast-message">${sanitizeInput(message)}</div>
        </div>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'toastSlideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, duration);
    
    return toast;
}

// ============================================
// FORM VALIDATION
// ============================================

function validateLoginForm() {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    
    let isValid = true;
    
    if (!username) {
        showInputError('login-username', 'Este campo es obligatorio');
        isValid = false;
    } else if (username.length < 3 || username.length > 20) {
        showInputError('login-username', 'El usuario debe tener entre 3 y 20 caracteres');
        isValid = false;
    } else {
        clearInputError('login-username');
    }
    
    if (!password) {
        showInputError('login-password', 'Este campo es obligatorio');
        isValid = false;
    } else {
        clearInputError('login-password');
    }
    
    return isValid;
}

function validateRegisterForm() {
    const username = document.getElementById('register-username').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    const license = document.getElementById('register-license').value.trim();
    
    let isValid = true;
    
    if (!username) {
        showInputError('register-username', 'Este campo es obligatorio');
        isValid = false;
    } else if (username.length < 3 || username.length > 20) {
        showInputError('register-username', 'El usuario debe tener entre 3 y 20 caracteres');
        isValid = false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        showInputError('register-username', 'El usuario solo puede contener letras, números y guiones bajos');
        isValid = false;
    } else {
        clearInputError('register-username');
    }
    
    if (!email) {
        showInputError('register-email', 'Este campo es obligatorio');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showInputError('register-email', 'El email no es válido');
        isValid = false;
    } else {
        clearInputError('register-email');
    }
    
    if (!password) {
        showInputError('register-password', 'Este campo es obligatorio');
        isValid = false;
    } else if (password.length < 8) {
        showInputError('register-password', 'La contraseña debe tener al menos 8 caracteres');
        isValid = false;
    } else {
        clearInputError('register-password');
    }
    
    if (!confirmPassword) {
        showInputError('register-confirm-password', 'Este campo es obligatorio');
        isValid = false;
    } else if (password !== confirmPassword) {
        showInputError('register-confirm-password', 'Las contraseñas no coinciden');
        isValid = false;
    } else {
        clearInputError('register-confirm-password');
    }
    
    if (!license) {
        showInputError('register-license', 'Este campo es obligatorio');
        isValid = false;
    } else if (!/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(license)) {
        showInputError('register-license', 'El formato de la license key debe ser XXXX-XXXX-XXXX-XXXX');
        isValid = false;
    } else {
        clearInputError('register-license');
    }
    
    return isValid;
}

function showInputError(inputId, message) {
    const input = document.getElementById(inputId);
    const errorSpan = document.getElementById(`${inputId}-error`);
    
    if (input) {
        input.classList.add('error');
    }
    
    if (errorSpan) {
        errorSpan.textContent = message;
    }
}

function clearInputError(inputId) {
    const input = document.getElementById(inputId);
    const errorSpan = document.getElementById(`${inputId}-error`);
    
    if (input) {
        input.classList.remove('error');
    }
    
    if (errorSpan) {
        errorSpan.textContent = '';
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    // Solo ejecutar esto en login.html, no en index.html
    const isLoginPage = window.location.pathname.includes('login.html') || 
                        window.location.pathname.endsWith('login.html') ||
                        document.getElementById('login-form') !== null;
    
    if (!isLoginPage) {
        console.log('[KEYAUTH] No es página de login, saltando inicialización automática');
        return; // No ejecutar nada si no es la página de login
    }
    
    console.log('[KEYAUTH] Es página de login, inicializando...');
    
    // Inicializar KeyAuth PRIMERO (obligatorio)
    console.log('[KEYAUTH] Inicializando KeyAuth...');
    const initSuccess = await initKeyAuth();
    
    if (!initSuccess) {
        showToast('error', 'Error de Inicialización', 'No se pudo inicializar KeyAuth. La aplicación puede no funcionar correctamente.');
    }
    
    // Verificar si hay sesión guardada (solo en login.html)
    const stored = getStoredAuth();
    if (stored) {
        console.log('[KEYAUTH] Sesión encontrada, verificando...');
        const checkResult = await keyAuthCheck();
        if (checkResult.success) {
            console.log('[KEYAUTH] Sesión válida, redirigiendo a index.html');
            window.location.href = 'index.html';
            return;
        } else {
            console.log('[KEYAUTH] Sesión inválida, mostrando formulario de login');
        }
    }
    
    // Tabs Login/Register
    const tabs = document.querySelectorAll('.auth-tab');
    const loginContent = document.getElementById('login-content');
    const registerContent = document.getElementById('register-content');
    const tabIndicator = document.querySelector('.tab-indicator');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            if (targetTab === 'login') {
                loginContent.classList.remove('hidden');
                registerContent.classList.add('hidden');
                tabIndicator.style.left = '0';
            } else {
                loginContent.classList.add('hidden');
                registerContent.classList.remove('hidden');
                tabIndicator.style.left = '50%';
            }
        });
    });
    
    // Switch links
    document.querySelectorAll('.switch-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetTab = link.dataset.switch;
            const tab = document.querySelector(`.auth-tab[data-tab="${targetTab}"]`);
            if (tab) tab.click();
        });
    });
    
    // Password toggles
    document.querySelectorAll('.password-toggle').forEach(toggle => {
        toggle.addEventListener('click', () => {
            const inputId = toggle.id.replace('-toggle', '');
            const input = document.getElementById(inputId);
            const icon = toggle.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
    
    // Password strength indicator
    const registerPassword = document.getElementById('register-password');
    if (registerPassword) {
        registerPassword.addEventListener('input', () => {
            const password = registerPassword.value;
            const strength = calculatePasswordStrength(password);
            const fill = document.getElementById('strength-fill');
            const text = document.getElementById('strength-text');
            
            if (fill) {
                fill.className = `strength-fill ${strength.level}`;
                fill.style.width = `${strength.percentage}%`;
            }
            
            if (text) {
                text.textContent = strength.text;
                text.className = `strength-text ${strength.level}`;
            }
        });
    }
    
    // License key formatter
    const licenseInput = document.getElementById('register-license');
    if (licenseInput) {
        licenseInput.addEventListener('input', () => {
            formatLicenseKey(licenseInput);
        });
    }
    
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!validateLoginForm()) return;
            
            const username = document.getElementById('login-username').value.trim();
            const password = document.getElementById('login-password').value;
            const remember = document.getElementById('remember-me').checked;
            
            const loginBtn = document.getElementById('login-btn');
            loginBtn.classList.add('loading');
            loginBtn.disabled = true;
            
            try {
                const result = await keyAuthLogin(username, password, remember);
                
                if (result.success) {
                    showToast('success', '¡Bienvenido!', `Hola, ${result.data.username}!`);
                    
                    document.querySelector('.auth-card').classList.add('success');
                    
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1000);
                } else {
                    showToast('error', 'Error de Login', result.message || 'Credenciales incorrectas');
                    loginBtn.classList.remove('loading');
                    loginBtn.disabled = false;
                }
            } catch (error) {
                showToast('error', 'Error', 'Ocurrió un error inesperado');
                loginBtn.classList.remove('loading');
                loginBtn.disabled = false;
            }
        });
    }
    
    // Register form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!validateRegisterForm()) return;
            
            const username = document.getElementById('register-username').value.trim();
            const email = document.getElementById('register-email').value.trim();
            const password = document.getElementById('register-password').value;
            const license = formatLicenseKey(document.getElementById('register-license'));
            
            const registerBtn = document.getElementById('register-btn');
            registerBtn.classList.add('loading');
            registerBtn.disabled = true;
            
            try {
                const result = await keyAuthRegister(username, email, password, license);
                
                if (result.success) {
                    showToast('success', '¡Cuenta Creada!', `Bienvenido a David IA, ${result.data.username}!`);
                    
                    document.querySelector('.auth-card').classList.add('success');
                    
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1500);
                } else {
                    showToast('error', 'Error de Registro', result.message || 'No se pudo crear la cuenta');
                    registerBtn.classList.remove('loading');
                    registerBtn.disabled = false;
                }
            } catch (error) {
                showToast('error', 'Error', 'Ocurrió un error inesperado');
                registerBtn.classList.remove('loading');
                registerBtn.disabled = false;
            }
        });
    }
    
    // Forgot password modal
    const forgotPasswordBtn = document.getElementById('forgot-password-btn');
    const forgotPasswordModal = document.getElementById('forgot-password-modal');
    const modalClose = document.getElementById('modal-close');
    
    if (forgotPasswordBtn && forgotPasswordModal) {
        forgotPasswordBtn.addEventListener('click', (e) => {
            e.preventDefault();
            forgotPasswordModal.classList.remove('hidden');
        });
    }
    
    if (modalClose && forgotPasswordModal) {
        modalClose.addEventListener('click', () => {
            forgotPasswordModal.classList.add('hidden');
        });
        
        forgotPasswordModal.addEventListener('click', (e) => {
            if (e.target === forgotPasswordModal) {
                forgotPasswordModal.classList.add('hidden');
            }
        });
    }
    
    // Forgot password form
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('forgot-email').value.trim();
            
            showToast('info', 'Email Enviado', 'Si el email existe, recibirás instrucciones para recuperar tu contraseña.');
            forgotPasswordModal.classList.add('hidden');
        });
    }
});

// ============================================
// EXPORT FUNCTIONS (para uso en otros archivos)
// ============================================

window.checkAuth = async function() {
    console.log('[CHECKAUTH] ==========================================');
    console.log('[CHECKAUTH] Verificando autenticación...');
    console.log('[CHECKAUTH] ==========================================');
    
    const stored = getStoredAuth();
    if (!stored) {
        console.log('[CHECKAUTH] ❌ No hay datos guardados - REDIRIGIENDO A LOGIN');
        return { authenticated: false };
    }
    
    console.log('[CHECKAUTH] ✅ Token guardado encontrado:', stored.token.substring(0, 10) + '...');
    console.log('[CHECKAUTH] Username:', stored.username);
    console.log('[CHECKAUTH] Expiry:', new Date(stored.expiry).toLocaleString());
    console.log('[CHECKAUTH] Tiempo restante:', Math.floor((stored.expiry - Date.now()) / 1000 / 60), 'minutos');
    
    // Verificar expiración local primero
    if (stored.expiry && stored.expiry < Date.now()) {
        console.log('[CHECKAUTH] ❌ Token expirado - REDIRIGIENDO A LOGIN');
        clearAuth();
        return { authenticated: false };
    }
    
    // Si hay token válido guardado, restaurar authState y permitir acceso
    // No necesitamos verificar con KeyAuth en cada carga de página
    // Solo verificamos periódicamente en segundo plano
    console.log('[CHECKAUTH] ✅ Token válido, restaurando sesión...');
    authState.isAuthenticated = true;
    authState.token = stored.token;
    authState.username = stored.username;
    authState.email = stored.email;
    authState.expiry = stored.expiry;
    authState.subscriptionExpiry = stored.subscriptionExpiry;
    authState.plan = stored.plan;
    
    console.log('[CHECKAUTH] ✅ AuthState restaurado:');
    console.log('[CHECKAUTH]   - isAuthenticated:', authState.isAuthenticated);
    console.log('[CHECKAUTH]   - token:', authState.token.substring(0, 10) + '...');
    console.log('[CHECKAUTH]   - username:', authState.username);
    
    // Verificar con KeyAuth en segundo plano (no bloquea el acceso) - DESACTIVADO TEMPORALMENTE
    // keyAuthCheck().then(result => {
    //     if (!result.success) {
    //         console.warn('[CHECKAUTH] ⚠️ Verificación en segundo plano falló, pero sesión sigue activa');
    //     } else {
    //         console.log('[CHECKAUTH] ✅ Verificación en segundo plano exitosa');
    //     }
    // }).catch(error => {
    //     console.warn('[CHECKAUTH] ⚠️ Error en verificación en segundo plano:', error);
    // });
    
    console.log('[CHECKAUTH] ✅ Retornando authenticated: true');
    console.log('[CHECKAUTH] ==========================================');
    
    return {
        authenticated: true,
        user: authState
    };
};

window.logout = async function() {
    await keyAuthLogout();
    window.location.href = 'login.html';
};

window.getCurrentUser = function() {
    return authState.isAuthenticated ? authState : null;
};
