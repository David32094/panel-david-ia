# 📸 INSTRUCCIONES PARA AGREGAR IMÁGENES DE ARMAS

## 📁 Estructura de Carpetas

Crea la siguiente estructura de carpetas dentro de `Panel David IA/`:

```
Panel David IA/
├── emotes/                    ← CREAR ESTA CARPETA
│   ├── evolutivas/            ← CREAR ESTA CARPETA
│   │   ├── evolutiva-1.png    ← Foto del AK47
│   │   ├── evolutiva-2.png    ← Foto del SCAR
│   │   ├── evolutiva-3.png    ← Foto del MP40 (1st)
│   │   ├── evolutiva-4.png    ← Foto del MP40 (2nd)
│   │   ├── evolutiva-5.png    ← Foto del M1014 (1st)
│   │   ├── evolutiva-6.png    ← Foto del M1014 (2nd)
│   │   ├── evolutiva-7.png    ← Foto del XM8
│   │   ├── evolutiva-8.png    ← Foto del FAMAS
│   │   ├── evolutiva-9.png    ← Foto del UMP
│   │   ├── evolutiva-10.png   ← Foto del M1887
│   │   ├── evolutiva-11.png   ← Foto del Woodpecker
│   │   ├── evolutiva-12.png   ← Foto del Groza
│   │   ├── evolutiva-13.png   ← Foto del M4A1
│   │   ├── evolutiva-14.png   ← Foto del Thompson
│   │   ├── evolutiva-15.png   ← Foto del G18
│   │   ├── evolutiva-16.png   ← Foto del Parafal
│   │   └── evolutiva-17.png   ← Foto del P90
│   │
│   ├── normales/              ← CREAR ESTA CARPETA (opcional)
│   │   ├── normal-1.png
│   │   ├── normal-2.png
│   │   └── ... (más emotes normales)
│   │
│   └── duo/                    ← CREAR ESTA CARPETA (opcional)
│       ├── duo-1.png
│       ├── duo-2.png
│       └── ... (más emotes dúo)
│
├── index.html
├── styles.css
├── script.js
└── ... (otros archivos)
```

## 📝 Pasos para Agregar las Imágenes

### Paso 1: Crear las Carpetas

1. Ve a la carpeta `Panel David IA/`
2. Crea una carpeta llamada `emotes`
3. Dentro de `emotes`, crea las carpetas:
   - `evolutivas`
   - `normales` (opcional)
   - `duo` (opcional)

### Paso 2: Agregar las Fotos

1. **Evolutivas (1-17):**
   - Coloca las fotos en `emotes/evolutivas/`
   - Nombra las imágenes exactamente como:
     - `evolutiva-1.png` (AK47)
     - `evolutiva-2.png` (SCAR)
     - `evolutiva-3.png` (MP40 1st)
     - `evolutiva-4.png` (MP40 2nd)
     - `evolutiva-5.png` (M1014 1st)
     - `evolutiva-6.png` (M1014 2nd)
     - `evolutiva-7.png` (XM8)
     - `evolutiva-8.png` (FAMAS)
     - `evolutiva-9.png` (UMP)
     - `evolutiva-10.png` (M1887)
     - `evolutiva-11.png` (Woodpecker)
     - `evolutiva-12.png` (Groza)
     - `evolutiva-13.png` (M4A1)
     - `evolutiva-14.png` (Thompson)
     - `evolutiva-15.png` (G18)
     - `evolutiva-16.png` (Parafal)
     - `evolutiva-17.png` (P90)

2. **Normales y Dúo:**
   - Coloca las fotos en sus respectivas carpetas
   - Nombra según el número del emote

### Paso 3: Verificar las Rutas

Las rutas ya están configuradas en `emotes-data.js` como:
- `"emotes/evolutiva-1.png"`
- `"emotes/normal-1.png"`
- `"emotes/duo-1.png"`

**No necesitas cambiar nada en el código**, solo asegúrate de que:
- Las carpetas existan
- Los nombres de archivo coincidan exactamente

## 🖼️ Especificaciones de las Imágenes

### Tamaño Recomendado
- **Ancho:** 150-200px
- **Alto:** 120-160px
- **Formato:** PNG (con transparencia) o JPG
- **Peso:** Máximo 100KB por imagen (para carga rápida)

### Calidad
- Imágenes nítidas y claras
- Fondo transparente (PNG) o fondo que combine con el diseño
- Resolución suficiente para verse bien en pantalla

## ✅ Verificación

Después de agregar las imágenes:

1. Abre `index.html` en el navegador
2. Verifica que las imágenes se muestren correctamente
3. Si no aparecen, revisa:
   - Que las carpetas existan
   - Que los nombres de archivo coincidan exactamente
   - La consola del navegador (F12) para ver errores

## 🔧 Si las Imágenes No Aparecen

Si ves un placeholder o la imagen no carga:

1. **Verifica la ruta:** Abre la consola del navegador (F12) y busca errores como:
   - `Failed to load resource: net::ERR_FILE_NOT_FOUND`
   - Esto indica que la ruta no es correcta

2. **Verifica el nombre:** Los nombres deben ser exactos (mayúsculas/minúsculas importan en algunos sistemas)

3. **Verifica la ubicación:** Las imágenes deben estar en:
   ```
   Panel David IA/emotes/evolutivas/evolutiva-1.png
   ```

## 📌 Nota Importante

- Las rutas son **relativas** a `index.html`
- Si mueves `index.html`, las rutas seguirán funcionando
- Si cambias la estructura de carpetas, actualiza las rutas en `emotes-data.js`

