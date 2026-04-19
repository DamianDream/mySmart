// Запускается до загрузки страницы (document_start, MAIN world)
// Перехватывает XHR и fetch чтобы извлечь внутренний Project ID

(function() {
  const PROJECT_RE = /\/api\/i\/projects\/(\d+)\//;

  // Сохраняем оригинальный fetch ДО любых перехватов
  window.__ss_original_fetch = window.fetch.bind(window);

  function saveId(id) {
    if (id && window.__ss_project_id !== id) {
      window.__ss_project_id = id;
      window.postMessage({ type: '__ss_project_id', id: id }, '*');
    }
  }

  // Перехват XHR — также перехватываем токены
  const origOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url) {
    if (typeof url === 'string') {
      const m = url.match(PROJECT_RE);
      if (m) saveId(m[1]);
    }
    return origOpen.apply(this, arguments);
  };

  const origSetHeader = XMLHttpRequest.prototype.setRequestHeader;
  XMLHttpRequest.prototype.setRequestHeader = function(name, value) {
    const lower = name.toLowerCase();
    if (lower === 'x-csrf-token') window.__ss_csrf_token = value;
    if (lower === 'x-xsrf-token') window.__ss_xsrf_token = value;
    // Отправляем токены в content.js
    if (lower === 'x-xsrf-token') {
      window.postMessage({ type: '__ss_tokens', csrf: window.__ss_csrf_token, xsrf: value }, '*');
    }
    return origSetHeader.apply(this, arguments);
  };

  // Перехват fetch
  const origFetch = window.fetch;
  window.fetch = function(...args) {
    const url = typeof args[0] === 'string' ? args[0] : args[0]?.url;
    if (url) {
      const m = url.match(PROJECT_RE);
      if (m) saveId(m[1]);
    }
    return origFetch.apply(this, args);
  };
})();
