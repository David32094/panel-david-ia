# 📋 Instrucciones de Configuración - Paso a Paso

## Resumen del Setup

```
┌─────────────────┐         ┌──────────────────┐
│  GitHub Pages   │  HTTPS  │  Oracle Cloud VPS │
│  (Panel Web)    │ ──────> │  (Bot Python)    │
│                 │         │  Puerto 3000     │
└─────────────────┘         └──────────────────┘
```

## Paso 1: Preparar el Panel Web

### 1.1 Actualizar URL de API

Edita `Panel David IA/script.js`:

```javascript
const CONFIG = {
    // ANTES (desarrollo):
    // API_URL: 'http://localhost:3000/api/send-command'
    
    // DESPUÉS (producción):
    API_URL: 'http://TU_IP_ORACLE:3000/api/send-command'
    // Reemplaza TU_IP_ORACLE con la IP pública de tu VPS
};
```

### 1.2 Verificar KeyAuth

Asegúrate de que `auth.js` tenga tus credenciales correctas:

```javascript
const KEYAUTH_CONFIG = {
    appName: "SENSI DAVID",
    ownerID: "JCGQ9PYdz2",
    version: "1.0",
    secret: "ce64eaab6734ffa6fc635a3dd1b699606de79bb6fc4fc39e046f4f17484e339a",
    apiURL: "https://keyauth.win/api/1.0/"
};
```

## Paso 2: Subir Panel a GitHub Pages

### 2.1 Crear Repositorio

1. Ve a [GitHub](https://github.com/new)
2. Nombre: `david-ia-panel` (o el que prefieras)
3. Marca como **Público**
4. Click en **Create repository**

### 2.2 Subir Archivos

```bash
# Desde la carpeta "Panel David IA"
cd "Panel David IA"

# Inicializar git
git init

# Agregar archivos
git add .

# Commit
git commit -m "Panel David IA - Initial commit"

# Conectar con GitHub (reemplaza USERNAME y REPO_NAME)
git remote add origin https://github.com/USERNAME/REPO_NAME.git

# Subir
git branch -M main
git push -u origin main
```

### 2.3 Activar GitHub Pages

1. Ve a tu repositorio en GitHub
2. **Settings** → **Pages**
3. **Source**: `main` branch, `/ (root)`
4. **Save**
5. Espera 1-2 minutos
6. Tu panel: `https://USERNAME.github.io/REPO_NAME/`

## Paso 3: Configurar Oracle Cloud VPS

### 3.1 Crear Cuenta

1. Ve a [Oracle Cloud Free Tier](https://www.oracle.com/cloud/free/)
2. Click en **Start for Free**
3. Completa el registro (necesitas tarjeta para verificación, no se cobra)

### 3.2 Crear Instancia

1. Dashboard → **Compute** → **Instances**
2. **Create Instance**
3. Configuración:
   - **Name**: `david-ia-bot`
   - **Image**: **Canonical Ubuntu 22.04**
   - **Shape**: **VM.Standard.A1.Flex**
     - OCPU: 4
     - Memory: 24 GB
   - **SSH keys**: Sube tu clave pública o genera una nueva
4. **Create**

### 3.3 Configurar Firewall

1. **Networking** → **Virtual Cloud Networks**
2. Selecciona tu VCN → **Security Lists** → **Default Security List**
3. **Add Ingress Rules**:
   - **Port 3000**: `0.0.0.0/0` (API)
   - **Port 22**: `0.0.0.0/0` (SSH)

## Paso 4: Instalar Bot en VPS

### 4.1 Conectarse por SSH

```bash
ssh -i /ruta/clave.pem ubuntu@TU_IP_PUBLICA
```

### 4.2 Instalar Dependencias

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install python3 python3-pip python3-venv git -y
```

### 4.3 Subir Bot

**Opción A: Desde tu PC con SCP**
```bash
# Desde tu PC (otra terminal)
scp -i /ruta/clave.pem -r "Bot David IA" ubuntu@TU_IP:/home/ubuntu/
```

**Opción B: Clonar desde GitHub (si subiste el bot)**
```bash
git clone https://github.com/USERNAME/BOT_REPO.git
```

### 4.4 Configurar Bot

```bash
cd "Bot David IA"
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install requests protobuf pycryptodome google-auth google-auth-oauthlib google-auth-httplib2
```

### 4.5 Verificar que el Servidor Escuche en 0.0.0.0

El código ya está configurado correctamente en `app.py` línea 4355:
```python
httpd = ReusableTCPServer(("", test_port), PanelHTTPRequestHandler)
```

El `""` significa que escucha en todas las interfaces (0.0.0.0), lo cual es correcto.

## Paso 5: Ejecutar Bot como Servicio

### 5.1 Crear Servicio systemd

```bash
sudo nano /etc/systemd/system/david-ia-bot.service
```

Pega este contenido (ajusta las rutas):

```ini
[Unit]
Description=David IA Bot - Free Fire Emote Bot
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/Bot David IA
Environment="PATH=/home/ubuntu/Bot David IA/venv/bin"
ExecStart=/home/ubuntu/Bot David IA/venv/bin/python app.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

**O simplemente copia el archivo preconfigurado:**

```bash
sudo cp Bot\ David\ IA/systemd/david-ia-bot.service /etc/systemd/system/
sudo nano /etc/systemd/system/david-ia-bot.service  # Ajustar rutas si es necesario
```

### 5.2 Activar Servicio

```bash
sudo systemctl daemon-reload
sudo systemctl enable david-ia-bot
sudo systemctl start david-ia-bot
sudo systemctl status david-ia-bot
```

### 5.3 Ver Logs

```bash
sudo journalctl -u david-ia-bot -f
```

## Paso 6: Verificar Conexión

### 6.1 Desde la VPS

```bash
curl http://localhost:3000/api/status
```

### 6.2 Desde tu Navegador

Abre: `http://TU_IP_PUBLICA:3000/api/status`

Deberías ver una respuesta JSON.

### 6.3 Desde GitHub Pages

1. Ve a tu panel: `https://USERNAME.github.io/REPO_NAME/`
2. Haz login con KeyAuth
3. Valida UID y código de equipo
4. Prueba ejecutar un emote

## Paso 7: Solución de Problemas

### Error: "CORS blocked"

El bot ya tiene CORS configurado. Si persiste:
- Verifica que el firewall permita el puerto 3000
- Verifica que el bot esté corriendo: `sudo systemctl status david-ia-bot`

### Error: "Connection refused"

- Verifica que el bot esté corriendo
- Verifica que el firewall esté abierto
- Verifica la IP en `script.js`

### Error: "Mixed Content" (HTTPS → HTTP)

GitHub Pages es HTTPS, pero tu API es HTTP. Soluciones:

**Opción A: Usar Nginx como proxy (Recomendado)**

```bash
# En Oracle Cloud VPS
sudo apt install nginx -y
sudo nano /etc/nginx/sites-available/david-ia-bot
```

Contenido:
```nginx
server {
    listen 80;
    server_name TU_IP_PUBLICA;

    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Content-Type' always;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/david-ia-bot /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

Actualiza `script.js`:
```javascript
API_URL: 'http://TU_IP_PUBLICA/api/send-command'
```

**Opción B: Usar HTTPS con Let's Encrypt** (si tienes dominio)

## ✅ Checklist Final

- [ ] Panel subido a GitHub Pages
- [ ] URL de API actualizada en `script.js`
- [ ] VPS creada en Oracle Cloud
- [ ] Firewall configurado (puertos 22 y 3000)
- [ ] Bot instalado y configurado
- [ ] Servicio systemd creado y activo
- [ ] Bot corriendo: `sudo systemctl status david-ia-bot`
- [ ] API accesible: `http://TU_IP:3000/api/status`
- [ ] Panel funciona desde GitHub Pages
- [ ] Login con KeyAuth funciona
- [ ] Emotes se ejecutan correctamente

## 🎉 ¡Listo!

Tu setup está completo:
- ✅ Panel web: 24/7 en GitHub Pages
- ✅ Bot: 24/7 en Oracle Cloud VPS
- ✅ Comunicación: Panel → API funcionando

