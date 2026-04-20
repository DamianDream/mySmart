(() => {
  'use strict';

  // SVG icons (shared)
  const iGear = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg>`;
  const iCopy = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
  const iEdit = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`;
  const iDone = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;
  const iReset = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/></svg>`;
  const iHistory = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
  const iSearch = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`;
  const iClock = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
  const iPreset = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>`;
  const iSave = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>`;
  const iTrash = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>`;
  const iPen = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`;
   const iAddToPreset = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><line x1="12" y1="9" x2="12" y2="15"/><line x1="9" y1="12" x2="15" y2="12"/></svg>`;
  const iTune = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="2" y1="14" x2="6" y2="14"></line><line x1="10" y1="8" x2="14" y2="8"></line><line x1="18" y1="16" x2="22" y2="16"></line></svg>`;
  const iFilter = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>`;

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
  const K_FONT = 'ms_font_size';
  const loadFont = () => localStorage.getItem(K_FONT) || 'small';
  const saveFont = (f) => localStorage.setItem(K_FONT, f);
  const FONT_SCALES = { small: 0.9, regular: 1, large: 1.1 };
  const K_PRESETS = 'ms_presets';
  const K_THEME = 'ms_theme';
  const K_VAR_HISTORY = 'ms_var_history';     // edit history per variable
  const K_SEARCH_HIST = (pid) => `ms_search_hist_${pid}`;  // search term history
  const K_CONTACT_SEARCH_HIST = (pid) => `ss_contact_search_hist_${pid}`;
  const K_VAR_PRESETS = (pid) => `ms_var_presets_${pid}`;  // var presets per project
  const K_CONTACT_SETTINGS = 'ss_contacts_display_settings';
  const K_TAB_STATE = (pid) => `ss_active_tab_${pid}`;  // var presets per project
  const K_LAST_TAB = (pid) => `ms_last_tab_${pid}`;

  // ─── STORAGE HELPERS ──────────────────────────────────────────────────────
  const loadPresets = () => { try { return JSON.parse(localStorage.getItem(K_PRESETS) || '[]'); } catch { return []; } };
  const savePresets = (p) => localStorage.setItem(K_PRESETS, JSON.stringify(p));
  const getPreset = (id) => loadPresets().find(p => p.projectId === id) || null;
  const loadTheme = () => localStorage.getItem(K_THEME) || 'dark';
  const saveTheme = (t) => localStorage.setItem(K_THEME, t);
  const loadLastTab = (pid) => { try { return localStorage.getItem(K_LAST_TAB(pid)) || 'vars'; } catch { return 'vars'; } };
  const saveLastTab = (pid, tab) => { if (pid) localStorage.setItem(K_LAST_TAB(pid), tab); };

  // Edit history (up to 5 per variable)
  const loadVarHistory = (pid, vid) => { try { return JSON.parse(localStorage.getItem(K_VAR_HISTORY) || '{}')[`${pid}_${vid}`] || []; } catch { return []; } };
  const saveVarHistory = (pid, vid, oldVal) => {
    try {
      const all = JSON.parse(localStorage.getItem(K_VAR_HISTORY) || '{}');
      const key = `${pid}_${vid}`;
      const arr = all[key] || [];
      arr.unshift({ value: oldVal, ts: new Date().toISOString() });
      all[key] = arr.slice(0, 5);
      localStorage.setItem(K_VAR_HISTORY, JSON.stringify(all));
    } catch { }
  };

  // Search term history (up to 20 per project)
  const loadSearchHist = (pid) => { try { return JSON.parse(localStorage.getItem(K_SEARCH_HIST(pid)) || '[]'); } catch { return []; } };
  const saveSearchHist = (pid, term) => {
    try {
      const arr = loadSearchHist(pid).filter(t => t !== term);
      arr.unshift(term);
      localStorage.setItem(K_SEARCH_HIST(pid), JSON.stringify(arr.slice(0, 20)));
    } catch { }
  };

  const loadContactSearchHist = (pid) => { try { return JSON.parse(localStorage.getItem(K_CONTACT_SEARCH_HIST(pid)) || '[]'); } catch { return []; } };
  const saveContactSearchHist = (pid, term) => {
    try {
      const arr = loadContactSearchHist(pid).filter(t => t !== term);
      arr.unshift(term);
      localStorage.setItem(K_CONTACT_SEARCH_HIST(pid), JSON.stringify(arr.slice(0, 10)));
    } catch { }
  };

  // Var presets per project
  const loadVarPresets = (pid) => { try { return JSON.parse(localStorage.getItem(K_VAR_PRESETS(pid)) || '[]'); } catch { return []; } };
  const saveVarPresets = (pid, p) => localStorage.setItem(K_VAR_PRESETS(pid), JSON.stringify(p));

  const loadContactSettings = () => { try { return JSON.parse(localStorage.getItem(K_CONTACT_SETTINGS)) || { showProfile: true, showDetails: true, showTags: true, showVars: true, compactCards: false }; } catch { return { showProfile: true, showDetails: true, showTags: true, showVars: true, compactCards: false }; } };
  const saveContactSettings = (s) => localStorage.setItem(K_CONTACT_SETTINGS, JSON.stringify(s));

  // ─── STATE ────────────────────────────────────────────────────────────────
  const state = {
    projectId: null, projectName: null,
    xsrfToken: null, activePreset: null,
    theme: loadTheme(),
    fontSize: loadFont(),
    activeTab: 'vars',
    view: 'main',
    navOpen: false,
    selectedTags: [], isSearching: false, isCounting: false,
    varResults: [], varEditingId: null, varShowHistoryId: null,
    varShowSearchHist: false,
    varPresetsOpen: false,
    varPresetEditing: null,
    varPresetPanelId: null,
    varPresetConfigPanelId: null,
    varViewingPresetId: null,
    contactResults: [], isSearchingContact: false, contactSearchPerformed: false,
    contactShowSearchHist: false,
    contactSettingsOpen: false,
    contactSettings: loadContactSettings(),
    contactInfoOpen: false, contactInfoId: null, contactInfo: null, isFetchingContactInfo: false
  };

  // ─── THEME ────────────────────────────────────────────────────────────────
  function applyTheme(t) {
    state.theme = t; saveTheme(t);
    const s = document.getElementById('ss-sidebar'); if (!s) return;
    Object.entries(THEMES[t] || THEMES.dark).forEach(([k, v]) => s.style.setProperty(k, v));
    s.dataset.theme = t;
  }

  function applyFontSize(f) {
    state.fontSize = f; saveFont(f);
    const s = document.getElementById('ss-sidebar'); if (!s) return;
    s.style.setProperty('--font-scale', FONT_SCALES[f] || 1);
  }
  const getXsrfToken = () => document.querySelector('meta[name="csrf-token"]')?.content ?? '';
  const getXsrfCookie = () => decodeURIComponent(document.cookie.split('; ').find(r => r.startsWith('XSRF-TOKEN='))?.split('=')[1] ?? '');
  const getProjectFromUrl = () => { const p = new URLSearchParams(location.search).get('project'); return p ? p.replace(/-\d+$/, '') : null; };
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
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
      chrome.runtime.sendMessage({ type: 'API_REQUEST', url, method, headers, body }, (res) => {
        if (chrome.runtime.lastError) return reject(new Error(chrome.runtime.lastError.message));
        if (!res?.ok) return reject(new Error(res?.error || `HTTP ${res?.status}`));
        resolve(res.data);
      });
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
    const el = document.getElementById('ss-project-display'); if (!el) return;
    if (state.projectId) {
      const name = state.projectName ? ` (${state.projectName})` : '';
      const check = state.activePreset ? ' <span style="color:var(--success);font-size:10px;">✓</span>' : '';
      el.innerHTML = `<span style="color:var(--success);">${state.projectId}</span><span style="color:var(--text4);font-size:11px;">${name}</span>${check}`;
    } else {
      el.innerHTML = `<span style="color:var(--text5);">waiting...</span>`;
    }
  }

  // ─── NAV ──────────────────────────────────────────────────────────────────
  function renderNav() {
    const nav = document.getElementById('ss-nav'); if (!nav) return;
    nav.innerHTML = `
      <button class="ss-nav-item ${state.activeTab === 'vars' ? 'active' : ''}" data-tab="vars"><span>Variables</span></button>
      <button class="ss-nav-item ${state.activeTab === 'tags' ? 'active' : ''}" data-tab="tags"><span>Tags</span></button>
      <button class="ss-nav-item ${state.activeTab === 'contacts' ? 'active' : ''}" data-tab="contacts"><span>Contacts</span></button>
    `;
    nav.querySelectorAll('.ss-nav-item').forEach(btn => {
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
            <span style="font-size:9px;color:var(--text5);font-family:'JetBrains Mono',monospace;text-transform:uppercase;letter-spacing:0.05em;line-height:1;">${state.theme === 'dark' ? 'Dark' : 'Light'} Mode</span>
            <label class="ss-theme-switch" title="Toggle Theme" style="flex-shrink:0;">
              <input type="checkbox" id="ss-theme-toggle-input"${state.theme === 'dark' ? ' checked' : ''}>
              <span class="ss-slider"></span>
            </label>
          </div>
          <div style="display:flex;flex-direction:column;gap:6px;align-items:flex-end;flex:1;">
            <span style="font-size:9px;color:var(--text5);font-family:'JetBrains Mono',monospace;text-transform:uppercase;letter-spacing:0.05em;line-height:1;margin-right:2px;">Font Size</span>
            <select class="ss-input ss-font-select" id="ss-font-select" style="max-width:110px;padding:5px 8px;font-size:11px;">
              <option value="small"${state.fontSize === 'small' ? ' selected' : ''}>Small</option>
              <option value="regular"${state.fontSize === 'regular' ? ' selected' : ''}>Regular</option>
              <option value="large"${state.fontSize === 'large' ? ' selected' : ''}>Large</option>
            </select>
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
        <div id="ss-preset-msg" style="display:none;font-size:11px;margin-bottom:8px;font-family:monospace;"></div>
        <button class="ss-btn-primary" id="ss-preset-save">Save Preset</button>
      </div>
    `;

    document.getElementById('ss-theme-toggle-input').onchange = (e) => { applyTheme(e.target.checked ? 'dark' : 'light'); renderSettings(); };
    document.getElementById('ss-font-select').onchange = (e) => { applyFontSize(e.target.value); };

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
      if (!pid) { msg.textContent = '⚠ Project ID required'; msg.style.cssText = 'display:block;color:var(--error);font-size:11px;margin-bottom:8px;font-family:monospace;'; return; }
      const presets = loadPresets(); const idx = presets.findIndex(p => p.projectId === pid);
      // If updating existing preset and token is empty — keep old token
      const existingToken = idx >= 0 ? presets[idx].apiToken : '';
      const preset = { projectId: pid, apiToken: token || existingToken, name: name || pid };
      if (idx >= 0) presets[idx] = preset; else presets.push(preset);
      savePresets(presets);
      if (pid === state.projectId) { state.activePreset = preset; renderHeader(); }
      msg.textContent = '✅ Saved!'; msg.style.cssText = 'display:block;color:var(--success);font-size:11px;margin-bottom:8px;font-family:monospace;';
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
        <div class="ss-search-row">
          <input class="ss-input" id="ss-tag-input" type="text" placeholder="tag name" autocomplete="off" />
          <button class="ss-btn-search" id="ss-btn-search">Find</button>
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
      item.innerHTML = `<div style="min-width:0;flex:1;"><div class="ss-dropdown-item-name">${name}</div><div class="ss-dropdown-item-id" style="font-size:11px;color:var(--success);margin-top:4px;">ID: <b style="font-size:12px;">${tag.id}</b></div></div><button class="ss-var-btn ss-tag-copy-btn" title="Copy ID">${iCopy}</button>`;
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
      if (searchBtn) { searchBtn.disabled = true; searchBtn.textContent = '...'; }
      setLoading(true);
      closeDropdown();
      try {
        const data = await searchTags(state.projectId, term); const col = data.collection || [];
        showDropdown(col, term, data.isExact);
      } catch (err) { showTagError(err.message); }
      finally { state.isSearching = false; setLoading(false); if (searchBtn) { searchBtn.disabled = false; searchBtn.textContent = 'Find'; } }
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
        return filtered.map(v => `
          <div class="ss-info-var" title="${esc(v.name)}: ${esc(String(v.value))}">
            <div class="ss-info-var-name">
              <span>${esc(v.name)}</span>
              <button class="ss-info-copy-btn" data-copy="${esc(v.name)}" title="Copy key">${iCopy}</button>
            </div>
            <div class="ss-info-var-val">
              <span>${esc(String(v.value))}</span>
              <button class="ss-info-copy-btn" data-copy="${esc(String(v.value))}" title="Copy value">${iCopy}</button>
            </div>
          </div>
        `).join('') || '<div class="ss-hint">No matching variables</div>';
      };

      const tagsHtml = (data.tags || []).map(t => `<span class="ss-info-tag" title="Created: ${t.createdAt}">${esc(t.name)}</span>`).join('');
      
      body.innerHTML = `
        ${state.contactSettings.showProfile ? `
        <div class="ss-info-section" style="display:flex;align-items:center;gap:12px;background:var(--bg2);padding:12px;border-radius:12px;margin-bottom:16px;">
          ${data.photo ? `<img src="${data.photo}" style="width:48px;height:48px;border-radius:50%;object-fit:cover;border:2px solid var(--border);">` : `<div style="width:48px;height:48px;border-radius:50%;background:var(--bg3);display:flex;align-items:center;justify-content:center;font-size:20px;">👤</div>`}
          <div style="flex:1;overflow:hidden;">
            <div style="font-weight:800;font-size:14px;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(data.fullName || data.name || 'Unnamed')}</div>
            <div style="font-size:11px;color:var(--text4);font-family:'JetBrains Mono',monospace;">ID: ${data.id}</div>
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
          <div style="margin-bottom:8px;">
            <input class="ss-input" id="ss-info-var-search" type="text" placeholder="Filter variables..." style="font-size:11px;padding:6px 10px;height:28px;" />
          </div>
          <div class="ss-info-vars" id="ss-info-vars-list">${renderVars()}</div>
        </div>
        ` : ''}
      `;

      const vSearch = document.getElementById('ss-info-var-search');
      if (vSearch) {
        vSearch.oninput = (e) => {
          document.getElementById('ss-info-vars-list').innerHTML = renderVars(e.target.value);
          bindExpand();
        };
      }

      const bindExpand = () => {
        body.querySelectorAll('.ss-info-detail-row, .ss-info-var').forEach(el => {
          el.onclick = (e) => { e.stopPropagation(); el.classList.toggle('expanded'); };
          el.querySelectorAll('.ss-info-copy-btn').forEach(btn => {
            btn.onclick = (e) => {
              e.stopPropagation();
              const text = btn.dataset.copy;
              navigator.clipboard.writeText(text);
              const old = btn.innerHTML;
              btn.innerHTML = iDone;
              setTimeout(() => btn.innerHTML = old, 1500);
            };
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
      <div style="margin-bottom:10px;">
        <div class="ss-section-label">Contact search</div>
        <div style="display:flex;gap:6px;align-items:center;margin-bottom:6px;">
          <div style="position:relative;flex:1;">
            <input class="ss-input" id="ss-contact-input" type="text" placeholder="Email or User ID" autocomplete="off" />
          </div>
          <button class="ss-var-btn ss-var-btn-hist-search" id="ss-contact-hist-btn" title="Search history">${iClock}</button>
          <div style="position:relative;">
            <button class="ss-var-btn" id="ss-contact-settings-btn" title="Filter contact info">${iTune}</button>
            <div id="ss-contact-settings-panel" class="ss-settings-panel" style="display:none;"></div>
          </div>
          <button class="ss-btn-search" id="ss-contact-btn">Find</button>
        </div>
        <!-- Search history dropdown -->
        <div id="ss-contact-search-hist" class="ss-search-hist-panel" style="display:none;"></div>
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
    const setBtn = document.getElementById('ss-contact-settings-btn');
    const setPanel = document.getElementById('ss-contact-settings-panel');

    const toggleHist = () => {
      state.contactShowSearchHist = !state.contactShowSearchHist;
      if (!state.contactShowSearchHist) { histPanel.style.display = 'none'; return; }
      const hist = loadContactSearchHist(state.projectId);
      if (!hist.length) { histPanel.innerHTML = '<div class="ss-hist-term" style="opacity:0.5;cursor:default;">No history</div>'; }
      else {
        histPanel.innerHTML = hist.map((t, i) => `<div class="ss-hist-term" data-index="${i}">${esc(t)}</div>`).join('');
        histPanel.querySelectorAll('.ss-hist-term').forEach(el => {
          el.onclick = () => {
            input.value = loadContactSearchHist(state.projectId)[parseInt(el.dataset.index)];
            toggleHist();
            doSearch();
          };
        });
      }
      histPanel.style.display = 'block';
    };

    const doSearch = async () => {
      const term = input.value.trim(); if (!term) return;
      saveContactSearchHist(state.projectId, term);
      state.contactShowSearchHist = false; if (histPanel) histPanel.style.display = 'none';
      state.isSearchingContact = true; state.contactSearchPerformed = true;
      btn.disabled = true; load.style.display = 'flex'; errEl.classList.remove('visible');
      try {
        state.contactResults = await findContacts(term);
        renderContacts();
      } catch (e) { errEl.textContent = `⚠ ${e.message}`; errEl.classList.add('visible'); }
      finally { state.isSearchingContact = false; btn.disabled = false; load.style.display = 'none'; }
    };

    if (histBtn) histBtn.onclick = (e) => { e.stopPropagation(); toggleHist(); };
    if (setBtn) setBtn.onclick = (e) => {
      e.stopPropagation();
      state.contactSettingsOpen = !state.contactSettingsOpen;
      setPanel.style.display = state.contactSettingsOpen ? 'flex' : 'none';
      if (state.contactSettingsOpen) renderContactSettingsPanel();
    };
    if (btn) btn.onclick = doSearch;
    if (input) input.onkeydown = (e) => { if (e.key === 'Enter') doSearch(); };

    document.addEventListener('click', (e) => {
      if (state.contactShowSearchHist && histPanel && !histPanel.contains(e.target) && e.target !== histBtn) {
        state.contactShowSearchHist = false; histPanel.style.display = 'none';
      }
      if (state.contactSettingsOpen && setPanel && !setPanel.contains(e.target) && e.target !== setBtn) {
        state.contactSettingsOpen = false; setPanel.style.display = 'none';
      }
    });
  }

  function renderContactSettingsPanel() {
    const p = document.getElementById('ss-contact-settings-panel'); if (!p) return;
    p.innerHTML = `
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
      card.onclick = () => renderContactInfoPanel(c.id);
      
      const thumb = c.photo ? `<img src="${c.photo}" style="width:32px;height:32px;border-radius:50%;object-fit:cover;">` : `<div style="width:32px;height:32px;border-radius:50%;background:var(--bg3);display:flex;align-items:center;justify-content:center;font-size:14px;">👤</div>`;
      
      card.innerHTML = `
        <div style="display:flex;gap:12px;align-items:center;${state.contactSettings.compactCards ? '' : 'margin-bottom:8px;'}">
          ${thumb}
          <div style="min-width:0;flex:1;">
            <div style="font-weight:700;color:var(--text);font-size:14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(c.fullName || 'Unnamed')}</div>
            <div style="font-size:11px;color:var(--text4);">ID: <span style="color:var(--success);font-weight:600;">${c.id}</span></div>
          </div>
          <button class="ss-var-btn ss-copy-btn" data-copy="${c.id}" title="Copy ID">${iCopy}</button>
        </div>
        ${!state.contactSettings.compactCards && c.email ? `<div style="font-size:12px;color:var(--text3);display:flex;align-items:center;gap:6px;"><span style="font-size:10px;">✉</span> ${esc(c.email)}</div>` : ''}
        ${!state.contactSettings.compactCards && c.phone ? `<div style="font-size:12px;color:var(--text3);display:flex;align-items:center;gap:6px;margin-top:2px;"><span style="font-size:10px;">📞</span> ${esc(c.phone)}</div>` : ''}
      `;
      
      card.querySelector('.ss-copy-btn').onclick = (e) => {
        const btn = e.currentTarget; e.stopPropagation();
        navigator.clipboard.writeText(btn.dataset.copy);
        btn.innerHTML = iDone;
        setTimeout(() => btn.innerHTML = iCopy, 1500);
      };

      list.appendChild(card);
    });
  }


  // ─── VARS TAB ─────────────────────────────────────────────────────────────

  function renderVarsTab() {
    const body = document.getElementById('ss-body');
    body.innerHTML = `
      <div style="margin-bottom:10px;">
        <div class="ss-section-label">Variable search</div>
        <div style="display:flex;gap:6px;align-items:center;margin-bottom:6px;">
          <div style="position:relative;flex:1;">
            <input class="ss-input" id="ss-var-input" type="text" placeholder="name1, name2, name3" autocomplete="off" />
          </div>
          <button class="ss-var-btn ss-var-btn-hist-search" id="ss-var-hist-btn" title="Search history">${iClock}</button>
          <button class="ss-var-btn ss-var-btn-preset-open" id="ss-var-preset-btn" title="Presets">${iPreset}</button>
          <button class="ss-var-btn ss-var-btn-reset-search" id="ss-var-reset-btn" title="Clear results">${iReset}</button>
          <button class="ss-btn-search" id="ss-var-btn">Find</button>
        </div>
        <!-- Search history dropdown -->
        <div id="ss-var-search-hist" class="ss-search-hist-panel" style="display:none;"></div>
        <!-- Presets panel -->
        <div id="ss-var-presets-panel" class="ss-var-presets-panel" style="display:none;"></div>
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

    const showVarErr = (msg) => { errEl.textContent = `⚠ ${msg}`; errEl.classList.add('visible'); setTimeout(() => errEl.classList.remove('visible'), 5000); };

    // ── Search history panel ──
    function toggleSearchHist() {
      state.varShowSearchHist = !state.varShowSearchHist;
      state.varPresetsOpen = false;
      presetsPanel.style.display = 'none';
      if (!state.varShowSearchHist) { histPanel.style.display = 'none'; return; }
      const hist = loadSearchHist(state.projectId);
      if (!hist.length) { histPanel.innerHTML = `<div class="ss-empty" style="border:none;padding:8px;">No search history</div>`; histPanel.style.display = 'block'; return; }
      histPanel.innerHTML = hist.map((t, i) => `<div class="ss-hist-term" data-index="${i}">${esc(t)}</div>`).join('');
      histPanel.style.display = 'block';
      histPanel.querySelectorAll('.ss-hist-term').forEach(el => {
        el.addEventListener('click', () => {
          input.value = loadSearchHist(state.projectId)[parseInt(el.dataset.index)];
          histPanel.style.display = 'none'; state.varShowSearchHist = false;
          doSearch();
        });
      });
    }

    // ── Presets panel ──
    function renderPresetsPanel() {
      state.varPresetsOpen = !state.varPresetsOpen;
      state.varShowSearchHist = false;
      histPanel.style.display = 'none';
      if (!state.varPresetsOpen) { presetsPanel.style.display = 'none'; return; }

      const pid = state.projectId;
      const presets = loadVarPresets(pid);
      presetsPanel.style.display = 'block';

      function drawPresets() {
        const ps = loadVarPresets(pid);
        presetsPanel.innerHTML = `
          <div style="padding:8px 10px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;">
            <span style="font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--text4);text-transform:uppercase;letter-spacing:.08em;">Variable Presets</span>
            <button class="ss-var-btn" id="ss-preset-add-btn" title="New preset">${iSave}</button>
          </div>
          ${ps.length === 0 ? `<div class="ss-empty" style="border:none;padding:10px;">No presets yet</div>`
            : ps.map((p, i) => `
              <div class="ss-vpreset-item" data-pi="${i}">
                ${state.varPresetEditing === i ? `
                  <input class="ss-input ss-vpreset-name-input" data-pi="${i}" value="${esc(p.name)}" style="flex:1;padding:4px 8px;font-size:11px;" />
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
                  <div style="font-size:11px;font-weight:600;margin-bottom:6px;">Variables inside ${esc(p.name)}</div>
                  <div id="ss-preset-cfg-list-${i}" style="margin-bottom:8px;font-size:11px;color:var(--text3);max-height:120px;overflow-y:auto;">
                      Loading variables...
                  </div>
                  <div style="display:flex;gap:4px;">
                    <input class="ss-input" id="ss-cfg-add-id-${i}" placeholder="ID" style="width:60px;font-size:11px;" />
                    <input class="ss-input" id="ss-cfg-add-name-${i}" placeholder="Name" style="flex:1;font-size:11px;" />
                    <button class="ss-var-btn" id="ss-cfg-add-btn-${i}" title="Add by ID">${iSave}</button>
                  </div>
                </div>
              ` : ''}
              `).join('')}
          <!-- Save current results as preset -->
          ${state.varResults.length > 0 ? `
            <div style="padding:8px 10px;border-top:1px solid var(--border);">
              <div style="display:flex;gap:6px;align-items:center;">
                <input class="ss-input" id="ss-new-preset-name" placeholder="Preset name" style="flex:1;padding:6px 8px;font-size:11px;" />
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
            items: state.varResults.map(d => ({id: d.id, name: d.name})), 
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
               p.items = p.ids.map(id => ({id, name: '...'}));
               fetchDefinitionsByIds(p.ids).then(results => {
                 p.items = p.ids.map(id => {
                   const f = results.find(r => r.id === id);
                   return {id, name: f ? f.name : `Unknown (${id})`};
                 });
                 const allPs = loadVarPresets(pid); allPs[pi] = p; saveVarPresets(pid, allPs);
                 if(state.varPresetConfigPanelId === pi) drawPresets();
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
                if(!p.items) p.items = [];
                p.items.push({id: idVal, name: nameVal});
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
            state.varPresetsOpen = false; presetsPanel.style.display = 'none'; state.varPresetConfigPanelId = null;
            btn.disabled = true; btn.textContent = '...'; loadEl.style.display = 'flex';
            listEl.innerHTML = ''; state.varResults = []; state.varEditingId = null; state.varShowHistoryId = null;
            state.varViewingPresetId = pi;
            try {
              const results = await fetchDefinitionsByIds(preset.ids);
              state.varResults = preset.ids.map(id => results.find(r => r.id === id)).filter(Boolean);
              renderVarList(listEl, showVarErr);
            } catch (err) { showVarErr(err.message); }
            finally { btn.disabled = false; btn.textContent = 'Find'; loadEl.style.display = 'none'; }
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

    // ── Search ──
    async function doSearch() {
      const raw = input.value.trim(); if (!raw || !state.projectId) return;
      // Split by comma, trim each term
      const terms = raw.split(',').map(t => t.trim()).filter(Boolean);
      btn.disabled = true; btn.textContent = '...'; loadEl.style.display = 'flex';
      listEl.innerHTML = ''; state.varResults = []; state.varEditingId = null; state.varShowHistoryId = null; 
      state.varViewingPresetId = null;
      histPanel.style.display = 'none'; state.varShowSearchHist = false;
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
      finally { btn.disabled = false; btn.textContent = 'Find'; loadEl.style.display = 'none'; }
    }

    btn.addEventListener('click', doSearch);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });
    
    document.getElementById('ss-var-hist-btn').addEventListener('click', (e) => { e.stopPropagation(); toggleSearchHist(); });
    document.getElementById('ss-var-preset-btn').addEventListener('click', (e) => { e.stopPropagation(); renderPresetsPanel(); });
    document.getElementById('ss-var-reset-btn').addEventListener('click', () => {
      input.value = '';
      state.varResults = []; state.varEditingId = null; state.varShowHistoryId = null; state.varPresetPanelId = null;
      state.varViewingPresetId = null;
      listEl.innerHTML = '';
      histPanel.style.display = 'none'; state.varShowSearchHist = false;
      presetsPanel.style.display = 'none'; state.varPresetsOpen = false;
    });

    // Close panels on outside click
    document.addEventListener('click', (e) => {
      if (!histPanel.contains(e.target) && e.target.id !== 'ss-var-hist-btn') { histPanel.style.display = 'none'; state.varShowSearchHist = false; }
      if (!presetsPanel.contains(e.target) && e.target.id !== 'ss-var-preset-btn') { presetsPanel.style.display = 'none'; state.varPresetsOpen = false; }
    }, { capture: false });

    if (state.varResults.length) renderVarList(listEl, showVarErr);
  }

  function renderVarList(listEl, showVarErr) {
    listEl.innerHTML = '';
    if (!state.varResults.length) { listEl.innerHTML = `<div class="ss-empty">No variables found</div>`; return; }

    if (state.varViewingPresetId !== null) {
       const ps = loadVarPresets(state.projectId);
       const p = ps[state.varViewingPresetId];
       if (p) listEl.innerHTML += `<div style="padding:6px 10px;font-size:11px;color:var(--text4);background:var(--bg3);border-radius:4px;margin-bottom:6px;">Viewing Preset: <b>${esc(p.name)}</b></div>`;
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
              <input class="ss-input ss-preset-search-input" placeholder="Filter presets..." style="padding:5px 8px;font-size:11px;" />
            </div>
            <div class="ss-preset-list-inner">
              ${ps.length === 0 ? `<div class="ss-empty" style="border:none;padding:6px 10px;font-size:11px;">No presets yet</div>`
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
                <input class="ss-input ss-new-preset-from-card" placeholder="New preset name..." style="flex:1;padding:5px 8px;font-size:11px;" />
                <button class="ss-var-btn ss-new-preset-from-card-btn" title="Create & add">${iSave}</button>
              </div>
            </div>
          </div>
        `;
      }

      card.innerHTML = `
        <div class="ss-var-card-main">
          <div class="ss-var-info">
            <div class="ss-var-name">${esc(def.name)}</div>
            <div class="ss-var-value-preview">${esc(def.value || '—')}</div>
          </div>
          <div class="ss-var-actions">
            ${isEditing ? `
              <button class="ss-var-btn ss-var-btn-history${showHist ? ' active' : ''}" data-action="history" data-id="${def.id}" title="Edit history">${iHistory}</button>
              <button class="ss-var-btn ss-var-btn-copy" data-action="copy-edit" data-id="${def.id}" title="Copy">${iCopy}</button>
              <button class="ss-var-btn ss-var-btn-reset" data-action="reset" data-id="${def.id}" title="Reset">${iReset}</button>
              <button class="ss-var-btn ss-var-btn-done" data-action="save" data-id="${def.id}" title="Save">${iDone}</button>
            `: `
              <button class="ss-var-btn ss-var-btn-copy" data-action="copy" data-id="${def.id}" title="Copy value">${iCopy}</button>
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
              if(ps[pi].items) ps[pi].items = ps[pi].items.filter(x => x.id !== def.id);
            }
            else { 
              if (!ps[pi].ids.includes(def.id)) {
                ps[pi].ids.push(def.id);
                if(!ps[pi].items) ps[pi].items = [];
                ps[pi].items.push({id: def.id, name: def.name});
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
          ps.push({ name, ids: [def.id], items: [{id: def.id, name: def.name}], ts: new Date().toISOString() });
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

  // ─── SWITCH ───────────────────────────────────────────────────────────────
  function switchView(view) {
    state.view = view;
    const sb = document.getElementById('ss-settings-btn'), bb = document.getElementById('ss-back-btn');
    const nav = document.getElementById('ss-nav'), hb = document.getElementById('ss-header-bottom');
    if (view === 'settings') {
      sb && (sb.style.display = 'none'); bb && (bb.style.display = 'flex');
      if (nav) nav.classList.remove('open'); if (hb) hb.style.display = 'none';
      renderSettings();
    } else {
      sb && (sb.style.display = 'flex'); bb && (bb.style.display = 'none');
      if (hb) hb.style.display = 'flex';
      state.activeTab === 'tags' ? renderMain() : renderVarsTab();
    }
  }

  function switchTab(tab) {
    state.activeTab = tab; saveLastTab(state.projectId, tab);
    let label = 'Variables';
    if (tab === 'tags') label = 'Tags';
    if (tab === 'contacts') label = 'Contacts';
    document.getElementById('ss-current-tab-label').textContent = label;
    renderNav();
    if (tab === 'tags') renderMain();
    else if (tab === 'contacts') renderContactsTab();
    else renderVarsTab();
  }

  // ─── BUILD SIDEBAR ────────────────────────────────────────────────────────
  function buildSidebar() {
    const s = document.createElement('div'); s.id = 'ss-sidebar';
    s.innerHTML = `
      <div id="ss-resize-handle"></div>
      <div class="ss-header">
        <div class="ss-header-top" style="align-items:center;margin-bottom:6px;">
          <div style="display:flex;align-items:center;gap:8px;">
            <button class="ss-icon-btn" id="ss-burger" style="font-size:1.14em;">☰</button>
            <span id="ss-current-tab-label" style="font-size:14px;font-weight:600;color:var(--text2);">Variables</span>
          </div>
          <div style="display:flex;gap:6px;align-items:center;">
            <button class="ss-icon-btn" id="ss-back-btn" style="display:none;">←</button>
            <button class="ss-icon-btn" id="ss-settings-btn">⚙</button>
            <button class="ss-close" id="ss-close">✕</button>
          </div>
        </div>
        <div class="ss-project-badge"><span class="dot"></span>Project ID: <span id="ss-project-display">—</span></div>
      </div>
      <div id="ss-nav" class="ss-nav"></div>
      <div id="ss-info-panel" class="ss-info-panel"></div>
      <div class="ss-body" id="ss-body"></div>
      <div class="ss-footer">
        <div class="ss-title">my<span>Sender</span></div>
        <div class="ss-subtitle">Tools · v2.0</div>
      </div>
    `;
    return s;
  }

  // ─── INIT ─────────────────────────────────────────────────────────────────
  function init() {
    if (document.getElementById('ss-sidebar')) return;
    const sidebar = buildSidebar();
    document.body.appendChild(sidebar);
    applyTheme(state.theme);
    applyFontSize(state.fontSize);
    state.projectName = getProjectFromUrl();

    listenForProjectId((id) => {
      if (id === state.projectId) return;
      state.projectId = id; state.activePreset = getPreset(id);
      const lastTab = loadLastTab(id);
      switchTab(lastTab);
      renderHeader();
    });

    renderHeader(); renderNav();

    chrome.runtime.onMessage.addListener((msg) => { if (msg.type === 'TOGGLE_SIDEBAR') sidebar.classList.toggle('open'); });

    const handle = document.getElementById('ss-resize-handle');
    let isResizing = false, startX = 0, startWidth = 0;
    handle.addEventListener('mousedown', (e) => { isResizing = true; startX = e.clientX; startWidth = sidebar.offsetWidth; handle.classList.add('dragging'); document.body.style.userSelect = 'none'; document.body.style.cursor = 'ew-resize'; });
    document.addEventListener('mousemove', (e) => { if (!isResizing) return; sidebar.style.width = Math.min(800, Math.max(320, startWidth + (startX - e.clientX))) + 'px'; });
    document.addEventListener('mouseup', () => { if (!isResizing) return; isResizing = false; handle.classList.remove('dragging'); document.body.style.userSelect = ''; document.body.style.cursor = ''; });

    document.getElementById('ss-close').onclick = () => sidebar.classList.remove('open');
    document.getElementById('ss-settings-btn').onclick = () => switchView('settings');
    document.getElementById('ss-back-btn').onclick = () => switchView('main');
    document.getElementById('ss-burger').onclick = (e) => { e.stopPropagation(); document.getElementById('ss-nav').classList.toggle('open'); };

    document.addEventListener('click', (e) => {
      if (sidebar.classList.contains('open') && !sidebar.contains(e.target)) closeDropdown();
      const nav = document.getElementById('ss-nav');
      if (nav && nav.classList.contains('open') && !nav.contains(e.target) && e.target.id !== 'ss-burger') nav.classList.remove('open');
      const info = document.getElementById('ss-info-panel');
      if (info && info.classList.contains('open') && !info.contains(e.target) && !e.target.closest('.ss-var-card')) {
        state.contactInfoOpen = false; info.classList.remove('open');
      }
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

  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }
})();
