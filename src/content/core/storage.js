export const K_CONTACT_FAVORITES = 'ss_contacts_favorites';
export const K_SIDEBAR_WIDTH = 'ms_sidebar_width';
export const K_PRESETS = 'ms_presets';
export const K_THEME = 'ms_theme';
export const K_VAR_HISTORY = 'ms_var_history';
export const K_SEARCH_HIST = (pid) => `ms_search_hist_${pid}`;
export const K_TAG_SEARCH_HIST = (pid) => `ss_tag_search_hist_${pid}`;
export const K_CONTACT_SEARCH_HIST = (pid) => `ss_contact_search_hist_${pid}`;
export const K_VAR_PRESETS = (pid) => `ms_var_presets_${pid}`;
export const K_CONTACT_SETTINGS = 'ss_contacts_display_settings';
export const K_LAST_TAB = (pid) => `ms_last_tab_${pid}`;
export const K_SESSION_PROJECT = 'ms_session_project_id';
export const K_SESSION_EXTRA_WIDTH = 'ss_extra_panel_width';
export const K_LATEST_PROJECT_ID = 'ms_latest_project_id';
export const K_GLOBAL_SETTINGS = 'ss_global_settings';
export const K_TAG_FAVORITES = 'ss_tag_favorites';
export const K_CONTACT_PRIORITY_VARS = (pid) => `ss_contact_priority_vars_${pid}`;
export const K_VAR_FAVORITES = 'ms_var_favorites';
export const K_ACTION_LOGS = 'ss_action_logs';

export let __localCache = {};

export async function initStorage() {
  try {
    __localCache = await chrome.storage.local.get(null);
  } catch (e) {
    console.warn('Storage access failed, using empty cache', e);
    __localCache = {};
  }
  
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local') {
      for (const [key, { newValue }] of Object.entries(changes)) {
        __localCache[key] = newValue;
      }
    }
  });
}

export const loadFromCache = (key, defaultVal) => { 
  try { 
    const v = __localCache[key]; 
    return v !== undefined ? (typeof v === 'string' && (v.startsWith('{') || v.startsWith('[')) ? JSON.parse(v) : v) : defaultVal; 
  } catch { 
    return defaultVal; 
  } 
};

export const saveToStorage = (key, val) => { 
  const str = typeof val === 'object' ? JSON.stringify(val) : String(val); 
  __localCache[key] = str; 
  chrome.storage.local.set({ [key]: str }); 
};

export const saveToSession = (key, val) => { 
  const str = typeof val === 'object' ? JSON.stringify(val) : String(val); 
  chrome.storage.session.set({ [key]: str }); 
};

export const loadFromSession = async (key) => { 
  const res = await chrome.storage.session.get(key); 
  return res[key] || null; 
};

export const loadSidebarWidth = () => loadFromCache(K_SIDEBAR_WIDTH, '500');
export const saveSidebarWidth = (w) => saveToStorage(K_SIDEBAR_WIDTH, w);

export const loadPresets = () => loadFromCache(K_PRESETS, []);
export const savePresets = (p) => saveToStorage(K_PRESETS, p);
export const getPreset = (id) => loadPresets().find(p => p.projectId === id) || null;

export const loadTheme = () => loadFromCache(K_THEME, 'dark');
export const saveTheme = (t) => saveToStorage(K_THEME, t);

export const loadLastTab = (pid) => loadFromCache(K_LAST_TAB(pid), 'vars');
export const saveLastTab = (pid, tab) => { if (pid) saveToStorage(K_LAST_TAB(pid), tab); };

export const loadVarHistory = (pid, vid) => loadFromCache(K_VAR_HISTORY, {})[`${pid}_${vid}`] || [];
export const saveVarHistory = (pid, vid, oldVal) => {
  try {
    const all = loadFromCache(K_VAR_HISTORY, {});
    const key = `${pid}_${vid}`;
    const arr = all[key] || [];
    arr.unshift({ value: oldVal, ts: new Date().toISOString() });
    all[key] = arr.slice(0, 5);
    saveToStorage(K_VAR_HISTORY, all);
  } catch { }
};

export const loadSearchHist = (pid) => loadFromCache(K_SEARCH_HIST(pid), []);
export const saveSearchHist = (pid, term) => {
  try {
    const arr = loadSearchHist(pid).filter(t => t !== term);
    arr.unshift(term);
    saveToStorage(K_SEARCH_HIST(pid), arr.slice(0, 100));
  } catch { }
};

export const loadTagSearchHist = (pid) => loadFromCache(K_TAG_SEARCH_HIST(pid), []);
export const saveTagSearchHist = (pid, term) => {
  try {
    const arr = loadTagSearchHist(pid).filter(t => t !== term);
    arr.unshift(term);
    saveToStorage(K_TAG_SEARCH_HIST(pid), arr.slice(0, 100));
  } catch { }
};

export const loadContactSearchHist = (pid) => loadFromCache(K_CONTACT_SEARCH_HIST(pid), []);
export const saveContactSearchHist = (pid, term) => {
  try {
    const arr = loadContactSearchHist(pid).filter(t => t !== term);
    arr.unshift(term);
    saveToStorage(K_CONTACT_SEARCH_HIST(pid), arr.slice(0, 100));
  } catch { }
};

export const loadVarPresets = (pid) => loadFromCache(K_VAR_PRESETS(pid), []);
export const saveVarPresets = (pid, p) => saveToStorage(K_VAR_PRESETS(pid), p);

export const loadContactSettings = () => loadFromCache(K_CONTACT_SETTINGS, { showProfile: true, showDetails: true, showTags: true, showVars: true, compactCards: false });
export const saveContactSettings = (s) => saveToStorage(K_CONTACT_SETTINGS, s);

export const loadGlobalSettings = () => {
  const s = loadFromCache(K_GLOBAL_SETTINGS, { useApiCache: false, autoFetch: false });
  if (!s.installId) {
    s.installId = crypto.randomUUID();
    saveToStorage(K_GLOBAL_SETTINGS, s);
  }
  return s;
};
export const saveGlobalSettings = (s) => saveToStorage(K_GLOBAL_SETTINGS, s);

export const loadContactFavorites = () => loadFromCache(K_CONTACT_FAVORITES, []);
export const saveContactFavorites = (f) => saveToStorage(K_CONTACT_FAVORITES, f.slice(0, 100));

export const loadTagFavorites = () => loadFromCache(K_TAG_FAVORITES, []);
export const saveTagFavorites = (f) => saveToStorage(K_TAG_FAVORITES, f.slice(0, 100));

export const loadContactPriorityVars = (pid) => loadFromCache(K_CONTACT_PRIORITY_VARS(pid), '');
export const saveContactPriorityVars = (pid, val) => saveToStorage(K_CONTACT_PRIORITY_VARS(pid), val);

export const loadVarFavorites = () => loadFromCache(K_VAR_FAVORITES, []);
export const saveVarFavorites = (f) => saveToStorage(K_VAR_FAVORITES, f.slice(0, 100));

export const loadLogs = () => loadFromCache(K_ACTION_LOGS, []);
export const saveLogs = (logs) => saveToStorage(K_ACTION_LOGS, logs);
