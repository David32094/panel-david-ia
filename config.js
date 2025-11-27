// ============================================
// CONFIGURACIÓN DE LA API DEL BOT EN RAILWAY
// ============================================

window.API_CONFIG = {
    // URL para enviar comandos al bot
    API_URL: 'https://web-production-ddaf8.up.railway.app/api/send-command',

    // URL para consultar el estado del bot
    STATUS_URL: 'https://web-production-ddaf8.up.railway.app/api/status'
};

// Logs para comprobar que se cargó bien
console.log('[CONFIG] ✅ config.js cargado');
console.log('[CONFIG] API_URL:', window.API_CONFIG.API_URL);
console.log('[CONFIG] STATUS_URL:', window.API_CONFIG.STATUS_URL);
