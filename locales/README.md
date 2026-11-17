# Idiomas del portafolio

El sitio sigue siendo HTML, CSS y JavaScript estáticos, compatible con GitHub Pages. No necesita backend, API ni un proceso de compilación.

- `es.js` y `en.js` contienen los mismos identificadores y sus textos en cada idioma, dentro de `window.portfolioTranslations.es` y `window.portfolioTranslations.en`.
- El selector del encabezado cambia entre `?lang=es` y `?lang=en`, conservando el ancla de la página.
- El idioma indicado en la URL tiene prioridad sobre la última elección guardada. La primera visita sin preferencia empieza en español.
- Los enlaces entre páginas y los enlaces de las galerías conservan el idioma.
- Si no se pueden cargar las traducciones, el HTML original sigue disponible en español.

Para actualizar un texto, cambia su entrada en ambos diccionarios y el texto español del HTML. Para agregar un texto, usa una clave descriptiva en `data-i18n`; cuando el elemento incluya iconos u otros elementos, marca únicamente un `span` con el texto. Para atributos, usa `data-i18n-alt`, `data-i18n-aria-label`, `data-i18n-content` o `data-i18n-title`.

Los textos de las galerías usan claves `gallery.*` para sus controles y `galleries.*` para flujos, módulos y capturas. Los originales de `assets/galleries/*/gallery-data.js` sirven como respaldo en español. Al añadir una captura, conserva su identificador de módulo y añade las claves `.photos.<índice>.alt` y `.photos.<índice>.caption` en ambos diccionarios.

Las capturas de las aplicaciones conservan su contenido original. Las traducciones cubren sus descripciones, no las palabras dentro de las imágenes.

Puedes comprobarlo abriendo `index.html` directamente desde tu computadora, incluso con `?lang=en`. Los diccionarios se cargan como scripts clásicos desde la misma carpeta: funcionan tanto con `file://` como en GitHub Pages, sin `fetch`, backend ni servicios externos.

También puedes usar un servidor de archivos estáticos, por ejemplo `python -m http.server 4173`, y abrir `http://localhost:4173/index.html?lang=en`.
