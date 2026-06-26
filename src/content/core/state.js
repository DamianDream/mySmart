import {
  loadFromCache,
  loadSidebarWidth,
  loadGlobalSettings,
  loadContactSettings,
  loadContactFavorites,
  loadVarFavorites,
  loadTagFavorites,
  loadTheme
} from './storage.js';

export const state = {
  projectId: null,
  projectName: null,
  projectMode: 'AUTO',
  sidebarOpen: false,
  sidebarWidth: '500px',
  globalSettings: {},
  contactSettings: {},
  activeTab: 'vars',
  xsrfToken: null,
  activePreset: null,
  editingProjectId: null,
  systemicNameLocked: true,
  updatePending: false,
  newVersion: null,
  latestVersion: null,
  fontSize: 'regular',

  view: 'main',
  navOpen: false,

  // Tags
  tagResults: [],
  tagShowSearchHist: false,
  tagShowFavorites: false,
  tagFavorites: [],
  tagSearchPerformed: false,

  // Vars
  varResults: [],
  varLoading: false,
  isSearching: false,
  varEditingId: null,
  varShowHistoryId: null,
  varShowSearchHist: false,
  varShowFavorites: false,
  varFavorites: [],
  varPresetsOpen: false,
  varPresetEditing: null,
  varPresetPanelId: null,
  varPresetConfigPanelId: null,
  varViewingPresetId: null,

  // Contacts
  contactResults: [],
  isSearchingContact: false,
  contactSearchPerformed: false,
  contactShowSearchHist: false,
  contactSettingsOpen: false,
  contactFavorites: [],
  contactInfoOpen: false,
  contactInfoId: null,
  contactInfo: null,
  isFetchingContactInfo: false,
  contactShowFavorites: false,
  contactVarEditingKey: null,
  activeUrlContact: null,

  theme: 'dark'
};

export function initState() {
  state.projectMode = loadFromCache('ss_project_mode', 'AUTO');
  state.sidebarOpen = loadSidebarWidth() !== '0';
  state.sidebarWidth = loadSidebarWidth() === '0' ? '500px' : (loadSidebarWidth() || '500px');
  state.globalSettings = loadGlobalSettings();
  state.contactSettings = loadContactSettings();
  state.contactFavorites = loadContactFavorites();
  state.varFavorites = loadVarFavorites();
  state.tagFavorites = loadTagFavorites();
  state.latestVersion = loadFromCache('ss_latest_version', null);
  state.theme = loadTheme();
}
