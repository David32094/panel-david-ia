// ============================================
// CONFIGURACIÓN DE API
// ============================================
// Copia este archivo a config.js y actualiza con tu IP de Oracle Cloud

const CONFIG = {
    // Para desarrollo local:
    // API_URL: 'http://localhost:3000/api/send-command'
    
    // Para producción (Oracle Cloud VPS):
    // Reemplaza TU_IP_PUBLICA con la IP pública de tu Oracle Cloud VPS
    API_URL: 'http://https://tonia-unrebuffable-uncolouredly.ngrok-free.dev/api/send-command:3000/api/send-command'
    
    // Si configuraste Nginx como proxy:
    // API_URL: 'http://TU_IP_PUBLICA/api/send-command'
    
    // Si tienes dominio con HTTPS:
    // API_URL: 'https://tu-dominio.com/api/send-command'
};

