(() => {
  'use strict';

  const storageKey = 'portfolio-language';
  const supportedLanguages = new Set(['es', 'en']);
  const scriptUrl = document.currentScript.src;
  const currentUrl = new URL(window.location.href);
  let savedLanguage;
  try {
    savedLanguage = window.localStorage.getItem(storageKey);
  } catch {
    // The selector and shareable URLs also work when storage is unavailable.
  }
  const requestedLanguage = currentUrl.searchParams.get('lang');
  let language = supportedLanguages.has(requestedLanguage)
    ? requestedLanguage
    : supportedLanguages.has(savedLanguage) ? savedLanguage : 'es';
  let messages = {};

  function t(key, variables = {}, fallback = '') {
    const template = messages[key] ?? fallback;
    return String(template).replace(/\{(\w+)\}/g, (match, name) =>
      Object.prototype.hasOwnProperty.call(variables, name) ? String(variables[name]) : match
    );
  }

  function localizeUrl(href) {
    const url = new URL(href, window.location.href);
    if (url.origin === currentUrl.origin && /\.html$/i.test(url.pathname)) {
      url.searchParams.set('lang', language);
    }
    return url.href;
  }

  const api = { language, t, localizeUrl, ready: null };
  window.portfolioI18n = api;

  function applyTranslations() {
    document.documentElement.lang = language === 'en' ? 'en' : 'es-MX';
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const translated = messages[element.dataset.i18n];
      if (translated !== undefined) element.textContent = translated;
    });
    for (const attribute of ['aria-label', 'alt', 'content', 'title']) {
      document.querySelectorAll(`[data-i18n-${attribute}]`).forEach(element => {
        const translated = messages[element.getAttribute(`data-i18n-${attribute}`)];
        if (translated !== undefined) element.setAttribute(attribute, translated);
      });
    }
  }

  function updateLinks() {
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (link.hasAttribute('data-language') || href.startsWith('#')) return;
      const url = new URL(href, window.location.href);
      if (url.origin === currentUrl.origin && /\.html$/i.test(url.pathname)) {
        link.href = localizeUrl(href);
      }
    });
    document.querySelectorAll('[data-language]').forEach(link => {
      const targetLanguage = link.dataset.language;
      const url = new URL(window.location.href);
      url.searchParams.set('lang', targetLanguage);
      link.href = url.href;
      if (targetLanguage === language) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }

  function rememberLanguage() {
    try {
      window.localStorage.setItem(storageKey, language);
    } catch {
      // Private browsing or storage settings must not prevent language selection.
    }
  }

  function loadDictionary(selectedLanguage) {
    // Classic scripts work over both file:// and HTTPS, unlike fetch of local JSON.
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = new URL(`locales/${selectedLanguage}.js`, scriptUrl).href;
      script.onload = () => resolve(window.portfolioTranslations?.[selectedLanguage]);
      script.onerror = () => reject(new Error('Translations unavailable'));
      document.head.append(script);
    });
  }

  api.ready = (async () => {
    let englishUnavailable = false;
    try {
      const dictionary = await loadDictionary(language);
      if (!dictionary || typeof dictionary !== 'object' || Array.isArray(dictionary)) {
        throw new Error('Invalid translations');
      }
      messages = dictionary;
    } catch {
      englishUnavailable = language === 'en';
      language = 'es';
    }
    api.language = language;
    applyTranslations();
    updateLinks();
    if (!englishUnavailable) rememberLanguage();
    if (englishUnavailable) {
      const selector = document.querySelector('.language-switch');
      if (selector) {
        const status = document.createElement('p');
        status.className = 'language-status';
        status.lang = 'en';
        status.setAttribute('role', 'status');
        status.textContent = 'English could not be loaded. Please try again.';
        selector.after(status);
      }
    }
    return language;
  })();
})();
