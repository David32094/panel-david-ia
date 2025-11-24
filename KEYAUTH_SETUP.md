# 🔐 Configuración de KeyAuth - David IA v3.0

## ✅ Configuración Completada

La configuración de KeyAuth ya está integrada con tus credenciales:

- **App Name:** SENSI DAVID
- **Owner ID:** JCGQ9PYdz2
- **Version:** 1.0
- **API URL:** https://keyauth.win/api/1.3/

---

## 📋 Archivos Modificados

### `auth.js`
- ✅ Configuración de KeyAuth actualizada con tus credenciales
- ✅ API URL actualizada a versión 1.3
- ✅ Todas las funciones de autenticación implementadas

### `login.html`
- ✅ Página de login/registro completa
- ✅ Formularios con validación
- ✅ Sistema de tabs (Login/Register)
- ✅ Modal de recuperación de contraseña

### `auth.css`
- ✅ Estilos premium para la página de autenticación
- ✅ Animaciones y efectos visuales
- ✅ Diseño responsive

### `index.html`
- ✅ Verificación de autenticación antes de mostrar contenido
- ✅ Información de usuario en el header
- ✅ Botón de logout

### `script.js`
- ✅ Verificación automática de sesión
- ✅ Redirección a login si no está autenticado
- ✅ Verificación periódica cada 5 minutos

---

## 🚀 Cómo Funciona

### 1. **Primera Vez (Registro)**
1. Usuario accede a `login.html`
2. Hace clic en la tab "Registrarse"
3. Completa el formulario:
   - Username (3-20 caracteres)
   - Email válido
   - Password (mínimo 8 caracteres)
   - License Key (formato: XXXX-XXXX-XXXX-XXXX)
4. KeyAuth valida la license key
5. Si es válida, crea la cuenta y hace auto-login
6. Redirige a `index.html` (dashboard)

### 2. **Login Normal**
1. Usuario accede a `login.html`
2. Ingresa username y password
3. Opcional: marca "Recordarme" para sesión persistente
4. KeyAuth valida credenciales
5. Si son correctas, guarda token y redirige a dashboard

### 3. **Uso del Dashboard**
1. Al cargar `index.html`, verifica automáticamente la sesión
2. Si no hay sesión válida, redirige a `login.html`
3. Muestra información del usuario en el header
4. Verifica la sesión cada 5 minutos
5. Si expira, redirige automáticamente a login

---

## 🔧 Funciones de KeyAuth Implementadas

### ✅ Login
- Endpoint: `POST /api/1.3/`
- Parámetros: `type=login`, `username`, `password`, `hwid`
- Guarda token de sesión

### ✅ Registro
- Endpoint: `POST /api/1.3/`
- Parámetros: `type=register`, `username`, `email`, `password`, `license`, `hwid`
- Valida license key antes de crear cuenta
- Auto-login después de registro exitoso

### ✅ Verificación de Sesión
- Endpoint: `POST /api/1.3/`
- Parámetros: `type=license`, `sessionid`
- Verifica que el token sea válido
- Comprueba que la licencia no haya expirado

### ✅ Logout
- Endpoint: `POST /api/1.3/`
- Parámetros: `type=logout`, `sessionid`
- Invalida el token en KeyAuth
- Limpia datos locales

---

## 🛡️ Seguridad Implementada

### Frontend
- ✅ Sanitización de inputs (prevención XSS)
- ✅ Validación de formato (email, password, license key)
- ✅ Rate limiting visual (deshabilitar botón después de intento)
- ✅ Tokens guardados en localStorage/sessionStorage según preferencia
- ✅ HWID único por dispositivo

### Comunicación
- ✅ HTTPS obligatorio (KeyAuth usa HTTPS)
- ✅ Headers correctos (`Content-Type: application/x-www-form-urlencoded`)
- ✅ Timeout de requests (10 segundos)
- ✅ Manejo de errores robusto

---

## 📱 Características del Sistema

### Página de Login
- ✅ Diseño premium con animaciones
- ✅ Tabs para cambiar entre Login/Register
- ✅ Validación en tiempo real
- ✅ Indicador de fortaleza de contraseña
- ✅ Toggle para mostrar/ocultar password
- ✅ Formato automático de license key
- ✅ Checkbox "Recordarme"
- ✅ Link "¿Olvidaste tu contraseña?"

### Dashboard
- ✅ Verificación automática de autenticación
- ✅ Información de usuario en header
- ✅ Plan de suscripción visible
- ✅ Botón de logout con confirmación
- ✅ Verificación periódica de sesión

### Notificaciones
- ✅ Toast notifications (top-right)
- ✅ Tipos: success, error, warning, info
- ✅ Animaciones suaves
- ✅ Auto-dismiss configurable

---

## 🎨 Estilos y Animaciones

### Paleta de Colores
- Verde Principal: `#1EF59A`
- Verde Secundario: `#0FAF68`
- Fondo Oscuro: `#042B1F`
- Paneles: `#07100D`
- Texto: `#E9FFF4`

### Animaciones
- ✅ Fade-in del logo
- ✅ Scale-in del card de autenticación
- ✅ Slide de tabs
- ✅ Shake en errores
- ✅ Success animation
- ✅ Loading states
- ✅ Toast slide-in

---

## 🔄 Flujo de Autenticación

```
Usuario accede → Verifica token guardado
   ↓
¿Token válido?
   → SÍ → Valida con KeyAuth → Dashboard
   → NO → Muestra login.html
   
Usuario hace login → KeyAuth valida
   ↓
¿Credenciales correctas?
   → SÍ → Guarda token → Dashboard
   → NO → Muestra error
   
Usuario en Dashboard → Cada 5 minutos
   ↓
Verifica token con KeyAuth
   ↓
¿Token válido?
   → SÍ → Continúa
   → NO → Logout → Login
```

---

## 📝 Notas Importantes

1. **License Keys**: Deben estar creadas en tu panel de KeyAuth antes de que los usuarios puedan registrarse.

2. **HWID**: Se genera automáticamente basado en el navegador. Es único por dispositivo.

3. **Sesiones**: 
   - Sin "Recordarme": Token en `sessionStorage` (se borra al cerrar navegador)
   - Con "Recordarme": Token en `localStorage` (persiste entre sesiones)

4. **Expiración**: La sesión expira según la configuración de KeyAuth. El sistema verifica automáticamente.

5. **Errores Comunes**:
   - "License key inválida": La key no existe o ya fue usada
   - "Credenciales incorrectas": Username o password incorrectos
   - "Sesión expirada": El token ya no es válido

---

## 🧪 Testing

### Probar Login
1. Abre `login.html`
2. Ingresa credenciales válidas
3. Debe redirigir a `index.html`
4. Debe mostrar tu username en el header

### Probar Registro
1. Abre `login.html`
2. Cambia a tab "Registrarse"
3. Completa el formulario con una license key válida
4. Debe crear cuenta y hacer auto-login

### Probar Logout
1. En el dashboard, haz clic en el botón de logout
2. Confirma
3. Debe redirigir a `login.html`
4. Debe limpiar todos los datos

### Probar Verificación de Sesión
1. Inicia sesión
2. Espera 5 minutos
3. El sistema debe verificar automáticamente
4. Si la sesión es válida, continúa funcionando

---

## 🚨 Troubleshooting

### "KeyAuth no está configurado correctamente"
- Verifica que `KEYAUTH_CONFIG` en `auth.js` tenga los valores correctos
- Asegúrate de que `appName` y `ownerID` no estén vacíos

### "Error de conexión"
- Verifica tu conexión a internet
- Asegúrate de que KeyAuth esté funcionando
- Revisa la consola del navegador para más detalles

### "License key inválida"
- Verifica que la license key exista en tu panel de KeyAuth
- Asegúrate de que no haya sido usada antes
- Verifica el formato (XXXX-XXXX-XXXX-XXXX)

### "Sesión expirada"
- La sesión puede haber expirado en KeyAuth
- Inicia sesión nuevamente
- Verifica la configuración de expiración en KeyAuth

---

## 📚 Recursos

- [KeyAuth Documentation](https://docs.keyauth.cc/)
- [KeyAuth Dashboard](https://keyauth.cc/dashboard/)
- Panel de KeyAuth: https://keyauth.cc/dashboard/

---

**Versión:** 3.0  
**Última Actualización:** 2025-01-24  
**Estado:** ✅ Configurado y Funcional

