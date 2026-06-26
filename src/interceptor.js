// Запускается до загрузки страницы (document_start, MAIN world)
// Перехватывает XHR и fetch чтобы извлечь внутренний Project ID

(function() {
  const PROJECTS_LIST_URL = '/api/i/projects';
  const PROJECT_RE = /\/api\/i\/projects\/(\d+)\//;

  function getUrlProject() {
    return new URLSearchParams(location.search).get('project');
  }

  function saveId(id) {
    if (id && window.__ss_project_id !== id) {
      window.__ss_project_id = id;
      window.postMessage({ type: '__ss_project_id', id: id }, '*');
    }
  }

  function saveProjectData(data) {
    const slug = getUrlProject();
    if (!slug || !Array.isArray(data)) return;
    const project = data.find(p => p.identifier === slug);
    if (project) {
      window.postMessage({ 
        type: '__ss_project_data', 
        id: String(project.id), 
        name: project.name 
      }, '*');
    }
  }

  // Intercept XHR
  const origOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url) {
    this._url = url;
    if (typeof url === 'string') {
      const m = url.match(PROJECT_RE);
      if (m) saveId(m[1]);
    }
    return origOpen.apply(this, arguments);
  };

  const origSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function() {
    this.addEventListener('load', () => {
      if (this._url && this._url.includes(PROJECTS_LIST_URL) && !this._url.match(PROJECT_RE)) {
        try {
          const data = JSON.parse(this.responseText);
          saveProjectData(data);
        } catch (e) {}
      }
    });
    return origSend.apply(this, arguments);
  };

  let interceptedCsrf = null;
  const origSetHeader = XMLHttpRequest.prototype.setRequestHeader;
  XMLHttpRequest.prototype.setRequestHeader = function(name, value) {
    const lower = name.toLowerCase();
    if (lower === 'x-csrf-token') interceptedCsrf = value;
    if (lower === 'x-xsrf-token') {
      window.postMessage({ type: '__ss_tokens', csrf: interceptedCsrf, xsrf: value }, '*');
    }
    return origSetHeader.apply(this, arguments);
  };

  // Intercept fetch
  const origFetch = window.fetch;
  window.fetch = async function(...args) {
    const url = typeof args[0] === 'string' ? args[0] : args[0]?.url;
    if (url) {
      const m = url.match(PROJECT_RE);
      if (m) saveId(m[1]);
    }
    
    const response = await origFetch.apply(this, args);
    
    if (url && url.includes(PROJECTS_LIST_URL) && !url.match(PROJECT_RE)) {
      const clone = response.clone();
      clone.json().then(data => saveProjectData(data)).catch(() => {});
    }
    
    return response;
  };

  // Trigger a manual fetch to get project list immediately
  // This helps if the original request was missed or already happened
  function tryFetchProjects() {
    window.fetch(PROJECTS_LIST_URL)
      .then(r => r.clone().json())
      .then(data => saveProjectData(data))
      .catch(() => {});
  }

  // Run shortly after script execution
  setTimeout(tryFetchProjects, 500);
  // And again after a bit more time just in case
  setTimeout(tryFetchProjects, 2000);
})();
