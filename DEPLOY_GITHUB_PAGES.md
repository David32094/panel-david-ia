# 🚀 Guía de Despliegue - Panel Web en GitHub Pages

## Estructura del Proyecto

```
Panel David IA/
├── index.html          # Panel principal
├── login.html          # Página de login
├── auth.js             # Autenticación KeyAuth
├── script.js           # Lógica del panel
├── styles.css          # Estilos
├── auth.css            # Estilos de login
├── animations.css      # Animaciones
├── weapon-names.js     # Nombres de armas
├── emotes-data.js      # Datos de emotes
├── cursor-trail.js     # Efecto de cursor
└── emotes/             # Imágenes de emotes
    ├── evolutivas/
    ├── normales/
    └── duo/
```

## Pasos para Desplegar en GitHub Pages

### 1. Crear Repositorio en GitHub

1. Ve a [GitHub](https://github.com) y crea un nuevo repositorio
2. Nombre sugerido: `david-ia-panel` o `freefire-emote-panel`
3. Marca como **público** (necesario para GitHub Pages gratis)
4. NO inicialices con README, .gitignore o licencia

### 2. Subir Archivos

```bash
# En tu terminal, desde la carpeta del proyecto
cd "Panel David IA"

# Inicializar git
git init

# Agregar todos los archivos
git add .

# Commit inicial
git commit -m "Initial commit - Panel David IA"

# Agregar el repositorio remoto (reemplaza USERNAME y REPO_NAME)
git remote add origin https://github.com/USERNAME/REPO_NAME.git

# Subir archivos
git branch -M main
git push -u origin main
```

### 3. Activar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Click en **Settings** (Configuración)
3. En el menú lateral, click en **Pages**
4. En **Source**, selecciona:
   - Branch: `main`
   - Folder: `/ (root)`
5. Click en **Save**
6. Espera 1-2 minutos
7. Tu panel estará disponible en: `https://USERNAME.github.io/REPO_NAME/`

### 4. Configurar la URL de la API

**IMPORTANTE:** Necesitas actualizar la URL de la API en `script.js` para que apunte a tu servidor Oracle Cloud.

Edita `Panel David IA/script.js`:

```javascript
const CONFIG = {
    // Cambiar localhost por la IP pública de tu Oracle Cloud VPS
    API_URL: 'http://TU_IP_ORACLE:3000/api/send-command'
    // O si tienes dominio:
    // API_URL: 'https://tu-dominio.com/api/send-command'
};
```

### 5. Verificar CORS en el Bot

Asegúrate de que el bot en Oracle Cloud permita peticiones desde tu dominio de GitHub Pages.

En `app.py`, el código ya tiene:
```python
self.send_header('Access-Control-Allow-Origin', '*')
```

Esto permite peticiones desde cualquier origen, incluyendo GitHub Pages.

## Estructura Final en GitHub

```
tu-repositorio/
├── index.html
├── login.html
├── auth.js
├── script.js
├── styles.css
├── auth.css
├── animations.css
├── weapon-names.js
├── emotes-data.js
├── cursor-trail.js
├── emotes/
│   ├── evolutivas/
│   ├── normales/
│   └── duo/
└── README.md (opcional)
```

## Notas Importantes

1. **GitHub Pages es HTTPS**: Tu panel será `https://...`
2. **API debe ser HTTP o HTTPS**: Si tu API es HTTP, algunos navegadores pueden bloquearla (mixed content)
3. **Solución**: Usa HTTPS en Oracle Cloud o configura un proxy
4. **KeyAuth funciona**: El login funciona perfectamente desde GitHub Pages

## Actualizar el Panel

Cada vez que hagas cambios:

```bash
git add .
git commit -m "Descripción de cambios"
git push
```

Los cambios se reflejan en 1-2 minutos automáticamente.

## URL Final

Tu panel estará disponible en:
- `https://USERNAME.github.io/REPO_NAME/`
- `https://USERNAME.github.io/REPO_NAME/login.html`

