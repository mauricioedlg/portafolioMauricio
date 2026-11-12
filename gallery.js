(() => {
  'use strict';

  const dialog = document.getElementById('project-gallery');
  const galleries = window.portfolioGalleries;
  if (!dialog || !galleries || typeof dialog.showModal !== 'function') return;

  const title = document.getElementById('gallery-title');
  const filter = document.getElementById('gallery-module');
  const position = document.getElementById('gallery-position');
  const image = document.getElementById('gallery-image');
  const imageDescription = document.getElementById('gallery-image-description');
  const imageStatus = document.getElementById('gallery-image-status');
  const currentModule = document.getElementById('gallery-current-module');
  const caption = document.getElementById('gallery-current-caption');
  const thumbnails = document.getElementById('gallery-thumbnails');
  const previous = dialog.querySelector('[data-gallery-previous]');
  const next = dialog.querySelector('[data-gallery-next]');
  const close = dialog.querySelector('[data-gallery-close]');
  const zoom = dialog.querySelector('[data-gallery-zoom]');
  const figure = dialog.querySelector('.gallery-figure');
  const viewer = dialog.querySelector('.gallery-viewer');
  const layout = dialog.querySelector('.gallery-layout');
  const workflow = dialog.querySelector('.gallery-workflow');
  const workflowSteps = document.getElementById('gallery-workflow-steps');
  let allPhotos = [];
  let visiblePhotos = [];
  let currentIndex = 0;
  let opener = null;

  function setZoom(enabled) {
    figure.classList.toggle('is-zoomed', enabled);
    zoom.setAttribute('aria-pressed', String(enabled));
    zoom.textContent = enabled ? 'Ajustar imagen' : 'Ampliar imagen';
    image.style.width = enabled ? `${Math.max(image.naturalWidth, figure.clientWidth * 2)}px` : '';
    figure.scrollLeft = enabled ? (figure.scrollWidth - figure.clientWidth) / 2 : 0;
    figure.scrollTop = 0;
  }

  function updateImageStatus() {
    if (!dialog.open || !image.getAttribute('src') || !image.complete) return;
    const loaded = image.naturalWidth > 0;
    if (loaded) viewer.style.setProperty('--gallery-image-ratio', `${image.naturalWidth} / ${image.naturalHeight}`);
    zoom.disabled = !loaded;
    image.hidden = !loaded;
    imageStatus.textContent = loaded ? '' : 'No se pudo cargar esta imagen. Prueba con otra foto.';
    imageStatus.hidden = loaded;
  }

  image.addEventListener('load', updateImageStatus);
  image.addEventListener('error', updateImageStatus);

  function showPhoto(index) {
    currentIndex = (index + visiblePhotos.length) % visiblePhotos.length;
    const photo = visiblePhotos[currentIndex];
    setZoom(false);
    viewer.style.setProperty('--gallery-image-ratio', photo.width > 0 && photo.height > 0 ? `${photo.width} / ${photo.height}` : '16 / 9');
    zoom.disabled = true;
    image.hidden = false;
    image.alt = photo.alt;
    imageStatus.textContent = 'Cargando imagen…';
    imageStatus.hidden = false;
    image.src = photo.src;
    updateImageStatus();
    currentModule.textContent = photo.moduleLabel;
    caption.textContent = photo.caption;
    imageDescription.textContent = `${photo.moduleLabel}: ${photo.caption}`;
    position.textContent = `Foto ${currentIndex + 1} de ${visiblePhotos.length}`;
    previous.disabled = next.disabled = visiblePhotos.length < 2;

    Array.from(thumbnails.children).forEach((button, photoIndex) => {
      button.tabIndex = photoIndex === currentIndex ? 0 : -1;
      if (photoIndex === currentIndex) button.setAttribute('aria-current', 'true');
      else button.removeAttribute('aria-current');
    });
    const activeThumbnail = thumbnails.children[currentIndex];
    activeThumbnail.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'instant' });
  }

  function applyFilter() {
    visiblePhotos = filter.value === 'all'
      ? allPhotos
      : allPhotos.filter(photo => photo.moduleId === filter.value);
    const buttons = visiblePhotos.map((photo, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'gallery-thumbnail';
      button.setAttribute('aria-label', `Ver foto ${index + 1}: ${photo.moduleLabel}. ${photo.caption}`);
      const thumbnail = document.createElement('img');
      thumbnail.alt = '';
      thumbnail.width = 96;
      thumbnail.height = 60;
      thumbnail.loading = 'lazy';
      thumbnail.decoding = 'async';
      thumbnail.src = photo.src;
      button.append(thumbnail);
      button.addEventListener('click', () => showPhoto(index));
      return button;
    });
    thumbnails.replaceChildren(...buttons);
    showPhoto(0);
  }

  function openGallery(key, trigger) {
    const gallery = galleries[key];
    if (!gallery || dialog.open) return;
    opener = trigger;
    title.textContent = gallery.title;
    const steps = Array.isArray(gallery.workflow) ? gallery.workflow : [];
    workflowSteps.replaceChildren(...steps.map(text => {
      const item = document.createElement('li');
      item.textContent = text;
      return item;
    }));
    workflow.hidden = steps.length === 0;
    layout.classList.toggle('has-workflow', steps.length > 0);
    allPhotos = gallery.modules.flatMap(module => module.photos.map(photo => ({
      ...photo, moduleId: module.id, moduleLabel: module.label
    })));
    const options = [new Option(`Todas las fotos (${allPhotos.length})`, 'all')];
    gallery.modules.forEach(module => {
      options.push(new Option(`${module.label} (${module.photos.length})`, module.id));
    });
    filter.replaceChildren(...options);
    filter.value = 'all';
    dialog.showModal();
    document.documentElement.classList.add('gallery-open');
    applyFilter();
    close.focus({ preventScroll: true });
  }

  document.querySelectorAll('[data-gallery-open]').forEach(trigger => {
    if (!galleries[trigger.dataset.galleryOpen]?.modules.some(module => module.photos.length)) return;
    trigger.hidden = false;
    trigger.addEventListener('click', () => openGallery(trigger.dataset.galleryOpen, trigger));
  });

  filter.addEventListener('change', applyFilter);
  previous.addEventListener('click', () => showPhoto(currentIndex - 1));
  next.addEventListener('click', () => showPhoto(currentIndex + 1));
  close.addEventListener('click', () => dialog.close());
  zoom.addEventListener('click', () => setZoom(zoom.getAttribute('aria-pressed') !== 'true'));

  // Only a click that starts and ends on the backdrop should close the gallery.
  let backdropPressed = false;
  dialog.addEventListener('pointerdown', event => { backdropPressed = event.target === dialog; });
  dialog.addEventListener('click', event => {
    if (backdropPressed && event.target === dialog) dialog.close();
    backdropPressed = false;
  });

  dialog.addEventListener('keydown', event => {
    if (event.key === 'Tab') {
      const controls = Array.from(dialog.querySelectorAll('button:not(:disabled):not([tabindex="-1"]), select:not(:disabled), [tabindex="0"]'))
        .filter(control => control.getClientRects().length > 0);
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus({ preventScroll: true });
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
      return;
    }
    if (event.altKey || event.ctrlKey || event.metaKey || workflow.contains(event.target) || event.target.matches('select, input, textarea, [contenteditable="true"]')) return;
    const destinations = { ArrowLeft: currentIndex - 1, ArrowRight: currentIndex + 1, Home: 0, End: visiblePhotos.length - 1 };
    if (!(event.key in destinations)) return;
    event.preventDefault();
    const focusThumbnail = thumbnails.contains(document.activeElement);
    showPhoto(destinations[event.key]);
    if (focusThumbnail) thumbnails.children[currentIndex].focus({ preventScroll: true });
  });

  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('gallery-open');
    setZoom(false);
    image.removeAttribute('src');
    image.alt = '';
    imageStatus.hidden = true;
    thumbnails.replaceChildren();
    workflowSteps.replaceChildren();
    allPhotos = [];
    visiblePhotos = [];
    opener?.focus({ preventScroll: true });
  });
})();
