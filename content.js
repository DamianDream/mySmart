(() => {
  'use strict';

  // SVG icons (shared)
  const iGear = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg>`;
  const iCopy = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
  const iEdit = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`;
  const iDone = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;
  const iReset = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/></svg>`;
  const iHistory = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
  const iExternal = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="vertical-align:middle;"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`;
  const iSearch = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`;
  const iClock = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
  const iPreset = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>`;
  const iStar = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
  const iStarFill = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
  const iSave = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>`;
  const iTrash = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>`;
  const iPen = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`;
  const iAddToPreset = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><line x1="12" y1="9" x2="12" y2="15"/><line x1="9" y1="12" x2="15" y2="12"/></svg>`;
  const iTune = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="2" y1="14" x2="6" y2="14"></line><line x1="10" y1="8" x2="14" y2="8"></line><line x1="18" y1="16" x2="22" y2="16"></line></svg>`;
  const iFilter = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>`;
  const iBack = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>`;
  const iX = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
  const iMenu = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`;
  const iKey = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>`;

  const iVariable = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`;
  const iTag = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>`;
  const iUsers = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`;
  const iFunnel = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 3H2l8 9.46V19l4 2V12.46L22 3z"></path></svg>`;
  const iChat = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`;
  const iMonitor = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>`;
  const iLog = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>`;

  // ─── COLORS ───────────────────────────────────────────────────────────────
  const THEMES = {
    dark: {
      '--bg-solid': '#202124', '--bg': 'rgba(32, 33, 36, 0.75)', '--bg2': 'rgba(42, 43, 46, 0.65)', '--bg3': 'rgba(255, 255, 255, 0.08)', '--bg4': 'rgba(28, 29, 32, 0.75)',
      '--border': 'rgba(255, 255, 255, 0.08)', '--border2': 'rgba(255, 255, 255, 0.15)',
      '--text': '#ffffff', '--text2': '#f8fafc', '--text3': '#cbd5e1', '--text4': '#94a3b8', '--text5': '#64748b',
      '--accent': '#3b82f6', '--accent2': '#60a5fa', '--accent-bg': 'rgba(59, 130, 246, 0.18)',
      '--success': '#10b981', '--error': '#ef4444', '--mark-bg': '#0d2040', '--mark-text': '#a0c4ff',
      '--shadow': 'rgba(0,0,0,0.3)', '--blur-depth': '24px'
    },
    light: {
      '--bg-solid': '#f0f2f5', '--bg': 'rgba(255, 255, 255, 0.70)', '--bg2': 'rgba(255, 255, 255, 0.55)', '--bg3': 'rgba(0, 0, 0, 0.04)', '--bg4': 'rgba(245, 245, 250, 0.5)',
      '--border': 'rgba(0, 0, 0, 0.06)', '--border2': 'rgba(0, 0, 0, 0.14)',
      '--text': '#0f172a', '--text2': '#1e293b', '--text3': '#475569', '--text4': '#64748b', '--text5': '#94a3b8',
      '--accent': '#2563eb', '--accent2': '#3b82f6', '--accent-bg': 'rgba(37, 99, 235, 0.12)',
      '--success': '#059669', '--error': '#dc2626', '--mark-bg': '#bdd6ff', '--mark-text': '#0040a0',
      '--shadow': 'rgba(0,0,0,0.06)', '--blur-depth': '24px'
    },
  };

  // ─── STORAGE KEYS ─────────────────────────────────────────────────────────
  const K_CONTACT_FAVORITES = 'ss_contacts_favorites';
  const K_SIDEBAR_WIDTH = 'ms_sidebar_width';
  const K_PRESETS = 'ms_presets';
  const K_THEME = 'ms_theme';
  const K_VAR_HISTORY = 'ms_var_history';     // edit history per variable
  const K_SEARCH_HIST = (pid) => `ms_search_hist_${pid}`;  // search term history
  const K_CONTACT_SEARCH_HIST = (pid) => `ss_contact_search_hist_${pid}`;
  const K_VAR_PRESETS = (pid) => `ms_var_presets_${pid}`;  // var presets per project
  const K_CONTACT_SETTINGS = 'ss_contacts_display_settings';
  const K_LAST_TAB = (pid) => `ms_last_tab_${pid}`;

  let __localCache = {};

  // ─── STORAGE HELPERS ──────────────────────────────────────────────────────
  const loadFromCache = (key, defaultVal) => { try { const v = __localCache[key]; return v !== undefined ? (typeof v === 'string' && (v.startsWith('{') || v.startsWith('[')) ? JSON.parse(v) : v) : defaultVal; } catch { return defaultVal; } };
  const saveToStorage = (key, val) => { const str = typeof val === 'object' ? JSON.stringify(val) : String(val); __localCache[key] = str; chrome.storage.local.set({ [key]: str }); };

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
  
  const loadContactFavorites = () => loadFromCache(K_CONTACT_FAVORITES, []);
  const saveContactFavorites = (f) => saveToStorage(K_CONTACT_FAVORITES, f.slice(0, 100));
  
  const K_VAR_FAVORITES = 'ms_var_favorites';
  const loadVarFavorites = () => loadFromCache(K_VAR_FAVORITES, []);
  const saveVarFavorites = (f) => saveToStorage(K_VAR_FAVORITES, f.slice(0, 100));

  // --- PANEL MANAGER ---
  const toggleSidePanel = (id) => {
    const panels = [
      'ss-nav', 'ss-info-panel', 
      'ss-contact-search-hist', 'ss-contact-fav-panel', 'ss-contact-settings-panel',
      'ss-var-search-hist', 'ss-var-presets-panel', 'ss-var-fav-panel', 'ss-extra-panel'
    ];
    const target = document.getElementById(id);
    if (!target) return;

    const alreadyOpenId = panels.find(pId => {
      const p = document.getElementById(pId);
      return p && p.classList.contains('open');
    });

    if (id === 'ss-nav') {
      // Burger menu: close everything else WITH animation, then toggle nav
      panels.forEach(pId => {
        if (pId !== 'ss-nav') {
          const p = document.getElementById(pId);
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
      document.querySelectorAll('.ss-action-btn.active, .ss-var-btn.active').forEach(b => b.classList.remove('active'));
      
      target.classList.toggle('open');
      state.navOpen = target.classList.contains('open');
      return;
    }

    // Tab-specific logic (Instant Swap)
    if (alreadyOpenId && alreadyOpenId !== 'ss-nav') {
      const old = document.getElementById(alreadyOpenId);
      old.classList.add('ss-no-transition');
      target.classList.add('ss-no-transition');
      
      old.classList.remove('open');
      target.classList.add('open');
      
      // Delay removal to ensure reflow
      setTimeout(() => {
        old.classList.remove('ss-no-transition');
        target.classList.remove('ss-no-transition');
      }, 50);
    } else {
      // Normal slide-out
      panels.forEach(pId => {
        if (pId !== id) {
          const p = document.getElementById(pId);
          if (p) p.classList.remove('open');
        }
      });
      target.classList.add('open');
    }
  };

  // ─── STATE ────────────────────────────────────────────────────────────────
  const state = {
    projectId: null, projectName: null,
    xsrfToken: null, activePreset: null,
    theme: loadTheme(),
    fontSize: 'regular',
    activeTab: 'vars',
    view: 'main',
    navOpen: false,
    selectedTags: [], isSearching: false, isCounting: false,
    varResults: [], varEditingId: null, varShowHistoryId: null,
    varShowSearchHist: false,
    varShowFavorites: false,
    varFavorites: loadVarFavorites(),
    varPresetsOpen: false,
    varPresetEditing: null,
    varPresetPanelId: null,
    varPresetConfigPanelId: null,
    varViewingPresetId: null,
    contactResults: [], isSearchingContact: false, contactSearchPerformed: false,
    contactShowSearchHist: false,
    contactSettingsOpen: false,
    contactSettings: loadContactSettings(),
    contactFavorites: loadContactFavorites(),
    contactInfoOpen: false, contactInfoId: null, contactInfo: null, isFetchingContactInfo: false,
    contactShowFavorites: false,
    contactVarEditingKey: null
  };

  // ─── THEME ────────────────────────────────────────────────────────────────
  function applyTheme(t) {
    state.theme = t; saveTheme(t);
    const s = document.getElementById('ss-sidebar'); if (!s) return;
    Object.entries(THEMES[t] || THEMES.dark).forEach(([k, v]) => s.style.setProperty(k, v));
    s.dataset.theme = t;
  }

  const getXsrfToken = () => document.querySelector('meta[name="csrf-token"]')?.content ?? '';
  const getXsrfCookie = () => decodeURIComponent(document.cookie.split('; ').find(r => r.startsWith('XSRF-TOKEN='))?.split('=')[1] ?? '');
  const getProjectFromUrl = () => { const p = new URLSearchParams(location.search).get('project'); return p ? p.replace(/-\d+$/, '') : null; };
  const getFullProjectFromUrl = () => new URLSearchParams(location.search).get('project');
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  const showNotice = (msg, type = 'error') => {
    let n = document.getElementById('ss-global-notice');
    if (!n) {
      n = document.createElement('div'); n.id = 'ss-global-notice';
      document.body.appendChild(n);
    }
    n.textContent = msg;
    n.style.background = type === 'error' ? 'var(--error)' : 'var(--accent)';
    n.classList.add('visible');
    setTimeout(() => n.classList.remove('visible'), 3000);
  };
  const copyToClipboard = (text) => navigator.clipboard.writeText(text).catch(() => {
    const ta = document.createElement('textarea'); ta.value = text;
    document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
  });

  // ─── INTERCEPTOR ──────────────────────────────────────────────────────────
  function listenForProjectId(cb) {
    window.addEventListener('message', (e) => {
      if (e.source !== window) return;
      if (e.data?.type === '__ss_project_id' && e.data?.id) cb(e.data.id);
      if (e.data?.type === '__ss_tokens' && e.data?.xsrf) state.xsrfToken = e.data.xsrf;
    });
  }

  // ─── API ──────────────────────────────────────────────────────────────────
  function bgFetch(url, method = 'GET', headers = {}, body = null) {
    return new Promise((resolve, reject) => {
      try {
        chrome.runtime.sendMessage({ type: 'API_REQUEST', url, method, headers, body }, (res) => {
          if (chrome.runtime.lastError) {
            const m = chrome.runtime.lastError.message;
            if (m.includes('context invalidated')) {
              return reject(new Error('Extension was updated 🔄 Please refresh this page to continue.'));
            }
            return reject(new Error(m));
          }
          if (!res?.ok) return reject(new Error(res?.error || `HTTP ${res?.status}`));
          resolve(res.data);
        });
      } catch (e) {
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

  async function searchTags(pid, term) {
    const preset = getPreset(pid);
    if (!preset?.apiToken) throw new Error('No API token. Open Settings ⚙');
    const all = []; let page = 1, tp = 1;
    while (page <= tp) {
      const d = await bgFetch(`https://api.smartsender.com/v1/tags?${new URLSearchParams({ page, limitation: 20, term })}`, 'GET', { 'Accept': 'application/json', 'Authorization': `Bearer ${preset.apiToken}` });
      all.push(...(d.collection || [])); tp = d.cursor?.pages ?? 1; page++;
    }
    const tl = term.toLowerCase().trim();
    const exact = all.filter(t => t.name.toLowerCase().trim() === tl);
    return { collection: exact.length ? exact : all.filter(t => t.name.toLowerCase().includes(tl)), isExact: exact.length > 0 };
  }

  async function countContacts(pid, tags, dv, dop) {
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
    const h = authHeaders();
    if (!h) throw new Error('No API token. Open Settings ⚙');
    const d = await bgFetch(`https://api.smartsender.com/v1/definitions?${new URLSearchParams({ page: 1, limitation: 20, term })}`, 'GET', h);
    return d.collection || [];
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
    const disp = document.getElementById('ss-project-display');
    const status = document.getElementById('ss-api-status');
    if (state.projectId) {
      const name = state.projectName || '—';
      if (disp) disp.innerHTML = `<span style="color:var(--text4);font-size:13px;">Project:</span> <span style="color:var(--success);font-weight:700;font-size:13px;">${name}</span> <span style="color:var(--text5);font-size:13px;">(id: ${state.projectId})</span>`;
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
    const nav = document.getElementById('ss-nav'); if (!nav) return;
    nav.innerHTML = `
      <div class="ss-section-label" style="padding: 0 16px; margin: 8px 0;">Workspace</div>
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
      <div class="ss-nav-item disabled">
        <span class="ss-nav-icon">${iLog}</span>
        <span>Log</span>
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
  }

  // ─── SETTINGS ─────────────────────────────────────────────────────────────
  function renderSettings() {
    const body = document.getElementById('ss-body');
    const presets = loadPresets();
    const themeIcon = state.theme === 'dark' ? '☀️' : '🌙';

    body.innerHTML = `
      <div style="margin-bottom:14px;">
        <div class="ss-section-label" style="margin-bottom:12px;">Appearance</div>
        <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:12px;">
          <div style="display:flex;flex-direction:column;gap:6px;align-items:center;">
            <span style="font-size:11px;color:var(--text5);font-family:'JetBrains Mono',monospace;text-transform:uppercase;letter-spacing:0.05em;line-height:1;">${state.theme === 'dark' ? 'Dark' : 'Light'} Mode</span>
            <label class="ss-theme-switch" title="Toggle Theme" style="flex-shrink:0;">
              <input type="checkbox" id="ss-theme-toggle-input"${state.theme === 'dark' ? ' checked' : ''}>
              <span class="ss-slider"></span>
            </label>
          </div>
        </div>
      </div>
      <div class="ss-divider"></div>
      <div style="margin:14px 0;">
        <div class="ss-section-label">Projects</div>
        <div style="display:flex;flex-direction:column;gap:6px;">
          ${presets.length === 0 ? `<div class="ss-empty">No presets — add one below</div>`
        : presets.map((p, i) => `
              <div class="ss-preset-card${state.projectId === p.projectId ? ' active' : ''}">
                <div class="ss-preset-info">
                  <div class="ss-preset-name">${esc(p.name || p.projectId)}</div>
                  <div class="ss-preset-meta">ID: ${p.projectId} · ${p.apiToken ? '<span style="color:var(--success);">access provided</span>' : '<span style="color:var(--text5);">⚠ no token</span>'}</div>
                </div>
                <button class="ss-preset-delete" data-index="${i}">×</button>
              </div>`).join('')}
        </div>
      </div>
      <div class="ss-divider"></div>
      <div style="margin-top:14px;">
        <div class="ss-section-label">Add / Update Preset</div>
        <label class="ss-field-label">Project name</label>
        <input class="ss-input" id="ss-preset-name" type="text" placeholder="newlook" style="margin-bottom:8px;" value="${state.projectName || ''}" />
        <label class="ss-field-label">Project ID</label>
        <input class="ss-input" id="ss-preset-pid" type="text" placeholder="86866" style="margin-bottom:8px;" value="${state.projectId || ''}" />
        <label class="ss-field-label">API Token</label>
        <input class="ss-input" id="ss-preset-token" type="password" placeholder="••••••••••••••••" style="margin-bottom:12px;" />
        <div id="ss-preset-msg" style="display:none;font-size:13px;margin-bottom:8px;font-family:monospace;"></div>
        <button class="ss-btn-primary" id="ss-preset-save">Save Preset</button>
      </div>
    `;

    document.getElementById('ss-theme-toggle-input').onchange = (e) => { applyTheme(e.target.checked ? 'dark' : 'light'); renderSettings(); };

    body.querySelectorAll('.ss-preset-delete').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const p = loadPresets(); p.splice(parseInt(btn.dataset.index), 1); savePresets(p);
        if (state.activePreset && !getPreset(state.projectId)) { state.activePreset = null; renderHeader(); }
        renderSettings();
      };
    });

    document.getElementById('ss-preset-save').onclick = () => {
      const name = document.getElementById('ss-preset-name').value.trim();
      const pid = document.getElementById('ss-preset-pid').value.trim();
      const token = document.getElementById('ss-preset-token').value.trim();
      const msg = document.getElementById('ss-preset-msg');
      if (!pid) { msg.textContent = '⚠ Project ID required'; msg.style.cssText = 'display:block;color:var(--error);font-size:13px;margin-bottom:8px;font-family:monospace;'; return; }
      const presets = loadPresets(); const idx = presets.findIndex(p => p.projectId === pid);
      // If updating existing preset and token is empty — keep old token
      const existingToken = idx >= 0 ? presets[idx].apiToken : '';
      const preset = { projectId: pid, apiToken: token || existingToken, name: name || pid };
      if (idx >= 0) presets[idx] = preset; else presets.push(preset);
      savePresets(presets);
      if (pid === state.projectId) { state.activePreset = preset; renderHeader(); }
      msg.textContent = '✅ Saved!'; msg.style.cssText = 'display:block;color:var(--success);font-size:13px;margin-bottom:8px;font-family:monospace;';
      setTimeout(() => { msg.style.display = 'none'; }, 2000);
      // Re-render but DON'T wipe the fields — just update preset list
      body.querySelectorAll('.ss-preset-card').forEach(c => c.remove());
      const listDiv = body.querySelector('[data-preset-list]');
      // Simplest: full re-render is fine since token is now saved
      renderSettings();
    };
  }

  // ─── TAGS TAB ─────────────────────────────────────────────────────────────
  function renderMain() {
    const body = document.getElementById('ss-body');
    body.innerHTML = `
      <div style="margin-bottom:14px;">
        <div class="ss-section-label">Tag search</div>
        <div style="display:flex;gap:6px;align-items:center;">
          <input class="ss-input" id="ss-tag-input" type="text" placeholder="tag name" autocomplete="off" style="flex:1;" />
          <button class="ss-btn-search" id="ss-btn-search" title="Search" style="width:44px;padding:0;justify-content:center;">${iSearch}</button>
        </div>
        <div class="ss-dropdown" id="ss-dropdown" style="margin-top:8px;"></div>
      </div>
      <div class="ss-error" id="ss-error"></div>
      <div class="ss-loading" id="ss-loading" style="display:none;"><div class="ss-spinner"></div><span class="ss-loading-text">Searching...</span></div>
    `;
    bindMainEvents();
  }


  function showDropdown(tags, term = '', isExact = false) {
    const iCopy = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
    const iDone = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;

    const dd = document.getElementById('ss-dropdown'); if (!dd) return; dd.innerHTML = '';
    if (!tags.length) { dd.innerHTML = `<div class="ss-dropdown-empty">No tags found</div>`; dd.classList.add('visible'); return; }
    const hint = document.createElement('div'); hint.className = 'ss-dropdown-hint';
    hint.textContent = isExact ? `✓ exact · ${tags.length}` : `~ partial · ${tags.length}`; dd.appendChild(hint);
    tags.forEach(tag => {
      let name = esc(tag.name);
      if (term) { const re = new RegExp(`(${term.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')})`, 'gi'); name = tag.name.replace(re, `<mark style="background:var(--mark-bg);color:var(--mark-text);border-radius:2px;padding:0 2px;">$1</mark>`); }
      const item = document.createElement('div'); item.className = 'ss-dropdown-item'; item.style.cursor = 'default';
      item.innerHTML = `<div style="min-width:0;flex:1;"><div class="ss-dropdown-item-name">${name}</div><div class="ss-dropdown-item-id" style="font-size:13px;color:var(--success);margin-top:4px;">ID: <b style="font-size:14px;">${tag.id}</b></div></div><button class="ss-var-btn ss-tag-copy-btn" title="Copy ID">${iCopy}</button>`;
      const copyBtn = item.querySelector('.ss-tag-copy-btn');
      copyBtn.onclick = (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(tag.id);
        copyBtn.innerHTML = iDone;
        copyBtn.style.color = 'var(--success)';
        setTimeout(() => { copyBtn.innerHTML = iCopy; copyBtn.style.color = ''; }, 1500);
      };
      dd.appendChild(item);
    });
    dd.classList.add('visible');
  }

  const closeDropdown = () => { const d = document.getElementById('ss-dropdown'); if (d) { d.classList.remove('visible'); d.innerHTML = ''; } };

  function showTagError(msg) { const el = document.getElementById('ss-error'); if (!el) return; el.textContent = `⚠ ${msg}`; el.classList.add('visible'); setTimeout(() => el.classList.remove('visible'), 4000); }
  function setLoading(v) { const el = document.getElementById('ss-loading'); if (el) el.classList.toggle('visible', v); }

  function bindMainEvents() {
    const searchBtn = document.getElementById('ss-btn-search'), tagInput = document.getElementById('ss-tag-input');
    async function doSearch() {
      const term = tagInput?.value.trim(); if (!term) return;
      if (!state.projectId) { showTagError('Project ID not determined'); return; }
      if (state.isSearching) return;
      state.isSearching = true;
      if (searchBtn) { searchBtn.disabled = true; searchBtn.innerHTML = '...'; }
      setLoading(true);
      closeDropdown();
      try {
        const data = await searchTags(state.projectId, term); const col = data.collection || [];
        showDropdown(col, term, data.isExact);
      } catch (err) { showTagError(err.message); }
      finally { state.isSearching = false; setLoading(false); if (searchBtn) { searchBtn.disabled = false; searchBtn.innerHTML = iSearch; } }
    }
    searchBtn?.addEventListener('click', doSearch);
    tagInput?.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); if (e.key === 'Escape') closeDropdown(); });
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
    const panel = document.getElementById('ss-info-panel');
    if (!panel) return;

    state.contactInfoOpen = true;
    state.contactInfoId = id;
    panel.classList.add('open');

    panel.innerHTML = `
      <div class="ss-info-header">
        <div class="ss-info-title">Contact Info</div>
        <button class="ss-close" id="ss-info-close">✕</button>
      </div>
      <div id="ss-info-search-sticky" style="padding:10px 16px;background:var(--bg-solid);border-bottom:1px solid var(--border);display:none;">
        <input class="ss-input" id="ss-info-var-search" type="text" placeholder="Filter variables..." style="font-size:13px;padding:6px 10px;height:28px;" />
      </div>
      <div class="ss-info-body" id="ss-info-body">
        <div class="ss-loading" style="display:flex;"><div class="ss-spinner"></div><span class="ss-loading-text">Loading details...</span></div>
      </div>
    `;

    document.getElementById('ss-info-close').onclick = () => {
      state.contactInfoOpen = false;
      panel.classList.remove('open');
    };

    fetchContactInfo(id).then(data => {
      if (state.contactInfoId !== id) return;
      state.contactInfo = data;
      const body = document.getElementById('ss-info-body');
      if (!body) return;

      const standardKeys = ['id', 'name', 'firstName', 'lastName', 'fullName', 'email', 'phone', 'photo', 'createdAt', 'notes', 'tags', 'values', 'thumb', 'updatedAt', 'system_city', 'system_country', 'system_continent', 'system_timezone', 'system_os', 'system_browser', 'is_active', 'userId', 'projectId'];

      let vars = (data.values || []).map(v => ({ name: v.name, value: v.value }));
      // Extract root level keys as fallback/addition
      Object.keys(data).forEach(k => {
        if (!standardKeys.includes(k) && data[k] !== null && typeof data[k] !== 'object') {
          if (!vars.find(v => v.name === k)) vars.push({ name: k, value: data[k] });
        }
      });

      const renderVars = (filter = '') => {
        const terms = filter.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
        const filtered = vars.filter(v => {
          if (!terms.length) return true;
          const vn = v.name.toLowerCase();
          const vv = String(v.value).toLowerCase();
          return terms.some(t => vn.includes(t) || vv.includes(t));
        });
        return filtered.map(v => {
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
        }).join('') || '<div class="ss-hint">No matching variables</div>';
      };

      const tagsHtml = (data.tags || []).map(t => `<span class="ss-info-tag" title="Created: ${t.createdAt}">${esc(t.name)}</span>`).join('');

      body.innerHTML = `
        ${state.contactSettings.showProfile ? `
        <div class="ss-info-section" style="display:flex;align-items:center;gap:12px;background:var(--bg2);padding:12px;border-radius:12px;margin-bottom:16px;">
          ${data.photo ? `<img src="${data.photo}" style="width:48px;height:48px;border-radius:50%;object-fit:cover;border:2px solid var(--border);">` : `<div style="width:48px;height:48px;border-radius:50%;background:var(--bg3);display:flex;align-items:center;justify-content:center;font-size:20px;">👤</div>`}
          <div style="flex:1;overflow:hidden;">
            <div style="font-weight:800;font-size:16px;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:flex;align-items:center;">
              <span style="overflow:hidden;text-overflow:ellipsis;">${esc(data.fullName || data.name || 'Unnamed')}</span>
              ${getFullProjectFromUrl() ? `<a href="https://messenger.smartsender.com/chats?project=${getFullProjectFromUrl()}&selectedContactId=${data.id}" target="_blank" title="Open chat" style="color:var(--text4);text-decoration:none;display:inline-flex;margin-left:8px;flex-shrink:0;">${iExternal}</a>` : ''}
            </div>
            <div style="font-size:13px;color:var(--text4);font-family:'JetBrains Mono',monospace;">ID: ${data.id}</div>
          </div>
        </div>
        ` : ''}

        ${state.contactSettings.showDetails ? `
        <div class="ss-info-section">
          <div class="ss-info-label">Basic Data</div>
          ${data.email ? `<div class="ss-info-detail-row" title="Email: ${esc(data.email)}"><span class="ss-info-detail-label">Email</span><div class="ss-info-detail-value"><span>${esc(data.email)}</span><button class="ss-info-copy-btn" data-copy="${esc(data.email)}" title="Copy email">${iCopy}</button></div></div>` : ''}
          ${data.phone ? `<div class="ss-info-detail-row" title="Phone: ${esc(data.phone)}"><span class="ss-info-detail-label">Phone</span><div class="ss-info-detail-value"><span>${esc(data.phone)}</span><button class="ss-info-copy-btn" data-copy="${esc(data.phone)}" title="Copy phone">${iCopy}</button></div></div>` : ''}
          <div class="ss-info-detail-row" title="Created: ${new Date(data.createdAt).toLocaleString()}"><span class="ss-info-detail-label">Created</span><div class="ss-info-detail-value"><span>${new Date(data.createdAt).toLocaleDateString()}</span><button class="ss-info-copy-btn" data-copy="${new Date(data.createdAt).toLocaleDateString()}" title="Copy date">${iCopy}</button></div></div>
        </div>
        ` : ''}
        
        ${state.contactSettings.showTags ? `
        <div class="ss-info-section">
          <div class="ss-info-label">Tags (${(data.tags || []).length})</div>
          <div class="ss-info-tags">${tagsHtml || '<div class="ss-hint">No tags assigned</div>'}</div>
        </div>
        ` : ''}
        
        ${state.contactSettings.showVars ? `
        <div class="ss-info-section">
          <div class="ss-info-label">Variables (${vars.length})</div>
          <div class="ss-info-vars" id="ss-info-vars-list">${renderVars()}</div>
        </div>
        ` : ''}
      `;

      const vSearch = document.getElementById('ss-info-var-search');
      const vSearchSticky = document.getElementById('ss-info-search-sticky');
      if (vSearchSticky) vSearchSticky.style.display = state.contactSettings.showVars ? 'block' : 'none';

      if (vSearch) {
        vSearch.value = ''; // Reset on open
        vSearch.oninput = (e) => {
          document.getElementById('ss-info-vars-list').innerHTML = renderVars(e.target.value);
          bindExpand();
        };
      }

      const bindExpand = () => {
        body.querySelectorAll('.ss-info-detail-row, .ss-info-var').forEach(el => {
          el.onclick = (e) => {
            if (e.target.closest('input') || e.target.closest('button')) return;
            e.stopPropagation(); el.classList.toggle('expanded');
          };
          el.querySelectorAll('.ss-info-copy-btn[data-copy]').forEach(btn => {
            btn.onclick = (e) => {
              e.stopPropagation();
              const text = btn.dataset.copy;
              navigator.clipboard.writeText(text);
              const old = btn.innerHTML; btn.innerHTML = iDone;
              setTimeout(() => btn.innerHTML = old, 1500);
            };
          });

          el.querySelector('.ss-cvar-edit')?.addEventListener('click', (e) => {
            e.stopPropagation();
            state.contactVarEditingKey = e.currentTarget.dataset.key;
            document.getElementById('ss-info-vars-list').innerHTML = renderVars(vSearch?.value || '');
            bindExpand();
            setTimeout(() => body.querySelector('.ss-cvar-input')?.focus(), 30);
          });

          el.querySelector('.ss-cvar-cancel')?.addEventListener('click', (e) => {
            e.stopPropagation();
            state.contactVarEditingKey = null;
            document.getElementById('ss-info-vars-list').innerHTML = renderVars(vSearch?.value || '');
            bindExpand();
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

          // Handle Enter key for save
          el.querySelector('.ss-cvar-input')?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') el.querySelector('.ss-cvar-save')?.click();
            if (e.key === 'Escape') el.querySelector('.ss-cvar-cancel')?.click();
          });
        });
      };
      bindExpand();
    }).catch(err => {
      const body = document.getElementById('ss-info-body');
      if (body) body.innerHTML = `<div class="ss-error visible">⚠ ${err.message}</div>`;
    });
  }

  function renderContactsTab() {
    const body = document.getElementById('ss-body');
    body.innerHTML = `
      <div style="margin-bottom:12px;">
        <div class="ss-section-label">Contact search</div>
        <div style="display:flex;gap:6px;align-items:center;margin-bottom:8px;">
          <input class="ss-input" id="ss-contact-input" type="text" placeholder="Email or User ID" autocomplete="off" style="flex:1;" />
          <button class="ss-btn-search" id="ss-contact-btn" title="Search" style="width:44px;padding:0;justify-content:center;">${iSearch}</button>
          <button class="ss-btn-search" id="ss-contact-reset-btn" title="Reset Search" style="width:44px;padding:0;justify-content:center;background:var(--bg3);color:var(--text4);">${iReset}</button>
        </div>
        <div style="display:flex;gap:6px;align-items:center;">
          <button class="ss-action-btn" id="ss-contact-hist-btn">History</button>
          <button class="ss-action-btn" id="ss-contact-settings-btn">Options</button>
          <button class="ss-action-btn" id="ss-contact-fav-btn">Favorite</button>
        </div>
      </div>
      <div id="ss-contact-list" style="display:flex;flex-direction:column;gap:6px;"></div>
      <div class="ss-error" id="ss-contact-error"></div>
      <div class="ss-loading" id="ss-contact-loading" style="display:none;"><div class="ss-spinner"></div><span class="ss-loading-text">Searching...</span></div>
    `;
    renderContacts();
    bindContactsEvents();
  }

  function bindContactsEvents() {
    const input = document.getElementById('ss-contact-input');
    const btn = document.getElementById('ss-contact-btn');
    const load = document.getElementById('ss-contact-loading');
    const errEl = document.getElementById('ss-contact-error');
    const histBtn = document.getElementById('ss-contact-hist-btn');
    const histPanel = document.getElementById('ss-contact-search-hist');
    const favBtn = document.getElementById('ss-contact-fav-btn');
    const favPanel = document.getElementById('ss-contact-fav-panel');
    const setBtn = document.getElementById('ss-contact-settings-btn');
    const setPanel = document.getElementById('ss-contact-settings-panel');

    const toggleHist = () => {
      state.contactShowSearchHist = !state.contactShowSearchHist;
      if (!state.contactShowSearchHist) {
        document.getElementById('ss-contact-search-hist').classList.remove('open');
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
            <button class="ss-close" id="ss-close-hist-btn">✕</button>
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
    const resetBtn = document.getElementById('ss-contact-reset-btn');
    if (resetBtn) resetBtn.onclick = doReset;
    if (input) input.onkeydown = (e) => { if (e.key === 'Enter') doSearch(); };

    document.addEventListener('click', (e) => {
      const target = e.target;
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
    const p = document.getElementById('ss-contact-fav-panel'); if (!p) return;
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
          <button class="ss-close" id="ss-close-fav-btn">✕</button>
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
        document.getElementById('ss-contact-fav-btn').classList.remove('active');
      };
      
      const filterInput = p.querySelector('#ss-fav-filter');
      filterInput.focus();
      filterInput.oninput = (e) => renderFavList(e.target.value);

      p.querySelectorAll('.ss-hist-term[data-id]').forEach(el => {
        el.onclick = () => {
          document.getElementById('ss-contact-input').value = el.dataset.id;
          state.contactShowFavorites = false;
          p.classList.remove('open');
          document.getElementById('ss-contact-fav-btn').classList.remove('active');
          const btn = document.getElementById('ss-contact-btn');
          if (btn) btn.click();
        };
      });
    };

    renderFavList();
  }

  function renderContactSettingsPanel() {
    const p = document.getElementById('ss-contact-settings-panel'); if (!p) return;
    p.innerHTML = `
      <div class="ss-info-header">
        <div class="ss-info-title">Options</div>
        <button class="ss-close" onclick="document.getElementById('ss-contact-settings-btn').click()">✕</button>
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
        <div style="height:1px;background:var(--border);margin:4px 0;"></div>
        <div class="ss-settings-item" id="ss-toggle-compact">
          <span>Compact Search Cards</span>
          <div class="ss-settings-check ${state.contactSettings.compactCards ? 'active' : ''}">${state.contactSettings.compactCards ? '✓' : ''}</div>
        </div>
      </div>
    `;
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
    const list = document.getElementById('ss-contact-list'); if (!list) return;
    list.innerHTML = '';
    if (!state.contactResults.length) {
      if (state.contactSearchPerformed) list.innerHTML = `<div class="ss-empty">No contacts found</div>`;
      return;
    }

    state.contactResults.forEach(c => {
      const card = document.createElement('div'); card.className = 'ss-var-card';
      card.style.padding = '12px';
      card.onclick = () => {
        renderContactInfoPanel(c.id);
        toggleSidePanel('ss-info-panel');
      };

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
        navigator.clipboard.writeText(btn.dataset.copy);
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
      };

      list.appendChild(card);
    });
  }


  // ─── VARS TAB ─────────────────────────────────────────────────────────────

  function renderVarsTab() {
    const body = document.getElementById('ss-body');
    body.innerHTML = `
      <div style="margin-bottom:12px;">
        <div class="ss-section-label">Variable search</div>
        <div style="display:flex;gap:6px;align-items:center;margin-bottom:8px;">
          <input class="ss-input" id="ss-var-input" type="text" placeholder="name1, name2, name3" autocomplete="off" style="flex:1;" />
          <button class="ss-btn-search" id="ss-var-btn" title="Search" style="width:44px;padding:0;justify-content:center;">${iSearch}</button>
          <button class="ss-btn-search" id="ss-var-reset-btn" title="Reset Search" style="width:44px;padding:0;justify-content:center;background:var(--bg3);color:var(--text4);">${iReset}</button>
        </div>
        <div style="display:flex;gap:6px;align-items:center;">
          <button class="ss-action-btn" id="ss-var-hist-btn">History</button>
          <button class="ss-action-btn" id="ss-var-preset-btn">Presets</button>
          <button class="ss-action-btn" id="ss-var-fav-tab-btn">Favorites</button>
        </div>
      </div>
      <div id="ss-var-list" style="display:flex;flex-direction:column;gap:6px;"></div>
      <div class="ss-error" id="ss-var-error"></div>
      <div class="ss-loading" id="ss-var-loading" style="display:none;"><div class="ss-spinner"></div><span class="ss-loading-text">Searching...</span></div>
    `;

    const input = document.getElementById('ss-var-input');
    const btn = document.getElementById('ss-var-btn');
    const listEl = document.getElementById('ss-var-list');
    const errEl = document.getElementById('ss-var-error');
    const loadEl = document.getElementById('ss-var-loading');
    const histPanel = document.getElementById('ss-var-search-hist');
    const presetsPanel = document.getElementById('ss-var-presets-panel');
    const favPanel = document.getElementById('ss-var-fav-panel');

    const showVarErr = (msg) => { errEl.textContent = `⚠ ${msg}`; errEl.classList.add('visible'); setTimeout(() => errEl.classList.remove('visible'), 5000); };

    // ── Search history panel ──
    function toggleSearchHist() {
      state.varShowSearchHist = !state.varShowSearchHist;
      if (!state.varShowSearchHist) {
        histPanel.classList.remove('open');
        document.getElementById('ss-var-hist-btn').classList.remove('active');
        return;
      }
      
      state.varPresetsOpen = false; presetsPanel.classList.remove('open'); document.getElementById('ss-var-preset-btn').classList.remove('active');
      state.varShowFavorites = false; favPanel.classList.remove('open'); document.getElementById('ss-var-fav-tab-btn').classList.remove('active');

      document.getElementById('ss-var-hist-btn').classList.add('active');
      const hist = loadSearchHist(state.projectId);
      
      const renderHistList = (filter = '') => {
        const filtered = hist.filter(t => t.toLowerCase().includes(filter.toLowerCase()));
        const listHtml = filtered.length 
          ? filtered.map((t, i) => `<div class="ss-hist-term" data-term="${esc(t)}">${esc(t)}</div>`).join('')
          : `<div class="ss-hist-term" style="opacity:0.5;cursor:default;">${filter ? 'No matches' : 'No history'}</div>`;
        
        histPanel.innerHTML = `
          <div class="ss-info-header">
            <div class="ss-info-title">Search History</div>
            <button class="ss-close" onclick="document.getElementById('ss-var-hist-btn').click()">✕</button>
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
        document.getElementById('ss-var-preset-btn').classList.remove('active');
        return;
      }

      state.varShowSearchHist = false;
      histPanel.classList.remove('open');
      document.getElementById('ss-var-hist-btn').classList.remove('active');
      state.varShowFavorites = false;
      favPanel.classList.remove('open');
      document.getElementById('ss-var-fav-tab-btn').classList.remove('active');

      document.getElementById('ss-var-preset-btn').classList.add('active');
      toggleSidePanel('ss-var-presets-panel');

      const pid = state.projectId;
      function drawPresets() {
        const ps = loadVarPresets(pid);
        presetsPanel.innerHTML = `
          <div class="ss-info-header">
            <div class="ss-info-title">Presets</div>
            <div style="display:flex;gap:4px;align-items:center;">
              <button class="ss-var-btn" id="ss-preset-add-btn" title="New preset">${iSave}</button>
              <button class="ss-close" onclick="document.getElementById('ss-var-preset-btn').click()">✕</button>
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
                <button class="ss-var-btn ss-vpreset-config" data-pi="${i}" title="Configure Preset">${iGear}</button>
                <button class="ss-var-btn ss-vpreset-edit" data-pi="${i}" title="Rename">${iPen}</button>
                <button class="ss-var-btn ss-vpreset-copy" data-pi="${i}" title="Copy">${iCopy}</button>
                <button class="ss-var-btn ss-vpreset-delete" data-pi="${i}" title="Delete">${iTrash}</button>
              </div>
              ${state.varPresetConfigPanelId === i ? `
                <div style="padding:6px 10px;background:var(--bg4);border-bottom:1px solid var(--border);">
                  <div style="font-size:13px;font-weight:600;margin-bottom:6px;">Variables inside ${esc(p.name)}</div>
                  <div id="ss-preset-cfg-list-${i}" style="margin-bottom:8px;font-size:13px;color:var(--text3);max-height:120px;overflow-y:auto;">
                      Loading variables...
                  </div>
                  <div style="display:flex;gap:4px;">
                    <input class="ss-input" id="ss-cfg-add-id-${i}" placeholder="ID" style="width:60px;font-size:13px;" />
                    <input class="ss-input" id="ss-cfg-add-name-${i}" placeholder="Name" style="flex:1;font-size:13px;" />
                    <button class="ss-var-btn" id="ss-cfg-add-btn-${i}" title="Add by ID">${iSave}</button>
                  </div>
                </div>
              ` : ''}
              `).join('')}
          <!-- Save current results as preset -->
          ${state.varResults.length > 0 ? `
            <div style="padding:8px 10px;border-top:1px solid var(--border);">
              <div style="display:flex;gap:6px;align-items:center;">
                <input class="ss-input" id="ss-new-preset-name" placeholder="Preset name" style="flex:1;padding:6px 8px;font-size:13px;" />
                <button class="ss-var-btn ss-new-preset-save" title="Save">${iSave}</button>
              </div>
            </div>`: ''}
        `;

        // Add new preset
        presetsPanel.querySelector('#ss-preset-add-btn')?.addEventListener('click', () => {
          document.getElementById('ss-new-preset-name')?.focus();
        });

        // Save new preset from current results
        presetsPanel.querySelector('.ss-new-preset-save')?.addEventListener('click', () => {
          const nameEl = document.getElementById('ss-new-preset-name');
          const name = nameEl?.value.trim();
          if (!name) { nameEl?.focus(); return; }
          const ps = loadVarPresets(pid);
          ps.push({
            name,
            ids: state.varResults.map(d => d.id),
            items: state.varResults.map(d => ({ id: d.id, name: d.name })),
            ts: new Date().toISOString()
          });
          saveVarPresets(pid, ps);
          drawPresets();
        });

        // Copy preset
        presetsPanel.querySelectorAll('.ss-vpreset-copy').forEach(b => {
          b.addEventListener('click', (e) => {
            e.stopPropagation();
            const pi = parseInt(b.dataset.pi);
            const ps = loadVarPresets(pid);
            ps.push({ name: ps[pi].name + ' (copy)', ids: [...ps[pi].ids], ts: new Date().toISOString() });
            saveVarPresets(pid, ps);
            drawPresets();
          });
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
          const listDiv = document.getElementById(`ss-preset-cfg-list-${pi}`);
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

          const addBtn = document.getElementById(`ss-cfg-add-btn-${pi}`);
          if (addBtn) {
            addBtn.addEventListener('click', () => {
              const idVal = parseInt(document.getElementById(`ss-cfg-add-id-${pi}`).value.trim());
              const nameVal = document.getElementById(`ss-cfg-add-name-${pi}`).value.trim() || 'Custom Variable';
              if (!idVal) return;
              if (!p.ids.includes(idVal)) {
                p.ids.push(idVal);
                if (!p.items) p.items = [];
                p.items.push({ id: idVal, name: nameVal });
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
            state.varPresetsOpen = false; presetsPanel.classList.remove('open'); state.varPresetConfigPanelId = null;
            btn.disabled = true; btn.textContent = '...'; loadEl.style.display = 'flex';
            listEl.innerHTML = ''; state.varResults = []; state.varEditingId = null; state.varShowHistoryId = null;
            state.varViewingPresetId = pi;
            try {
              const results = await fetchDefinitionsByIds(preset.ids);
              state.varResults = preset.ids.map(id => results.find(r => r.id === id)).filter(Boolean);
              renderVarList(listEl, showVarErr);
            } catch (err) { showVarErr(err.message); }
            finally { btn.disabled = false; btn.innerHTML = iSearch; loadEl.style.display = 'none'; }
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
        document.getElementById('ss-var-fav-tab-btn').classList.remove('active');
        return;
      }
      
      state.varPresetsOpen = false; presetsPanel.classList.remove('open'); document.getElementById('ss-var-preset-btn').classList.remove('active');
      state.varShowSearchHist = false; histPanel.classList.remove('open'); document.getElementById('ss-var-hist-btn').classList.remove('active');

      document.getElementById('ss-var-fav-tab-btn').classList.add('active');
      const favs = loadVarFavorites();
      
      const renderFavList = (filter = '') => {
        const filtered = favs.filter(f => f.name.toLowerCase().includes(filter.toLowerCase()) || f.id.toString().includes(filter));
        const listHtml = filtered.length 
          ? filtered.map((f, i) => `<div class="ss-hist-term" data-index="${favs.indexOf(f)}">${esc(f.name)} <span style="font-size:11px;color:var(--text4);margin-left:auto;">${f.id}</span></div>`).join('')
          : `<div class="ss-hist-term" style="opacity:0.5;cursor:default;">${filter ? 'No matches' : 'No favorites yet'}</div>`;

        favPanel.innerHTML = `
          <div class="ss-info-header">
            <div class="ss-info-title">Favorites</div>
            <button class="ss-close" onclick="document.getElementById('ss-var-fav-tab-btn').click()">✕</button>
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
      finally { btn.disabled = false; btn.innerHTML = iSearch; loadEl.style.display = 'none'; }
    }

    btn.onclick = doSearch;
    input.onkeydown = (e) => { if (e.key === 'Enter') doSearch(); };

    document.getElementById('ss-var-hist-btn').onclick = (e) => { e.stopPropagation(); toggleSearchHist(); };
    document.getElementById('ss-var-preset-btn').onclick = (e) => { e.stopPropagation(); renderPresetsPanel(); };
    document.getElementById('ss-var-fav-tab-btn').onclick = (e) => { e.stopPropagation(); toggleFavPanel(); };
    document.getElementById('ss-var-reset-btn').onclick = () => {
      input.value = '';
      state.varResults = []; state.varEditingId = null; state.varShowHistoryId = null; state.varPresetPanelId = null;
      state.varViewingPresetId = null;
      listEl.innerHTML = '';
      histPanel.classList.remove('open'); state.varShowSearchHist = false;
      presetsPanel.classList.remove('open'); state.varPresetsOpen = false;
      favPanel.classList.remove('open'); state.varShowFavorites = false;
      document.querySelectorAll('.ss-action-btn').forEach(b => b.classList.remove('active'));
    };

    // Close panels on outside click
    document.addEventListener('click', (e) => {
      const target = e.target;
      if (state.varShowSearchHist && !histPanel.contains(target) && target.id !== 'ss-var-hist-btn') {
        state.varShowSearchHist = false; histPanel.classList.remove('open');
        document.getElementById('ss-var-hist-btn')?.classList.remove('active');
      }
      if (state.varPresetsOpen && !presetsPanel.contains(target) && target.id !== 'ss-var-preset-btn') {
        state.varPresetsOpen = false; presetsPanel.classList.remove('open');
        document.getElementById('ss-var-preset-btn')?.classList.remove('active');
      }
      if (state.varShowFavorites && !favPanel.contains(target) && target.id !== 'ss-var-fav-tab-btn') {
        state.varShowFavorites = false; favPanel.classList.remove('open');
        document.getElementById('ss-var-fav-tab-btn')?.classList.remove('active');
      }
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
            <div class="ss-var-panel-label" style="padding:8px 10px 4px;">Add / Remove from preset</div>
            <div style="padding:0 10px 6px;">
              <input class="ss-input ss-preset-search-input" placeholder="Filter presets..." style="padding:5px 8px;font-size:13px;" />
            </div>
            <div class="ss-preset-list-inner">
              ${ps.length === 0 ? `<div class="ss-empty" style="border:none;padding:6px 10px;font-size:13px;">No presets yet</div>`
            : inPresets.map(p => `
                  <div class="ss-preset-toggle-row" data-pi="${p.i}">
                    <span class="ss-preset-toggle-name">${esc(p.name)}</span>
                    <span class="ss-preset-toggle-count">${p.ids.length}</span>
                    <button class="ss-var-btn ss-preset-toggle-btn${p.has ? ' active' : ''}" data-pi="${p.i}" data-has="${p.has}" title="${p.has ? 'Remove from preset' : 'Add to preset'}">
                      ${p.has ? iDone : `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`}
                    </button>
                  </div>`).join('')}
            </div>
            <div style="padding:6px 10px 8px;border-top:1px solid var(--border);">
              <div style="display:flex;gap:6px;">
                <input class="ss-input ss-new-preset-from-card" placeholder="New preset name..." style="flex:1;padding:5px 8px;font-size:13px;" />
                <button class="ss-var-btn ss-new-preset-from-card-btn" title="Create & add">${iSave}</button>
              </div>
            </div>
          </div>
        `;
      }

      card.innerHTML = `
        <div class="ss-var-card-main">
          <div class="ss-var-info">
            <div class="ss-var-name" style="display:flex;align-items:center;">
              <button class="ss-var-btn ss-fav-var-btn" data-action="fav" data-id="${def.id}" title="${state.varFavorites.some(f => f.id == def.id) ? 'Remove from favorites' : 'Add to favorites'}" style="margin-right:6px; color:${state.varFavorites.some(f => f.id == def.id) ? 'var(--accent)' : 'var(--border2)'};">
                 ${state.varFavorites.some(f => f.id == def.id) ? iStarFill : iStar}
              </button>
              ${esc(def.name)}
            </div>
            <div class="ss-var-value-preview">${esc(def.value || '—')}</div>
          </div>
          <div class="ss-var-actions">
            ${isEditing ? `
              <button class="ss-var-btn ss-var-btn-history${showHist ? ' active' : ''}" data-action="history" data-id="${def.id}" title="Edit history">${iHistory}</button>
              <button class="ss-var-btn ss-var-btn-copy" data-action="copy-edit" data-id="${def.id}" title="Copy">${iCopy}</button>
              <button class="ss-var-btn ss-var-btn-reset" data-action="reset" data-id="${def.id}" title="Reset">${iReset}</button>
              <button class="ss-var-btn ss-var-btn-done" data-action="save" data-id="${def.id}" title="Save">${iDone}</button>
            `: `
              <button class="ss-var-btn ss-var-btn-copy-name" data-action="copy-name" data-id="${def.id}" title="Copy Name">${iKey}</button>
              <button class="ss-var-btn ss-var-btn-copy" data-action="copy" data-id="${def.id}" title="Copy Value">${iCopy}</button>
              <button class="ss-var-btn ss-var-btn-addpreset${showPresetPanel ? ' active' : ''}" data-action="addpreset" data-id="${def.id}" title="Add to preset">${iAddToPreset}</button>
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
          setTimeout(() => { const ta = document.getElementById(`ss-var-edit-${def.id}`); if (ta) { ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); } }, 30);
        }
      });

      card.querySelectorAll('.ss-history-item').forEach(item => {
        item.addEventListener('click', () => {
          const h = loadVarHistory(state.projectId, def.id)[parseInt(item.dataset.hi)];
          if (!h) return; const ta = document.getElementById(`ss-var-edit-${def.id}`); if (ta) ta.value = h.value;
        });
      });

      // Preset panel interactions
      function bindPresetPanel() {
        const panel = card.querySelector('.ss-card-preset-panel'); if (!panel) return;

        // Filter presets
        panel.querySelector('.ss-preset-search-input')?.addEventListener('input', (e) => {
          const q = e.target.value.toLowerCase();
          panel.querySelectorAll('.ss-preset-toggle-row').forEach(row => {
            const name = row.querySelector('.ss-preset-toggle-name')?.textContent.toLowerCase() || '';
            row.style.display = name.includes(q) ? '' : 'none';
          });
        });

        // Toggle add/remove
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
            }
            else {
              if (!ps[pi].ids.includes(def.id)) {
                ps[pi].ids.push(def.id);
                if (!ps[pi].items) ps[pi].items = [];
                ps[pi].items.push({ id: def.id, name: def.name });
              }
            }
            saveVarPresets(pid, ps);
            // Re-render just this card's preset panel
            state.varPresetPanelId = def.id;
            renderVarList(listEl, showVarErr);
          });
        });

        // Create new preset and add this var
        panel.querySelector('.ss-new-preset-from-card-btn')?.addEventListener('click', (e) => {
          e.stopPropagation();
          const inp = panel.querySelector('.ss-new-preset-from-card');
          const name = inp?.value.trim(); if (!name) return;
          const ps = loadVarPresets(pid);
          ps.push({ name, ids: [def.id], items: [{ id: def.id, name: def.name }], ts: new Date().toISOString() });
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
          if (state.varShowFavorites) {
            document.getElementById('ss-var-fav-tab-btn')?.click();
            document.getElementById('ss-var-fav-tab-btn')?.click();
          }
          return;
        }

        if (action === 'copy-name') {
          copyToClipboard(def.name);
          const old = btn.innerHTML; btn.innerHTML = iDone;
          setTimeout(() => btn.innerHTML = old, 1500);
        }

        if (action === 'copy') { copyToClipboard(def.value || ''); btn.style.color = 'var(--success)'; setTimeout(() => btn.style.color = '', 1500); }
        if (action === 'copy-edit') { const ta = document.getElementById(`ss-var-edit-${id}`); copyToClipboard(ta?.value || def.value || ''); btn.style.color = 'var(--success)'; setTimeout(() => btn.style.color = '', 1500); }
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
        if (action === 'edit') { state.varEditingId = id; state.varShowHistoryId = null; state.varPresetPanelId = null; renderVarList(listEl, showVarErr); setTimeout(() => { const ta = document.getElementById(`ss-var-edit-${id}`); if (ta) { ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); } }, 30); }
        if (action === 'reset') { state.varEditingId = null; state.varShowHistoryId = null; renderVarList(listEl, showVarErr); }
        if (action === 'history') { state.varShowHistoryId = state.varShowHistoryId === id ? null : id; renderVarList(listEl, showVarErr); }

        if (action === 'save') {
          const ta = document.getElementById(`ss-var-edit-${id}`); if (!ta) return;
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
    document.querySelectorAll('.ss-extra-panel').forEach(p => p.classList.remove('open'));
    document.querySelectorAll('.ss-action-btn, .ss-var-btn').forEach(b => b.classList.remove('active'));
    state.contactShowSearchHist = false; state.contactShowFavorites = false; state.contactSettingsOpen = false;
    state.varShowSearchHist = false; state.varPresetsOpen = false;
  }

  // ─── SWITCH ───────────────────────────────────────────────────────────────
  function switchView(view) {
    closeAllExtraPanels();
    state.view = view;
    const sb = document.getElementById('ss-settings-btn'), bb = document.getElementById('ss-back-btn');
    const nav = document.getElementById('ss-nav'), hb = document.getElementById('ss-header-bottom');
    const labelEl = document.getElementById('ss-current-tab-label');

    if (view === 'settings') {
      sb && (sb.style.display = 'none'); bb && (bb.style.display = 'flex');
      if (nav) nav.classList.remove('open'); if (hb) hb.style.display = 'none';
      if (labelEl) labelEl.textContent = 'Preference';
      renderSettings();
    } else {
      sb && (sb.style.display = 'flex'); bb && (bb.style.display = 'none');
      if (hb) hb.style.display = 'flex';
      
      if (labelEl) {
        let label = 'Variables';
        if (state.activeTab === 'tags') label = 'Tags';
        if (state.activeTab === 'contacts') label = 'Contacts';
        labelEl.textContent = label;
      }

      if (state.activeTab === 'tags') renderMain();
      else if (state.activeTab === 'contacts') renderContactsTab();
      else renderVarsTab();
    }
  }

  function switchTab(tab) {
    if (state.view === 'settings') switchView('main');
    state.activeTab = tab; saveLastTab(state.projectId, tab);
    let label = 'Variables';
    if (tab === 'tags') label = 'Tags';
    if (tab === 'contacts') label = 'Contacts';
    document.getElementById('ss-current-tab-label').textContent = label;
    renderNav();
    updateExternalLink(tab);
    if (tab === 'tags') renderMain();
    else if (tab === 'contacts') renderContactsTab();
    else renderVarsTab();
  }

  function updateExternalLink(tab) {
    const link = document.getElementById('ss-tab-external-link');
    const fullProject = getFullProjectFromUrl();
    if (link && fullProject) {
      let path = 'home';
      if (tab === 'tags') path = 'tags';
      if (tab === 'contacts') path = 'contacts';
      if (tab === 'vars') path = 'definitions';
      link.href = `https://console.smartsender.com/${path}?project=${fullProject}`;
      link.style.display = 'inline-flex';
    } else if (link) {
      link.style.display = 'none';
    }
  }

  // ─── BUILD SIDEBAR ────────────────────────────────────────────────────────
  function buildSidebar() {
    const s = document.createElement('div'); s.id = 'ss-sidebar';
    s.innerHTML = `
      <div id="ss-resize-handle"></div>
      <div class="ss-header">
        <div class="ss-header-top" style="align-items:center;margin-bottom:6px;">
          <div style="display:flex;align-items:center;gap:12px;">
            <button class="ss-icon-btn" id="ss-burger" title="Navigation Menu" style="width:44px;height:44px;background:none;border-radius:12px;display:flex;align-items:center;justify-content:center;color:var(--text2);padding:0;">
              ${iMenu}
            </button>
            <div style="display:flex;align-items:center;">
              <span id="ss-current-tab-label" style="font-size:28px;font-weight:700;color:var(--text2);letter-spacing:-0.02em;">Variables</span>
              <a id="ss-tab-external-link" target="_blank" title="Open in SmartSender" style="display:none;color:var(--text4);margin-left:10px;text-decoration:none;transition:color 0.2s;">
                ${iExternal.replace('width="16" height="16"', 'width="22" height="22"')}
              </a>
            </div>
          </div>
          <div style="display:flex;gap:8px;align-items:center;">
            <button class="ss-icon-btn" id="ss-back-btn" title="Back to Tabs" style="display:none;">${iBack}</button>
            <button class="ss-icon-btn" id="ss-settings-btn" title="Settings">${iGear.replace('width="12" height="12"', 'width="18" height="18"')}</button>
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
      <div class="ss-body" id="ss-body"></div>
      <div class="ss-footer" style="padding:10px 16px;">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;">
           <div style="display:flex;align-items:center;gap:8px;">
             <div class="ss-title" style="margin:0;">my<span>Sender</span></div>
             <div style="font-size:9px;color:var(--text5);font-family:'JetBrains Mono',monospace;margin-top:4px;">v${chrome.runtime.getManifest().version}</div>
             <div id="ss-api-status" style="display:none;font-size:10px;background:var(--error);color:white;padding:2px 6px;border-radius:4px;font-weight:700;text-transform:uppercase;">api key</div>
           </div>
           <div class="ss-project-badge" id="ss-project-container" style="margin:0;flex-shrink:0;"><span id="ss-project-display">—</span></div>
        </div>
      </div>
    `;
    return s;
  }

  // ─── INIT ─────────────────────────────────────────────────────────────────
  function init() {
    if (document.getElementById('ss-sidebar')) return;
    const sidebar = buildSidebar();
    document.body.appendChild(sidebar);
    sidebar.style.width = loadSidebarWidth() + 'px';
    applyTheme(state.theme);

    function refreshProjectContext() {
      const name = getProjectFromUrl();
      if (name !== state.projectName) {
        state.projectName = name;
        renderHeader();
        updateExternalLink(state.activeTab);
      }
    }
    state.projectName = getProjectFromUrl();

    listenForProjectId((id) => {
      if (id === state.projectId) return;
      state.projectId = id; state.activePreset = getPreset(id);
      const lastTab = loadLastTab(id);
      switchTab(lastTab);
      renderHeader();
    });

    renderHeader(); renderNav();

    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.type === 'TOGGLE_SIDEBAR') {
        sidebar.classList.toggle('open');
        if (sidebar.classList.contains('open')) {
          if (state.view === 'settings') switchView('main');
          refreshProjectContext();
          renderHeader();
        }
      }
    });

    const handle = document.getElementById('ss-resize-handle');
    let isResizing = false, startX = 0, startWidth = 0;
    handle.addEventListener('mousedown', (e) => { isResizing = true; startX = e.clientX; startWidth = sidebar.offsetWidth; handle.classList.add('dragging'); document.body.style.userSelect = 'none'; document.body.style.cursor = 'ew-resize'; });
    document.addEventListener('mousemove', (e) => { if (!isResizing) return; sidebar.style.width = Math.min(1200, Math.max(320, startWidth + (startX - e.clientX))) + 'px'; });
    document.addEventListener('mouseup', () => { if (!isResizing) return; isResizing = false; handle.classList.remove('dragging'); document.body.style.userSelect = ''; document.body.style.cursor = ''; saveSidebarWidth(sidebar.offsetWidth); });

    document.getElementById('ss-close').onclick = () => sidebar.classList.remove('open');
    document.getElementById('ss-settings-btn').onclick = () => switchView('settings');
    document.getElementById('ss-back-btn').onclick = () => switchView('main');
    document.getElementById('ss-burger').onclick = (e) => {
      e.stopPropagation();
      toggleSidePanel('ss-nav');
    };

    document.addEventListener('click', (e) => {
      if (sidebar.classList.contains('open') && !sidebar.contains(e.target)) closeDropdown();
      const nav = document.getElementById('ss-nav');
      if (nav && nav.classList.contains('open') && !nav.contains(e.target) && e.target.id !== 'ss-burger') {
        nav.classList.remove('open');
        state.navOpen = false;
      }
      const info = document.getElementById('ss-info-panel');
      if (info && info.classList.contains('open') && !info.contains(e.target) && !e.target.closest('.ss-var-card')) {
        info.classList.remove('open');
        state.contactInfoOpen = false;
      }
      const extraPanels = ['ss-contact-search-hist', 'ss-contact-fav-panel', 'ss-contact-settings-panel', 'ss-var-search-hist', 'ss-var-presets-panel'];
      extraPanels.forEach(pId => {
        const p = document.getElementById(pId);
        if (p && p.classList.contains('open') && !p.contains(e.target) && !e.target.closest('.ss-action-btn') && !e.target.closest('.ss-var-btn')) {
            p.classList.remove('open');
            if (pId === 'ss-contact-search-hist') state.contactShowSearchHist = false;
            if (pId === 'ss-contact-fav-panel') state.contactShowFavorites = false;
            if (pId === 'ss-contact-settings-panel') state.contactSettingsOpen = false;
        }
      });
      // Close var edit if click outside any var card
      if (state.varEditingId !== null) {
        const clickedCard = e.target.closest('.ss-var-card');
        if (!clickedCard) {
          state.varEditingId = null; state.varShowHistoryId = null;
          const listEl = document.getElementById('ss-var-list');
          if (listEl) renderVarList(listEl, () => { });
        }
      }
    });

    switchTab(state.activeTab);
  }

  const startApp = async () => {
    __localCache = await chrome.storage.local.get(null);
    if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }

    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'local') {
        for (const [key, { newValue }] of Object.entries(changes)) {
          __localCache[key] = newValue;
        }
      }
    });
  };

  startApp();
})();
