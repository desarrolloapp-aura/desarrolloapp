
---

### PASO 3: Subir tus archivos

Tienes 3 opciones:

#### **OPCIÓN A: Arrastrar y soltar (MÁS FÁCIL)**

1. En la página del repositorio que acabas de crear
2. Verás instrucciones, pero busca la sección que dice algo como "uploading an existing file"
3. O simplemente arrastra los archivos desde tu carpeta:
   - `index.html`
   - `style.css`
   - `script.js`
   - `README.md` (opcional)
4. Arrastra todos los archivos a la zona de GitHub
5. Abajo, escribe un mensaje: "Primera versión del sistema"
6. Haz clic en **"Commit changes"**

#### **OPCIÓN B: GitHub Desktop (Recomendado si vas a hacer cambios)**

1. Descarga GitHub Desktop: https://desktop.github.com
2. Instálalo y conéctalo con tu cuenta
3. En GitHub Desktop:
   - File > Add Local Repository
   - Selecciona tu carpeta del proyecto
   - Haz clic en "Publish repository"
   - Selecciona tu cuenta y el repositorio
   - Haz clic en "Publish repository"

#### **OPCIÓN C: Desde la terminal (Para usuarios avanzados)**

```bash
cd C:\Users\usuario\Desktop\economia
git init
git add .
git commit -m "Primera versión"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/evaluacion-proveedores.git
git push -u origin main
```

---

### PASO 4: Activar GitHub Pages

1. En tu repositorio de GitHub, ve a la pestaña **"Settings"** (Configuración)
   - Está en la parte superior del repositorio

2. En el menú lateral izquierdo, busca y haz clic en **"Pages"**

3. En la sección **"Source"**:
   - Selecciona **"Deploy from a branch"**
   - En **"Branch"**, selecciona **"main"**
   - En **"Folder"**, selecciona **"/ (root)"**
   - Haz clic en **"Save"**

4. ⏳ Espera 1-2 minutos mientras GitHub procesa

5. Verás un mensaje verde que dice:
   ```
   ✅ Your site is live at https://TU-USUARIO.github.io/evaluacion-proveedores/
   ```

---

### PASO 5: Obtener tu link

Tu link será:
```
https://TU-USUARIO.github.io/evaluacion-proveedores/
```

**Ejemplo:**
- Si tu usuario es `juan-perez`
- El link será: `https://juan-perez.github.io/evaluacion-proveedores/`

---

### PASO 6: Personalizar el nombre (OPCIONAL)

Si quieres cambiar el nombre de la URL:

1. Ve a Settings del repositorio
2. Haz clic en "General" (arriba)
3. Busca "Repository name"
4. Cambia el nombre (ejemplo: `evaluacion-proveedores-2024`)
5. El nuevo link será: `https://TU-USUARIO.github.io/nuevo-nombre/`

---

## 📤 COMPARTIR EL LINK

Una vez que tengas el link, puedes:

✅ Compartirlo por email
✅ Compartirlo por WhatsApp
✅ Compartirlo por Teams/Slack
✅ Agregarlo a favoritos
✅ Enviarlo por cualquier medio

**Todos los miembros de la empresa podrán:**
- Abrir el link en su navegador
- Usar el sistema directamente
- No necesitan descargar nada
- Funciona en computadoras, tablets y móviles

---

## 🔄 ACTUALIZAR EL SISTEMA

Si haces cambios:

1. Edita los archivos localmente
2. Vuelve a subirlos a GitHub (arrastra y suelta de nuevo)
3. Los cambios se reflejan automáticamente en el link (puede tardar 1-2 minutos)

---

## ⚠️ IMPORTANTE

- ✅ El repositorio DEBE ser **Público** para GitHub Pages gratuito
- ✅ Los datos se guardan en el navegador de cada usuario (no se sincronizan)
- ✅ El link es permanente mientras el repositorio exista
- ✅ Es completamente gratuito

---

## 🆘 PROBLEMAS COMUNES

**"No veo la opción Pages"**
- Asegúrate de que el repositorio sea Público
- Verifica que hayas subido al menos el archivo `index.html`

**"El link no funciona"**
- Espera 2-3 minutos después de activar Pages
- Verifica que hayas seleccionado la rama "main"
- Recarga la página de Settings

**"No puedo subir archivos"**
- Usa GitHub Desktop (más fácil)
- O arrastra y suelta directamente en la web

---

## ✅ RESUMEN RÁPIDO

1. Crear cuenta en GitHub
2. Crear repositorio (Público)
3. Subir archivos (arrastrar y soltar)
4. Settings > Pages > Activar
5. Copiar el link que te da GitHub
6. ¡Compartir con tu equipo!

**Tu link será:** `https://TU-USUARIO.github.io/evaluacion-proveedores/`

