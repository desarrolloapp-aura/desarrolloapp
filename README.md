# Sistema de Evaluación de Proveedores

Aplicación web para evaluar proveedores con asignaciones específicas por evaluador.

## Cómo usar localmente

1. Descarga todos los archivos en una carpeta
2. Abre el archivo `index.html` en tu navegador
3. ¡Listo! La aplicación funciona completamente offline

## Cómo compartir con la empresa

### Opción 1: Netlify (Recomendado - Gratis y Fácil)

1. Ve a [https://www.netlify.com](https://www.netlify.com)
2. Crea una cuenta gratuita
3. Arrastra la carpeta completa del proyecto a Netlify
4. Obtendrás una URL como: `tu-proyecto.netlify.app`
5. Comparte esa URL con todos los miembros de la empresa

### Opción 2: GitHub Pages (Gratis)

1. Crea una cuenta en [GitHub](https://github.com)
2. Crea un nuevo repositorio
3. Sube todos los archivos del proyecto
4. Ve a Settings > Pages
5. Selecciona la rama main y guarda
6. Comparte la URL que GitHub te proporciona

### Opción 3: Servidor Web Propio

1. Sube todos los archivos a tu servidor web
2. Asegúrate de que `index.html` esté en la raíz
3. Comparte la URL con tu equipo

### Opción 4: Compartir Archivos

1. Comprime la carpeta en un archivo ZIP
2. Compártela por email, Google Drive, OneDrive, etc.
3. Cada persona descarga, descomprime y abre `index.html`

## Características

- ✅ Cada evaluador solo ve sus proveedores asignados
- ✅ Filtrado automático de proveedores ya evaluados
- ✅ Descarga de evaluaciones en Excel
- ✅ Envío de correos a proveedores
- ✅ Almacenamiento local (no requiere base de datos)

## Notas Importantes

- Los datos se guardan en el navegador (localStorage)
- Si se limpia el caché del navegador, se pierden los datos
- Para respaldar datos, descarga el Excel regularmente
- Cada usuario debe usar su propio navegador/dispositivo

