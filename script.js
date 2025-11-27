// ============================================
// CONFIGURACIÓN
// ============================================
// Cargar configuración desde config.js si existe, sino usar valores por defecto
let CONFIG = {
    API_URL: 'http://localhost:3000/api/send-command'
};

// Intentar cargar configuración externa desde config.js
console.log('[CONFIG] ========================================');
console.log('[CONFIG] Verificando config.js...');
console.log('[CONFIG] typeof API_CONFIG:', typeof API_CONFIG);
console.log('[CONFIG] API_CONFIG:', API_CONFIG);

if (typeof API_CONFIG !== 'undefined' && API_CONFIG && API_CONFIG.API_URL) {
    CONFIG.API_URL = API_CONFIG.API_URL;
    console.log('[CONFIG] ✅ Configuración cargada desde config.js');
    console.log('[CONFIG] URL:', CONFIG.API_URL);
    
    // Verificar el tipo de URL
    if (CONFIG.API_URL.includes('localhost') || CONFIG.API_URL.includes('127.0.0.1')) {
        console.log('[CONFIG] ✅ Modo LOCAL detectado - Solo funcionará en esta computadora');
    } else if (CONFIG.API_URL.includes('trycloudflare.com')) {
        console.log('[CONFIG] ✅ Modo REMOTO (Cloudflare) detectado');
    } else if (CONFIG.API_URL.includes('ngrok')) {
        console.log('[CONFIG] ✅ Modo REMOTO (ngrok) detectado');
    } else {
        console.warn('[CONFIG] ⚠️ URL personalizada detectada');
    }
} else {
    console.error('[CONFIG] ❌ No se encontró config.js o API_CONFIG');
    console.error('[CONFIG] ⚠️ Usando localhost por defecto - NO funcionará desde móvil/internet');
    console.error('[CONFIG] 💡 Verifica que config.js esté en GitHub y tenga la URL correcta');
}
console.log('[CONFIG] ========================================');

// ============================================
// ESTADO GLOBAL
// ============================================
let currentUID = null;
let isValidUID = false;
let currentTeamCode = null;
let isValidTeamCode = false;

// ============================================
// ELEMENTOS DOM
// ============================================
const uidInput = document.getElementById('uid-input');
const validateBtn = document.getElementById('validate-btn');
const uidStatus = document.getElementById('uid-status');
const teamCodeInput = document.getElementById('team-code-input');
const validateTeamBtn = document.getElementById('validate-team-btn');
const teamStatus = document.getElementById('team-status');
const logContent = document.getElementById('log-content');

// ============================================
// FUNCIONES DE UTILIDAD
// ============================================

/**
 * Valida si un UID es válido (solo números, mínimo 8 dígitos)
 */
function validateUID(uid) {
    const uidRegex = /^\d{8,}$/;
    return uidRegex.test(uid.trim());
}

/**
 * Valida si un código de equipo es válido (solo números, típicamente 6 dígitos)
 */
function validateTeamCode(code) {
    const codeRegex = /^\d{4,}$/; // Mínimo 4 dígitos para códigos de equipo
    return codeRegex.test(code.trim());
}

/**
 * Agrega un mensaje al log
 */
function addLogMessage(message, type = 'info') {
    const logMessage = document.createElement('p');
    logMessage.className = `log-message ${type}`;
    logMessage.textContent = message;
    
    logContent.appendChild(logMessage);
    logContent.scrollTop = logContent.scrollHeight;
    
    // Limpiar mensajes antiguos (mantener solo los últimos 10)
    const messages = logContent.querySelectorAll('.log-message');
    if (messages.length > 10) {
        messages[0].remove();
    }
}

/**
 * Actualiza el estado del UID
 */
function updateUIDStatus(valid, message) {
    uidStatus.textContent = message;
    uidStatus.className = `uid-status ${valid ? 'valid' : 'invalid'}`;
    isValidUID = valid;
}

// ============================================
// VALIDACIÓN DE UID
// ============================================

validateBtn.addEventListener('click', () => {
    const uid = uidInput.value.trim();
    
    if (!uid) {
        updateUIDStatus(false, '⚠️ Por favor ingresa un UID');
        addLogMessage('Error: Campo UID vacío', 'error');
        return;
    }
    
    if (validateUID(uid)) {
        currentUID = uid;
        updateUIDStatus(true, '✅ UID válido');
        addLogMessage(`UID validado: ${uid}`, 'success');
    } else {
        updateUIDStatus(false, '❌ UID inválido (mínimo 8 dígitos)');
        addLogMessage(`Error: UID inválido - ${uid}`, 'error');
    }
});

// Validar al presionar Enter
uidInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        validateBtn.click();
    }
});

// ============================================
// VALIDACIÓN DE CÓDIGO DE EQUIPO
// ============================================

/**
 * Actualiza el estado del código de equipo
 */
function updateTeamStatus(valid, message) {
    teamStatus.textContent = message;
    teamStatus.className = `uid-status ${valid ? 'valid' : 'invalid'}`;
    isValidTeamCode = valid;
}

validateTeamBtn.addEventListener('click', () => {
    const teamCode = teamCodeInput.value.trim();
    
    if (!teamCode) {
        updateTeamStatus(false, '⚠️ Por favor ingresa un código de equipo');
        addLogMessage('Error: Campo código de equipo vacío', 'error');
        return;
    }
    
    if (validateTeamCode(teamCode)) {
        currentTeamCode = teamCode;
        updateTeamStatus(true, '✅ Código de equipo válido');
        addLogMessage(`Código de equipo validado: ${teamCode}`, 'success');
    } else {
        updateTeamStatus(false, '❌ Código inválido (mínimo 4 dígitos)');
        addLogMessage(`Error: Código de equipo inválido - ${teamCode}`, 'error');
    }
});

// Validar código de equipo al presionar Enter
teamCodeInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        validateTeamBtn.click();
    }
});

// ============================================
// CONFIGURACIÓN DE MODO DE BOT
// ============================================

const botModeLeave = document.getElementById('bot-mode-leave');
const botModeStay = document.getElementById('bot-mode-stay');
const botModeDescription = document.getElementById('bot-mode-description');

// Actualizar descripción cuando cambia el modo
function updateBotModeDescription() {
    const selectedMode = document.querySelector('input[name="bot-mode"]:checked')?.value || 'leave';
    
    if (selectedMode === 'leave') {
        if (botModeDescription) {
            botModeDescription.innerHTML = '🚪 <strong>Salir Bot:</strong> Sale del equipo después de ejecutar el emote';
        }
    } else {
        if (botModeDescription) {
            botModeDescription.innerHTML = '🏠 <strong>Quedarse Bot:</strong> Permanece en el equipo después de ejecutar el emote';
        }
    }
}

// Event listeners para los radio buttons
if (botModeLeave) {
    botModeLeave.addEventListener('change', updateBotModeDescription);
}

if (botModeStay) {
    botModeStay.addEventListener('change', updateBotModeDescription);
}

// Inicializar descripción cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    updateBotModeDescription();
});

// ============================================
// ENVÍO DE COMANDOS
// ============================================

/**
 * Envía un comando al bot
 */
async function sendCommandToBot(command, params = {}) {
    try {
        console.log('========================================');
        console.log('📤 ENVIANDO COMANDO AL BOT');
        console.log('========================================');
        console.log('Comando:', command);
        console.log('Parámetros:', params);
        
        // Enviar TODOS los comandos con el mismo formato que el bot espera del chat del juego
        // El bot procesará el comando directamente como si viniera del chat
        const payload = {
            command: command,
            uid: params.uid || '',
            emote_number: params.emote_number || '',
            category: params.category || null,
            command_type: params.command_type || '/play'  // Incluir siempre, el bot lo ignorará si no es emote
        };
        
        console.log('📦 Payload completo que se envía:', JSON.stringify(payload, null, 2));
        console.log('🔍 Tipo de comando detectado:');
        if (command.startsWith('/join')) {
            console.log('   → Es un comando /join (unirse a equipo)');
        } else if (command === '/solo') {
            console.log('   → Es un comando /solo (salir del equipo)');
        } else if (command.startsWith('/ev')) {
            console.log('   → Es un comando /ev (emote evolutiva)');
        } else if (command.startsWith('/play')) {
            console.log('   → Es un comando /play (emote normal/dúo)');
        } else {
            console.log('   → Comando desconocido:', command);
        }
        
        console.log('[FETCH] Intentando conectar a:', CONFIG.API_URL);
        console.log('[FETCH] Payload completo:', JSON.stringify(payload, null, 2));
        
        const response = await fetch(CONFIG.API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true',  // Necesario para ngrok free
            },
            body: JSON.stringify(payload)
        });
        
        console.log('[FETCH] ✅ Respuesta recibida. Status:', response.status);
        console.log('[FETCH] 📥 Respuesta HTTP Status:', response.status, response.statusText);
        
        if (response.ok) {
            const data = await response.json();
            console.log('[FETCH] ✅ Respuesta del bot (JSON):', JSON.stringify(data, null, 2));
            console.log('[FETCH] ========================================');
            return data;
        } else {
            const errorText = await response.text();
            console.error('[FETCH] ❌ Error response (texto):', errorText);
            console.log('[FETCH] ========================================');
            return { success: false, message: `HTTP ${response.status}: ${errorText}` };
        }
    } catch (error) {
        console.error('[FETCH] ❌ Error al enviar comando:', error);
        console.error('[FETCH] Tipo de error:', error.name);
        console.error('[FETCH] Mensaje:', error.message);
        console.error('[FETCH] Stack trace:', error.stack);
        console.log('[FETCH] ========================================');
        
        // Detectar errores de red específicos
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            console.error('[FETCH] ❌ ERROR DE RED: No se puede conectar al servidor');
            console.error('[FETCH] 💡 Verifica:');
            
            // Mensajes diferentes según si es local o remoto
            if (CONFIG.API_URL.includes('localhost') || CONFIG.API_URL.includes('127.0.0.1')) {
                console.error('[FETCH]   1. ¿El bot está corriendo? (Ejecuta INICIAR_BOT.bat)');
                console.error('[FETCH]   2. ¿El puerto 3000 está disponible?');
                console.error('[FETCH]   3. ¿El panel se abrió desde http://localhost? (no desde file://)');
                return { success: false, message: 'Error de conexión. Verifica que el bot esté corriendo en localhost:3000.' };
            } else {
                console.error('[FETCH]   1. ¿El bot está corriendo?');
                console.error('[FETCH]   2. ¿El túnel (Cloudflare/ngrok) está activo?');
                console.error('[FETCH]   3. ¿La URL es correcta?', CONFIG.API_URL);
                return { success: false, message: 'Error de conexión. Verifica que el bot y el túnel estén corriendo.' };
            }
        }
        
        return { success: false, message: error.message };
    }
}

/**
 * Se une a un equipo usando el código
 */
async function joinTeam(teamCode) {
    addLogMessage(`🚪 Conectando...`, 'info');
    console.log('[JOIN] Iniciando proceso de unirse al equipo:', teamCode);
    
    // Enviar el comando /join exactamente igual que /ev o /play
    // El bot lo procesará como si viniera del chat del juego
    const command = `/join ${teamCode}`;
    console.log('[JOIN] Comando a enviar:', command);
    
    const result = await sendCommandToBot(command, {
        uid: '',  // Vacío porque no es un comando de emote
        emote_number: '',  // Vacío porque no es un comando de emote
        category: null,
        command_type: '/play'  // El bot lo ignorará porque el comando es /join
    });
    
    console.log('[JOIN] Resultado recibido:', result);
    
    if (result.success) {
        addLogMessage(`✅ Unido al equipo exitosamente`, 'success');
        console.log('[JOIN] ✅ Éxito al unirse al equipo');
        return true;
    } else {
        addLogMessage(`❌ Error al unirse al equipo: ${result.message || 'Error desconocido'}`, 'error');
        console.error('[JOIN] ❌ Error:', result.message);
        console.error('[JOIN] Respuesta completa:', result);
        return false;
    }
}

/**
 * Sale del equipo actual usando /solo
 */
async function leaveTeam() {
    addLogMessage(`🚪 Saliendo del equipo...`, 'info');
    console.log('[LEAVE] Iniciando proceso de salir del equipo');
    
    // Enviar el comando /solo exactamente igual que /ev o /play
    // El bot lo procesará como si viniera del chat del juego
    const command = '/solo';
    console.log('[LEAVE] Comando a enviar:', command);
    
    const result = await sendCommandToBot(command, {
        uid: '',  // Vacío porque no es un comando de emote
        emote_number: '',  // Vacío porque no es un comando de emote
        category: null,
        command_type: '/play'  // El bot lo ignorará porque el comando es /solo
    });
    
    console.log('[LEAVE] Resultado recibido:', result);
    
    if (result.success) {
        addLogMessage(`✅ Salido del equipo exitosamente`, 'success');
        console.log('[LEAVE] ✅ Éxito al salir del equipo');
        return true;
    } else {
        addLogMessage(`⚠️ No se pudo salir del equipo: ${result.message || 'Error desconocido'}`, 'warning');
        console.warn('[LEAVE] ⚠️ Advertencia:', result.message);
        return false;
    }
}

/**
 * Envía un comando /play al bot (o /ev para evolutivas)
 * Flujo: unirse al equipo → hacer emote → salir con /solo
 */
async function sendPlayCommand(uid, number, category = null, commandType = '/play') {
    console.log('sendPlayCommand called:', { uid, number, isValidUID, currentUID, isValidTeamCode, currentTeamCode });
    
    if (!isValidUID || !currentUID) {
        addLogMessage('❌ Por favor valida el UID primero', 'error');
        return false;
    }
    
    if (!isValidTeamCode || !currentTeamCode) {
        addLogMessage('❌ Por favor valida el código de equipo primero', 'error');
        return false;
    }
    
    // Determinar el comando correcto según la categoría
    const emoteCommand = commandType === '/ev' ? `/ev ${uid} ${number}` : `/play ${uid} ${number}`;
    
    addLogMessage(`🎯 Procesando emote #${number}...`, 'info');
    
    try {
        // PASO 1: Unirse al equipo usando el código ingresado
        addLogMessage(`🚪 Uniéndose al equipo...`, 'info');
        const joined = await joinTeam(currentTeamCode);
        if (!joined) {
            addLogMessage(`❌ No se pudo unir al equipo`, 'error');
            return false;
        }
        
        // PASO 2: Ejecutar el emote
        addLogMessage(`🎭 Ejecutando emote #${number}...`, 'sending');
        console.log('[EMOTE] Iniciando ejecución de emote');
        console.log('[EMOTE] Comando:', emoteCommand);
        console.log('[EMOTE] UID:', uid);
        console.log('[EMOTE] Número:', number);
        console.log('[EMOTE] Categoría:', category);
        console.log('[EMOTE] Tipo:', commandType);
        
        const emoteResult = await sendCommandToBot(emoteCommand, {
            uid: uid,
            emote_number: number,
            category: category,
            command_type: commandType
        });
        
        console.log('[EMOTE] Resultado recibido:', emoteResult);
        
        if (!emoteResult.success) {
            addLogMessage(`❌ Error: ${emoteResult.message || 'No se pudo enviar el emote'}`, 'error');
            // Verificar modo antes de salir en caso de error
            const botMode = document.querySelector('input[name="bot-mode"]:checked')?.value || 'leave';
            if (botMode === 'leave') {
                await leaveTeam();
            }
            return false;
        }
        
        // Verificar modo de operación
        const botMode = document.querySelector('input[name="bot-mode"]:checked')?.value || 'leave';
        
        if (botMode === 'leave') {
            // Modo "Salir Bot": ejecutar /solo
            await leaveTeam();
            addLogMessage(`✅ Emote enviado exitosamente`, 'success');
        } else {
            // Modo "Quedarse Bot": NO ejecutar /solo
            addLogMessage(`✅ Emote enviado exitosamente`, 'success');
        }
        
        return true;
        
    } catch (error) {
        console.error('Error en el proceso completo:', error);
        addLogMessage(`❌ Error: ${error.message}`, 'error');
        
        // Intentar salir del equipo en caso de error
        try {
            await leaveTeam();
        } catch (leaveError) {
            console.error('Error al salir del equipo:', leaveError);
        }
        
        return false;
    }
}

// ============================================
// CARGA DE EMOTES
// ============================================

/**
 * Crea una tarjeta de emote
 */
function createEmoteCard(emote) {
    const card = document.createElement('div');
    card.className = 'emote-card';
    card.dataset.number = emote.Number;
    card.dataset.id = emote.Id;
    
    // Obtener el nombre del arma usando la función getWeaponName
    const weaponName = typeof getWeaponName !== 'undefined' 
        ? getWeaponName(emote.Number) 
        : (emote.Name || `Emote #${emote.Number}`);
    
    // Codificar la URL de la imagen para manejar espacios y caracteres especiales
    // encodeURI codifica espacios como %20, que es lo que necesitamos para URLs
    let imageUrl = null;
    if (emote.Image) {
        // Dividir la ruta en partes y codificar solo el nombre del archivo
        const pathParts = emote.Image.split('/');
        const fileName = pathParts.pop();
        const encodedFileName = encodeURIComponent(fileName); // Codifica espacios como %20
        imageUrl = pathParts.join('/') + '/' + encodedFileName;
    }
    
    const fallbackSvg = `data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27150%27 height=%27120%27%3E%3Crect fill=%27%2307100D%27 width=%27150%27 height=%27120%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 fill=%27%238DAFA3%27 font-size=%2714%27 text-anchor=%27middle%27 dy=%27.3em%27%3E${encodeURIComponent(weaponName)}%3C/text%3E%3C/svg%3E`;
    
    card.innerHTML = `
        <img 
            src="${imageUrl || fallbackSvg}" 
            alt="${weaponName}"
            class="emote-image"
            onerror="console.error('Error cargando imagen:', '${imageUrl}'); this.onerror=null; this.src='${fallbackSvg}';"
            loading="lazy"
        >
        <div class="emote-name">${weaponName}</div>
        <div class="emote-number">#${emote.Number}</div>
    `;
    
    // Función para manejar clicks/touch
    const handleEmoteClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('[EMOTE] Click detectado:', emote.Number);
        console.log('[EMOTE] UID válido:', isValidUID, 'UID actual:', currentUID);
        console.log('[EMOTE] Team code válido:', isValidTeamCode, 'Team code actual:', currentTeamCode);
        console.log('[EMOTE] API URL:', CONFIG.API_URL);
        
        if (isValidUID && currentUID && isValidTeamCode && currentTeamCode) {
            console.log('[EMOTE] ✅ Todo válido, ejecutando emote...');
            // Agregar animación de click
            card.classList.add('sending');
            
            // Determinar la categoría del emote basándose en en qué grid está
            const grid = card.closest('.emote-grid');
            let category = null;
            if (grid) {
                if (grid.id === 'evolutivas-grid') {
                    category = 'evolutivas';
                } else if (grid.id === 'normales-grid') {
                    category = 'normales';
                } else if (grid.id === 'duo-grid') {
                    category = 'duo';
                }
            }
            
            // Para evolutivas usar /ev, para normales y dúo usar /play
            const command = category === 'evolutivas' ? '/ev' : '/play';
            console.log('[EMOTE] Enviando comando:', `${command} ${currentUID} ${emote.Number}`, 'Categoría:', category);
            
            sendPlayCommand(currentUID, emote.Number, category, command).then((success) => {
                // Remover animación de sending y agregar success
                card.classList.remove('sending');
                if (success) {
                    card.classList.add('success');
                    setTimeout(() => {
                        card.classList.remove('success');
                    }, 2000);
                }
            }).catch((error) => {
                console.error('[EMOTE] Error al ejecutar emote:', error);
                card.classList.remove('sending');
                addLogMessage('❌ Error al ejecutar emote: ' + error.message, 'error');
            });
        } else {
            if (!isValidUID || !currentUID) {
                addLogMessage('❌ Por favor valida el UID primero', 'error');
                uidInput.focus();
            } else if (!isValidTeamCode || !currentTeamCode) {
                addLogMessage('❌ Por favor valida el código de equipo primero', 'error');
                teamCodeInput.focus();
            }
        }
    };
    
    // Agregar event listeners para desktop y móvil
    card.addEventListener('click', handleEmoteClick);
    card.addEventListener('touchend', handleEmoteClick);
    
    // Agregar efecto visual al hacer hover
    card.style.cursor = 'pointer';
    
    return card;
}

/**
 * Carga emotes en una categoría
 */
function loadEmotesInCategory(categoryId, emotes) {
    const grid = document.getElementById(`${categoryId}-grid`);
    if (!grid) {
        console.error(`Grid no encontrado: ${categoryId}-grid`);
        return;
    }
    
    console.log(`Cargando ${emotes.length} emotes en ${categoryId}`);
    grid.innerHTML = ''; // Limpiar grid
    
    emotes.forEach((emote, index) => {
        try {
            const card = createEmoteCard(emote);
            grid.appendChild(card);
            console.log(`Emote ${index + 1} agregado:`, emote.Number);
        } catch (error) {
            console.error(`Error creando emote ${emote.Number}:`, error);
        }
    });
    
    console.log(`Total de cards en ${categoryId}:`, grid.children.length);
}

/**
 * Inicializa el panel con los emotes
 */
function initializePanel() {
    console.log('Inicializando panel...');
    
    // Verificar que existe EMOTES_DATA
    if (typeof EMOTES_DATA === 'undefined') {
        console.error('EMOTES_DATA no está definido');
        addLogMessage('⚠️ Error: No se encontraron datos de emotes', 'error');
        return;
    }
    
    console.log('EMOTES_DATA encontrado:', EMOTES_DATA);
    
    // Cargar emotes por categoría
    if (EMOTES_DATA.evolutivas && EMOTES_DATA.evolutivas.length > 0) {
        console.log('Cargando evolutivas:', EMOTES_DATA.evolutivas.length);
        loadEmotesInCategory('evolutivas', EMOTES_DATA.evolutivas);
    } else {
        console.warn('No hay emotes evolutivas');
    }
    
    if (EMOTES_DATA.normales && EMOTES_DATA.normales.length > 0) {
        console.log('Cargando normales:', EMOTES_DATA.normales.length);
        loadEmotesInCategory('normales', EMOTES_DATA.normales);
    } else {
        console.warn('No hay emotes normales');
    }
    
    if (EMOTES_DATA.duo && EMOTES_DATA.duo.length > 0) {
        console.log('Cargando dúo:', EMOTES_DATA.duo.length);
        loadEmotesInCategory('duo', EMOTES_DATA.duo);
    } else {
        console.warn('No hay emotes dúo');
    }
    
    addLogMessage('✅ Panel inicializado correctamente', 'success');
    console.log('Panel inicializado');
}

// Verificación de estado del bot removida - no es necesaria

// ============================================
// VERIFICACIÓN DE AUTENTICACIÓN
// ============================================
let isCheckingAuth = false;
let authCheckComplete = false;

async function checkAuthentication() {
    // Evitar múltiples verificaciones simultáneas
    if (isCheckingAuth) {
        console.log('[AUTH] Verificación ya en progreso, esperando...');
        return false;
    }
    
    if (authCheckComplete) {
        console.log('[AUTH] Verificación ya completada');
        return true;
    }
    
    isCheckingAuth = true;
    
    try {
        // Esperar a que auth.js esté completamente cargado
        let retries = 0;
        while (typeof window.checkAuth === 'undefined' && retries < 10) {
            console.log('[AUTH] Esperando a que auth.js se cargue...', retries);
            await new Promise(resolve => setTimeout(resolve, 100));
            retries++;
        }
        
        if (typeof window.checkAuth === 'undefined') {
            console.error('[AUTH] auth.js no está cargado después de 1 segundo');
            isCheckingAuth = false;
            // NO redirigir automáticamente para evitar bucles
            return false;
        }
        
        console.log('[AUTH] auth.js cargado, verificando autenticación...');
        
        const authResult = await window.checkAuth();
        
        console.log('[AUTH] Resultado de checkAuth:', authResult);
        console.log('[AUTH] Authenticated:', authResult.authenticated);
        console.log('[AUTH] User:', authResult.user);
        
        if (!authResult.authenticated) {
            console.log('[AUTH] Usuario no autenticado');
            isCheckingAuth = false;
            // NO redirigir automáticamente para evitar bucles
            // window.location.href = 'login.html';
            return false;
        }
        
        console.log('[AUTH] ✅ Usuario autenticado:', authResult.user?.username);
        authCheckComplete = true;
        
        // Mostrar información del usuario
        const userInfo = document.getElementById('user-info');
        const userName = document.getElementById('user-name');
        const userPlan = document.getElementById('user-plan');
        
        if (userInfo && userName && userPlan && authResult.user) {
            userName.textContent = authResult.user.username;
            userPlan.textContent = authResult.user.plan || 'Free';
            userInfo.style.display = 'flex';
        }
        
        // Botón de logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async () => {
                if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
                    if (typeof window.logout === 'function') {
                        await window.logout();
                    } else {
                        window.location.href = 'login.html';
                    }
                }
            });
        }
        
        // Verificar sesión periódicamente (cada 5 minutos) - DESACTIVADO TEMPORALMENTE
        // setInterval(async () => {
        //     const check = await window.checkAuth();
        //     if (!check.authenticated) {
        //         alert('Tu sesión ha expirado. Serás redirigido al login.');
        //         window.location.href = 'login.html';
        //     }
        // }, 5 * 60 * 1000); // 5 minutos
        
        isCheckingAuth = false;
        return true;
    } catch (error) {
        console.error('[AUTH] Error en verificación de autenticación:', error);
        isCheckingAuth = false;
        // NO redirigir automáticamente para evitar bucles
        // window.location.href = 'login.html';
        return false;
    }
}

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM cargado, verificando autenticación...');
    
    // Verificar autenticación de manera simple (sin bucles)
    try {
        // Esperar a que auth.js esté cargado
        let retries = 0;
        while (typeof window.checkAuth === 'undefined' && retries < 10) {
            await new Promise(resolve => setTimeout(resolve, 100));
            retries++;
        }
        
        if (typeof window.checkAuth !== 'undefined') {
            const authResult = await window.checkAuth();
            console.log('[AUTH] Resultado:', authResult.authenticated);
            
            if (!authResult.authenticated) {
                console.log('[AUTH] No autenticado, redirigiendo a login...');
                window.location.href = 'login.html';
                return; // Salir para evitar inicializar el panel
            }
            
            // Mostrar información del usuario si está autenticado
            if (authResult.user) {
                const userInfo = document.getElementById('user-info');
                const userName = document.getElementById('user-name');
                const userPlan = document.getElementById('user-plan');
                
                if (userInfo && userName && userPlan) {
                    userName.textContent = authResult.user.username;
                    userPlan.textContent = authResult.user.plan || 'Free';
                    userInfo.style.display = 'flex';
                }
                
                // Botón de logout
                const logoutBtn = document.getElementById('logout-btn');
                if (logoutBtn) {
                    logoutBtn.addEventListener('click', async () => {
                        if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
                            if (typeof window.logout === 'function') {
                                await window.logout();
                            } else {
                                window.location.href = 'login.html';
                            }
                        }
                    });
                }
            }
        } else {
            console.warn('[AUTH] auth.js no está cargado, pero continuando...');
        }
    } catch (error) {
        console.error('[AUTH] Error en verificación:', error);
        // Si hay error, redirigir a login para estar seguro
        window.location.href = 'login.html';
        return;
    }
    
    console.log('Usuario autenticado, inicializando panel...');
    addLogMessage('🚀 Panel de Control iniciado', 'info');
    
    // Verificar que los scripts estén cargados
    console.log('CONFIG:', CONFIG);
    console.log('EMOTES_DATA disponible:', typeof EMOTES_DATA !== 'undefined');
    console.log('getWeaponName disponible:', typeof getWeaponName !== 'undefined');
    
    initializePanel();
    
    // Verificación de estado del bot removida
    
    // Verificar que los botones se crearon
    setTimeout(() => {
        const emoteCards = document.querySelectorAll('.emote-card');
        console.log('Emote cards creados:', emoteCards.length);
        if (emoteCards.length === 0) {
            addLogMessage('⚠️ No se encontraron emotes. Verifica los datos.', 'error');
        }
    }, 500);
});

