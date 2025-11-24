# 🚀 Guía de Despliegue - Bot en Oracle Cloud Always Free VPS

## Requisitos Previos

1. Cuenta de Oracle Cloud (gratis)
2. Tarjeta de crédito (solo para verificación, no se cobra)
3. Acceso SSH

## Paso 1: Crear Instancia en Oracle Cloud

### 1.1 Crear Cuenta

1. Ve a [Oracle Cloud](https://www.oracle.com/cloud/free/)
2. Click en **Start for Free**
3. Completa el registro (necesitas tarjeta para verificación)

### 1.2 Crear Instancia VPS

1. Una vez dentro del dashboard, busca **Compute** → **Instances**
2. Click en **Create Instance**
3. Configuración:
   - **Name**: `david-ia-bot`
   - **Image**: **Canonical Ubuntu 22.04** (o la última LTS)
   - **Shape**: **VM.Standard.A1.Flex** (ARM, Always Free)
     - OCPU: 4
     - Memory: 24 GB
   - **Networking**: Dejar por defecto
   - **Add SSH keys**: Sube tu clave pública SSH o genera una nueva
4. Click en **Create**

### 1.3 Configurar Firewall (IMPORTANTE)

1. Ve a **Networking** → **Virtual Cloud Networks**
2. Selecciona tu VCN
3. Click en **Security Lists**
4. Click en **Default Security List**
5. Click en **Add Ingress Rules**:
   - **Source Type**: CIDR
   - **Source CIDR**: `0.0.0.0/0` (permite desde cualquier lugar)
   - **IP Protocol**: TCP
   - **Destination Port Range**: `3000` (puerto de tu API)
   - **Description**: "Panel Web API"
6. Click en **Add Ingress Rules** de nuevo para SSH:
   - **Source Type**: CIDR
   - **Source CIDR**: `0.0.0.0/0`
   - **IP Protocol**: TCP
   - **Destination Port Range**: `22`
   - **Description**: "SSH Access"
7. Guarda los cambios

## Paso 2: Conectarse a la VPS

### 2.1 Obtener IP Pública

1. En **Compute** → **Instances**, encuentra tu instancia
2. Copia la **Public IP Address**

### 2.2 Conectarse por SSH

```bash
# Si usaste clave SSH
ssh -i /ruta/a/tu/clave.pem ubuntu@TU_IP_PUBLICA

# Si usaste contraseña
ssh ubuntu@TU_IP_PUBLICA
```

## Paso 3: Instalar Dependencias

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Python 3.10+ y pip
sudo apt install python3 python3-pip python3-venv -y

# Instalar dependencias del sistema
sudo apt install build-essential libssl-dev libffi-dev -y

# Instalar Git
sudo apt install git -y
```

## Paso 4: Subir el Bot

### Opción A: Usando Git

```bash
# Clonar tu repositorio (si tienes el bot en GitHub)
git clone https://github.com/USERNAME/REPO_NAME.git
cd REPO_NAME
```

### Opción B: Usando SCP (desde tu PC)

```bash
# Desde tu PC, en otra terminal
scp -i /ruta/a/clave.pem -r "NmTcp(bd) NO FUCNIONA AVANZADO" ubuntu@TU_IP_PUBLICA:/home/ubuntu/
```

## Paso 5: Configurar el Bot

```bash
# Ir a la carpeta del bot
cd "NmTcp(bd) NO FUCNIONA AVANZADO"

# Crear entorno virtual
python3 -m venv venv

# Activar entorno virtual
source venv/bin/activate

# Instalar dependencias
pip install --upgrade pip
pip install -r requirements.txt  # Si tienes requirements.txt
# O instalar manualmente:
pip install requests protobuf pycryptodome google-auth google-auth-oauthlib google-auth-httplib2
```

## Paso 6: Configurar el Bot para Producción

Edita `app.py` y asegúrate de que:

1. **El servidor HTTP escuche en todas las interfaces**:
```python
# En start_panel_server, cambiar:
server_address = ('0.0.0.0', port)  # No 'localhost', sino '0.0.0.0'
```

2. **La URL de la API sea accesible desde GitHub Pages**:
   - El bot ya tiene CORS configurado (`Access-Control-Allow-Origin: *`)
   - Solo necesitas que el puerto 3000 esté abierto (ya lo configuraste en el firewall)

## Paso 7: Ejecutar el Bot como Servicio (24/7)

### Crear servicio systemd

```bash
sudo nano /etc/systemd/system/david-ia-bot.service
```

Contenido del archivo:

```ini
[Unit]
Description=David IA Bot - Free Fire Emote Bot
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/NmTcp(bd) NO FUCNIONA AVANZADO
Environment="PATH=/home/ubuntu/NmTcp(bd) NO FUCNIONA AVANZADO/venv/bin"
ExecStart=/home/ubuntu/NmTcp(bd) NO FUCNIONA AVANZADO/venv/bin/python app.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### Activar y iniciar el servicio

```bash
# Recargar systemd
sudo systemctl daemon-reload

# Habilitar para que inicie automáticamente
sudo systemctl enable david-ia-bot

# Iniciar el servicio
sudo systemctl start david-ia-bot

# Verificar estado
sudo systemctl status david-ia-bot

# Ver logs
sudo journalctl -u david-ia-bot -f
```

## Paso 8: Configurar el Panel Web

En tu repositorio de GitHub Pages, edita `script.js`:

```javascript
const CONFIG = {
    // Cambiar por la IP pública de tu Oracle Cloud VPS
    API_URL: 'http://TU_IP_PUBLICA:3000/api/send-command'
};
```

**IMPORTANTE**: Si usas HTTP, algunos navegadores pueden bloquearlo desde HTTPS (GitHub Pages). 

### Solución: Usar HTTPS con Nginx (Recomendado)

1. Instalar Nginx en Oracle Cloud:
```bash
sudo apt install nginx certbot python3-certbot-nginx -y
```

2. Configurar Nginx como proxy reverso:
```bash
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
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS headers
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Content-Type' always;
    }
}
```

3. Habilitar sitio:
```bash
sudo ln -s /etc/nginx/sites-available/david-ia-bot /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

4. Actualizar `script.js` en GitHub Pages:
```javascript
const CONFIG = {
    API_URL: 'http://TU_IP_PUBLICA/api/send-command'
};
```

## Paso 9: Verificar que Todo Funcione

1. **Verificar que el bot esté corriendo**:
```bash
sudo systemctl status david-ia-bot
```

2. **Verificar que la API responda**:
```bash
curl http://localhost:3000/api/status
```

3. **Desde tu navegador, prueba**:
```
http://TU_IP_PUBLICA:3000/api/status
```

4. **Desde GitHub Pages, prueba hacer login y ejecutar un emote**

## Mantenimiento

### Ver logs del bot:
```bash
sudo journalctl -u david-ia-bot -f
```

### Reiniciar el bot:
```bash
sudo systemctl restart david-ia-bot
```

### Detener el bot:
```bash
sudo systemctl stop david-ia-bot
```

### Actualizar el bot:
```bash
cd /home/ubuntu/NmTcp(bd) NO FUCNIONA AVANZADO
git pull  # Si usas Git
# O subir archivos nuevos con SCP
sudo systemctl restart david-ia-bot
```

## Seguridad Adicional (Opcional)

1. **Configurar firewall UFW**:
```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 3000/tcp
sudo ufw enable
```

2. **Usar HTTPS con Let's Encrypt** (si tienes dominio):
```bash
sudo certbot --nginx -d tu-dominio.com
```

## Resumen

✅ **Panel Web**: GitHub Pages (24/7, gratis)
✅ **Bot + API**: Oracle Cloud Always Free VPS (24/7, gratis)
✅ **Comunicación**: Panel HTTPS → API HTTP/HTTPS
✅ **KeyAuth**: Funciona en ambos lados
✅ **Auto-reinicio**: systemd reinicia el bot si se cae

