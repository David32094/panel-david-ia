# 🎮 David IA - Panel de Emotes para Free Fire

Panel web para ejecutar emotes en Free Fire mediante un bot automatizado.

## 🚀 Despliegue Rápido

### Panel Web (GitHub Pages)

1. **Sube los archivos a GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/USERNAME/REPO_NAME.git
   git push -u origin main
   ```

2. **Activa GitHub Pages**
   - Ve a Settings → Pages
   - Source: `main` branch, `/ (root)`
   - Tu panel estará en: `https://USERNAME.github.io/REPO_NAME/`

3. **Configura la URL de la API**
   - Edita `script.js` línea 6
   - Cambia `localhost:3000` por la IP de tu Oracle Cloud VPS
   - Ejemplo: `API_URL: 'http://TU_IP:3000/api/send-command'`

### Bot Python (Oracle Cloud VPS)

1. **Crea una instancia VPS en Oracle Cloud**
   - Shape: VM.Standard.A1.Flex (Always Free)
   - OS: Ubuntu 22.04

2. **Configura el firewall**
   - Abre puerto 3000 (API)
   - Abre puerto 22 (SSH)

3. **Sube y ejecuta el bot**
   ```bash
   # Conectarse por SSH
   ssh ubuntu@TU_IP
   
   # Subir archivos (desde tu PC)
   scp -r "NmTcp(bd) NO FUCNIONA AVANZADO" ubuntu@TU_IP:/home/ubuntu/
   
   # Instalar dependencias
   cd "NmTcp(bd) NO FUCNIONA AVANZADO"
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   
   # Ejecutar como servicio
   sudo nano /etc/systemd/system/david-ia-bot.service
   # (Ver DEPLOY_ORACLE_CLOUD.md para el contenido)
   sudo systemctl enable david-ia-bot
   sudo systemctl start david-ia-bot
   ```

## 📚 Documentación Completa

- **[DEPLOY_GITHUB_PAGES.md](DEPLOY_GITHUB_PAGES.md)** - Guía detallada para GitHub Pages
- **[DEPLOY_ORACLE_CLOUD.md](DEPLOY_ORACLE_CLOUD.md)** - Guía detallada para Oracle Cloud VPS
- **[KEYAUTH_SETUP.md](KEYAUTH_SETUP.md)** - Configuración de KeyAuth

## 🔧 Configuración

### KeyAuth

El panel usa KeyAuth para autenticación. Configura tus credenciales en `auth.js`:

```javascript
const KEYAUTH_CONFIG = {
    appName: "SENSI DAVID",
    ownerID: "JCGQ9PYdz2",
    version: "1.0",
    secret: "tu-secret-key",
    apiURL: "https://keyauth.win/api/1.0/"
};
```

### API del Bot

En `script.js`, configura la URL de tu API:

```javascript
const CONFIG = {
    API_URL: 'http://TU_IP_ORACLE:3000/api/send-command'
};
```

## 🎯 Características

- ✅ Autenticación con KeyAuth
- ✅ Panel web responsive
- ✅ Ejecución de emotes (normales, dúo, evolutivas)
- ✅ Modo "Salir Bot" / "Quedarse Bot"
- ✅ Validación de UID y código de equipo
- ✅ Interfaz moderna con animaciones

## 📝 Estructura

```
Panel David IA/
├── index.html          # Panel principal
├── login.html          # Página de login
├── auth.js             # Autenticación KeyAuth
├── script.js           # Lógica del panel
├── styles.css          # Estilos generales
├── auth.css            # Estilos de login
├── animations.css      # Animaciones
├── weapon-names.js     # Nombres de armas
├── emotes-data.js      # Datos de emotes
├── cursor-trail.js     # Efecto de cursor
└── emotes/             # Imágenes de emotes
```

## 🔒 Seguridad

- El panel requiere autenticación KeyAuth
- La API valida tokens antes de ejecutar comandos
- CORS configurado para permitir solo tu dominio

## 📞 Soporte

Para problemas o preguntas, revisa la documentación en los archivos `.md` incluidos.
