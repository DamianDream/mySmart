// Side Panel bootstrap (PoC). Reuses the existing sidebar UI, but mounts it
// into Chrome's native side panel instead of injecting an overlay into the page.
// Page context (current URL, active contact) comes from the active tab via the
// chrome.tabs API rather than from `location`.
import styles from '../sidebar.css?inline';
import { setShadowRoot } from '../content/utils/dom.js';
import {
  initStorage,
  loadFromSession,
  loadFromCache,
  K_SESSION_PROJECT,
  K_LATEST_PROJECT_ID
} from '../content/core/storage.js';
import { initState, state } from '../content/core/state.js';
import { applyTheme } from '../content/ui/themes.js';
import {
  buildSidebar,
  toggleSidePanel,
  switchTab,
  switchView,
  renderHeader,
  renderNav
} from '../content/ui/sidebar.js';
import { updateModeUI, renderProjectSwitcherPanel } from '../content/ui/settings.js';
import { switchProject, setProjectMode } from '../content/models/project.js';
import { closeAllExtraPanels } from '../content/tabs/vars.js';
import { setUrlSource, getProjectFromUrl, getFullProjectFromUrl, isSmartsender } from '../content/utils/url.js';
import { checkForUpdates, updateVersionDisplay, initUpdateWatcher } from '../content/core/updater.js';
import { checkActiveContactUrl } from '../content/tabs/info.js';

// Re-export tab modules so their handlers are part of this bundle.
export * from '../content/tabs/vars.js';
export * from '../content/tabs/tags.js';
export * from '../content/tabs/contacts.js';
export * from '../content/tabs/events.js';
export * from '../content/tabs/logs.js';
export * from '../content/tabs/funnels.js';
export * from '../content/tabs/info.js';

let shadowRoot = null;
let currentUrl = '';

// In the side panel the sidebar must fill the whole surface instead of being an
// off-canvas overlay. (Injected into the shadow root, where the base CSS lives.)
const OVERRIDE_CSS = `
  #ss-sidebar {
    position: relative !important;
    inset: auto !important;
    width: 100% !important;
    max-width: none !important;
    height: 100vh !important;
    transform: none !important;
    box-shadow: none !important;
    border: none !important;
    overflow: hidden !important;
  }
  #ss-resize-handle, #ss-extra-resize-handle { display: none !important; }

  /* The slide-out sub-panels were designed to fly out to the LEFT of a floating
     sidebar. In the native side panel that's off-screen, so render them as
     full-width drawers that slide in OVER the panel instead. */
  .ss-nav, .ss-extra-panel, .ss-info-panel {
    width: 100% !important;
    max-width: 100% !important;
    transform: translateX(-100%) !important;
  }
  .ss-nav.open, .ss-extra-panel.open, .ss-info-panel.open {
    transform: translateX(0) !important;
    z-index: 100 !important;
    pointer-events: auto !important;
  }
`;

function queryActiveTabUrl() {
  return new Promise((resolve) => {
    try {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        resolve(tabs && tabs[0] && tabs[0].url ? tabs[0].url : '');
      });
    } catch { resolve(''); }
  });
}

function refreshProjectContext() {
  if (!isSmartsender() || state.projectMode === 'MANUAL') return;
  const pid = getFullProjectFromUrl();
  if (pid && pid !== state.projectId) switchProject(pid);
}

async function syncActiveTab() {
  currentUrl = await queryActiveTabUrl();
  refreshProjectContext();
  checkActiveContactUrl();
}

function wireUI() {
  renderHeader();
  renderNav();
  updateModeUI();
  updateVersionDisplay();

  const modeCheckbox = shadowRoot.getElementById('ss-mode-checkbox');
  if (modeCheckbox) {
    modeCheckbox.addEventListener('change', (e) => {
      if (!isSmartsender()) return;
      setProjectMode(e.target.checked ? 'AUTO' : 'MANUAL');
      if (state.projectMode === 'AUTO') refreshProjectContext();
    });
  }

  const onClick = (id, fn) => { const el = shadowRoot.getElementById(id); if (el) el.onclick = fn; };
  onClick('ss-project-container', (e) => { e.stopPropagation(); renderProjectSwitcherPanel(); toggleSidePanel('ss-project-switcher-panel'); });
  onClick('ss-api-status', () => switchView('settings'));
  onClick('ss-burger', (e) => { e.stopPropagation(); toggleSidePanel('ss-nav'); });

  // Close (×) buttons inside extra panels (delegated)
  const panelStateReset = {
    'ss-contact-search-hist': () => { state.contactShowSearchHist = false; },
    'ss-contact-fav-panel': () => { state.contactShowFavorites = false; },
    'ss-contact-settings-panel': () => { state.contactSettingsOpen = false; },
    'ss-info-panel': () => { state.contactInfoOpen = false; },
    'ss-var-search-hist': () => { state.varShowSearchHist = false; },
    'ss-var-presets-panel': () => { state.varPresetsOpen = false; }
  };
  shadowRoot.addEventListener('click', (e) => {
    const closeBtn = e.target.closest('.ss-close-extra-panel');
    if (!closeBtn) return;
    const panel = closeBtn.closest('.ss-info-panel, .ss-extra-panel');
    if (!panel) return;
    e.stopPropagation();
    panel.classList.remove('open');
    panelStateReset[panel.id]?.();
    shadowRoot.querySelectorAll('.ss-action-btn, .ss-var-btn').forEach(b => b.classList.remove('active'));
  });

  // Outside-click handling (scoped to shadow root)
  shadowRoot.addEventListener('click', (e) => {
    const nav = shadowRoot.getElementById('ss-nav');
    if (nav && nav.classList.contains('open') && !nav.contains(e.target) && e.target.id !== 'ss-burger') {
      nav.classList.remove('open'); state.navOpen = false;
    }
    const info = shadowRoot.getElementById('ss-info-panel');
    if (info && info.classList.contains('open') && !info.contains(e.target) && !e.target.closest('.ss-var-card')) {
      info.classList.remove('open'); state.contactInfoOpen = false;
    }
    const extraPanels = ['ss-contact-search-hist', 'ss-contact-fav-panel', 'ss-contact-settings-panel', 'ss-project-switcher-panel'];
    extraPanels.forEach(pId => {
      const p = shadowRoot.getElementById(pId);
      if (p && p.classList.contains('open') && !p.contains(e.target) && !e.target.closest('.ss-action-btn') && !e.target.closest('.ss-var-btn')) {
        p.classList.remove('open');
        if (pId === 'ss-contact-search-hist') state.contactShowSearchHist = false;
        if (pId === 'ss-contact-fav-panel') state.contactShowFavorites = false;
        if (pId === 'ss-contact-settings-panel') state.contactSettingsOpen = false;
      }
    });
  });
}

async function init() {
  const sidebar = buildSidebar();
  sidebar.classList.add('open');
  shadowRoot.appendChild(sidebar);
  applyTheme(state.theme);

  await syncActiveTab();

  // Project persistence (mirrors the content-script bootstrap)
  const sessionPid = await loadFromSession(K_SESSION_PROJECT);
  const urlPid = getFullProjectFromUrl();
  const latestPid = loadFromCache(K_LATEST_PROJECT_ID, null);

  let targetPid = null;
  if (isSmartsender()) {
    targetPid = state.projectMode === 'AUTO'
      ? (urlPid || sessionPid || latestPid)
      : (sessionPid || latestPid || urlPid);
  } else {
    targetPid = sessionPid || latestPid;
  }
  state.projectName = getProjectFromUrl();

  if (targetPid) switchProject(targetPid);
  else switchTab(state.activeTab || 'vars');

  wireUI();

  // React to the user switching tabs / navigating in the browser
  chrome.tabs.onActivated.addListener(syncActiveTab);
  chrome.tabs.onUpdated.addListener((tabId, info) => { if (info.url || info.status === 'complete') syncActiveTab(); });
  chrome.windows?.onFocusChanged?.addListener(syncActiveTab);

  initUpdateWatcher();
  checkForUpdates();
}

async function startApp() {
  const root = document.getElementById('ss-panel-root');
  shadowRoot = root.attachShadow({ mode: 'open' });

  const styleEl = document.createElement('style');
  styleEl.textContent = styles + OVERRIDE_CSS;
  shadowRoot.appendChild(styleEl);

  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap';
  shadowRoot.appendChild(fontLink);

  setShadowRoot(shadowRoot);
  setUrlSource(() => currentUrl || location.href);

  await initStorage();
  initState();
  init();
}

startApp();
