(async () => {
  'use strict';

  const i18n = window.portfolioI18n;
  if (i18n?.ready) await i18n.ready;
  const t = (key, vars = {}, fallback = '') => i18n?.t
    ? i18n.t(key, vars, fallback)
    : fallback.replace(/\{(\w+)\}/g, (match, name) => vars[name] ?? match);

  const galleryPages = {
    'react-native': 'proyecto-react-native.html',
    'refacciones': 'proyecto-refacciones.html',
    'app-finanzas': 'proyecto-app-finanzas.html'
  };
  const galleryElement = document.getElementById('project-gallery');

  // Keep previously shared gallery links working after moving to separate pages.
  if (!galleryElement) {
    function redirectLegacyGallery() {
      if (!/^#galeria=[^&]+$/.test(window.location.hash)) return;
      const key = new URLSearchParams(window.location.hash.slice(1)).get('galeria');
      if (Object.prototype.hasOwnProperty.call(galleryPages, key)) {
        const destination = new URL(galleryPages[key], window.location.href);
        destination.search = window.location.search;
        window.location.replace(i18n?.localizeUrl ? i18n.localizeUrl(destination.href) : destination.href);
      }
    }
    window.addEventListener('hashchange', redirectLegacyGallery);
    redirectLegacyGallery();
    return;
  }

  const galleryKey = galleryElement.dataset.gallery;
  const originalGallery = window.portfolioGalleries?.[galleryKey];
  const galleryPrefix = `galleries.${galleryKey}`;
  const gallery = originalGallery && {
    ...originalGallery,
    workflow: originalGallery.workflow?.map((text, index) => t(`${galleryPrefix}.workflow.${index}`, {}, text)),
    modules: originalGallery.modules.map(module => {
      const modulePrefix = `${galleryPrefix}.modules.${module.id}`;
      return {
        ...module,
        label: t(`${modulePrefix}.label`, {}, module.label),
        photos: module.photos.map((photo, index) => ({
          ...photo,
          alt: t(`${modulePrefix}.photos.${index}.alt`, {}, photo.alt),
          caption: t(`${modulePrefix}.photos.${index}.caption`, {}, photo.caption)
        }))
      };
    })
  };
  const modules = gallery?.modules.filter(module => module.photos.length > 0);
  if (!modules?.length) return;

  const filter = document.getElementById('gallery-module');
  const position = document.getElementById('gallery-position');
  const image = document.getElementById('gallery-image');
  const imageDescription = document.getElementById('gallery-image-description');
  const imageStatus = document.getElementById('gallery-image-status');
  const currentModule = document.getElementById('gallery-current-module');
  const caption = document.getElementById('gallery-current-caption');
  const thumbnails = document.getElementById('gallery-thumbnails');
  const previous = galleryElement.querySelector('[data-gallery-previous]');
  const next = galleryElement.querySelector('[data-gallery-next]');
  const zoom = galleryElement.querySelector('[data-gallery-zoom]');
  const figure = galleryElement.querySelector('.gallery-figure');
  const viewer = galleryElement.querySelector('.gallery-viewer');
  const share = galleryElement.querySelector('[data-gallery-share]');
  const shareFeedback = galleryElement.querySelector('.gallery-share-feedback');
  const shareStatus = document.getElementById('gallery-share-status');
  const shareUrl = document.getElementById('gallery-share-url');
  const allPhotos = modules.flatMap(module => module.photos.map(photo => ({
    ...photo, moduleId: module.id, moduleLabel: module.label
  })));
  let visiblePhotos = [];
  let currentIndex = 0;

  function setZoom(enabled) {
    figure.classList.toggle('is-zoomed', enabled);
    zoom.setAttribute('aria-pressed', String(enabled));
    zoom.textContent = enabled
      ? t('gallery.zoomFit', {}, 'Ajustar imagen')
      : t('gallery.zoomIn', {}, 'Ampliar imagen');
    image.style.width = enabled ? `${Math.max(image.naturalWidth, figure.clientWidth * 2)}px` : '';
    figure.scrollLeft = enabled ? (figure.scrollWidth - figure.clientWidth) / 2 : 0;
    figure.scrollTop = 0;
  }

  function updateImageStatus() {
    if (!image.getAttribute('src') || !image.complete) return;
    const loaded = image.naturalWidth > 0;
    if (loaded) viewer.style.setProperty('--gallery-image-ratio', `${image.naturalWidth} / ${image.naturalHeight}`);
    zoom.disabled = !loaded;
    image.hidden = !loaded;
    imageStatus.textContent = loaded ? '' : t('gallery.loadError', {}, 'No se pudo cargar esta imagen. Prueba con otra foto.');
    imageStatus.hidden = loaded;
  }

  function showPhoto(index, revealThumbnail = false) {
    if (!visiblePhotos.length) return;
    currentIndex = (index + visiblePhotos.length) % visiblePhotos.length;
    const photo = visiblePhotos[currentIndex];
    setZoom(false);
    viewer.style.setProperty('--gallery-image-ratio', photo.width > 0 && photo.height > 0 ? `${photo.width} / ${photo.height}` : '16 / 9');
    zoom.disabled = true;
    image.hidden = false;
    image.alt = photo.alt;
    imageStatus.textContent = t('gallery.loading', {}, 'Cargando imagen…');
    imageStatus.hidden = false;
    image.src = photo.src;
    updateImageStatus();
    currentModule.textContent = photo.moduleLabel;
    caption.textContent = photo.caption;
    imageDescription.textContent = `${photo.moduleLabel}: ${photo.caption}`;
    position.textContent = t('gallery.position', { current: currentIndex + 1, total: visiblePhotos.length }, 'Foto {current} de {total}');
    previous.disabled = next.disabled = visiblePhotos.length < 2;

    Array.from(thumbnails.children).forEach((button, photoIndex) => {
      button.tabIndex = photoIndex === currentIndex ? 0 : -1;
      if (photoIndex === currentIndex) button.setAttribute('aria-current', 'true');
      else button.removeAttribute('aria-current');
    });
    if (revealThumbnail) {
      // Scroll the thumbnail strip only; leave the document at the reader's position.
      const active = thumbnails.children[currentIndex];
      const left = active.offsetLeft;
      if (left < thumbnails.scrollLeft) thumbnails.scrollLeft = left;
      else if (left + active.offsetWidth > thumbnails.scrollLeft + thumbnails.clientWidth) {
        thumbnails.scrollLeft = left + active.offsetWidth - thumbnails.clientWidth;
      }
    }
  }

  function applyFilter() {
    visiblePhotos = filter.value === 'all'
      ? allPhotos
      : allPhotos.filter(photo => photo.moduleId === filter.value);
    const buttons = visiblePhotos.map((photo, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'gallery-thumbnail';
      button.setAttribute('aria-label', t('gallery.viewPhoto', {
        current: index + 1, module: photo.moduleLabel, caption: photo.caption
      }, 'Ver foto {current}: {module}. {caption}'));
      const thumbnail = document.createElement('img');
      thumbnail.alt = '';
      thumbnail.width = 96;
      thumbnail.height = 60;
      thumbnail.loading = 'lazy';
      thumbnail.decoding = 'async';
      thumbnail.src = photo.src;
      button.append(thumbnail);
      button.addEventListener('click', () => showPhoto(index, true));
      return button;
    });
    thumbnails.replaceChildren(...buttons);
    thumbnails.scrollLeft = 0;
    showPhoto(0);
  }

  const options = [new Option(t('gallery.allPhotos', { total: allPhotos.length }, 'Todas las fotos ({total})'), 'all')];
  modules.forEach(module => {
    options.push(new Option(`${module.label} (${module.photos.length})`, module.id));
  });
  filter.replaceChildren(...options);
  filter.value = 'all';
  filter.disabled = false;
  share.disabled = false;

  const workflow = galleryElement.querySelector('.gallery-workflow');
  const steps = Array.isArray(gallery.workflow) ? gallery.workflow : [];
  document.getElementById('gallery-workflow-steps').replaceChildren(...steps.map(text => {
    const item = document.createElement('li');
    item.textContent = text;
    return item;
  }));
  workflow.hidden = steps.length === 0;
  galleryElement.querySelector('.gallery-layout').classList.toggle('has-workflow', steps.length > 0);

  image.addEventListener('load', updateImageStatus);
  image.addEventListener('error', updateImageStatus);
  filter.addEventListener('change', applyFilter);
  previous.addEventListener('click', () => showPhoto(currentIndex - 1, true));
  next.addEventListener('click', () => showPhoto(currentIndex + 1, true));
  zoom.addEventListener('click', () => setZoom(zoom.getAttribute('aria-pressed') !== 'true'));

  share.addEventListener('click', async () => {
    const url = new URL(i18n?.localizeUrl ? i18n.localizeUrl(window.location.href) : window.location.href);
    url.hash = '';
    const localHint = url.protocol === 'file:'
      ? t('gallery.shareLocalHint', {}, ' Este enlace es local. Para compartirlo con otras personas, abre tu portafolio publicado y copia el enlace desde allí.')
      : '';
    try {
      await navigator.clipboard.writeText(url.href);
      share.textContent = t('gallery.shareCopied', {}, 'Enlace copiado');
      shareUrl.hidden = true;
      shareStatus.textContent = t('gallery.shareCopiedStatus', {}, 'Enlace copiado.') + localHint;
    } catch {
      share.textContent = t('gallery.shareCopy', {}, 'Copiar enlace');
      shareStatus.textContent = t('gallery.shareManualStatus', {}, 'Selecciona y copia el enlace del campo.') + localHint;
      shareUrl.value = url.href;
      shareUrl.hidden = false;
    }
    shareFeedback.hidden = false;
    if (!shareUrl.hidden) {
      shareUrl.focus({ preventScroll: true });
      shareUrl.select();
    }
  });
  shareUrl.addEventListener('click', () => shareUrl.select());

  galleryElement.addEventListener('keydown', event => {
    // Arrow keys belong to the image viewer and thumbnails, not page navigation.
    if (!viewer.contains(event.target) && !thumbnails.contains(event.target)) return;
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const destinations = { ArrowLeft: currentIndex - 1, ArrowRight: currentIndex + 1, Home: 0, End: visiblePhotos.length - 1 };
    if (!(event.key in destinations)) return;
    event.preventDefault();
    const focusThumbnail = thumbnails.contains(document.activeElement);
    showPhoto(destinations[event.key], true);
    if (focusThumbnail) thumbnails.children[currentIndex].focus({ preventScroll: true });
  });

  applyFilter();
})();
