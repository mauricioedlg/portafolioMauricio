# Portafolio de Mauricio Estrada de la Garza

Página estática en español basada en el contenido del CV. Conserva la paleta vino, rosa y blanco del portafolio original. No requiere instalar dependencias ni compilar.

## Ver la página

Abre `index.html` en tu navegador. También puedes servir esta carpeta con `python -m http.server 8000` y visitar `http://localhost:8000`.

## Personalizar los proyectos

La primera tarjeta presenta el proyecto real **Sitio web de Grinsa Manufacturas**, desarrollado para que el negocio familiar pueda comenzar a anunciarse en Google Ads y captar más prospectos. Incluye la captura `assets/grinsa-manufacturas.png`, las tecnologías React, Bootstrap, Django, Brevo API y Render, y enlaces al [sitio web](https://www.grinsa.mx/) y al [repositorio de GitHub, rama 2.5](https://github.com/paginagrinsa/grinsaManufacturas/tree/2.5).

La segunda tarjeta presenta **Aplicación en React Native**, proyecto final del certificado en aplicaciones móviles. La app integra CRM, finanzas y gestión de proyectos para empresas de software. Incluye la captura `assets/aplicacion-react-native.png`, las tecnologías React Native, CSS, Django, PostgreSQL, Neon, Docker y Render, enlaces a la [versión web](https://aplicacionreactnative.onrender.com/login) y al [repositorio de GitHub, rama v1](https://github.com/mauricioedlg/aplicacionReactNative/tree/v1), y una galería local con 58 fotos. La portada muestra el inicio de sesión con el botón **¿Olvidaste tu contraseña?**. El frontend y el backend se ejecutan en un contenedor de Docker dentro de un mismo servicio de Render y se probó en navegador y emulador de Android.

La tercera tarjeta presenta **Réplica Aplicación de Refacciones Clarios**, proyecto final de la clase de aplicaciones web inspirado en el sistema en el que trabajé durante mis prácticas en Clarios, desarrollado con mis propios recursos y datos. Incluye la captura `assets/aplicacion-refacciones-clarios.png`, las tecnologías HTML, CSS, JavaScript, Django, SQL Server, PostgreSQL, Neon y Render, enlaces a la [aplicación web](https://apprefacciones.onrender.com/index.html) y al [repositorio de GitHub](https://github.com/mauricioedlg/appRefacciones), y una galería local con 67 fotos.

Las tres tarjetas presentan proyectos reales y no incluyen caso de estudio. Para añadir otro proyecto:

1. Guarda una foto o captura en `assets/`, por ejemplo `assets/mi-proyecto.jpg`.
2. Busca `id="lista-proyectos"` en `index.html` y duplica un bloque `<article class="project-card">` completo.
3. Cambia el `src` de su `<img>` por la ruta de tu imagen. Escribe en `alt` una descripción de la foto o captura. Mantén `width` y `height` acordes con las dimensiones de la imagen.
4. Sustituye el título, el tipo de proyecto, la descripción y las etiquetas de tecnologías.
5. Actualiza los botones con los enlaces del nuevo proyecto.
6. Asigna un identificador único al título, por ejemplo `proyecto-04`. Actualiza también el `aria-labelledby` de la tarjeta y los `aria-label` de las tecnologías y los enlaces.

En escritorio, las tarjetas de proyectos se distribuyen en dos columnas, con la tercera centrada en la fila inferior. En pantallas de hasta 48rem se apilan en una sola columna. Cada tarjeta conserva su estructura vertical: imagen arriba en su propio marco, bloque enmarcado con el título, la descripción y las tecnologías debajo, y botones de enlaces centrados y apilados verticalmente al final, fuera del bloque de descripción. Los botones de las tarjetas de una misma fila quedan alineados. El ajuste de las imágenes se define con `object-fit` en `styles.css`; las capturas con la clase `.project-screenshot` se muestran completas, sin recortarse.

## Galerías de las aplicaciones

Las tarjetas de React Native y Refacciones incluyen el botón permanente **Ver más detalles del proyecto**, con fondo blanco y letras rojas, encima de los enlaces a la versión web y al repositorio. La imagen principal queda despejada. El botón abre una ventana de galería dentro del portafolio, con el selector **Filtrar por módulo**, flechas anterior/siguiente, miniaturas, contador y el flujo principal de la aplicación. La opción **Todas las fotos** permite recorrer la aplicación completa. Las imágenes se muestran completas y las miniaturas se cargan según se necesitan.

La galería sigue una distribución de dos columnas en escritorio: a la izquierda están el filtro por módulo, el contador de fotos y **Ampliar imagen**, seguidos de la foto grande con flechas y las miniaturas; a la derecha aparece **Flujo principal del software**, con seis pasos específicos de la aplicación. En móvil y tablet, los pasos se muestran debajo de las miniaturas. El panel de pasos conserva el flujo completo al cambiar de módulo o de foto.

La ventana comienza directamente con los controles, sin una cabecera de título que ocupe espacio. El botón de cierre aparece primero, a la izquierda del filtro por módulo. En escritorio, la ventana deja al menos 48 píxeles por lado y 40 píxeles arriba y abajo para ocupar el área delimitada en la referencia. En móvil se conservan márgenes más pequeños. El visor adapta su proporción a cada imagen para mostrarla completa a lo ancho, sin franjas laterales añadidas ni recortes. Si el contenido supera la altura de la pantalla, puedes desplazarte por la galería para llegar a las miniaturas y los pasos.

El botón **Ampliar imagen**, encima de la foto, permite leer los detalles de las capturas y desplazarse dentro de ellas. **Ajustar imagen** vuelve a mostrar la captura completa. Al cambiar de foto se restablece el encuadre completo.

Los seis pasos se guardan en la propiedad `workflow` del `gallery-data.js` de cada aplicación. El flujo de Refacciones va desde la solicitud y las dos aprobaciones hasta el código de almacén, la cotización y la conclusión. El de React Native comprende prospectos en CRM, cierre de ventas, creación y requisitos de proyectos, seguimiento KANBAN y reportes financieros por periodo.

Para navegar también puedes usar las flechas izquierda/derecha del teclado; Inicio y Fin van a la primera y última foto del filtro. Las flechas del selector conservan su función de elegir un módulo. El botón de cierre, la tecla Escape o un clic fuera de la ventana cierran la galería y devuelven el foco al botón que la abrió.

Los 9 módulos de React Native incluyen inicio de sesión, olvidaste tu contraseña, creación de cuenta y organización, solicitud pendiente, administrador, colaborador, CRM, proyectos y finanzas. **Inicio de sesión** contiene 5 capturas de pruebas en navegador: formulario, credenciales, verificación por código, correo de acceso y sesión iniciada en el dispositivo. **Olvidaste tu contraseña** contiene 9 capturas del flujo de recuperación: correo, código de verificación, nueva contraseña y confirmación tanto en la aplicación como por correo. Los 6 módulos de Refacciones incluyen inicio de sesión, solicitante, gerente de mantenimiento, gerente de planta, almacenista y comprador.

Las 125 fotos de las galerías se guardan en `assets/galleries/react-native/` y `assets/galleries/refacciones/`. Se conservan también las dos capturas anteriores del inicio de sesión de React Native como archivos, aunque ya no aparecen en la galería. Cada carpeta contiene un archivo `gallery-data.js` con los módulos, las rutas, los textos alternativos y las leyendas de sus fotos. Para añadir una foto, guárdala en la carpeta correspondiente y agrega su entrada al módulo adecuado en ese archivo. `gallery.js` controla ambas galerías; los scripts se cargan en `index.html` y funcionan también al abrirlo directamente, sin servidor ni dependencias.

## Fotos de experiencia laboral

Las tarjetas de CEMEX y Clarios incluyen dos fotos de cada empresa: `fotoCemex1.jpeg`, `fotoCemex2.jpeg`, `fotoClarios1.jpeg` y `fotoClarios2.jpeg`. Las fotos aparecen lado a lado en marcos redondeados, con margen dentro de cada tarjeta. Debajo se centran el logotipo de la empresa, el periodo y el puesto; las actividades conservan sus viñetas. Cada foto permite abrir el original completo en una pestaña nueva.

Para sustituirlas, actualiza el `src` y el `alt` de la imagen y el `href` de su enlace en la sección `id="experiencia"` de `index.html`. Conserva `width` y `height` acordes con el tamaño de la nueva imagen.

Los logotipos blancos se guardan localmente en `assets/`. Fuentes: [CEMEX, recurso oficial](https://www.cemex.hr/documents/1867803/1870998/logo-white.svg/ffb8d9e9-502c-e829-8ac7-d3e4b1b72cd9?version=1.0&t=1730920041582) y [Clarios, encabezado de su sitio oficial](https://www.clarios.com/es/media-press).

## Actualizar tu perfil

El contenido de Inicio, Sobre mí, Educación, Experiencia laboral y Competencias está en `index.html`. Los colores originales están definidos como variables al principio de `styles.css`.
