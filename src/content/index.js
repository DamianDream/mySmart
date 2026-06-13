

  const shadowHost = document.createElement('div');
  shadowHost.id = 'ss-extension-host';
  document.body.appendChild(shadowHost);
  const shadowRoot = shadowHost.attachShadow({ mode: 'open' });

  const styleEl = document.createElement('style');
  styleEl.textContent = styles;
  shadowRoot.appendChild(styleEl);

  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap';
  shadowRoot.appendChild(fontLink);


  import styles from '../sidebar.css?inline';
  import { 
    iGear, iCopy, iEdit, iDone, iReset, iHistory, iExternal, iSearch, iClock, iPreset, 
    iStar, iStarFill, iSave, iTrash, iPen, iAddToPreset, iTune, iFilter, iBack, iX, 
    iMenu, iKey, iLock, iUnlock, iPlus, iVariable, iTag, iUsers, iFunnel, iChat, 
    iMonitor, iLog, iInfo, iCollapse
  } from './icons.js';

  // ─── COLORS ───────────────────────────────────────────────────────────────
  const THEMES = {
    dark: {
      '--bg-solid': '#202124', '--bg': 'rgba(32, 33, 36, 0.75)', '--bg2': 'rgba(42, 43, 46, 0.65)', '--bg3': 'rgba(255, 255, 255, 0.08)', '--bg4': 'rgba(28, 29, 32, 0.75)',
      '--border': 'rgba(255, 255, 255, 0.08)', '--border2': 'rgba(255, 255, 255, 0.15)',
      '--text': '#ffffff', '--text2': '#f8fafc', '--text3': '#cbd5e1', '--text4': '#94a3b8', '--text5': '#64748b',
      '--accent-rgb': '59, 130, 246', '--accent': '#3b82f6', '--accent2': '#60a5fa', '--accent-bg': 'rgba(59, 130, 246, 0.18)',
      '--success-rgb': '16, 185, 129', '--success': '#10b981',
      '--error-rgb': '239, 68, 68', '--error': '#ef4444',
      '--mark-bg': '#0d2040', '--mark-text': '#a0c4ff',
      '--shadow': 'rgba(0,0,0,0.3)', '--blur-depth': '24px',
      '--font-main': "'Roboto', sans-serif",
    },
    light: {
      '--bg-solid': '#f0f2f5', '--bg': 'rgba(255, 255, 255, 0.70)', '--bg2': 'rgba(255, 255, 255, 0.55)', '--bg3': 'rgba(0, 0, 0, 0.04)', '--bg4': 'rgba(245, 245, 250, 0.5)',
      '--border': 'rgba(0, 0, 0, 0.06)', '--border2': 'rgba(0, 0, 0, 0.14)',
      '--text': '#0f172a', '--text2': '#1e293b', '--text3': '#475569', '--text4': '#64748b', '--text5': '#94a3b8',
      '--accent-rgb': '37, 99, 235', '--accent': '#2563eb', '--accent2': '#3b82f6', '--accent-bg': 'rgba(37, 99, 235, 0.12)',
      '--success-rgb': '5, 150, 105', '--success': '#059669',
      '--error-rgb': '220, 38, 38', '--error': '#dc2626',
      '--mark-bg': '#bdd6ff', '--mark-text': '#0040a0',
      '--shadow': 'rgba(0,0,0,0.06)', '--blur-depth': '24px',
      '--font-main': "'Roboto', sans-serif",
    },
  };

  // ─── STORAGE KEYS ─────────────────────────────────────────────────────────
  const K_CONTACT_FAVORITES = 'ss_contacts_favorites';
  const K_SIDEBAR_WIDTH = 'ms_sidebar_width';
  const K_PRESETS = 'ms_presets';
  const K_THEME = 'ms_theme';
  const K_VAR_HISTORY = 'ms_var_history';     // edit history per variable
  const K_SEARCH_HIST = (pid) => `ms_search_hist_${pid}`;  // search term history
  const K_TAG_SEARCH_HIST = (pid) => `ss_tag_search_hist_${pid}`;
  const K_CONTACT_SEARCH_HIST = (pid) => `ss_contact_search_hist_${pid}`;
  const K_VAR_PRESETS = (pid) => `ms_var_presets_${pid}`;  // var presets per project
  const K_CONTACT_SETTINGS = 'ss_contacts_display_settings';
  const K_LAST_TAB = (pid) => `ms_last_tab_${pid}`;
  const K_SESSION_PROJECT = 'ms_session_project_id';
  const K_SESSION_EXTRA_WIDTH = 'ss_extra_panel_width';
  const K_LATEST_PROJECT_ID = 'ms_latest_project_id';

  let __localCache = {};

  function debounce(func, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  // ─── STORAGE HELPERS ──────────────────────────────────────────────────────
  const loadFromCache = (key, defaultVal) => { try { const v = __localCache[key]; return v !== undefined ? (typeof v === 'string' && (v.startsWith('{') || v.startsWith('[')) ? JSON.parse(v) : v) : defaultVal; } catch { return defaultVal; } };
  const saveToStorage = (key, val) => { const str = typeof val === 'object' ? JSON.stringify(val) : String(val); __localCache[key] = str; chrome.storage.local.set({ [key]: str }); };

  const saveToSession = (key, val) => { const str = typeof val === 'object' ? JSON.stringify(val) : String(val); chrome.storage.session.set({ [key]: str }); };
  const loadFromSession = async (key) => { const res = await chrome.storage.session.get(key); return res[key] || null; };

  const loadSidebarWidth = () => loadFromCache(K_SIDEBAR_WIDTH, '500');
  const saveSidebarWidth = (w) => saveToStorage(K_SIDEBAR_WIDTH, w);

  const loadPresets = () => loadFromCache(K_PRESETS, []);
  const savePresets = (p) => saveToStorage(K_PRESETS, p);
  const getPreset = (id) => loadPresets().find(p => p.projectId === id) || null;

  const loadTheme = () => loadFromCache(K_THEME, 'dark');
  const saveTheme = (t) => saveToStorage(K_THEME, t);

  const loadLastTab = (pid) => loadFromCache(K_LAST_TAB(pid), 'vars');
  const saveLastTab = (pid, tab) => { if (pid) saveToStorage(K_LAST_TAB(pid), tab); };

  // Edit history (up to 5 per variable)
  const loadVarHistory = (pid, vid) => loadFromCache(K_VAR_HISTORY, {})[`${pid}_${vid}`] || [];
  const saveVarHistory = (pid, vid, oldVal) => {
    try {
      const all = loadFromCache(K_VAR_HISTORY, {});
      const key = `${pid}_${vid}`;
      const arr = all[key] || [];
      arr.unshift({ value: oldVal, ts: new Date().toISOString() });
      all[key] = arr.slice(0, 5);
      saveToStorage(K_VAR_HISTORY, all);
    } catch { }
  };

  // Search term history (up to 100 per project)
  const loadSearchHist = (pid) => loadFromCache(K_SEARCH_HIST(pid), []);
  const saveSearchHist = (pid, term) => {
    try {
      const arr = loadSearchHist(pid).filter(t => t !== term);
      arr.unshift(term);
      saveToStorage(K_SEARCH_HIST(pid), arr.slice(0, 100));
    } catch { }
  };

  const loadTagSearchHist = (pid) => loadFromCache(K_TAG_SEARCH_HIST(pid), []);
  const saveTagSearchHist = (pid, term) => {
    try {
      const arr = loadTagSearchHist(pid).filter(t => t !== term);
      arr.unshift(term);
      saveToStorage(K_TAG_SEARCH_HIST(pid), arr.slice(0, 100));
    } catch { }
  };

  const loadContactSearchHist = (pid) => loadFromCache(K_CONTACT_SEARCH_HIST(pid), []);
  const saveContactSearchHist = (pid, term) => {
    try {
      const arr = loadContactSearchHist(pid).filter(t => t !== term);
      arr.unshift(term);
      saveToStorage(K_CONTACT_SEARCH_HIST(pid), arr.slice(0, 100));
    } catch { }
  };

  // Var presets per project
  const loadVarPresets = (pid) => loadFromCache(K_VAR_PRESETS(pid), []);
  const saveVarPresets = (pid, p) => saveToStorage(K_VAR_PRESETS(pid), p);

  const loadContactSettings = () => loadFromCache(K_CONTACT_SETTINGS, { showProfile: true, showDetails: true, showTags: true, showVars: true, compactCards: false });
  const saveContactSettings = (s) => saveToStorage(K_CONTACT_SETTINGS, s);

  const K_GLOBAL_SETTINGS = 'ss_global_settings';
  const loadGlobalSettings = () => {
    const s = loadFromCache(K_GLOBAL_SETTINGS, { useApiCache: false, autoFetch: false });
    if (!s.installId) {
      s.installId = crypto.randomUUID();
      saveToStorage(K_GLOBAL_SETTINGS, s);
    }
    return s;
  };
  const saveGlobalSettings = (s) => saveToStorage(K_GLOBAL_SETTINGS, s);

  const loadContactFavorites = () => loadFromCache(K_CONTACT_FAVORITES, []);
  const saveContactFavorites = (f) => saveToStorage(K_CONTACT_FAVORITES, f.slice(0, 100));

  const K_TAG_FAVORITES = 'ss_tag_favorites';
  const loadTagFavorites = () => loadFromCache(K_TAG_FAVORITES, []);
  const saveTagFavorites = (f) => saveToStorage(K_TAG_FAVORITES, f.slice(0, 100));

  const K_CONTACT_PRIORITY_VARS = (pid) => `ss_contact_priority_vars_${pid}`;
  const loadContactPriorityVars = (pid) => loadFromCache(K_CONTACT_PRIORITY_VARS(pid), '');
  const saveContactPriorityVars = (pid, val) => saveToStorage(K_CONTACT_PRIORITY_VARS(pid), val);

  const K_VAR_FAVORITES = 'ms_var_favorites';
  const loadVarFavorites = () => loadFromCache(K_VAR_FAVORITES, []);
  const saveVarFavorites = (f) => saveToStorage(K_VAR_FAVORITES, f.slice(0, 100));

  const K_ACTION_LOGS = 'ss_action_logs';
  const loadLogs = () => loadFromCache(K_ACTION_LOGS, []);
  const saveLogs = (logs) => saveToStorage(K_ACTION_LOGS, logs);
  const logAction = (action, detail, payload = null) => {
    const logs = loadLogs();
    
    // Safely stringify and truncate payload if needed
    let safePayload = null;
    if (payload) {
      try {
        const str = JSON.stringify(payload, null, 2);
        safePayload = str.length > 5000 ? str.substring(0, 5000) + '\n...[truncated]' : str;
      } catch (e) {
        safePayload = 'Unserializable payload';
      }
    }

    logs.unshift({ time: Date.now(), action, detail, project: state.projectId, payload: safePayload, id: Date.now() + Math.random() });
    if (logs.length > 1000) logs.length = 1000;
    saveLogs(logs);
    if (state.activeTab === 'log') renderLogTab();
  };
  const clearLogs = () => { 
    saveLogs([]); 
    if (state.activeTab === 'log') renderLogTab(); 
  };

  // --- PANEL MANAGER ---
  const toggleSidePanel = (id) => {
    const panels = [
      'ss-nav', 'ss-info-panel',
      'ss-contact-search-hist', 'ss-contact-fav-panel', 'ss-contact-settings-panel',
      'ss-var-search-hist', 'ss-var-presets-panel', 'ss-var-fav-panel',
      'ss-tag-search-hist', 'ss-tag-fav-panel',
      'ss-project-switcher-panel', 'ss-extra-panel'
    ];
    const target = shadowRoot.getElementById(id);
    if (!target) return;

    const alreadyOpenId = panels.find(pId => {
      const p = shadowRoot.getElementById(pId);
      return p && p.classList.contains('open');
    });

    if (id === 'ss-nav') {
      // Burger menu: close everything else WITH animation, then toggle nav
      panels.forEach(pId => {
        if (pId !== 'ss-nav') {
          const p = shadowRoot.getElementById(pId);
          if (p && p.classList.contains('open')) {
            p.classList.remove('open');
            // Sync state
            if (pId === 'ss-info-panel') state.contactInfoOpen = false;
            if (pId === 'ss-contact-search-hist') state.contactShowSearchHist = false;
            if (pId === 'ss-contact-fav-panel') state.contactShowFavorites = false;
            if (pId === 'ss-contact-settings-panel') state.contactSettingsOpen = false;
          }
        }
      });
      // Clean up all active buttons in sidebar
      shadowRoot.querySelectorAll('.ss-action-btn.active, .ss-var-btn.active').forEach(b => b.classList.remove('active'));

      target.classList.toggle('open');
      state.navOpen = target.classList.contains('open');
      return;
    }

    // Tab-specific logic
    if (alreadyOpenId === id) {
      target.classList.remove('open');
      shadowRoot.querySelectorAll('.ss-action-btn.active, .ss-var-btn.active').forEach(b => b.classList.remove('active'));
      return;
    }

    if (alreadyOpenId && alreadyOpenId !== 'ss-nav') {
      const old = shadowRoot.getElementById(alreadyOpenId);
      old.classList.add('ss-no-transition');
      target.classList.add('ss-no-transition');

      old.classList.remove('open');
      target.classList.add('open');
      setTimeout(() => {
        old.classList.remove('ss-no-transition');
        target.classList.remove('ss-no-transition');
      }, 50);
    } else {
      // Normal slide-out
      panels.forEach(pId => {
        if (pId !== id) {
          const p = shadowRoot.getElementById(pId);
          if (p) p.classList.remove('open');
        }
      });
      target.classList.add('open');
    }
  };

  // ─── STATE ────────────────────────────────────────────────────────────────
  const state = {
    projectId: null, projectName: null,
    projectMode: loadFromCache('ss_project_mode', 'AUTO'),
    xsrfToken: null, activePreset: null,
    theme: loadTheme(),
    fontSize: 'regular',
    activeTab: 'vars',
    view: 'main',
    navOpen: false,
    editingProjectId: null,
    systemicNameLocked: true,
    tagResults: [],
    tagShowSearchHist: false,
    tagShowFavorites: false,
    tagFavorites: loadTagFavorites(),
    varResults: [], varEditingId: null, varShowHistoryId: null,
    varShowSearchHist: false,
    varShowFavorites: false,
    varFavorites: loadVarFavorites(),
    varPresetsOpen: false,
    varPresetEditing: null,
    varPresetPanelId: null,
    varPresetConfigPanelId: null,
    varViewingPresetId: null,
    contactResults: [], isSearchingContact: false, contactSearchPerformed: false, activeUrlContact: null,
    contactShowSearchHist: false,
    contactSettingsOpen: false,
    contactSettings: loadContactSettings(),
    globalSettings: loadGlobalSettings(),
    contactFavorites: loadContactFavorites(),
    contactInfoOpen: false, contactInfoId: null, contactInfo: null, isFetchingContactInfo: false,
    contactShowFavorites: false,
    contactVarEditingKey: null
  };

  // ─── THEME ────────────────────────────────────────────────────────────────
  function applyTheme(t) {
    state.theme = t; saveTheme(t);
    const s = shadowRoot.getElementById('ss-sidebar'); if (!s) return;
    Object.entries(THEMES[t] || THEMES.dark).forEach(([k, v]) => s.style.setProperty(k, v));
    s.dataset.theme = t;
  }

  const getXsrfToken = () => document.querySelector('meta[name="csrf-token"]')?.content ?? '';
  const getXsrfCookie = () => decodeURIComponent(document.cookie.split('; ').find(r => r.startsWith('XSRF-TOKEN='))?.split('=')[1] ?? '');
  const getProjectFromUrl = () => {
    const p = new URLSearchParams(location.search).get('project');
    if (p) return p.replace(/-\d+$/, '');
    const path = location.pathname.split('/');
    if (path[1] === 'projects' && path[2]) return path[2].replace(/-\d+$/, '');
    return null;
  };
  const getUrlContactId = () => {
    const s = new URLSearchParams(location.search).get('selectedContactId');
    if (s) return s;
    const h = location.hash.split('?')[1];
    if (h) {
      const p = new URLSearchParams(h).get('selectedContactId');
      if (p) return p;
    }
    return null;
  };
  const getFullProjectFromUrl = () => {
    const p = new URLSearchParams(location.search).get('project');
    if (p) return p;
    const path = location.pathname.split('/');
    // Check for /projects/full-id/...
    if (path[1] === 'projects' && path[2]) return path[2];
    return null;
  };
  const isSmartsender = () => location.hostname.endsWith('smartsender.com');
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  const showNotice = (msg, type = 'error') => {
    let container = shadowRoot.getElementById('ss-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'ss-toast-container';
      shadowRoot.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'ss-toast';
    toast.style.background = type === 'error' ? 'var(--error, #ef4444)' : 'var(--success, #10b981)';
    
    // Check if it's an info toast
    if (type === 'info') toast.style.background = 'var(--accent, #3b82f6)';
    
    toast.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;">
        <span>${type === 'error' ? '⚠️' : (type === 'info' ? 'ℹ️' : '✅')}</span>
        <span>${esc(msg)}</span>
      </div>
      <div class="ss-toast-progress" style="animation-duration: 3s;"></div>
    `;
    
    container.appendChild(toast);
    
    // Force reflow
    void toast.offsetWidth;
    toast.classList.add('visible');
    
    toast.onclick = () => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 300);
    };

    setTimeout(() => {
      if (toast.parentNode) {
        toast.classList.remove('visible');
        setTimeout(() => toast.remove(), 300);
      }
    }, 3000);
  };
  const copyToClipboard = (text, actionName = 'Copy Data', detailText = '') => {
    logAction(actionName, detailText || `Copied: ${text}`);
    return navigator.clipboard.writeText(text).catch(() => {
      const ta = document.createElement('textarea'); ta.value = text;
      document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
    });
  };

  function listenForTokens() {
    window.addEventListener('message', (e) => {
      if (e.source !== window) return;
      if (e.data?.type === '__ss_tokens' && e.data?.xsrf) state.xsrfToken = e.data.xsrf;
    });
  }

  // ─── API ──────────────────────────────────────────────────────────────────
  function bgFetch(url, method = 'GET', headers = {}, body = null) {
    const cleanUrl = url.split('?')[0];
    return new Promise((resolve, reject) => {
      try {
        chrome.runtime.sendMessage({ type: 'API_REQUEST', url, method, headers, body }, (res) => {
          if (chrome.runtime.lastError) {
            const m = chrome.runtime.lastError.message;
            logAction('API Error', `${method} ${cleanUrl} - Extension Error`, { url, method, body, error: m });
            if (m.includes('context invalidated')) {
              return reject(new Error('Extension was updated 🔄 Please refresh this page to continue.'));
            }
            return reject(new Error(m));
          }
          if (!res?.ok) {
            logAction('API Error', `${method} ${cleanUrl} - HTTP ${res?.status}`, { url, method, body, status: res?.status, error: res?.error });
            return reject(new Error(res?.error || `HTTP ${res?.status}`));
          }
          logAction('API Request', `${method} ${cleanUrl} - Success`, { url, method, body, status: res.status, response: res.data });
          resolve(res.data);
        });
      } catch (e) {
        logAction('API Error', `${method} ${cleanUrl} - Catch Error`, { url, method, body, error: e.message });
        if (e.message.includes('context invalidated')) {
          reject(new Error('Extension was updated 🔄 Please refresh this page to continue.'));
        } else {
          reject(e);
        }
      }
    });
  }

  const buildHeaders = (extra = {}) => ({
    'x-requested-with': 'XMLHttpRequest',
    'X-CSRF-TOKEN': getXsrfToken(),
    'X-XSRF-TOKEN': state.xsrfToken || getXsrfCookie(),
    ...extra,
  });

  const authHeaders = () => {
    const t = getPreset(state.projectId)?.apiToken;
    return t ? { 'Accept': 'application/json', 'Authorization': `Bearer ${t}` } : null;
  };

  const __apiCache = new Map();
  const getApiCache = (key) => {
    if (!state.globalSettings.useApiCache) return null;
    const item = __apiCache.get(key);
    if (item && Date.now() - item.ts < 5 * 60 * 1000) return item.data; // 5 mins
    return null;
  };
  const setApiCache = (key, data) => {
    __apiCache.set(key, { data, ts: Date.now() });
  };

  async function searchTags(pid, term) {
    const cacheKey = `tags_${pid}_${term}`;
    const cached = getApiCache(cacheKey);
    if (cached) return cached;

    const preset = getPreset(pid);
    if (!preset?.apiToken) throw new Error('No API token. Open Settings ⚙');
    const all = []; let page = 1, tp = 1;
    while (page <= tp) {
      const d = await bgFetch(`https://api.smartsender.com/v1/tags?${new URLSearchParams({ page, limitation: 20, term })}`, 'GET', { 'Accept': 'application/json', 'Authorization': `Bearer ${preset.apiToken}` });
      all.push(...(d.collection || [])); tp = d.cursor?.pages ?? 1; page++;
    }
    const tl = term.toLowerCase().trim();
    const exact = all.filter(t => t.name.toLowerCase().trim() === tl);
    const result = { collection: exact.length ? exact : all.filter(t => t.name.toLowerCase().includes(tl)), isExact: exact.length > 0 };
    setApiCache(cacheKey, result);
    return result;
  }

  async function countContacts(pid, tags, dv, dop) {
    if (!isSmartsender()) {
      showNotice('This feature is only available on console.smartsender.com', 'error');
      throw new Error('Unsupported domain');
    }
    const scopes = tags.map(tag => ({ resource: { name: tag.name, referable: tag.id, operator: dv ? dop : '=', value: dv || tag.createdAt.split('T')[0] }, type: 'tags', condition: 'includes' }));
    const apiOrigin = location.origin;
    const res = await fetch(`${apiOrigin}/api/i/projects/${pid}/contacts`, {
      method: 'POST', credentials: 'include',
      headers: buildHeaders({ 'Content-Type': 'application/json;charset=UTF-8', 'Accept': 'application/json, text/plain, */*' }),
      body: JSON.stringify({ scopes, page: 1, sort: 'ASC', limitation: 1 }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  async function searchDefinitions(term) {
    const cacheKey = `defs_${state.projectId}_${term}`;
    const cached = getApiCache(cacheKey);
    if (cached) return cached;

    const h = authHeaders();
    if (!h) throw new Error('No API token. Open Settings ⚙');
    const d = await bgFetch(`https://api.smartsender.com/v1/definitions?${new URLSearchParams({ page: 1, limitation: 20, term })}`, 'GET', h);
    const result = d.collection || [];
    setApiCache(cacheKey, result);
    return result;
  }

  async function fetchDefinitionsByIds(ids) {
    const h = authHeaders(); if (!h) throw new Error('No API token.');
    const results = [];
    for (const id of ids) {
      try {
        const d = await bgFetch(`https://api.smartsender.com/v1/definitions/${id}`, 'GET', h);
        if (d) results.push(d);
      } catch { }
    }
    return results;
  }

  async function updateDefinition(id, name, value) {
    const h = authHeaders(); if (!h) throw new Error('No API token.');
    return bgFetch(`https://api.smartsender.com/v1/definitions/${id}`, 'PUT', { ...h, 'Content-Type': 'application/json' }, JSON.stringify({ name, value }));
  }

  async function verifyDefinition(id, expected) {
    const h = authHeaders(); if (!h) return false;
    try {
      const def = state.varResults.find(d => d.id === id); if (!def) return false;
      const d = await bgFetch(`https://api.smartsender.com/v1/definitions?${new URLSearchParams({ page: 1, limitation: 20, term: def.name })}`, 'GET', h);
      return (d.collection || []).find(d => d.id === id)?.value === expected;
    } catch { return false; }
  }

  // ─── HEADER ───────────────────────────────────────────────────────────────
  function renderHeader() {
    const disp = shadowRoot.getElementById('ss-project-display');
    const status = shadowRoot.getElementById('ss-api-status');
    if (state.projectId) {
      const name = state.projectName || '—';
      if (disp) disp.innerHTML = `<span style="color:var(--text4);font-size:13px;">Project:</span> <span style="color:var(--success);font-weight:700;font-size:13px;">${name}</span>`;
      if (status) {
        const hasToken = getPreset(state.projectId)?.apiToken;
        status.style.display = hasToken ? 'none' : 'block';
      }
    } else {
      if (disp) disp.innerHTML = `<span style="color:var(--text5);">waiting...</span>`;
      if (status) status.style.display = 'none';
    }
  }

  // ─── NAV ──────────────────────────────────────────────────────────────────
  function renderNav() {
    const nav = shadowRoot.getElementById('ss-nav'); if (!nav) return;
    nav.innerHTML = `
      <div class="ss-info-header">
        <div class="ss-info-title">Workspace</div>
        <button class="ss-close" id="ss-nav-close">${iX}</button>
      </div>
      <div class="ss-section-label" style="padding: 0 16px; margin: 8px 0;">Menu</div>
      <button class="ss-nav-item ${state.activeTab === 'vars' ? 'active' : ''}" data-tab="vars">
        <span class="ss-nav-icon">${iVariable}</span>
        <span>Variables</span>
      </button>
      <button class="ss-nav-item ${state.activeTab === 'tags' ? 'active' : ''}" data-tab="tags">
        <span class="ss-nav-icon">${iTag}</span>
        <span>Tags</span>
      </button>
      <button class="ss-nav-item ${state.activeTab === 'contacts' ? 'active' : ''}" data-tab="contacts">
        <span class="ss-nav-icon">${iUsers}</span>
        <span>Contacts</span>
      </button>
      <button class="ss-nav-item ${state.activeTab === 'log' ? 'active' : ''}" data-tab="log">
        <span class="ss-nav-icon">${iLog}</span>
        <span>Action Logs</span>
      </button>
      <button class="ss-nav-item ${state.activeTab === 'info' ? 'active' : ''}" data-tab="info">
        <span class="ss-nav-icon">${iInfo}</span>
        <span>About</span>
      </button>
    
      <div class="ss-divider" style="margin: 8px 0;"></div>
      <div class="ss-section-label" style="padding: 0 16px; margin: 8px 0;">Coming Soon</div>
      
      <div class="ss-nav-item disabled">
        <span class="ss-nav-icon">${iFunnel}</span>
        <span>Funnels</span>
        <span class="ss-nav-soon">Soon</span>
      </div>
      <div class="ss-nav-item disabled">
        <span class="ss-nav-icon">${iChat}</span>
        <span>Chat</span>
        <span class="ss-nav-soon">Soon</span>
      </div>
      <div class="ss-nav-item disabled">
        <span class="ss-nav-icon">${iMonitor}</span>
        <span>Monitoring</span>
        <span class="ss-nav-soon">Soon</span>
      </div>


      
    `;
    nav.querySelectorAll('.ss-nav-item:not(.disabled)').forEach(btn => {
      btn.addEventListener('click', () => {
        state.navOpen = false;
        nav.classList.remove('open');
        switchTab(btn.dataset.tab);
      });
    });

    const closeBtn = shadowRoot.getElementById('ss-nav-close');
    if (closeBtn) closeBtn.onclick = () => toggleSidePanel('ss-nav');
  }

  // ─── SETTINGS ─────────────────────────────────────────────────────────────
  function renderSettings() {
    const body = shadowRoot.getElementById('ss-body');
    const ep = state.editingProjectId ? getPreset(state.editingProjectId) : null;
    const sysName = ep ? ep.projectId : (state.projectId || '');
    const dispName = ep ? (ep.customName || '') : '';
    const token = ep ? (ep.apiToken || '') : '';

    body.innerHTML = `
      <div style="margin-bottom:14px;">
        <div class="ss-section-label" style="margin-bottom:12px;">Appearance</div>
        <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:12px;">
          <div style="display:flex;flex-direction:column;gap:6px;align-items:center;">
            <span style="font-size:11px;color:var(--text5);font-family:Roboto,sans-serif;text-transform:uppercase;letter-spacing:0.05em;line-height:1;">${state.theme === 'dark' ? 'Dark' : 'Light'} Mode</span>
            <label class="ss-theme-switch" title="Toggle Theme" style="flex-shrink:0;">
              <input type="checkbox" id="ss-theme-toggle-input"${state.theme === 'dark' ? ' checked' : ''}>
              <span class="ss-slider"></span>
            </label>
          </div>
          <div style="display:flex;flex-direction:column;gap:6px;align-items:center;">
            <span style="font-size:11px;color:var(--text5);font-family:Roboto,sans-serif;text-transform:uppercase;letter-spacing:0.05em;line-height:1;">API Cache</span>
            <label class="ss-theme-switch" title="Smart API Caching" style="flex-shrink:0;">
              <input type="checkbox" id="ss-cache-toggle-input"${state.globalSettings.useApiCache ? ' checked' : ''}>
              <span class="ss-slider"></span>
            </label>
          </div>
          <div style="display:flex;flex-direction:column;gap:6px;align-items:center;">
            <span style="font-size:11px;color:var(--text5);font-family:Roboto,sans-serif;text-transform:uppercase;letter-spacing:0.05em;line-height:1;">Auto Fetch</span>
            <label class="ss-theme-switch" title="Search as you type" style="flex-shrink:0;">
              <input type="checkbox" id="ss-autofetch-toggle-input"${state.globalSettings.autoFetch ? ' checked' : ''}>
              <span class="ss-slider"></span>
            </label>
          </div>
        </div>
      </div>
      <div class="ss-divider"></div>
      <div style="margin-top:14px;">
        <div class="ss-section-label">${state.editingProjectId ? 'Edit Project' : 'Add Project'}</div>
        
        <label class="ss-field-label">Display Name (Optional)</label>
        <input class="ss-input" id="ss-preset-custom-name" type="text" placeholder="e.g. My Main Project" style="margin-bottom:12px;" value="${esc(dispName)}" />

        <label class="ss-field-label">System Name (URL identifier)</label>
        <div style="position:relative;margin-bottom:12px;">
          <input class="ss-input" id="ss-preset-name" type="text" placeholder="newlook" 
                 style="padding-right:36px;${state.systemicNameLocked ? 'color:var(--text5);' : ''}" 
                 value="${esc(sysName)}" ${state.systemicNameLocked ? 'disabled' : ''} />
          <button id="ss-lock-toggle" style="position:absolute;right:8px;top:50%;transform:translateY(-50%);background:none;border:none;color:${state.systemicNameLocked ? 'var(--text4)' : 'var(--error)'};cursor:pointer;padding:4px;display:flex;align-items:center;justify-content:center;">
            ${state.systemicNameLocked ? iLock : iUnlock}
          </button>
        </div>

        <label class="ss-field-label">API Token</label>
        <input class="ss-input" id="ss-preset-token" type="password" placeholder="••••••••••••••••" style="margin-bottom:12px;" value="${token ? '********' : ''}" />
        <div id="ss-preset-msg" style="display:none;font-size:13px;margin-bottom:8px;font-family:Roboto,sans-serif;"></div>
        <div style="display:flex;gap:8px;">
          <button class="ss-btn-primary" id="ss-preset-save" style="flex:1;">${state.editingProjectId ? 'Update' : 'Save'} Project</button>
          ${state.editingProjectId ? '<button class="ss-btn-search" id="ss-preset-cancel" style="background:var(--bg3);color:var(--text);border:1px solid var(--border);">Cancel</button>' : ''}
        </div>
      </div>
      <div class="ss-divider"></div>
      <div style="margin-top:14px;">
        <div class="ss-section-label">Data Management</div>
        <div style="display:flex;gap:8px;">
          <button class="ss-btn-search" id="ss-export-btn" style="flex:1;">Export Data</button>
          <button class="ss-btn-search" id="ss-import-btn" style="flex:1;background:var(--bg3);border:1px solid var(--border);">Import Data</button>
          <input type="file" id="ss-import-file" accept=".json" style="display:none;" />
        </div>
      </div>
    `;

    shadowRoot.getElementById('ss-theme-toggle-input').onchange = (e) => { const theme = e.target.checked ? 'dark' : 'light'; applyTheme(theme); logAction('Change Theme', `Theme changed to ${theme}`); renderSettings(); };
    shadowRoot.getElementById('ss-cache-toggle-input').onchange = (e) => { 
      state.globalSettings.useApiCache = e.target.checked;
      saveGlobalSettings(state.globalSettings);
      logAction('Settings', `API Cache ${e.target.checked ? 'enabled' : 'disabled'}`);
      if (e.target.checked) showNotice('API Cache enabled', 'info');
      else showNotice('API Cache disabled', 'info');
    };
    shadowRoot.getElementById('ss-autofetch-toggle-input').onchange = (e) => { 
      state.globalSettings.autoFetch = e.target.checked;
      saveGlobalSettings(state.globalSettings);
      logAction('Settings', `Auto Fetch ${e.target.checked ? 'enabled' : 'disabled'}`);
      if (e.target.checked) showNotice('Auto Fetch enabled', 'info');
      else showNotice('Auto Fetch disabled', 'info');
    };

    shadowRoot.getElementById('ss-lock-toggle').onclick = () => {
      state.systemicNameLocked = !state.systemicNameLocked;
      renderSettings();
    };

    if (state.editingProjectId) {
      shadowRoot.getElementById('ss-preset-cancel').onclick = () => {
        state.editingProjectId = null;
        state.systemicNameLocked = true;
        renderSettings();
      };
    }

    shadowRoot.getElementById('ss-export-btn').onclick = () => {
      chrome.storage.local.get(null, (data) => {
        const exportData = {};
        for (const [key, val] of Object.entries(data)) {
          if (key.startsWith('ss_')) exportData[key] = val;
        }
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `smartsender_backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        logAction('Data Management', 'Settings exported successfully');
        showNotice('Settings exported successfully', 'info');
      });
    };

    shadowRoot.getElementById('ss-import-btn').onclick = () => shadowRoot.getElementById('ss-import-file').click();
    shadowRoot.getElementById('ss-import-file').onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target.result);
          const toSave = {};
          for (const [key, val] of Object.entries(data)) {
            if (key.startsWith('ss_')) {
              toSave[key] = val;
              __localCache[key] = val;
            }
          }
          chrome.storage.local.set(toSave, () => {
            logAction('Data Management', 'Settings imported successfully');
            showNotice('Settings imported successfully. Reloading...', 'info');
            setTimeout(() => location.reload(), 1500);
          });
        } catch (err) {
          showNotice('Invalid JSON file', 'error');
        }
      };
      reader.readAsText(file);
    };

    shadowRoot.getElementById('ss-preset-save').onclick = () => {
      const pid = shadowRoot.getElementById('ss-preset-name').value.trim();
      const customName = shadowRoot.getElementById('ss-preset-custom-name').value.trim();
      let token = shadowRoot.getElementById('ss-preset-token').value.trim();
      const msg = shadowRoot.getElementById('ss-preset-msg');

      if (!pid) { msg.textContent = '⚠ System name required'; msg.style.cssText = 'display:block;color:var(--error);font-size:13px;margin-bottom:8px;font-family:Roboto,sans-serif;'; return; }

      const presets = loadPresets();

      // If token is just placeholders, use existing one
      if (token === '********') {
        const existing = presets.find(p => p.projectId === (state.editingProjectId || pid));
        token = existing ? existing.apiToken : '';
      }

      const preset = { projectId: pid, apiToken: token, name: pid, customName: customName };

      if (state.editingProjectId && state.editingProjectId !== pid) {
        const oldIdx = presets.findIndex(p => p.projectId === state.editingProjectId);
        if (oldIdx >= 0) presets.splice(oldIdx, 1);
      }

      const targetIdx = presets.findIndex(p => p.projectId === pid);
      if (targetIdx >= 0) presets[targetIdx] = preset;
      else presets.push(preset);

      savePresets(presets);
      if (pid === state.projectId) {
        state.activePreset = preset;
        state.projectName = customName || pid;
        renderHeader();
      }

      msg.textContent = '✅ Saved!';
      msg.style.cssText = 'display:block;color:var(--success);font-size:13px;margin-bottom:8px;font-family:Roboto,sans-serif;';

      state.editingProjectId = null;
      state.systemicNameLocked = true;

      setTimeout(() => {
        msg.style.display = 'none';
        renderSettings();
      }, 1500);

      renderProjectSwitcherPanel();
    };
  }

  // ─── TAGS TAB ─────────────────────────────────────────────────────────────
  function renderMain() {
    const body = shadowRoot.getElementById('ss-body');
    const pid = state.projectId;
    const hasHist = pid ? loadTagSearchHist(pid).length > 0 : false;
    const hasFavs = state.tagFavorites.length > 0;

    body.innerHTML = `
      <div style="margin-bottom:14px;">
        <div class="ss-section-label">Tag search</div>
        <div style="display:flex;gap:6px;align-items:center;margin-bottom:8px;">
          <input class="ss-input" id="ss-tag-input" type="text" placeholder="tag name" autocomplete="off" style="flex:1;" />
          <button class="ss-btn-search" id="ss-btn-search" title="Search" style="background:none;width:32px;padding:0;justify-content:center;border:none;">${iSearch.replace('width="24" height="24"', 'width="16" height="16"')}</button>
          <button class="ss-btn-search" id="ss-btn-tag-reset" title="Reset Search" style="background:none;width:32px;padding:0;justify-content:center;border:none;color:var(--text4);">${iReset.replace('width="24" height="24"', 'width="16" height="16"')}</button>
        </div>
        <div style="display:flex;gap:6px;align-items:center;">
          <button class="ss-action-btn ${state.tagShowSearchHist ? 'active' : ''}" id="ss-tag-hist-btn" style="${hasHist ? '' : 'display:none;'}">History</button>
          <button class="ss-action-btn ${state.tagShowFavorites ? 'active' : ''}" id="ss-tag-fav-btn" style="${hasFavs ? '' : 'display:none;'}">Favorites</button>
        </div>
      </div>
      <div id="ss-tag-list" style="display:flex;flex-direction:column;gap:8px;"></div>
      <div class="ss-error" id="ss-tag-error"></div>
      <div class="ss-loading" id="ss-tag-loading" style="display:none;"><div class="ss-spinner"></div><span class="ss-loading-text">Searching...</span></div>
    `;
    renderTagList();
    bindTagEvents();
  }

  function renderTagList() {
    const listEl = shadowRoot.getElementById('ss-tag-list'); if (!listEl) return;
    listEl.innerHTML = '';
    const results = state.tagResults || [];
    if (!results.length) {
      if (state.tagSearchPerformed) {
        listEl.innerHTML = `<div class="ss-empty">No tags found</div>`;
      }
      return;
    }

    results.forEach(tag => {
      const isFav = state.tagFavorites.some(f => f.id == tag.id);
      const item = document.createElement('div');
      item.className = 'ss-var-card';
      item.innerHTML = `
        <div class="ss-var-card-main">
          <div class="ss-var-info">
            <div class="ss-var-name" style="display:flex;align-items:center;">
              ${esc(tag.name)}
            </div>
            <div class="ss-var-value-preview" style="font-size:11px;color:var(--text5);">ID: ${tag.id}</div>
          </div>
          <div class="ss-var-actions">
            <button class="ss-var-btn ss-fav-tag-btn" data-id="${tag.id}" title="${isFav ? 'Remove from favorites' : 'Add to favorites'}" style="color:${isFav ? 'var(--accent)' : 'var(--border2)'};">
               ${isFav ? iStarFill : iStar}
            </button>
            <button class="ss-var-btn ss-tag-copy-id-btn" data-id="${tag.id}" title="Copy ID">${iCopy}</button>
          </div>
        </div>
      `;
      const favBtn = item.querySelector('.ss-fav-tag-btn');
      favBtn.onclick = (e) => {
        e.stopPropagation();
        const exists = state.tagFavorites.findIndex(f => f.id == tag.id);
        if (exists > -1) state.tagFavorites.splice(exists, 1);
        else state.tagFavorites.unshift({ id: tag.id, name: tag.name });
        saveTagFavorites(state.tagFavorites);
        renderTagList();
        renderMain();
      };
      const copyBtn = item.querySelector('.ss-tag-copy-id-btn');
      copyBtn.onclick = (e) => {
        e.stopPropagation();
        copyToClipboard(tag.id, 'Copy Tag ID', `Copied ID: ${tag.id} for tag: ${tag.name}`);
        const old = copyBtn.innerHTML; copyBtn.innerHTML = iDone; copyBtn.style.color = 'var(--success)';
        setTimeout(() => { copyBtn.innerHTML = old; copyBtn.style.color = ''; }, 1500);
      };
      listEl.appendChild(item);
    });
  }

  function renderTagHistPanel() {
    const p = shadowRoot.getElementById('ss-tag-search-hist'); if (!p) return;
    const hist = loadTagSearchHist(state.projectId);
    const tagInput = shadowRoot.getElementById('ss-tag-input');

    const renderHistList = (filter = '') => {
      const filtered = hist.filter(t => t.toLowerCase().includes(filter.toLowerCase()));
      const listHtml = filtered.length
        ? filtered.map(t => `<div class="ss-hist-term" data-term="${esc(t)}">${esc(t)}</div>`).join('')
        : `<div class="ss-hist-term" style="opacity:0.5;cursor:default;">${filter ? 'No matches' : 'No history'}</div>`;

      p.innerHTML = `
        <div class="ss-info-header">
          <div class="ss-info-title">Search History</div>
          <button class="ss-close" id="ss-tag-hist-close">${iX}</button>
        </div>
        <div class="ss-panel-search-wrapper">
          <input type="text" class="ss-panel-search-input" id="ss-tag-hist-filter" placeholder="Quick search..." value="${esc(filter)}">
        </div>
        <div class="ss-panel-list-content">
          ${listHtml}
        </div>
      `;

      const cb = p.querySelector('#ss-tag-hist-close');
      if (cb) {
        cb.onclick = () => {
          state.tagShowSearchHist = false;
          p.classList.remove('open');
          shadowRoot.getElementById('ss-tag-hist-btn')?.classList.remove('active');
        };
      }

      const filterInput = p.querySelector('#ss-tag-hist-filter');
      if (filterInput) {
        filterInput.oninput = (e) => renderHistList(e.target.value);
        if (filter) {
          filterInput.focus();
          filterInput.setSelectionRange(filter.length, filter.length);
        }
      }

      p.querySelectorAll('.ss-hist-term[data-term]').forEach(item => {
        item.onclick = () => {
          if (tagInput) {
            tagInput.value = item.dataset.term;
            const searchBtn = shadowRoot.getElementById('ss-btn-search');
            if (searchBtn) searchBtn.click();
          }
          state.tagShowSearchHist = false;
          p.classList.remove('open');
          shadowRoot.getElementById('ss-tag-hist-btn')?.classList.remove('active');
        };
      });
    };

    renderHistList();
  }

  function renderTagFavPanel() {
    const p = shadowRoot.getElementById('ss-tag-fav-panel'); if (!p) return;
    p.innerHTML = `
      <div class="ss-info-header">
        <div class="ss-info-title">Favorite Tags</div>
        <button class="ss-close" id="ss-tag-fav-close">${iX}</button>
      </div>
      <div class="ss-panel-list-content">
        ${state.tagFavorites.length ? state.tagFavorites.map(f => `
          <div class="ss-hist-term" style="display:flex;justify-content:space-between;align-items:center;gap:12px;padding:8px 14px;border-bottom:1px solid var(--border);">
            <div style="min-width:0;flex:1;">
              <div style="font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--text);">${esc(f.name)}</div>
              <div style="font-size:11px;color:var(--text5);">ID: ${f.id}</div>
            </div>
            <div style="display:flex;gap:4px;">
               <button class="ss-var-btn ss-fav-tag-copy" data-id="${f.id}" title="Copy ID">${iCopy}</button>
               <button class="ss-var-btn ss-fav-tag-rm" data-id="${f.id}" title="Remove" style="color:var(--text5);">${iX}</button>
            </div>
          </div>
        `).join('') : '<div class="ss-empty">No favorites yet</div>'}
      </div>
    `;
    const cb = p.querySelector('#ss-tag-fav-close'); if (cb) cb.onclick = () => toggleSidePanel('ss-tag-fav-panel');
    p.querySelectorAll('.ss-fav-tag-copy').forEach(btn => {
      btn.onclick = () => {
        copyToClipboard(btn.dataset.id, 'Copy Tag ID', `Copied ID: ${btn.dataset.id}`);
        const old = btn.innerHTML; btn.innerHTML = iDone; btn.style.color = 'var(--success)';
        setTimeout(() => { btn.innerHTML = old; btn.style.color = ''; }, 1500);
      };
    });
    p.querySelectorAll('.ss-fav-tag-rm').forEach(btn => {
      btn.onclick = () => {
        state.tagFavorites = state.tagFavorites.filter(f => f.id != btn.dataset.id);
        saveTagFavorites(state.tagFavorites);
        renderTagFavPanel();
        renderTagList();
        renderMain();
      };
    });
  }

  function bindTagEvents() {
    const searchBtn = shadowRoot.getElementById('ss-btn-search'), tagInput = shadowRoot.getElementById('ss-tag-input');
    const resetBtn = shadowRoot.getElementById('ss-btn-tag-reset');
    const histBtn = shadowRoot.getElementById('ss-tag-hist-btn');
    const favBtn = shadowRoot.getElementById('ss-tag-fav-btn');

    async function doSearch() {
      const term = tagInput?.value.trim(); if (!term) return;
      if (!state.projectId) { showNotice('Project not selected'); return; }
      if (state.isSearching) return;
      logAction('Search Tags', `Query: "${term}"`);
      state.isSearching = true;
      if (searchBtn) { searchBtn.disabled = true; searchBtn.innerHTML = '...'; }
      const l = shadowRoot.getElementById('ss-tag-loading'); if (l) l.style.display = 'block';
      state.tagSearchPerformed = true;
      try {
        const data = await searchTags(state.projectId, term);
        state.tagResults = data.collection || [];
        saveTagSearchHist(state.projectId, term);
        renderTagList();
      } catch (err) { showNotice(err.message); }
      finally { state.isSearching = false; if (l) l.style.display = 'none'; if (searchBtn) { searchBtn.disabled = false; searchBtn.innerHTML = iSearch.replace('width="24" height="24"', 'width="16" height="16"'); } renderMain(); }
    }

    searchBtn?.addEventListener('click', doSearch);
    tagInput?.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });
    tagInput?.addEventListener('input', debounce((e) => {
      const val = e.target.value.trim();
      if (val.length >= 2) {
        if (state.globalSettings.autoFetch) doSearch();
      }
      else if (!val) { state.tagResults = []; state.tagSearchPerformed = false; renderTagList(); }
    }, 400));
    resetBtn?.addEventListener('click', () => {
      if (tagInput) tagInput.value = '';
      state.tagResults = [];
      state.tagSearchPerformed = false;
      renderTagList();
      renderMain();
    });
    histBtn?.addEventListener('click', () => {
      state.tagShowSearchHist = !state.tagShowSearchHist;
      if (state.tagShowSearchHist) {
        state.tagShowFavorites = false;
        shadowRoot.getElementById('ss-tag-fav-btn')?.classList.remove('active');
        histBtn.classList.add('active');
        renderTagHistPanel();
        toggleSidePanel('ss-tag-search-hist');
      } else {
        histBtn.classList.remove('active');
        toggleSidePanel('ss-tag-search-hist');
      }
    });
    favBtn?.addEventListener('click', () => {
      state.tagShowFavorites = !state.tagShowFavorites;
      if (state.tagShowFavorites) {
        state.tagShowSearchHist = false;
        shadowRoot.getElementById('ss-tag-hist-btn')?.classList.remove('active');
        favBtn.classList.add('active');
        renderTagFavPanel();
        toggleSidePanel('ss-tag-fav-panel');
      } else {
        favBtn.classList.remove('active');
        toggleSidePanel('ss-tag-fav-panel');
      }
    });
  }

  // ─── CONTACTS TAB ──────────────────────────────────────────────────────────
  async function findContacts(term) {
    const h = authHeaders(); if (!h) throw new Error('No API token. Open Settings ⚙');
    const isEmail = term.includes('@');
    const looksLikeId = /^\d+$/.test(term);
    let results = [];

    if (looksLikeId) {
      try {
        const res = await bgFetch(`https://api.smartsender.com/v1/contacts/${term}`, 'GET', h);
        if (res && res.id) results.push(res);
      } catch (e) { console.warn('[Contacts] ID lookup failed:', e.message); }
    }

    if (results.length === 0) {
      const params = new URLSearchParams({ page: 1, limitation: 10, term: term.trim() });
      try {
        const res = await bgFetch(`https://api.smartsender.com/v1/contacts/search?${params}`, 'GET', h);
        results = res?.collection || (Array.isArray(res) ? res : []);
      } catch (e) {
        console.error('[Contacts] Search failed:', e.message);
        throw e;
      }
    }
    return results;
  }

  async function fetchContactInfo(id) {
    const h = authHeaders(); if (!h) throw new Error('No API token.');
    return bgFetch(`https://api.smartsender.com/v1/contacts/${id}/info`, 'GET', h);
  }

  async function updateContactVar(contactId, key, value) {
    const h = authHeaders(); if (!h) throw new Error('No API token.');
    return bgFetch(`https://api.smartsender.com/v1/contacts/${contactId}`, 'PUT', h, {
      values: { [key]: value }
    });
  }

  function renderContactInfoPanel(id) {
    const panel = shadowRoot.getElementById('ss-info-panel');
    if (!panel) return;

    closeAllExtraPanels();
    state.contactInfoOpen = true;
    state.contactInfoId = id;
    panel.classList.add('open');

    panel.innerHTML = `
      <div class="ss-info-header">
        <div class="ss-info-title">Contact Info</div>
        <button class="ss-close" id="ss-info-close">${iX}</button>
      </div>
      <div id="ss-info-search-sticky" style="padding:10px 16px;background:var(--bg-solid);border-bottom:1px solid var(--border);display:none;">
        <input class="ss-input" id="ss-info-var-search" type="text" placeholder="Filter variables..." style="font-size:13px;padding:6px 10px;height:28px;" />
      </div>
      <div class="ss-info-body" id="ss-info-body">
        <div class="ss-loading" style="display:flex;"><div class="ss-spinner"></div><span class="ss-loading-text">Loading details...</span></div>
      </div>
    `;

    shadowRoot.getElementById('ss-info-close').onclick = () => {
      state.contactInfoOpen = false;
      panel.classList.remove('open');
    };

    fetchContactInfo(id).then(data => {
      if (state.contactInfoId !== id) return;
      state.contactInfo = data;
      const body = shadowRoot.getElementById('ss-info-body');
      if (!body) return;

      const standardKeys = ['id', 'name', 'firstName', 'lastName', 'fullName', 'email', 'phone', 'photo', 'createdAt', 'notes', 'tags', 'values', 'thumb', 'updatedAt', 'system_city', 'system_country', 'system_continent', 'system_timezone', 'system_os', 'system_browser', 'is_active', 'userId', 'projectId'];

      let vars = (data.values || []).map(v => ({ name: v.name, value: v.value }));
      Object.keys(data).forEach(k => {
        if (!standardKeys.includes(k) && data[k] !== null && typeof data[k] !== 'object') {
          if (!vars.find(v => v.name === k)) vars.push({ name: k, value: data[k] });
        }
      });

      const renderVarRow = (v) => {
        const isEditing = state.contactVarEditingKey === v.name;
        return `
          <div class="ss-info-var${isEditing ? ' editing' : ''}" title="${esc(v.name)}: ${esc(String(v.value))}">
            <div class="ss-info-var-name">
              <span>${esc(v.name)}</span>
              <button class="ss-info-copy-btn" data-copy="${esc(v.name)}" title="Copy key">${iCopy}</button>
            </div>
            <div class="ss-info-var-val">
              ${isEditing ? `
                <input class="ss-input ss-cvar-input" value="${esc(String(v.value))}" style="flex:1;height:22px;font-size:13px;padding:2px 6px;margin-right:4px;" />
                <button class="ss-var-btn ss-cvar-save" data-key="${esc(v.name)}" title="Save">${iDone}</button>
                <button class="ss-var-btn ss-cvar-cancel" title="Cancel">${iX}</button>
              ` : `
                <span>${esc(String(v.value))}</span>
                <button class="ss-info-copy-btn ss-cvar-edit" data-key="${esc(v.name)}" title="Edit value">${iEdit}</button>
                <button class="ss-info-copy-btn" data-copy="${esc(String(v.value))}" title="Copy value">${iCopy}</button>
              `}
            </div>
          </div>
        `;
      };

      const renderBodyContent = (filter = '') => {
        const terms = filter.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
        const pid = state.projectId;
        const priorityKeys = loadContactPriorityVars(pid).split(',').map(s => s.trim().toLowerCase()).filter(Boolean);

        const filteredTags = (data.tags || []).filter(t => !terms.length || terms.some(term => t.name.toLowerCase().includes(term)));
        const filteredVars = vars.filter(v => !terms.length || terms.some(t => v.name.toLowerCase().includes(t) || String(v.value).toLowerCase().includes(t)));

        const priorityVars = filteredVars.filter(v => priorityKeys.includes(v.name.toLowerCase()));

        let html = '';

        // Profile
        if (state.contactSettings.showProfile) {
          html += `
            <div class="ss-info-section" style="display:flex;align-items:center;gap:12px;background:var(--bg2);padding:12px;border-radius:12px;margin-bottom:16px;">
              ${data.photo ? `<img src="${data.photo}" style="width:48px;height:48px;border-radius:50%;object-fit:cover;border:2px solid var(--border);">` : `<div style="width:48px;height:48px;border-radius:50%;background:var(--bg3);display:flex;align-items:center;justify-content:center;font-size:20px;">👤</div>`}
              <div style="flex:1;overflow:hidden;">
                <div style="font-weight:800;font-size:16px;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:flex;align-items:center;">
                  <span style="overflow:hidden;text-overflow:ellipsis;">${esc(data.fullName || data.name || 'Unnamed')}</span>
                  ${getFullProjectFromUrl() ? `<a href="https://messenger.smartsender.com/chats?project=${getFullProjectFromUrl()}&selectedContactId=${data.id}" target="_blank" title="Open chat" style="color:var(--text4);text-decoration:none;display:inline-flex;margin-left:8px;flex-shrink:0;">${iExternal}</a>` : ''}
                </div>
                <div style="font-size:13px;color:var(--text4);font-family:Roboto,sans-serif;">ID: ${data.id}</div>
              </div>
            </div>
          `;
        }

        // Basic Data
        if (state.contactSettings.showDetails) {
          html += `
            <div class="ss-info-section">
              <div class="ss-info-label">Basic Data</div>
              ${data.email ? `<div class="ss-info-detail-row" title="Email: ${esc(data.email)}"><span class="ss-info-detail-label">Email</span><div class="ss-info-detail-value"><span>${esc(data.email)}</span><button class="ss-info-copy-btn" data-copy="${esc(data.email)}" title="Copy email">${iCopy}</button></div></div>` : ''}
              ${data.phone ? `<div class="ss-info-detail-row" title="Phone: ${esc(data.phone)}"><span class="ss-info-detail-label">Phone</span><div class="ss-info-detail-value"><span>${esc(data.phone)}</span><button class="ss-info-copy-btn" data-copy="${esc(data.phone)}" title="Copy phone">${iCopy}</button></div></div>` : ''}
              <div class="ss-info-detail-row" title="Created: ${new Date(data.createdAt).toLocaleString()}"><span class="ss-info-detail-label">Created</span><div class="ss-info-detail-value"><span>${new Date(data.createdAt).toLocaleDateString()}</span><button class="ss-info-copy-btn" data-copy="${new Date(data.createdAt).toLocaleDateString()}" title="Copy date">${iCopy}</button></div></div>
            </div>
          `;
        }

        // Priority Variables
        if (priorityVars.length > 0) {
          html += `
            <div class="ss-priority-section">
              <div class="ss-priority-label">Priority Variables</div>
              ${priorityVars.map(v => renderVarRow(v)).join('')}
            </div>
          `;
        }

        // Tags Accordion
        if (state.contactSettings.showTags) {
          html += `
            <div class="ss-info-accordion" id="ss-tags-accordion">
              <div class="ss-info-accordion-header">
                <span>Tags (${filteredTags.length})</span>
                <span class="ss-info-accordion-icon">▾</span>
              </div>
              <div class="ss-info-accordion-content">
                <div class="ss-info-tags">
                  ${filteredTags.map(t => `<span class="ss-info-tag">${esc(t.name)}</span>`).join('') || '<div class="ss-hint">No tags matched</div>'}
                </div>
              </div>
            </div>
          `;
        }

        // Variables Accordion
        if (state.contactSettings.showVars) {
          html += `
            <div class="ss-info-accordion" id="ss-vars-accordion">
              <div class="ss-info-accordion-header">
                <span>Variables (${filteredVars.length})</span>
                <span class="ss-info-accordion-icon">▾</span>
              </div>
              <div class="ss-info-accordion-content">
                <div class="ss-info-vars">
                  ${filteredVars.map(v => renderVarRow(v)).join('') || '<div class="ss-hint">No variables matched</div>'}
                </div>
              </div>
            </div>
          `;
        }

        return html;
      };

      body.innerHTML = renderBodyContent();

      const vSearch = shadowRoot.getElementById('ss-info-var-search');
      const vSearchSticky = shadowRoot.getElementById('ss-info-search-sticky');
      if (vSearchSticky) vSearchSticky.style.display = (state.contactSettings.showVars || state.contactSettings.showTags) ? 'block' : 'none';

      if (vSearch) {
        vSearch.value = '';
        vSearch.oninput = (e) => {
          body.innerHTML = renderBodyContent(e.target.value);
          bindAll();
          // Auto-expand if searching
          if (e.target.value.trim()) {
            body.querySelectorAll('.ss-info-accordion').forEach(a => a.classList.add('expanded'));
          }
        };
      }

      const bindAll = () => {
        // Accordion toggle
        body.querySelectorAll('.ss-info-accordion-header').forEach(h => {
          h.onclick = () => h.closest('.ss-info-accordion').classList.toggle('expanded');
        });

        // Copy buttons
        body.querySelectorAll('[data-copy]').forEach(btn => {
          btn.onclick = (e) => {
            e.stopPropagation();
            copyToClipboard(btn.dataset.copy, 'Copy Contact ID', `Copied ID: ${btn.dataset.copy}`);
            const old = btn.innerHTML; btn.innerHTML = iDone;
            setTimeout(() => btn.innerHTML = old, 1500);
          };
        });

        // Detail row expand
        body.querySelectorAll('.ss-info-detail-row').forEach(el => {
          el.onclick = (e) => {
            if (e.target.closest('button')) return;
            el.classList.toggle('expanded');
          };
        });

        // Variable actions
        body.querySelectorAll('.ss-info-var').forEach(el => {
          el.onclick = (e) => {
            if (e.target.closest('input') || e.target.closest('button')) return;
            el.classList.toggle('expanded');
          };

          el.querySelector('.ss-cvar-edit')?.addEventListener('click', (e) => {
            e.stopPropagation();
            state.contactVarEditingKey = e.currentTarget.dataset.key;
            body.innerHTML = renderBodyContent(vSearch?.value || '');
            bindAll();
            // Keep variables expanded when editing
            body.querySelector('#ss-vars-accordion')?.classList.add('expanded');
            setTimeout(() => body.querySelector('.ss-cvar-input')?.focus(), 30);
          });

          el.querySelector('.ss-cvar-cancel')?.addEventListener('click', (e) => {
            e.stopPropagation();
            state.contactVarEditingKey = null;
            body.innerHTML = renderBodyContent(vSearch?.value || '');
            bindAll();
            body.querySelector('#ss-vars-accordion')?.classList.add('expanded');
          });

          el.querySelector('.ss-cvar-save')?.addEventListener('click', async (e) => {
            e.stopPropagation();
            const key = e.currentTarget.dataset.key;
            const input = el.querySelector('.ss-cvar-input');
            const newVal = input.value;
            const b = e.currentTarget;
            b.disabled = true; b.innerHTML = '<span class="ss-spinner" style="width:10px;height:10px;border-width:1px;"></span>';
            try {
              await updateContactVar(id, key, newVal);
              state.contactVarEditingKey = null;
              renderContactInfoPanel(id);
            } catch (err) {
              alert('Update failed: ' + err.message);
              b.disabled = false; b.innerHTML = iDone;
            }
          });

          el.querySelector('.ss-cvar-input')?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') el.querySelector('.ss-cvar-save')?.click();
            if (e.key === 'Escape') el.querySelector('.ss-cvar-cancel')?.click();
          });
        });
      };
      bindAll();
    }).catch(err => {
      const body = shadowRoot.getElementById('ss-info-body');
      if (body) body.innerHTML = `<div class="ss-error visible">⚠ ${err.message}</div>`;
    });
  }

  // ─── LOGS TAB ──────────────────────────────────────────────────────────────
  function renderLogTab() {
    const body = shadowRoot.getElementById('ss-body');
    body.innerHTML = `
      <div style="margin-bottom:12px;">
        <div class="ss-section-label">Action Logs</div>
        <div style="display:flex;gap:6px;align-items:center;margin-bottom:8px;">
          <input class="ss-input" id="ss-log-filter" type="text" placeholder="Filter by action or details..." autocomplete="off" style="flex:1;" />
          <button class="ss-btn-search" id="ss-log-clear-btn" title="Clear Logs" style="background:none;width:32px;padding:0;justify-content:center;border:none;color:var(--error);">${iTrash.replace('width="24" height="24"', 'width="16" height="16"')}</button>
        </div>
        <div style="display:flex;gap:6px;align-items:center;">
          <div style="font-size:11px;color:var(--text4);">Showing latest 1000 actions across all projects.</div>
        </div>
      </div>
      <div id="ss-log-list" style="display:flex;flex-direction:column;gap:6px;"></div>
    `;

    const filterInput = shadowRoot.getElementById('ss-log-filter');
    const listEl = shadowRoot.getElementById('ss-log-list');
    const clearBtn = shadowRoot.getElementById('ss-log-clear-btn');

    clearBtn.onclick = () => {
      if (confirm('Are you sure you want to clear all action logs?')) {
        clearLogs();
      }
    };

    const renderList = (filterText = '') => {
      const logs = loadLogs();
      const filtered = logs.filter(l => 
        l.action.toLowerCase().includes(filterText.toLowerCase()) || 
        l.detail.toLowerCase().includes(filterText.toLowerCase()) ||
        (l.project && l.project.toLowerCase().includes(filterText.toLowerCase()))
      );

      if (!filtered.length) {
        listEl.innerHTML = `<div class="ss-empty">${logs.length === 0 ? 'No logs recorded yet.' : 'No logs match filter.'}</div>`;
        return;
      }

      listEl.innerHTML = filtered.map(log => {
        const date = new Date(log.time);
        const timeStr = date.toLocaleTimeString([], { hour12: false });
        const dateStr = date.toLocaleDateString();
        const hasPayload = !!log.payload;
        return `
          <div class="ss-var-card ${hasPayload ? 'ss-log-expandable' : ''}" style="padding:10px;display:flex;flex-direction:column;gap:4px;${hasPayload ? 'cursor:pointer;' : ''}">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <div style="font-size:12px;font-weight:600;color:var(--accent);">${esc(log.action)}</div>
              <div style="font-size:11px;color:var(--text5);">${dateStr} ${timeStr}</div>
            </div>
            <div style="font-size:13px;color:var(--text2);word-break:break-word;line-height:1.4;">
              ${esc(log.detail)}
              ${hasPayload ? '<span style="font-size:10px;color:var(--text4);margin-left:8px;opacity:0.7;">(Click to expand)</span>' : ''}
            </div>
            ${log.project ? `<div style="font-size:11px;color:var(--text4);margin-top:4px;">Project ID: ${esc(log.project)}</div>` : ''}
            ${hasPayload ? `<div class="ss-log-payload" style="display:none;margin-top:8px;padding:8px;background:var(--bg3);border:1px solid var(--border);border-radius:6px;font-family:monospace;font-size:11px;color:var(--text3);white-space:pre-wrap;word-break:break-all;">${esc(log.payload)}</div>` : ''}
          </div>
        `;
      }).join('');

      listEl.querySelectorAll('.ss-log-expandable').forEach(card => {
        card.onclick = () => {
          const payload = card.querySelector('.ss-log-payload');
          if (payload.style.display === 'none') {
            payload.style.display = 'block';
          } else {
            payload.style.display = 'none';
          }
        };
      });
    };

    filterInput.oninput = debounce((e) => renderList(e.target.value.trim()), 300);
    renderList();
  }

  // ─── ABOUT / INFO TAB ───────────────────────────────────────────────────────
  function renderInfoTab() {
    const body = shadowRoot.getElementById('ss-body');
    const settings = state.globalSettings;
    
    body.innerHTML = `
      <div style="margin-bottom:12px;text-align:center;">
        <div style="font-size:20px;font-weight:700;color:var(--text2);">SmartSender Assistant</div>
        <div style="font-size:12px;color:var(--text4);margin-top:8px;line-height:1.4;padding:0 10px;">
          This application does not send any sensitive data (such as project API keys) to the server. Your privacy and security are our priority.
        </div>
      </div>
      <div class="ss-divider" style="margin:16px 0;"></div>
      
      <div style="background:rgba(245,158,11,0.1); border:1px solid rgba(245,158,11,0.3); border-radius:6px; padding:10px; margin-bottom:16px; text-align:center;">
        <div style="font-size:12px; font-weight:600; color:#f59e0b; margin-bottom:4px;">Demo Testing Mode</div>
        <div style="font-size:11px; color:var(--text3); line-height:1.4;">The extension is currently in demo mode. You may encounter bugs or unexpected behavior. Please use the form below to report any issues.</div>
      </div>

      <div class="ss-section-label" style="margin-bottom:12px;">Feedback & Support</div>
      
      <div id="ss-feedback-form-container" style="background:var(--bg2); border:1px solid var(--border); border-radius:6px; padding:12px; display:flex; flex-direction:column; gap:12px;">
        <div>
          <label style="display:block;font-size:11px;color:var(--text4);margin-bottom:4px;">Name <span style="color:var(--error);">*</span></label>
          <input type="text" id="ss-feedback-name" class="ss-input" placeholder="Your name" value="${esc(settings.feedbackName || '')}" />
        </div>
        <div>
          <label style="display:block;font-size:11px;color:var(--text4);margin-bottom:4px;">Email <span style="color:var(--error);">*</span></label>
          <input type="email" id="ss-feedback-email" class="ss-input" placeholder="Your email" value="${esc(settings.feedbackEmail || '')}" />
        </div>
        <div>
          <label style="display:block;font-size:11px;color:var(--text4);margin-bottom:4px;">Topic <span style="color:var(--error);">*</span></label>
          <div style="position:relative;">
            <select id="ss-feedback-type" class="ss-input" style="appearance:none;cursor:pointer;width:100%;">
              <option value="bug">Bug Report</option>
              <option value="idea">Feature Idea</option>
              <option value="support">Support</option>
              <option value="other">Other</option>
            </select>
            <svg style="position:absolute;right:8px;top:50%;transform:translateY(-50%);pointer-events:none;color:var(--text4);" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </div>
        <div>
          <label style="display:block;font-size:11px;color:var(--text4);margin-bottom:4px;">Description <span style="color:var(--error);">*</span></label>
          <textarea id="ss-feedback-desc" class="ss-input" rows="4" placeholder="Describe your problem or idea in detail..." style="resize:vertical;"></textarea>
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          <input type="checkbox" id="ss-feedback-logs" style="accent-color:var(--accent);width:16px;height:16px;cursor:pointer;" />
          <label for="ss-feedback-logs" style="font-size:13px;color:var(--text2);cursor:pointer;user-select:none;">Send extension logs (last 100 actions)</label>
        </div>
        <div id="ss-feedback-msg" style="display:none;font-size:13px;padding:8px;border-radius:4px;margin-top:4px;"></div>
        <button id="ss-feedback-submit" class="ss-btn-search" style="justify-content:center;margin-top:4px;padding:10px;color:#fff;">Send Feedback</button>
      </div>

      <div id="ss-feedback-success-container" style="display:none; background:var(--bg2); border:1px solid var(--border); border-radius:6px; padding:32px 16px; flex-direction:column; align-items:center; gap:12px; text-align:center;">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
        <div style="font-size:16px;font-weight:600;color:var(--text2);margin-top:8px;">Feedback Sent!</div>
        <div style="font-size:13px;color:var(--text4);">Thank you for helping us improve SmartSender Assistant.</div>
      </div>
    `;

    const nameIn = shadowRoot.getElementById('ss-feedback-name');
    const emailIn = shadowRoot.getElementById('ss-feedback-email');
    const typeIn = shadowRoot.getElementById('ss-feedback-type');
    const descIn = shadowRoot.getElementById('ss-feedback-desc');
    const logsCb = shadowRoot.getElementById('ss-feedback-logs');
    const btn = shadowRoot.getElementById('ss-feedback-submit');
    const msgEl = shadowRoot.getElementById('ss-feedback-msg');

    btn.onclick = async () => {
      const name = nameIn.value.trim();
      const email = emailIn.value.trim();
      const topic = typeIn.value;
      const desc = descIn.value.trim();

      // Reset borders
      [nameIn, emailIn, typeIn, descIn].forEach(el => el.style.borderColor = '');

      const missing = [];
      if (!name) missing.push(nameIn);
      if (!email) missing.push(emailIn);
      if (!topic) missing.push(typeIn);
      if (!desc) missing.push(descIn);

      if (missing.length > 0) {
        missing.forEach(el => el.style.borderColor = 'var(--error)');
        msgEl.textContent = 'Please fill out all required fields.';
        msgEl.style.cssText = 'display:block;font-size:13px;padding:8px;border-radius:4px;margin-top:4px;background:rgba(239,68,68,0.1);color:var(--error);';
        return;
      }

      msgEl.style.display = 'none';
      btn.disabled = true;
      btn.innerHTML = 'Sending...';

      settings.feedbackName = nameIn.value.trim();
      settings.feedbackEmail = emailIn.value.trim();
      saveGlobalSettings(settings);

      const payload = {
        type: typeIn.value,
        message: desc,
        name: settings.feedbackName,
        email: settings.feedbackEmail,
        pageUrl: location.href,
        pageTitle: document.title,
        extensionName: chrome.runtime.getManifest().name,
        extensionVersion: chrome.runtime.getManifest().version,
        browser: 'Chrome',
        locale: navigator.language,
        userAgent: navigator.userAgent,
        userId: '',
        installId: settings.installId,
        meta: {
          section: 'about-tab',
          severity: typeIn.value === 'bug' ? 'high' : 'medium'
        },
        ...(logsCb.checked && { data: loadLogs().slice(0, 100) })
      };

      try {
        const res = await fetch('https://extension-feedback-api.batalshikov-d.workers.dev/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Failed to send feedback');
        const formContainer = shadowRoot.getElementById('ss-feedback-form-container');
        const successContainer = shadowRoot.getElementById('ss-feedback-success-container');
        formContainer.style.display = 'none';
        successContainer.style.display = 'flex';
        
        logAction('Feedback Sent', `Type: ${typeIn.value}`);
      } catch (err) {
        msgEl.textContent = 'Error: ' + err.message;
        msgEl.style.cssText = 'display:block;font-size:13px;padding:8px;border-radius:4px;margin-top:4px;background:rgba(239,68,68,0.1);color:var(--error);';
      } finally {
        btn.disabled = false;
        btn.innerHTML = 'Send Feedback';
      }
    };
  }

  function renderContactsTab() {
    const body = shadowRoot.getElementById('ss-body');
    body.innerHTML = `
      <div style="margin-bottom:12px;">
        <div class="ss-section-label">Contact search</div>
        <div style="display:flex;gap:6px;align-items:center;margin-bottom:8px;">
          <input class="ss-input" id="ss-contact-input" type="text" placeholder="Email or User ID" autocomplete="off" style="flex:1;" />
          <button class="ss-btn-search" id="ss-contact-btn" title="Search" style="background:none;width:32px;padding:0;justify-content:center;border:none;">${iSearch.replace('width="24" height="24"', 'width="16" height="16"')}</button>
          <button class="ss-btn-search" id="ss-contact-reset-btn" title="Reset Search" style="background:none;width:32px;padding:0;justify-content:center;border:none;color:var(--text4);">${iReset.replace('width="24" height="24"', 'width="16" height="16"')}</button>
        </div>
        <div style="display:flex;gap:6px;align-items:center;">
          <button class="ss-action-btn" id="ss-contact-hist-btn">History</button>
          <button class="ss-action-btn" id="ss-contact-settings-btn">Options</button>
          <button class="ss-action-btn" id="ss-contact-fav-btn" style="${state.contactFavorites.length > 0 ? '' : 'display:none;'}">Favorite</button>
        </div>
      </div>
      <div id="ss-contact-list" style="display:flex;flex-direction:column;gap:6px;"></div>
      <div class="ss-error" id="ss-contact-error"></div>
      <div class="ss-loading" id="ss-contact-loading" style="display:none;"><div class="ss-spinner"></div><span class="ss-loading-text">Searching...</span></div>
    `;
    renderContacts();
    bindContactsEvents();
    checkActiveContactUrl();
  }

  async function checkActiveContactUrl() {
    const urlId = getUrlContactId();
    if (urlId) {
      if (!state.activeUrlContact || state.activeUrlContact.id != urlId) {
        try {
          const h = authHeaders();
          if (h) {
            const res = await bgFetch(`https://api.smartsender.com/v1/contacts/${urlId}`, 'GET', h);
            if (res && res.id) {
              state.activeUrlContact = res;
              if (state.activeTab === 'contacts') renderContacts();
            }
          }
        } catch (e) { console.warn('[Contacts] URL Contact lookup failed:', e.message); }
      }
    } else {
      if (state.activeUrlContact) {
        state.activeUrlContact = null;
        if (state.activeTab === 'contacts') renderContacts();
      }
    }
  }

  function bindContactsEvents() {
    const input = shadowRoot.getElementById('ss-contact-input');
    const btn = shadowRoot.getElementById('ss-contact-btn');
    const load = shadowRoot.getElementById('ss-contact-loading');
    const errEl = shadowRoot.getElementById('ss-contact-error');
    const histBtn = shadowRoot.getElementById('ss-contact-hist-btn');
    const histPanel = shadowRoot.getElementById('ss-contact-search-hist');
    const favBtn = shadowRoot.getElementById('ss-contact-fav-btn');
    const favPanel = shadowRoot.getElementById('ss-contact-fav-panel');
    const setBtn = shadowRoot.getElementById('ss-contact-settings-btn');
    const setPanel = shadowRoot.getElementById('ss-contact-settings-panel');

    const toggleHist = () => {
      state.contactShowSearchHist = !state.contactShowSearchHist;
      if (!state.contactShowSearchHist) {
        shadowRoot.getElementById('ss-contact-search-hist').classList.remove('open');
        histBtn.classList.remove('active');
        return;
      }

      state.contactShowFavorites = false; state.contactSettingsOpen = false;
      favBtn.classList.remove('active'); setBtn.classList.remove('active');

      histBtn.classList.add('active');
      const hist = loadContactSearchHist(state.projectId);

      const renderHistList = (filter = '') => {
        const filtered = hist.filter(t => t.toLowerCase().includes(filter.toLowerCase()));
        const listHtml = filtered.length
          ? filtered.map((t, i) => `<div class="ss-hist-term" data-term="${esc(t)}">${esc(t)}</div>`).join('')
          : `<div class="ss-hist-term" style="opacity:0.5;cursor:default;">${filter ? 'No matches' : 'No history'}</div>`;

        histPanel.innerHTML = `
          <div class="ss-info-header">
            <div class="ss-info-title">Search History</div>
            <button class="ss-close" id="ss-close-hist-btn">${iX}</button>
          </div>
          <div class="ss-panel-search-wrapper">
            <input type="text" class="ss-panel-search-input" id="ss-hist-filter" placeholder="Quick search..." value="${esc(filter)}">
          </div>
          <div class="ss-panel-list-content">
            ${listHtml}
          </div>
        `;

        histPanel.querySelector('#ss-close-hist-btn').onclick = () => toggleHist();
        const filterInput = histPanel.querySelector('#ss-hist-filter');
        filterInput.focus();
        filterInput.oninput = (e) => renderHistList(e.target.value);

        histPanel.querySelectorAll('.ss-hist-term[data-term]').forEach(el => {
          el.onclick = () => {
            input.value = el.dataset.term;
            toggleHist();
            doSearch();
          };
        });
      };

      renderHistList();
      toggleSidePanel('ss-contact-search-hist');
    };

    const toggleFav = () => {
      state.contactShowFavorites = !state.contactShowFavorites;
      if (!state.contactShowFavorites) {
        favPanel.classList.remove('open'); favBtn.classList.remove('active');
        return;
      }

      state.contactShowSearchHist = false; state.contactSettingsOpen = false;
      histBtn.classList.remove('active'); setBtn.classList.remove('active');

      favBtn.classList.add('active');
      renderContactFavoritesPanel();
      toggleSidePanel('ss-contact-fav-panel');
    };

    const toggleSet = () => {
      state.contactSettingsOpen = !state.contactSettingsOpen;
      if (!state.contactSettingsOpen) {
        setPanel.classList.remove('open'); setBtn.classList.remove('active');
        return;
      }

      state.contactShowSearchHist = false; state.contactShowFavorites = false;
      histBtn.classList.remove('active'); favBtn.classList.remove('active');

      setBtn.classList.add('active');
      renderContactSettingsPanel();
      toggleSidePanel('ss-contact-settings-panel');
    };

    const doReset = () => {
      input.value = '';
      state.contactResults = [];
      state.contactSearchPerformed = false;
      renderContacts();
      errEl.classList.remove('visible');
    };

    const doSearch = async (termOverride = null) => {
      const term = termOverride || input.value.trim(); if (!term) return;
      if (!termOverride) saveContactSearchHist(state.projectId, term);
      logAction('Search Contacts', `Query: "${term}"`);

      state.contactShowSearchHist = false; if (histPanel) histPanel.classList.remove('open');
      state.contactShowFavorites = false; if (favPanel) favPanel.classList.remove('open');
      histBtn.classList.remove('active'); favBtn.classList.remove('active');

      state.isSearchingContact = true; state.contactSearchPerformed = true;
      btn.disabled = true; load.style.display = 'flex'; errEl.classList.remove('visible');
      try {
        state.contactResults = await findContacts(term);
        renderContacts();
      } catch (e) { errEl.textContent = `⚠ ${e.message}`; errEl.classList.add('visible'); }
      finally { state.isSearchingContact = false; btn.disabled = false; load.style.display = 'none'; }
    };

    if (histBtn) histBtn.onclick = (e) => { e.stopPropagation(); toggleHist(); };
    if (favBtn) favBtn.onclick = (e) => { e.stopPropagation(); toggleFav(); };
    if (setBtn) setBtn.onclick = (e) => { e.stopPropagation(); toggleSet(); };
    if (btn) btn.onclick = () => doSearch();
    const resetBtn = shadowRoot.getElementById('ss-contact-reset-btn');
    if (resetBtn) resetBtn.onclick = doReset;
    if (input) {
      input.onkeydown = (e) => { if (e.key === 'Enter') doSearch(); };
      input.addEventListener('input', debounce((e) => {
        const val = e.target.value.trim();
        if (val.length >= 2) {
          if (state.globalSettings.autoFetch) doSearch();
        }
        else if (!val) doReset();
      }, 400));
    }

    document.addEventListener('click', (e) => {
      const target = e.composedPath()[0] || e.target;
      if (state.contactShowSearchHist && !histPanel.contains(target) && target !== histBtn) {
        state.contactShowSearchHist = false; histPanel.classList.remove('open'); histBtn.classList.remove('active');
      }
      if (state.contactShowFavorites && !favPanel.contains(target) && target !== favBtn) {
        state.contactShowFavorites = false; favPanel.classList.remove('open'); favBtn.classList.remove('active');
      }
      if (state.contactSettingsOpen && !setPanel.contains(target) && target !== setBtn) {
        state.contactSettingsOpen = false; setPanel.classList.remove('open'); setBtn.classList.remove('active');
      }
    });
  }

  function renderContactFavoritesPanel() {
    const p = shadowRoot.getElementById('ss-contact-fav-panel'); if (!p) return;
    const favs = state.contactFavorites;

    const renderFavList = (filter = '') => {
      const filtered = favs.filter(f => f.name.toLowerCase().includes(filter.toLowerCase()) || f.id.toString().includes(filter));
      const listHtml = filtered.length
        ? filtered.map(f => `
          <div class="ss-hist-term" data-id="${f.id}" style="display:flex;align-items:center;gap:8px;">
            ${f.photo ? `<img src="${f.photo}" style="width:20px;height:20px;border-radius:50%;">` : '👤'}
            <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(f.name)}</span>
            <span style="font-size:12px;color:var(--text4);">${f.id}</span>
          </div>
        `).join('')
        : `<div class="ss-hist-term" style="opacity:0.5;cursor:default;">${filter ? 'No matches' : 'No favorites yet'}</div>`;

      p.innerHTML = `
        <div class="ss-info-header">
          <div class="ss-info-title">Favorites</div>
          <button class="ss-close" id="ss-close-fav-btn">${iX}</button>
        </div>
        <div class="ss-panel-search-wrapper">
          <input type="text" class="ss-panel-search-input" id="ss-fav-filter" placeholder="Filter favorites..." value="${esc(filter)}">
        </div>
        <div class="ss-panel-list-content">
          ${listHtml}
        </div>
      `;

      p.querySelector('#ss-close-fav-btn').onclick = () => {
        state.contactShowFavorites = false; p.classList.remove('open');
        shadowRoot.getElementById('ss-contact-fav-btn').classList.remove('active');
      };

      const filterInput = p.querySelector('#ss-fav-filter');
      filterInput.focus();
      filterInput.oninput = (e) => renderFavList(e.target.value);

      p.querySelectorAll('.ss-hist-term[data-id]').forEach(el => {
        el.onclick = () => {
          shadowRoot.getElementById('ss-contact-input').value = el.dataset.id;
          state.contactShowFavorites = false;
          p.classList.remove('open');
          shadowRoot.getElementById('ss-contact-fav-btn').classList.remove('active');
          const btn = shadowRoot.getElementById('ss-contact-btn');
          if (btn) btn.click();
        };
      });
    };

    renderFavList();
  }

  function renderContactSettingsPanel() {
    const p = shadowRoot.getElementById('ss-contact-settings-panel'); if (!p) return;
    const pid = state.projectId;
    const priorityVars = loadContactPriorityVars(pid);

    p.innerHTML = `
      <div class="ss-info-header">
        <div class="ss-info-title">Options</div>
        <button class="ss-close" onclick="shadowRoot.getElementById('ss-contact-settings-btn').click()">${iX}</button>
      </div>
      <div style="padding:16px;">
        <div class="ss-settings-item" id="ss-toggle-profile">
          <span>Profile Header</span>
          <div class="ss-settings-check ${state.contactSettings.showProfile ? 'active' : ''}">${state.contactSettings.showProfile ? '✓' : ''}</div>
        </div>
        <div class="ss-settings-item" id="ss-toggle-details">
          <span>Basic Data</span>
          <div class="ss-settings-check ${state.contactSettings.showDetails ? 'active' : ''}">${state.contactSettings.showDetails ? '✓' : ''}</div>
        </div>
        <div class="ss-settings-item" id="ss-toggle-tags">
          <span>Tags</span>
          <div class="ss-settings-check ${state.contactSettings.showTags ? 'active' : ''}">${state.contactSettings.showTags ? '✓' : ''}</div>
        </div>
        <div class="ss-settings-item" id="ss-toggle-vars">
          <span>Variables</span>
          <div class="ss-settings-check ${state.contactSettings.showVars ? 'active' : ''}">${state.contactSettings.showVars ? '✓' : ''}</div>
        </div>
        <div style="height:1px;background:var(--border);margin:12px 0;"></div>
        <div class="ss-settings-item" id="ss-toggle-compact">
          <span>Compact Search Cards</span>
          <div class="ss-settings-check ${state.contactSettings.compactCards ? 'active' : ''}">${state.contactSettings.compactCards ? '✓' : ''}</div>
        </div>
        
        <div style="height:1px;background:var(--border);margin:12px 0;"></div>
        <div class="ss-section-label" style="margin-bottom:8px;padding:0;color:var(--text2);">Priority Variables</div>
        <div style="display:flex;gap:6px;align-items:center;margin-bottom:4px;">
          <input type="text" class="ss-input" id="ss-priority-vars-input" placeholder="key1, key2, key3..." value="${esc(priorityVars)}" style="flex:1;font-size:13px;padding:8px 12px;height:32px;">
          <button class="ss-btn-primary" id="ss-priority-vars-save" style="width:44px;height:32px;padding:0;justify-content:center;" title="Apply Filter">${iDone}</button>
        </div>
        <div class="ss-hint" style="margin-top:4px;color:var(--text5);">Show these at the top (per project)</div>
      </div>
    `;

    p.querySelector('#ss-priority-vars-save')?.addEventListener('click', () => {
      const inp = p.querySelector('#ss-priority-vars-input');
      const val = inp?.value || '';
      saveContactPriorityVars(pid, val);
      if (state.contactInfoId) renderContactInfoPanel(state.contactInfoId);

      const btn = p.querySelector('#ss-priority-vars-save');
      const old = btn.innerHTML; btn.innerHTML = '✓';
      setTimeout(() => btn.innerHTML = old, 1000);
    });

    p.querySelector('#ss-priority-vars-input')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') p.querySelector('#ss-priority-vars-save')?.click();
    });

    p.querySelectorAll('.ss-settings-item').forEach(el => {
      el.onclick = (e) => {
        e.stopPropagation();
        let type;
        if (el.id === 'ss-toggle-profile') type = 'showProfile';
        else if (el.id === 'ss-toggle-details') type = 'showDetails';
        else if (el.id === 'ss-toggle-tags') type = 'showTags';
        else if (el.id === 'ss-toggle-vars') type = 'showVars';
        else if (el.id === 'ss-toggle-compact') type = 'compactCards';

        state.contactSettings[type] = !state.contactSettings[type];
        saveContactSettings(state.contactSettings);
        renderContactSettingsPanel();
        if (state.contactInfoId) renderContactInfoPanel(state.contactInfoId);
        renderContacts();
      };
    });
  }
  function renderContacts() {
    const list = shadowRoot.getElementById('ss-contact-list'); if (!list) return;
    list.innerHTML = '';
    if (!state.contactResults.length && !state.activeUrlContact) {
      if (state.contactSearchPerformed) list.innerHTML = `<div class="ss-empty">No contacts found</div>`;
      return;
    }

    const renderCard = (c, isUrlContact) => {
      const card = document.createElement('div'); card.className = 'ss-var-card';
      card.style.padding = '12px';
      if (isUrlContact) card.style.border = '1px solid var(--accent)';
      card.onclick = () => renderContactInfoPanel(c.id);

      const thumb = c.photo ? `<img src="${c.photo}" style="width:32px;height:32px;border-radius:50%;object-fit:cover;">` : `<div style="width:32px;height:32px;border-radius:50%;background:var(--bg3);display:flex;align-items:center;justify-content:center;font-size:16px;">👤</div>`;

      card.innerHTML = `
        <div style="display:flex;gap:12px;align-items:center;${state.contactSettings.compactCards ? '' : 'margin-bottom:8px;'}">
          ${thumb}
          <div style="min-width:0;flex:1;">
            <div style="font-weight:700;color:var(--text);font-size:16px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(c.fullName || 'Unnamed')}</div>
            <div style="font-size:13px;color:var(--text4);">ID: <span style="color:var(--success);font-weight:600;">${c.id}</span></div>
          </div>
          <div style="display:flex;gap:4px;align-items:center;">
            <button class="ss-var-btn ss-fav-btn" data-id="${c.id}" title="${state.contactFavorites.some(f => f.id == c.id) ? 'Remove from favorites' : 'Add to favorites'}" style="color:${state.contactFavorites.some(f => f.id == c.id) ? 'var(--accent)' : 'var(--text4)'};">
              ${state.contactFavorites.some(f => f.id == c.id) ? iStarFill : iStar}
            </button>
            ${getFullProjectFromUrl() ? `
              <a href="https://messenger.smartsender.com/chats?project=${getFullProjectFromUrl()}&selectedContactId=${c.id}" 
                 target="_blank" title="Open chat" class="ss-var-btn" 
                 onclick="event.stopPropagation();"
                 style="color:var(--text4);text-decoration:none;display:inline-flex;align-items:center;justify-content:center;padding:0;width:28px;height:28px;">
                 ${iExternal.replace('width="16" height="16"', 'width="12" height="12"')}
              </a>
            ` : ''}
            <button class="ss-var-btn ss-copy-btn" data-copy="${c.id}" title="Copy ID">${iCopy}</button>
          </div>
        </div>
        ${!state.contactSettings.compactCards && c.email ? `<div style="font-size:14px;color:var(--text3);display:flex;align-items:center;gap:6px;"><span style="font-size:12px;">✉</span> ${esc(c.email)}</div>` : ''}
        ${!state.contactSettings.compactCards && c.phone ? `<div style="font-size:14px;color:var(--text3);display:flex;align-items:center;gap:6px;margin-top:2px;"><span style="font-size:12px;">📞</span> ${esc(c.phone)}</div>` : ''}
      `;

      card.querySelector('.ss-copy-btn').onclick = (e) => {
        const btn = e.currentTarget; e.stopPropagation();
        copyToClipboard(btn.dataset.copy, 'Copy Contact ID', `Copied ID: ${btn.dataset.copy}`);
        btn.innerHTML = iDone;
        setTimeout(() => btn.innerHTML = iCopy, 1500);
      };

      card.querySelector('.ss-fav-btn').onclick = (e) => {
        const btn = e.currentTarget; e.stopPropagation();
        const id = btn.dataset.id;
        const exists = state.contactFavorites.findIndex(f => f.id == id);
        if (exists > -1) {
          state.contactFavorites.splice(exists, 1);
        } else {
          if (state.contactFavorites.length >= 100) {
            showNotice('Limit of 100 favorites reached');
            return;
          }
          state.contactFavorites.unshift({ id: c.id, name: c.fullName || 'Unnamed', photo: c.photo });
        }
        saveContactFavorites(state.contactFavorites);
        renderContacts();
        const favBtnTab = shadowRoot.getElementById('ss-contact-fav-btn');
        if (favBtnTab) favBtnTab.style.display = state.contactFavorites.length > 0 ? '' : 'none';
        const fp = shadowRoot.getElementById('ss-contact-fav-panel');
        if (fp && fp.classList.contains('open')) renderContactFavoritesPanel();
      };
      return card;
    };

    if (state.activeUrlContact) {
      list.appendChild(renderCard(state.activeUrlContact, true));
    }

    state.contactResults.forEach(c => {
      if (state.activeUrlContact && c.id == state.activeUrlContact.id) return;
      list.appendChild(renderCard(c, false));
    });
  }


  // ─── VARS TAB ─────────────────────────────────────────────────────────────

  function renderVarsTab() {
    const body = shadowRoot.getElementById('ss-body');
    
    let detectedVarsHtml = '';
    const detectedValues = new Set();
    if (location.href.startsWith('https://messenger.smartsender.com/funnels/')) {
      document.querySelectorAll('.variable-template').forEach(vt => {
        const parentSpan = vt.closest('span');
        if (parentSpan) {
          let fv = parentSpan.querySelector('.formatted-value');
          if (!fv && parentSpan.parentElement) fv = parentSpan.parentElement.querySelector('.formatted-value');
          if (fv) {
            const val = fv.textContent.trim();
            if (val && val !== 'null' && val !== 'undefined') detectedValues.add(val);
          }
        }
      });
    }

    if (detectedValues.size > 0) {
      detectedVarsHtml = `
        <div class="ss-detected-vars" id="ss-detected-vars-container">
          <div class="ss-detected-vars-title">Detected on page:</div>
          ${Array.from(detectedValues).map(v => `<div class="ss-var-pill" data-val="${esc(v)}">${esc(v)}</div>`).join('')}
          <div class="ss-var-pill-action" id="ss-var-pill-select-all">Select All</div>
        </div>
      `;
    }

    body.innerHTML = `
      <div style="margin-bottom:12px;">
        <div class="ss-section-label">Variable search</div>
        <div style="display:flex;gap:6px;align-items:center;margin-bottom:8px;">
          <input class="ss-input" id="ss-var-input" type="text" placeholder="name1, name2, name3" autocomplete="off" style="flex:1;" />
          <button class="ss-btn-search" id="ss-var-btn" title="Search" style="background:none;width:32px;padding:0;justify-content:center;border:none;">${iSearch.replace('width="24" height="24"', 'width="16" height="16"')}</button>
          <button class="ss-btn-search" id="ss-var-reset-btn" title="Reset Search" style="background:none;width:32px;padding:0;justify-content:center;border:none;color:var(--text4);">${iReset.replace('width="24" height="24"', 'width="16" height="16"')}</button>
        </div>
        ${detectedVarsHtml}
        <div style="display:flex;gap:6px;align-items:center;">
          <button class="ss-action-btn" id="ss-var-hist-btn">History</button>
          <button class="ss-action-btn" id="ss-var-preset-btn">Presets</button>
          <button class="ss-action-btn" id="ss-var-fav-tab-btn" style="${state.varFavorites.length > 0 ? '' : 'display:none;'}">Favorites</button>
        </div>
      </div>
      <div id="ss-var-list" style="display:flex;flex-direction:column;gap:6px;"></div>
      <div class="ss-error" id="ss-var-error"></div>
      <div class="ss-loading" id="ss-var-loading" style="display:none;"><div class="ss-spinner"></div><span class="ss-loading-text">Searching...</span></div>
    `;

    const input = shadowRoot.getElementById('ss-var-input');
    const btn = shadowRoot.getElementById('ss-var-btn');
    const listEl = shadowRoot.getElementById('ss-var-list');
    const errEl = shadowRoot.getElementById('ss-var-error');
    const loadEl = shadowRoot.getElementById('ss-var-loading');
    const histPanel = shadowRoot.getElementById('ss-var-search-hist');
    const presetsPanel = shadowRoot.getElementById('ss-var-presets-panel');
    const favPanel = shadowRoot.getElementById('ss-var-fav-panel');

    const updateInputFromPills = () => {
      const activePills = Array.from(shadowRoot.querySelectorAll('.ss-var-pill.active')).map(p => p.dataset.val);
      input.value = activePills.join(', ');
      if (activePills.length > 0) {
        if (state.globalSettings.autoFetch) doSearch();
      } else {
        input.dispatchEvent(new Event('input')); // trigger debounce logic
      }
    };

    shadowRoot.querySelectorAll('.ss-var-pill').forEach(pill => {
      pill.onclick = () => {
        pill.classList.toggle('active');
        updateInputFromPills();
      };
    });

    const selectAllBtn = shadowRoot.getElementById('ss-var-pill-select-all');
    if (selectAllBtn) {
      selectAllBtn.onclick = () => {
        shadowRoot.querySelectorAll('.ss-var-pill').forEach(p => p.classList.add('active'));
        updateInputFromPills();
      };
    }

    const showVarErr = (msg) => { errEl.textContent = `⚠ ${msg}`; errEl.classList.add('visible'); setTimeout(() => errEl.classList.remove('visible'), 5000); };

    // ── Search history panel ──
    function toggleSearchHist() {
      state.varShowSearchHist = !state.varShowSearchHist;
      if (!state.varShowSearchHist) {
        histPanel.classList.remove('open');
        shadowRoot.getElementById('ss-var-hist-btn').classList.remove('active');
        return;
      }

      state.varPresetsOpen = false; presetsPanel.classList.remove('open'); shadowRoot.getElementById('ss-var-preset-btn').classList.remove('active');
      state.varShowFavorites = false; favPanel.classList.remove('open'); shadowRoot.getElementById('ss-var-fav-tab-btn').classList.remove('active');

      shadowRoot.getElementById('ss-var-hist-btn').classList.add('active');
      const hist = loadSearchHist(state.projectId);

      const renderHistList = (filter = '') => {
        const filtered = hist.filter(t => t.toLowerCase().includes(filter.toLowerCase()));
        const listHtml = filtered.length
          ? filtered.map((t, i) => `<div class="ss-hist-term" data-term="${esc(t)}">${esc(t)}</div>`).join('')
          : `<div class="ss-hist-term" style="opacity:0.5;cursor:default;">${filter ? 'No matches' : 'No history'}</div>`;

        histPanel.innerHTML = `
          <div class="ss-info-header">
            <div class="ss-info-title">Search History</div>
            <button class="ss-close" onclick="shadowRoot.getElementById('ss-var-hist-btn').click()">${iX}</button>
          </div>
          <div class="ss-panel-search-wrapper">
            <input type="text" class="ss-panel-search-input" id="ss-var-hist-filter" placeholder="Quick search..." value="${esc(filter)}">
          </div>
          <div class="ss-panel-list-content">
            ${listHtml}
          </div>
        `;

        const filterInput = histPanel.querySelector('#ss-var-hist-filter');
        filterInput.focus();
        filterInput.oninput = (e) => renderHistList(e.target.value);

        histPanel.querySelectorAll('.ss-hist-term[data-term]').forEach(el => {
          el.onclick = () => {
            input.value = el.dataset.term;
            toggleSearchHist();
            doSearch();
          };
        });
      };

      renderHistList();
      toggleSidePanel('ss-var-search-hist');
    }

    // ── Presets panel ──
    function renderPresetsPanel() {
      state.varPresetsOpen = !state.varPresetsOpen;
      if (!state.varPresetsOpen) {
        presetsPanel.classList.remove('open');
        shadowRoot.getElementById('ss-var-preset-btn').classList.remove('active');
        return;
      }

      state.varShowSearchHist = false;
      histPanel.classList.remove('open');
      shadowRoot.getElementById('ss-var-hist-btn').classList.remove('active');
      state.varShowFavorites = false;
      favPanel.classList.remove('open');
      shadowRoot.getElementById('ss-var-fav-tab-btn').classList.remove('active');

      shadowRoot.getElementById('ss-var-preset-btn').classList.add('active');
      toggleSidePanel('ss-var-presets-panel');

      const pid = state.projectId;
      function drawPresets() {
        const ps = loadVarPresets(pid);
        presetsPanel.innerHTML = `
          <div class="ss-info-header">
            <div class="ss-info-title">Presets</div>
            <div style="display:flex;gap:4px;align-items:center;">
              <button class="ss-close" onclick="shadowRoot.getElementById('ss-var-preset-btn').click()">${iX}</button>
            </div>
          </div>
          ${ps.length === 0 ? `<div class="ss-empty" style="border:none;padding:10px;">No presets yet</div>`
            : ps.map((p, i) => `
              <div class="ss-vpreset-item" data-pi="${i}">
                ${state.varPresetEditing === i ? `
                  <input class="ss-input ss-vpreset-name-input" data-pi="${i}" value="${esc(p.name)}" style="flex:1;padding:4px 8px;font-size:13px;" />
                  <button class="ss-var-btn ss-vpreset-name-save" data-pi="${i}" title="Save name">${iDone}</button>
                `: `
                  <span class="ss-vpreset-name" title="Click to load" style="cursor:pointer;flex:1;" data-load-pi="${i}"><b>${esc(p.name)}</b></span>
                  <span class="ss-vpreset-count">${p.ids.length} vars</span>
                `}
                <button class="ss-var-btn ss-vpreset-config" data-pi="${i}" title="Configure Preset" style="background:none;">${iGear.replace('width="24" height="24"', 'width="14" height="14"')}</button>
                ${state.varPresetConfigPanelId === i ? `<button class="ss-var-btn ss-vpreset-edit" data-pi="${i}" title="Rename">${iPen}</button>` : ''}
                <button class="ss-var-btn ss-vpreset-delete" data-pi="${i}" title="Delete" style="background:none;">${iTrash.replace('width="24" height="24"', 'width="18" height="18"')}</button>
              </div>
              ${state.varPresetConfigPanelId === i ? `
                <div style="padding:6px 10px;background:var(--bg4);border-bottom:1px solid var(--border);">
                  <div id="ss-preset-cfg-list-${i}" style="margin-bottom:8px;font-size:13px;color:var(--text3);max-height:120px;overflow-y:auto;">
                      Loading variables...
                  </div>
                  <div style="display:flex;gap:4px;align-items:center;">
                    <input class="ss-input" id="ss-cfg-add-id-${i}" placeholder="Enter Variable ID..." style="flex:1;font-size:13px;height:28px;" />
                    <button class="ss-var-btn" id="ss-cfg-add-btn-${i}" title="Add by ID" style="height:28px;">${iPlus}</button>
                  </div>
                </div>
              ` : ''}
              `).join('')}
          <!-- Save / Create preset -->
          <div style="padding:8px 16px;border-top:1px solid var(--border);">
            <div style="display:flex;gap:6px;align-items:center;">
              <input class="ss-input" id="ss-new-preset-name" placeholder="Preset name..." style="flex:1;padding:6px 8px;font-size:13px;" />
              <button class="ss-var-btn ss-new-preset-save" title="Save">${iPlus}</button>
            </div>
          </div>
        `;

        // Rename (edit) logic remains but we removed header '+' and copy buttons
        // Save new preset (empty or from current results)
        presetsPanel.querySelector('.ss-new-preset-save')?.addEventListener('click', () => {
          const nameEl = shadowRoot.getElementById('ss-new-preset-name');
          const name = nameEl?.value.trim();
          if (!name) { nameEl?.focus(); return; }
          const ps = loadVarPresets(pid);
          // If we have search results, use them; otherwise create empty
          const ids = state.varResults.length > 0 ? state.varResults.map(d => d.id) : [];
          const items = state.varResults.length > 0 ? state.varResults.map(d => ({ id: d.id, name: d.name })) : [];

          ps.push({ name, ids, items, ts: new Date().toISOString() });
          saveVarPresets(pid, ps);
          nameEl.value = '';
          drawPresets();
        });

        // Configure preset toggle
        presetsPanel.querySelectorAll('.ss-vpreset-config').forEach(b => {
          b.addEventListener('click', (e) => {
            e.stopPropagation();
            const pi = parseInt(b.dataset.pi);
            state.varPresetConfigPanelId = state.varPresetConfigPanelId === pi ? null : pi;
            state.varPresetEditing = null;
            drawPresets();
          });
        });

        // Load config panel content
        if (state.varPresetConfigPanelId !== null) {
          const pi = state.varPresetConfigPanelId;
          const p = loadVarPresets(pid)[pi];
          const listDiv = shadowRoot.getElementById(`ss-preset-cfg-list-${pi}`);
          if (listDiv && p) {
            if (!p.items || p.items.length !== p.ids.length) {
              p.items = p.ids.map(id => ({ id, name: '...' }));
              fetchDefinitionsByIds(p.ids).then(results => {
                p.items = p.ids.map(id => {
                  const f = results.find(r => r.id === id);
                  return { id, name: f ? f.name : `Unknown (${id})` };
                });
                const allPs = loadVarPresets(pid); allPs[pi] = p; saveVarPresets(pid, allPs);
                if (state.varPresetConfigPanelId === pi) drawPresets();
              });
            } else {
              if (p.items.length === 0) listDiv.innerHTML = '<div class="ss-empty" style="border:none;padding:4px;">No variables</div>';
              else {
                listDiv.innerHTML = p.items.map(item => `
                   <div style="display:flex;align-items:center;justify-content:space-between;padding:3px 2px;border-bottom:1px solid rgba(0,0,0,0.05);">
                     <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;margin-right:6px;" title="${item.id}"><b>${item.id}</b> · ${esc(item.name)}</span>
                     <button class="ss-var-btn" data-cfg-rm="${item.id}" title="Remove">${iTrash}</button>
                   </div>
                 `).join('');
                listDiv.querySelectorAll('[data-cfg-rm]').forEach(btn => {
                  btn.addEventListener('click', () => {
                    const rmId = parseInt(btn.dataset.cfgRm);
                    p.ids = p.ids.filter(x => x !== rmId);
                    p.items = p.items.filter(x => x.id !== rmId);
                    const allPs = loadVarPresets(pid); allPs[pi] = p; saveVarPresets(pid, allPs);
                    drawPresets();
                  });
                });
              }
            }
          }

          const addBtn = shadowRoot.getElementById(`ss-cfg-add-btn-${pi}`);
          if (addBtn) {
            addBtn.addEventListener('click', () => {
              const idVal = parseInt(shadowRoot.getElementById(`ss-cfg-add-id-${pi}`).value.trim());
              if (!idVal) return;
              if (!p.ids.includes(idVal)) {
                p.ids.push(idVal);
                if (!p.items) p.items = [];
                p.items.push({ id: idVal, name: '...' });
                const allPs = loadVarPresets(pid); allPs[pi] = p; saveVarPresets(pid, allPs);
                drawPresets();
              }
            });
          }
        }

        // Rename (edit)
        presetsPanel.querySelectorAll('.ss-vpreset-edit').forEach(b => {
          b.addEventListener('click', (e) => { e.stopPropagation(); state.varPresetEditing = parseInt(b.dataset.pi); state.varPresetConfigPanelId = null; drawPresets(); });
        });

        // Save renamed
        presetsPanel.querySelectorAll('.ss-vpreset-name-save').forEach(b => {
          b.addEventListener('click', (e) => {
            e.stopPropagation();
            const pi = parseInt(b.dataset.pi);
            const inp = presetsPanel.querySelector(`.ss-vpreset-name-input[data-pi="${pi}"]`);
            const ps = loadVarPresets(pid); ps[pi].name = inp.value.trim() || ps[pi].name;
            saveVarPresets(pid, ps); state.varPresetEditing = null; drawPresets();
          });
        });

        // Load preset directly by clicking name
        presetsPanel.querySelectorAll('[data-load-pi]').forEach(b => {
          b.addEventListener('click', async (e) => {
            e.stopPropagation();
            const pi = parseInt(b.dataset.loadPi);
            const ps = loadVarPresets(pid);
            const preset = ps[pi]; if (!preset) return;
            state.varPresetConfigPanelId = null;
            btn.disabled = true; btn.textContent = '...'; loadEl.style.display = 'flex';
            listEl.innerHTML = ''; state.varResults = []; state.varEditingId = null; state.varShowHistoryId = null;
            state.varViewingPresetId = pi;
            try {
              const results = await fetchDefinitionsByIds(preset.ids);
              state.varResults = preset.ids.map(id => results.find(r => r.id === id)).filter(Boolean);
              renderVarList(listEl, showVarErr);
            } catch (err) { showVarErr(err.message); }
            finally { btn.disabled = false; btn.innerHTML = iSearch.replace('width="24" height="24"', 'width="16" height="16"'); loadEl.style.display = 'none'; }
          });
        });

        // Delete
        presetsPanel.querySelectorAll('.ss-vpreset-delete').forEach(b => {
          b.addEventListener('click', (e) => {
            e.stopPropagation();
            const ps = loadVarPresets(pid); ps.splice(parseInt(b.dataset.pi), 1);
            saveVarPresets(pid, ps); state.varPresetEditing = null; drawPresets();
          });
        });
      }

      drawPresets();
    }

    // ── Favorites panel ──
    function toggleFavPanel() {
      state.varShowFavorites = !state.varShowFavorites;
      if (!state.varShowFavorites) {
        favPanel.classList.remove('open');
        shadowRoot.getElementById('ss-var-fav-tab-btn').classList.remove('active');
        return;
      }

      state.varPresetsOpen = false; presetsPanel.classList.remove('open'); shadowRoot.getElementById('ss-var-preset-btn').classList.remove('active');
      state.varShowSearchHist = false; histPanel.classList.remove('open'); shadowRoot.getElementById('ss-var-hist-btn').classList.remove('active');

      shadowRoot.getElementById('ss-var-fav-tab-btn').classList.add('active');
      const favs = loadVarFavorites();

      const renderFavList = (filter = '') => {
        const filtered = favs.filter(f => f.name.toLowerCase().includes(filter.toLowerCase()) || f.id.toString().includes(filter));
        const listHtml = filtered.length
          ? filtered.map((f, i) => `<div class="ss-hist-term" data-index="${favs.indexOf(f)}">${esc(f.name)} <span style="font-size:11px;color:var(--text4);margin-left:auto;">${f.id}</span></div>`).join('')
          : `<div class="ss-hist-term" style="opacity:0.5;cursor:default;">${filter ? 'No matches' : 'No favorites yet'}</div>`;

        favPanel.innerHTML = `
          <div class="ss-info-header">
            <div class="ss-info-title">Favorites</div>
            <button class="ss-close" onclick="shadowRoot.getElementById('ss-var-fav-tab-btn').click()">${iX}</button>
          </div>
          <div class="ss-panel-search-wrapper">
            <input type="text" class="ss-panel-search-input" id="ss-var-fav-filter" placeholder="Filter variables..." value="${esc(filter)}">
          </div>
          <div class="ss-panel-list-content">
            ${listHtml}
          </div>
        `;

        const filterInput = favPanel.querySelector('#ss-var-fav-filter');
        filterInput.focus();
        filterInput.oninput = (e) => renderFavList(e.target.value);

        favPanel.querySelectorAll('.ss-hist-term[data-index]').forEach(el => {
          el.addEventListener('click', async () => {
            const fav = favs[parseInt(el.dataset.index)];
            toggleFavPanel();
            input.value = '';
            loadEl.style.display = 'flex';
            listEl.innerHTML = ''; state.varResults = []; state.varEditingId = null; state.varShowHistoryId = null;
            state.varViewingPresetId = null;
            try {
              const results = await fetchDefinitionsByIds([fav.id]);
              if (results.length) {
                state.varResults = results;
                renderVarList(listEl, showVarErr);
              } else {
                listEl.innerHTML = `<div class="ss-empty">Variable not found</div>`;
              }
            } catch (e) {
              showVarErr(e.message);
            } finally {
              loadEl.style.display = 'none';
            }
          });
        });
      };

      renderFavList();
      toggleSidePanel('ss-var-fav-panel');
    }

    // ── Search ──
    async function doSearch() {
      const raw = input.value.trim(); if (!raw || !state.projectId) return;
      logAction('Search Variables', `Query: "${raw}"`);
      // Split by comma, trim each term
      const terms = raw.split(',').map(t => t.trim()).filter(Boolean);
      btn.disabled = true; btn.innerHTML = '...'; loadEl.style.display = 'flex';
      listEl.innerHTML = ''; state.varResults = []; state.varEditingId = null; state.varShowHistoryId = null;
      state.varViewingPresetId = null;
      histPanel.classList.remove('open'); state.varShowSearchHist = false;
      // Save each term to search history
      terms.forEach(t => saveSearchHist(state.projectId, t));
      try {
        // Search all terms, merge results deduplicated by id
        const seen = new Set(); const all = [];
        for (const term of terms) {
          const results = await searchDefinitions(term);
          results.forEach(r => { if (!seen.has(r.id)) { seen.add(r.id); all.push(r); } });
        }
        state.varResults = all;
        renderVarList(listEl, showVarErr);
      } catch (err) { showVarErr(err.message); }
      finally { btn.disabled = false; btn.innerHTML = iSearch.replace('width="24" height="24"', 'width="16" height="16"'); loadEl.style.display = 'none'; }
    }

    btn.onclick = doSearch;
    if (input) {
      input.onkeydown = (e) => { if (e.key === 'Enter') doSearch(); };
      input.addEventListener('input', debounce((e) => {
        const val = e.target.value.trim();
        if (val.length >= 2) {
          if (state.globalSettings.autoFetch) doSearch();
        }
        else if (!val) { state.varResults = []; renderVarList(listEl, showVarErr); }
      }, 400));
    }

    shadowRoot.getElementById('ss-var-hist-btn').onclick = (e) => { e.stopPropagation(); toggleSearchHist(); };
    shadowRoot.getElementById('ss-var-preset-btn').onclick = (e) => { e.stopPropagation(); renderPresetsPanel(); };
    shadowRoot.getElementById('ss-var-fav-tab-btn').onclick = (e) => { e.stopPropagation(); toggleFavPanel(); };
    shadowRoot.getElementById('ss-var-reset-btn').onclick = () => {
      state.varResults = []; state.varEditingId = null; state.varShowHistoryId = null; state.varPresetPanelId = null;
      state.varViewingPresetId = null;
      state.varShowSearchHist = false; state.varPresetsOpen = false; state.varShowFavorites = false;
      renderVarsTab();
    };

    // Close panels logic removed as per user request to keep them open
    document.addEventListener('click', (e) => {
      // Logic for closing panels on outside click removed
    }, { capture: false });

    if (state.varResults.length) renderVarList(listEl, showVarErr);
  }

  function renderVarList(listEl, showVarErr) {
    listEl.innerHTML = '';
    if (!state.varResults.length) { listEl.innerHTML = `<div class="ss-empty">No variables found</div>`; return; }

    if (state.varViewingPresetId !== null) {
      const ps = loadVarPresets(state.projectId);
      const p = ps[state.varViewingPresetId];
      if (p) listEl.innerHTML += `<div style="padding:6px 10px;font-size:13px;color:var(--text4);background:var(--bg3);border-radius:4px;margin-bottom:6px;">Viewing Preset: <b>${esc(p.name)}</b></div>`;
    }

    state.varResults.forEach(def => {
      const isEditing = state.varEditingId === def.id;
      const showHist = state.varShowHistoryId === def.id;
      const showPresetPanel = state.varPresetPanelId === def.id;
      const status = def._status || '';
      const history = loadVarHistory(state.projectId, def.id);
      const pid = state.projectId;

      const card = document.createElement('div');
      card.className = `ss-var-card${isEditing ? ' editing' : ''}`;
      card.dataset.id = def.id;

      // Build preset panel HTML
      function buildPresetPanelHTML() {
        const ps = loadVarPresets(pid);
        const inPresets = ps.map((p, i) => ({ ...p, i, has: p.ids.includes(def.id) }));
        return `
          <div class="ss-card-preset-panel">
            <div class="ss-var-panel-label" style="padding:8px 10px 4px;">Preset Name / Search</div>
            <div style="padding:0 10px 6px; display:flex; gap:4px;">
              <input class="ss-input ss-preset-combined-input" placeholder="Name to create or search..." style="flex:1;padding:5px 8px;font-size:13px;" />
              <button class="ss-var-btn ss-preset-combined-save" title="Save / Create">${iSave}</button>
            </div>
            <div class="ss-preset-list-inner">
              ${ps.length === 0 ? `<div class="ss-empty" style="border:none;padding:6px 10px;font-size:13px;">No presets yet</div>`
            : inPresets.map(p => `
                  <div class="ss-preset-toggle-row" data-pi="${p.i}" style="display:${p.has ? 'flex' : 'none'};">
                    <span class="ss-preset-toggle-name">${esc(p.name)}</span>
                    <span class="ss-preset-toggle-count">${p.ids.length}</span>
                    <button class="ss-var-btn ss-preset-toggle-btn${p.has ? ' active' : ''}" data-pi="${p.i}" data-has="${p.has}" title="${p.has ? 'Remove from preset' : 'Add to preset'}">
                      ${p.has ? iDone : iPlus}
                    </button>
                  </div>`).join('')}
            </div>
          </div>
        `;
      }

      card.innerHTML = `
        <div class="ss-var-card-main">
          <div class="ss-var-info">
            <div class="ss-var-name" style="display:flex;align-items:center;gap:4px;">
              <button class="ss-var-btn ss-var-btn-copy-name" data-action="copy-name" data-id="${def.id}" title="Copy Name">${iCopy}</button>
              <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(def.name)}</span>
            </div>
            <div style="display:flex;align-items:center;gap:4px;margin-top:2px;">
              <button class="ss-var-btn ss-var-btn-copy" data-action="copy" data-id="${def.id}" title="Copy Value">${iCopy}</button>
              <div class="ss-var-value-preview">${esc(def.value || '—')}</div>
            </div>
          </div>
          <div class="ss-var-actions">
            ${isEditing ? `
              <button class="ss-var-btn ss-var-btn-history${showHist ? ' active' : ''}" data-action="history" data-id="${def.id}" title="Edit history">${iHistory}</button>
              <button class="ss-var-btn ss-var-btn-copy" data-action="copy-edit" data-id="${def.id}" title="Copy">${iCopy}</button>
              <button class="ss-var-btn ss-var-btn-reset" data-action="reset" data-id="${def.id}" title="Reset">${iReset}</button>
              <button class="ss-var-btn ss-var-btn-done" data-action="save" data-id="${def.id}" title="Save">${iDone}</button>
            `: `
              <button class="ss-var-btn ss-fav-var-btn" data-action="fav" data-id="${def.id}" title="${state.varFavorites.some(f => f.id == def.id) ? 'Remove from favorites' : 'Add to favorites'}" style="color:${state.varFavorites.some(f => f.id == def.id) ? 'var(--accent)' : 'var(--border2)'};">
                 ${state.varFavorites.some(f => f.id == def.id) ? iStarFill : iStar}
              </button>
              <button class="ss-var-btn ss-var-btn-addpreset${showPresetPanel ? ' active' : ''}" data-action="addpreset" data-id="${def.id}" title="Add to preset">${iPlus}</button>
              ${state.varViewingPresetId !== null ? `<button class="ss-var-btn" data-action="rm-from-preset" data-id="${def.id}" title="Remove from this preset">${iTrash}</button>` : ''}
              <button class="ss-var-btn ss-var-btn-edit" data-action="edit" data-id="${def.id}" title="Edit">${iEdit}</button>
            `}
            ${status === 'success' ? `<span class="ss-var-status success">✓</span>`
          : status === 'error' ? `<span class="ss-var-status error">✗</span>`
            : status === 'verifying' ? `<span class="ss-var-status verifying">⟳</span>`
              : `<span class="ss-var-status empty"></span>`}
          </div>
        </div>
        ${isEditing ? `<div class="ss-var-edit-panel"><textarea class="ss-var-textarea" id="ss-var-edit-${def.id}">${esc(def.value || '')}</textarea></div>` : ''}
        ${showHist && isEditing ? `
          <div class="ss-var-history-panel">
            <div class="ss-var-panel-label">History (up to 5)</div>
            ${history.length === 0 ? `<div class="ss-empty" style="border:none;padding:6px 0;">No history yet</div>`
            : history.map((h, hi) => `<div class="ss-history-item" data-hi="${hi}" data-id="${def.id}"><div class="ss-history-value">${esc(h.value)}</div><div class="ss-history-ts">${h.ts.split('T')[0]}</div></div>`).join('')}
          </div>`: ''}
        ${showPresetPanel && !isEditing ? buildPresetPanelHTML() : ''}
      `;

      card.querySelector('.ss-var-card-main').addEventListener('click', (e) => {
        if (e.target.closest('[data-action]')) return;
        if (!isEditing) {
          state.varEditingId = def.id; state.varShowHistoryId = null; state.varPresetPanelId = null;
          renderVarList(listEl, showVarErr);
          setTimeout(() => { const ta = shadowRoot.getElementById(`ss-var-edit-${def.id}`); if (ta) { ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); } }, 30);
        }
      });

      card.querySelectorAll('.ss-history-item').forEach(item => {
        item.addEventListener('click', () => {
          const h = loadVarHistory(state.projectId, def.id)[parseInt(item.dataset.hi)];
          if (!h) return; const ta = shadowRoot.getElementById(`ss-var-edit-${def.id}`); if (ta) ta.value = h.value;
        });
      });

      // Preset panel interactions
      function bindPresetPanel() {
        const panel = card.querySelector('.ss-card-preset-panel'); if (!panel) return;

        // Combined Search & Create
        panel.querySelector('.ss-preset-combined-input')?.addEventListener('input', (e) => {
          const q = e.target.value.toLowerCase();
          panel.querySelectorAll('.ss-preset-toggle-row').forEach(row => {
            const name = row.querySelector('.ss-preset-toggle-name')?.textContent.toLowerCase() || '';
            const isAdded = row.querySelector('.ss-preset-toggle-btn')?.dataset.has === 'true';
            if (!q) {
              row.style.display = isAdded ? 'flex' : 'none';
            } else {
              row.style.display = name.includes(q) ? 'flex' : 'none';
            }
          });
        });

        panel.querySelectorAll('.ss-preset-toggle-btn').forEach(b => {
          b.addEventListener('click', (e) => {
            e.stopPropagation();
            const pi = parseInt(b.dataset.pi);
            const has = b.dataset.has === 'true';
            const ps = loadVarPresets(pid);
            if (!ps[pi]) return;
            if (has) {
              ps[pi].ids = ps[pi].ids.filter(x => x !== def.id);
              if (ps[pi].items) ps[pi].items = ps[pi].items.filter(x => x.id !== def.id);
            } else {
              if (!ps[pi].ids.includes(def.id)) {
                ps[pi].ids.push(def.id);
                if (!ps[pi].items) ps[pi].items = [];
                ps[pi].items.push({ id: def.id, name: def.name });
              }
            }
            saveVarPresets(pid, ps);
            state.varPresetPanelId = def.id;
            renderVarList(listEl, showVarErr);
          });
        });

        panel.querySelector('.ss-preset-combined-save')?.addEventListener('click', (e) => {
          e.stopPropagation();
          const inp = panel.querySelector('.ss-preset-combined-input');
          const name = inp?.value.trim(); if (!name) return;
          const ps = loadVarPresets(pid);
          const existingIdx = ps.findIndex(p => p.name.toLowerCase() === name.toLowerCase());

          if (existingIdx > -1) {
            if (!ps[existingIdx].ids.includes(def.id)) {
              ps[existingIdx].ids.push(def.id);
              if (!ps[existingIdx].items) ps[existingIdx].items = [];
              ps[existingIdx].items.push({ id: def.id, name: def.name });
            }
          } else {
            ps.push({ name, ids: [def.id], items: [{ id: def.id, name: def.name }], ts: new Date().toISOString() });
          }
          saveVarPresets(pid, ps);
          state.varPresetPanelId = def.id;
          renderVarList(listEl, showVarErr);
        });
      }

      listEl.appendChild(card);
      bindPresetPanel();
    });

    listEl.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const action = btn.dataset.action, id = parseInt(btn.dataset.id);
        const def = state.varResults.find(d => d.id === id); if (!def) return;

        if (action === 'fav') {
          const exists = state.varFavorites.findIndex(f => f.id == id);
          if (exists > -1) { state.varFavorites.splice(exists, 1); }
          else {
            if (state.varFavorites.length >= 100) {
              showNotice('Limit of 100 favorites reached');
              return;
            }
            state.varFavorites.unshift({ id: def.id, name: def.name });
          }
          saveVarFavorites(state.varFavorites);
          renderVarList(listEl, showVarErr);
          const favBtnTab = shadowRoot.getElementById('ss-var-fav-tab-btn');
          if (favBtnTab) favBtnTab.style.display = state.varFavorites.length > 0 ? '' : 'none';
          if (state.varShowFavorites) {
            shadowRoot.getElementById('ss-var-fav-tab-btn')?.click();
            shadowRoot.getElementById('ss-var-fav-tab-btn')?.click();
          }
          return;
        }

        if (action === 'copy-name') {
          copyToClipboard(def.name, 'Copy Variable Name', `Copied variable name: ${def.name}`);
          const old = btn.innerHTML; btn.innerHTML = iDone;
          setTimeout(() => btn.innerHTML = old, 1500);
        }

        if (action === 'copy') { copyToClipboard(def.value || '', 'Copy Variable Value', `Copied value for: ${def.name}`); btn.style.color = 'var(--success)'; setTimeout(() => btn.style.color = '', 1500); }
        if (action === 'copy-edit') { const ta = shadowRoot.getElementById(`ss-var-edit-${id}`); copyToClipboard(ta?.value || def.value || '', 'Copy Variable Editor Value', `Copied edited value for: ${def.name}`); btn.style.color = 'var(--success)'; setTimeout(() => btn.style.color = '', 1500); }
        if (action === 'addpreset') { state.varPresetPanelId = state.varPresetPanelId === id ? null : id; state.varEditingId = null; renderVarList(listEl, showVarErr); }
        if (action === 'rm-from-preset') {
          const pi = state.varViewingPresetId;
          const ps = loadVarPresets(state.projectId);
          if (ps[pi]) {
            ps[pi].ids = ps[pi].ids.filter(x => x !== id);
            saveVarPresets(state.projectId, ps);
            state.varResults = state.varResults.filter(r => r.id !== id);
            renderVarList(listEl, showVarErr);
          }
        }
        if (action === 'edit') { state.varEditingId = id; state.varShowHistoryId = null; state.varPresetPanelId = null; renderVarList(listEl, showVarErr); setTimeout(() => { const ta = shadowRoot.getElementById(`ss-var-edit-${id}`); if (ta) { ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); } }, 30); }
        if (action === 'reset') { state.varEditingId = null; state.varShowHistoryId = null; renderVarList(listEl, showVarErr); }
        if (action === 'history') { state.varShowHistoryId = state.varShowHistoryId === id ? null : id; renderVarList(listEl, showVarErr); }

        if (action === 'save') {
          const ta = shadowRoot.getElementById(`ss-var-edit-${id}`); if (!ta) return;
          const newVal = ta.value, oldVal = def.value;
          def._status = 'verifying'; state.varEditingId = null; state.varShowHistoryId = null;
          renderVarList(listEl, showVarErr);
          try {
            await updateDefinition(id, def.name, newVal);
            const ok = await verifyDefinition(id, newVal);
            def._status = ok ? 'success' : 'error';
            if (ok) { saveVarHistory(state.projectId, id, oldVal); def.value = newVal; }
          } catch (err) { def._status = 'error'; showVarErr(err.message); }
          renderVarList(listEl, showVarErr);
          setTimeout(() => { def._status = ''; renderVarList(listEl, showVarErr); }, 2500);
        }
      });
    });
  }

  function closeAllExtraPanels() {
    shadowRoot.querySelectorAll('.ss-extra-panel').forEach(p => p.classList.remove('open'));
    shadowRoot.querySelectorAll('.ss-action-btn, .ss-var-btn').forEach(b => b.classList.remove('active'));
    state.contactShowSearchHist = false; state.contactShowFavorites = false; state.contactSettingsOpen = false;
    state.varShowSearchHist = false; state.varPresetsOpen = false;
  }

  // ─── SWITCH ───────────────────────────────────────────────────────────────
  function switchView(view) {
    closeAllExtraPanels();
    state.view = view;
    const sb = shadowRoot.getElementById('ss-settings-btn'), bb = shadowRoot.getElementById('ss-back-btn');
    const nav = shadowRoot.getElementById('ss-nav'), hb = shadowRoot.getElementById('ss-header-bottom');
    const labelEl = shadowRoot.getElementById('ss-current-tab-label');

    if (view === 'settings') {
      sb && (sb.style.display = 'none'); bb && (bb.style.display = 'flex');
      if (nav) nav.classList.remove('open'); if (hb) hb.style.display = 'none';
      if (labelEl) labelEl.textContent = 'Preference';
      const link = shadowRoot.getElementById('ss-tab-external-link');
      if (link) link.style.display = 'none';

      renderProjectSwitcherPanel();
      renderSettings();

      // Auto-open project switcher
      setTimeout(() => {
        const p = shadowRoot.getElementById('ss-project-switcher-panel');
        if (p) p.classList.add('open');
      }, 0);
    } else {
      // Close project switcher when leaving settings
      const p = shadowRoot.getElementById('ss-project-switcher-panel');
      if (p) p.classList.remove('open');
      sb && (sb.style.display = 'flex'); bb && (bb.style.display = 'none');
      if (hb) hb.style.display = 'flex';

      if (labelEl) {
        let label = 'Variables';
        if (state.activeTab === 'tags') label = 'Tags';
        if (state.activeTab === 'contacts') label = 'Contacts';
        if (state.activeTab === 'info') label = 'About';
        if (state.activeTab === 'log') label = 'Action Logs';
        labelEl.textContent = label;
      }

      if (state.activeTab === 'tags') renderMain();
      else if (state.activeTab === 'contacts') renderContactsTab();
      else if (state.activeTab === 'info') renderInfoTab();
      else renderVarsTab();

      updateExternalLink(state.activeTab);
    }
  }

  function switchTab(tab) {
    if (state.view === 'settings') switchView('main');
    state.activeTab = tab; saveLastTab(state.projectId, tab);
    let label = 'Variables';
    if (tab === 'tags') label = 'Tags';
    if (tab === 'contacts') label = 'Contacts';
    if (tab === 'log') label = 'Action Logs';
    if (tab === 'info') label = 'About';
    shadowRoot.getElementById('ss-current-tab-label').textContent = label;
    renderNav();
    updateExternalLink(tab);
    if (tab === 'tags') renderMain();
    else if (tab === 'contacts') renderContactsTab();
    else if (tab === 'log') renderLogTab();
    else if (tab === 'info') renderInfoTab();
    else renderVarsTab();
  }

  function updateExternalLink(tab) {
    const link = shadowRoot.getElementById('ss-tab-external-link');
    if (!link) return;

    const pid = state.projectId;
    const isActive = isSmartsender() && pid;

    link.style.display = 'inline-flex';

    if (isActive) {
      let path = 'definitions';
      if (tab === 'tags') path = 'tags';
      if (tab === 'contacts') path = 'contacts';

      link.href = `https://console.smartsender.com/${path}?project=${pid}`;
      link.style.opacity = '1';
      link.style.pointerEvents = 'auto';
      link.style.cursor = 'pointer';
      link.title = 'Open in SmartSender';
    } else {
      link.removeAttribute('href');
      link.style.opacity = '0.3';
      link.style.pointerEvents = 'none';
      link.style.cursor = 'default';
      link.title = 'Available only on smartsender.com with active project';
    }
  }

  // ─── BUILD SIDEBAR ────────────────────────────────────────────────────────
  function buildSidebar() {
    const s = document.createElement('div'); s.id = 'ss-sidebar';
    s.innerHTML = `
      <div id="ss-resize-handle"></div>
      <div id="ss-extra-resize-handle"></div>
      <div class="ss-header">
        <div class="ss-header-top" style="align-items:center;margin-bottom:6px;">
          <div style="display:flex;align-items:center;gap:12px;">
            <button class="ss-icon-btn" id="ss-burger" title="Navigation Menu" style="width:44px;height:44px;background:none;border-radius:12px;display:flex;align-items:center;justify-content:center;color:var(--text2);padding:0;">
              ${iMenu}
            </button>
            <div style="display:flex;align-items:center;">
              <span id="ss-current-tab-label" style="font-size:24px;font-weight:700;color:var(--text2);letter-spacing:-0.02em;">Variables</span>
              <a id="ss-tab-external-link" target="_blank" title="Open in SmartSender" style="display:none;color:var(--text4);margin-left:10px;text-decoration:none;transition:color 0.2s;">
                ${iExternal.replace('width="16" height="16"', 'width="22" height="22"')}
              </a>
            </div>
          </div>
          <div style="display:flex;gap:8px;align-items:center;">
            <button class="ss-icon-btn" id="ss-back-btn" title="Back to Tabs" style="display:none;">${iBack}</button>
            <button id="ss-settings-btn" title="Settings" style="background:none;border:none;cursor:pointer;padding:8px;display:flex;align-items:center;justify-content:center;color:var(--text4);transition:color 0.2s;">${iGear.replace('width="24" height="24"', 'width="20" height="20"')}</button>
            <button class="ss-close" id="ss-close" title="Close Workspace">${iX}</button>
          </div>
        </div>
      </div>
      <div id="ss-nav" class="ss-nav"></div>
      <div id="ss-info-panel" class="ss-info-panel"></div>
      <div id="ss-contact-search-hist" class="ss-extra-panel"></div>
      <div id="ss-contact-fav-panel" class="ss-extra-panel"></div>
      <div id="ss-contact-settings-panel" class="ss-extra-panel"></div>
      <div id="ss-var-search-hist" class="ss-extra-panel"></div>
      <div id="ss-var-presets-panel" class="ss-extra-panel"></div>
      <div id="ss-var-fav-panel" class="ss-extra-panel"></div>
      <div id="ss-tag-search-hist" class="ss-extra-panel"></div>
      <div id="ss-tag-fav-panel" class="ss-extra-panel"></div>
      <div id="ss-project-switcher-panel" class="ss-extra-panel"></div>
      <div class="ss-body" id="ss-body"></div>
      <div class="ss-footer" style="padding:10px 16px;">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;">
           <div style="display:flex;align-items:center;gap:8px;">
             <div class="ss-title" style="margin:0;">my<span>Sender</span></div>
             <div style="font-size:11px;color:var(--text5);font-family:Roboto,sans-serif;margin-top:4px;">v${chrome.runtime.getManifest().version}</div>
           </div>
           <div style="display:flex;align-items:center;gap:10px;margin-left:auto;">
             <div id="ss-mode-toggle-container" style="display:flex;align-items:center;gap:6px;">
                <span id="ss-mode-text" style="font-size:11px;font-weight:700;text-transform:uppercase;">AUTO</span>
                <label class="ss-mode-switch" id="ss-mode-switch-label" title="Toggle Auto/Manual Project Selection">
                  <input type="checkbox" id="ss-mode-checkbox">
                  <span class="ss-mode-slider"></span>
                </label>
             </div>
             <div class="ss-project-badge" id="ss-project-container" style="margin:0;flex-shrink:0;cursor:pointer;"><span id="ss-project-display">—</span></div>
             <div id="ss-api-status" style="display:none;font-size:11px;background:var(--error);color:white;padding:2px 6px;border-radius:4px;font-weight:700;text-transform:uppercase;cursor:pointer;" title="No API Key — Click to add">api key</div>
           </div>
        </div>
      </div>
    `;
    return s;
  }

  function renderProjectSwitcherPanel() {
    const p = shadowRoot.getElementById('ss-project-switcher-panel'); if (!p) return;
    const presets = loadPresets();

    const listHtml = presets.length
      ? presets.map((pr, idx) => `
        <div class="ss-hist-term ${state.projectId === pr.projectId ? 'active' : ''}" style="display:flex;justify-content:space-between;align-items:center;gap:8px;padding: 10px 14px;border-bottom:1px solid var(--border);">
          <div style="min-width:0;flex:1;cursor:pointer;" class="ss-project-select-trigger" data-pid="${pr.projectId}">
            <div style="font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--text);">${esc(pr.customName || pr.name)}</div>
            ${pr.customName ? `<div style="font-size:11px;color:var(--text5);">${esc(pr.projectId)}</div>` : ''}
          </div>
          <div style="display:flex;gap:4px;">
            <button class="ss-project-edit-btn" data-pid="${pr.projectId}" style="background:none;border:none;color:var(--text4);cursor:pointer;padding:4px;display:flex;align-items:center;justify-content:center;transition:color 0.2s;" title="Edit Project">${iPen}</button>
            <button class="ss-preset-delete" data-index="${idx}" style="background:none;border:none;color:var(--text5);cursor:pointer;font-size:18px;padding:4px;display:flex;align-items:center;justify-content:center;transition:color 0.2s;">${iX}</button>
          </div>
        </div>
      `).join('')
      : '<div class="ss-empty" style="border:none;padding:12px;">No projects saved. Click below to add one.</div>';

    p.innerHTML = `
      <div class="ss-info-header">
        <div class="ss-info-title">Switch Project</div>
        <button class="ss-close" id="ss-project-switcher-close">${iX}</button>
      </div>
      <div class="ss-panel-list-content" style="flex:1;overflow-y:auto;">
        ${listHtml}
      </div>
      <div style="padding: 16px; border-top: 1px solid var(--border); background: var(--bg);">
        <button class="ss-btn-primary" id="ss-project-add-btn" style="width: 100%; justify-content: center; gap: 8px;">
          <span style="font-size: 18px; line-height: 1;">+</span>
          <span>Add Project</span>
        </button>
      </div>
    `;

    shadowRoot.getElementById('ss-project-switcher-close').onclick = () => {
      toggleSidePanel('ss-project-switcher-panel');
    };

    p.querySelectorAll('.ss-project-select-trigger').forEach(el => {
      el.onclick = () => {
        setProjectMode('MANUAL');
        switchProject(el.dataset.pid);
        if (state.view !== 'settings') {
          toggleSidePanel('ss-project-switcher-panel');
        } else {
          renderProjectSwitcherPanel(); // Update active state highlight
        }
      };
    });

    p.querySelectorAll('.ss-project-edit-btn').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        state.editingProjectId = btn.dataset.pid;
        state.systemicNameLocked = true;
        switchView('settings');
      };
    });

    p.querySelectorAll('.ss-preset-delete').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.dataset.index);
        const presets = loadPresets();
        const deletedId = presets[idx].projectId;
        presets.splice(idx, 1);
        savePresets(presets);
        if (state.editingProjectId === deletedId) {
          state.editingProjectId = null;
        }
        renderProjectSwitcherPanel();
        if (state.view === 'settings') renderSettings();
      };
    });

    shadowRoot.getElementById('ss-project-add-btn').onclick = () => {
      state.editingProjectId = null;
      state.systemicNameLocked = false;
      switchView('settings');
    };
  }

  function setProjectMode(mode) {
    state.projectMode = mode;
    saveToStorage('ss_project_mode', mode);
    updateModeUI();
  }

  function updateModeUI() {
    const textEl = shadowRoot.getElementById('ss-mode-text');
    const checkbox = shadowRoot.getElementById('ss-mode-checkbox');
    const label = shadowRoot.getElementById('ss-mode-switch-label');

    if (!textEl || !checkbox || !label) return;

    const isAuto = state.projectMode === 'AUTO';

    if (!isSmartsender()) {
      label.classList.add('disabled');
      checkbox.disabled = false;
      textEl.textContent = 'MANUAL';
      textEl.style.color = 'var(--text5)';
      checkbox.checked = false;
    } else {
      label.classList.remove('disabled');
      checkbox.disabled = false;
      if (isAuto) {
        textEl.textContent = 'AUTO';
        textEl.style.color = 'var(--success)';
        checkbox.checked = true;
      } else {
        textEl.textContent = 'MANUAL';
        textEl.style.color = 'var(--error)';
        checkbox.checked = false;
      }
    }
  }

  const switchProject = (id) => {
    state.projectId = id;
    const p = getPreset(id);
    state.activePreset = p;
    state.projectName = p ? (p.customName || p.name) : id;
    logAction('Switch Project', `Project changed to: ${id}`);

    saveToSession(K_SESSION_PROJECT, id);
    saveToStorage(K_LATEST_PROJECT_ID, id);

    // Reset temporary results
    state.varResults = [];
    state.contactResults = [];
    state.contactSearchPerformed = false;

    const lastTab = loadLastTab(id);
    switchTab(lastTab);
    renderHeader();
    if (state.view === 'settings') renderSettings();
  };

  // ─── INIT ─────────────────────────────────────────────────────────────────
  async function init() {
    if (shadowRoot.getElementById('ss-sidebar')) return;
    const sidebar = buildSidebar();
    shadowRoot.appendChild(sidebar);
    sidebar.style.width = loadSidebarWidth() + 'px';
    const extraW = await loadFromSession(K_SESSION_EXTRA_WIDTH);
    if (extraW) sidebar.style.setProperty('--ss-extra-width', extraW + 'px');
    applyTheme(state.theme);

    // Persistence Logic
    const sessionPid = await loadFromSession(K_SESSION_PROJECT);
    const urlPid = getFullProjectFromUrl();
    const latestPid = loadFromCache(K_LATEST_PROJECT_ID, null);

    let targetPid = null;

    if (isSmartsender()) {
      if (state.projectMode === 'AUTO') {
        targetPid = urlPid || sessionPid || latestPid;
      } else {
        targetPid = sessionPid || latestPid || urlPid;
      }
    } else {
      targetPid = sessionPid || latestPid;
    }

    if (targetPid) {
      switchProject(targetPid);
    } else {
      // Initialize default UI if no project detected
      switchTab(state.activeTab);
    }

    function refreshProjectContext() {
      if (!isSmartsender() || state.projectMode === 'MANUAL') return;
      const pid = getFullProjectFromUrl();
      if (pid && pid !== state.projectId) {
        switchProject(pid);
      }
    }
    const urlName = getProjectFromUrl();
    if (urlName) state.projectName = urlName;

    listenForTokens();

    renderHeader(); renderNav(); updateModeUI();

    const modeCheckbox = shadowRoot.getElementById('ss-mode-checkbox');
    if (modeCheckbox) {
      modeCheckbox.addEventListener('change', (e) => {
        if (!isSmartsender()) {
          showNotice('Переключение режимов заблокировано и определяется только в ручном режиме', 'error');
          e.target.checked = false;
          return;
        }
        setProjectMode(e.target.checked ? 'AUTO' : 'MANUAL');
        if (state.projectMode === 'AUTO') refreshProjectContext();
      });
    }

    const closeSidebar = () => {
      closeAllExtraPanels();
      const nav = shadowRoot.getElementById('ss-nav');
      if (nav) nav.classList.remove('open');
      state.navOpen = false;
      setTimeout(() => {
        sidebar.classList.remove('open');
      }, 100);
    };

    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.type === 'TOGGLE_SIDEBAR') {
        if (sidebar.classList.contains('open')) {
          closeSidebar();
        } else {
          sidebar.classList.add('open');
          if (state.view === 'settings') switchView('main');
          refreshProjectContext();
          renderHeader();
          if (state.activeTab === 'vars') renderVarsTab();
        }
      }
    });

    const handle = shadowRoot.getElementById('ss-resize-handle');
    let isResizing = false, startX = 0, startWidth = 0;
    handle.addEventListener('mousedown', (e) => { isResizing = true; startX = e.clientX; startWidth = sidebar.offsetWidth; handle.classList.add('dragging'); document.body.style.userSelect = 'none'; document.body.style.cursor = 'ew-resize'; });
    document.addEventListener('mousemove', (e) => { if (!isResizing) return; sidebar.style.width = Math.min(1200, Math.max(320, startWidth + (startX - e.clientX))) + 'px'; });
    document.addEventListener('mouseup', () => { if (!isResizing) return; isResizing = false; handle.classList.remove('dragging'); document.body.style.userSelect = ''; document.body.style.cursor = ''; saveSidebarWidth(sidebar.offsetWidth); });
    handle.addEventListener('dblclick', () => {
      sidebar.style.width = '500px';
      saveSidebarWidth(500);
    });

    const extraHandle = shadowRoot.getElementById('ss-extra-resize-handle');
    let isExtraResizing = false, extraStartX = 0, extraStartWidth = 0;
    extraHandle.addEventListener('mousedown', (e) => {
      isExtraResizing = true;
      extraStartX = e.clientX;
      const computed = getComputedStyle(sidebar).getPropertyValue('--ss-extra-width');
      extraStartWidth = parseInt(computed) || 280;
      extraHandle.classList.add('dragging');
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'ew-resize';
    });
    document.addEventListener('mousemove', (e) => {
      if (!isExtraResizing) return;
      const newWidth = Math.min(800, Math.max(200, extraStartWidth + (extraStartX - e.clientX)));
      sidebar.style.setProperty('--ss-extra-width', newWidth + 'px');
    });
    document.addEventListener('mouseup', () => {
      if (!isExtraResizing) return;
      isExtraResizing = false;
      extraHandle.classList.remove('dragging');
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
      const w = parseInt(getComputedStyle(sidebar).getPropertyValue('--ss-extra-width'));
      if (w && !isNaN(w)) saveToSession(K_SESSION_EXTRA_WIDTH, w);
    });
    extraHandle.addEventListener('dblclick', () => {
      sidebar.style.setProperty('--ss-extra-width', '280px');
      saveToSession(K_SESSION_EXTRA_WIDTH, 280);
    });

    shadowRoot.getElementById('ss-close').onclick = closeSidebar;
    shadowRoot.getElementById('ss-settings-btn').onclick = () => switchView('settings');
    shadowRoot.getElementById('ss-back-btn').onclick = () => switchView('main');
    shadowRoot.getElementById('ss-project-container').onclick = (e) => {
      e.stopPropagation();
      renderProjectSwitcherPanel();
      toggleSidePanel('ss-project-switcher-panel');
    };
    shadowRoot.getElementById('ss-api-status').onclick = () => {
      switchView('settings');
    };
    shadowRoot.getElementById('ss-burger').onclick = (e) => {
      e.stopPropagation();
      toggleSidePanel('ss-nav');
    };

    document.addEventListener('click', (e) => {
      const target = e.composedPath()[0] || e.target;
      const nav = shadowRoot.getElementById('ss-nav');
      if (nav && nav.classList.contains('open') && !nav.contains(target) && target.id !== 'ss-burger') {
        nav.classList.remove('open');
        state.navOpen = false;
      }
      const info = shadowRoot.getElementById('ss-info-panel');
      if (info && info.classList.contains('open') && !info.contains(target) && !target.closest('.ss-var-card')) {
        info.classList.remove('open');
        state.contactInfoOpen = false;
      }
      const extraPanels = ['ss-contact-search-hist', 'ss-contact-fav-panel', 'ss-contact-settings-panel', 'ss-project-switcher-panel'];
      extraPanels.forEach(pId => {
        const p = shadowRoot.getElementById(pId);
        if (p && p.classList.contains('open') && !p.contains(target) && !target.closest('.ss-action-btn') && !target.closest('.ss-var-btn')) {
          p.classList.remove('open');
          if (pId === 'ss-contact-search-hist') state.contactShowSearchHist = false;
          if (pId === 'ss-contact-fav-panel') state.contactShowFavorites = false;
          if (pId === 'ss-contact-settings-panel') state.contactSettingsOpen = false;
        }
      });
      // Close var edit if click outside any var card
      if (state.varEditingId !== null) {
        const clickedCard = target.closest('.ss-var-card');
        if (!clickedCard) {
          state.varEditingId = null; state.varShowHistoryId = null;
          const listEl = shadowRoot.getElementById('ss-var-list');
          if (listEl) renderVarList(listEl, () => { });
        }
      }
    });

    switchTab(state.activeTab);
  }

  const startApp = async () => {
    try {
      __localCache = await chrome.storage.local.get(null);
    } catch (e) {
      console.warn('Storage access failed, using empty cache', e);
      __localCache = {};
    }

    const runInit = () => {
      if (document.body) {
        init();
      } else {
        setTimeout(runInit, 50);
      }
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', runInit);
    } else {
      runInit();
    }

    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'local') {
        for (const [key, { newValue }] of Object.entries(changes)) {
          __localCache[key] = newValue;
        }
      }
    });
  };

  startApp();
