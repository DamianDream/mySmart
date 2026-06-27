/* global history */
import styles from '../sidebar.css?inline';
import { setShadowRoot } from './utils/dom.js';
import {
  initStorage,
  loadFromSession,
  loadFromCache,
  loadSidebarWidth,
  saveSidebarWidth,
  K_SESSION_PROJECT,
  K_LATEST_PROJECT_ID
} from './core/storage.js';
import { initState, state } from './core/state.js';
import { applyTheme } from './ui/themes.js';
import {
  buildSidebar,
  toggleSidePanel,
  switchTab,
  switchView,
  renderHeader,
  renderNav
} from './ui/sidebar.js';
import { updateModeUI, renderProjectSwitcherPanel } from './ui/settings.js';
import { switchProject, setProjectMode } from './models/project.js';
import { closeAllExtraPanels } from './tabs/vars.js';
import { getProjectFromUrl, getFullProjectFromUrl, isSmartsender } from './utils/url.js';
import { checkForUpdates, updateVersionDisplay, initUpdateWatcher } from './core/updater.js';
import { checkActiveContactUrl } from './tabs/info.js';

export * from './tabs/vars.js';
export * from './tabs/tags.js';
export * from './tabs/contacts.js';
export * from './tabs/logs.js';
export * from './tabs/info.js';

let shadowRoot = null;

function listenForTokens() {
  window.addEventListener('message', (e) => {
    if (e.source !== window) return;
    if (e.data?.type === '__ss_tokens' && e.data?.xsrf) {
      state.xsrfToken = e.data.xsrf;
    }
  });
}

async function init() {
  if (shadowRoot.getElementById('ss-sidebar')) return;

  const sidebar = buildSidebar();
  shadowRoot.appendChild(sidebar);
  sidebar.style.width = loadSidebarWidth() + 'px';
  applyTheme(state.theme);

  // ─── Project persistence ──────────────────────────────────────────────
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

  state.projectName = getProjectFromUrl();

  if (targetPid) {
    switchProject(targetPid);
  } else {
    switchTab(state.activeTab || 'vars');
  }

  function refreshProjectContext() {
    if (!isSmartsender() || state.projectMode === 'MANUAL') return;
    const pid = getFullProjectFromUrl();
    if (pid && pid !== state.projectId) {
      switchProject(pid);
    }
  }

  // ─── SPA navigation watcher ───────────────────────────────────────────
  // SmartSender changes the URL via the History API without a full reload,
  // so patch pushState/replaceState and listen to popstate to react live.
  let lastUrl = location.href;
  const onUrlChange = () => {
    if (location.href === lastUrl) return;
    lastUrl = location.href;
    refreshProjectContext();
    checkActiveContactUrl();
  };
  ['pushState', 'replaceState'].forEach((m) => {
    const orig = history[m];
    history[m] = function (...args) {
      const ret = orig.apply(this, args);
      onUrlChange();
      return ret;
    };
  });
  window.addEventListener('popstate', onUrlChange);

  listenForTokens();

  renderHeader();
  renderNav();
  updateModeUI();
  updateVersionDisplay();

  // ─── Mode toggle ──────────────────────────────────────────────────────
  const modeCheckbox = shadowRoot.getElementById('ss-mode-checkbox');
  if (modeCheckbox) {
    modeCheckbox.addEventListener('change', (e) => {
      if (!isSmartsender()) return;
      setProjectMode(e.target.checked ? 'AUTO' : 'MANUAL');
      if (state.projectMode === 'AUTO') refreshProjectContext();
    });
  }

  // ─── Open / close ─────────────────────────────────────────────────────
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
      }
    }
  });

  // ─── Resize handle ────────────────────────────────────────────────────
  const handle = shadowRoot.getElementById('ss-resize-handle');
  let isResizing = false, startX = 0, startWidth = 0;
  if (handle) {
    handle.addEventListener('mousedown', (e) => {
      isResizing = true; startX = e.clientX; startWidth = sidebar.offsetWidth;
      handle.classList.add('dragging');
      document.body.style.userSelect = 'none'; document.body.style.cursor = 'ew-resize';
    });
  }
  document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;
    sidebar.style.width = Math.min(1200, Math.max(320, startWidth + (startX - e.clientX))) + 'px';
  });
  document.addEventListener('mouseup', () => {
    if (!isResizing) return;
    isResizing = false;
    handle && handle.classList.remove('dragging');
    document.body.style.userSelect = ''; document.body.style.cursor = '';
    saveSidebarWidth(sidebar.offsetWidth);
  });

  // ─── Header buttons ───────────────────────────────────────────────────
  const onClick = (id, fn) => { const el = shadowRoot.getElementById(id); if (el) el.onclick = fn; };
  onClick('ss-close', closeSidebar);
  onClick('ss-settings-btn', () => switchView('settings'));
  onClick('ss-back-btn', () => switchView('main'));
  onClick('ss-project-container', (e) => {
    e.stopPropagation();
    renderProjectSwitcherPanel();
    toggleSidePanel('ss-project-switcher-panel');
  });
  onClick('ss-api-status', () => switchView('settings'));
  onClick('ss-burger', (e) => {
    e.stopPropagation();
    toggleSidePanel('ss-nav');
  });

  // ─── Close (×) buttons inside extra panels (delegated) ────────────────
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

  // ─── Outside-click handling (scoped to shadow root) ───────────────────
  shadowRoot.addEventListener('click', (e) => {
    const nav = shadowRoot.getElementById('ss-nav');
    if (nav && nav.classList.contains('open') && !nav.contains(e.target) && e.target.id !== 'ss-burger') {
      nav.classList.remove('open');
      state.navOpen = false;
    }
    const info = shadowRoot.getElementById('ss-info-panel');
    if (info && info.classList.contains('open') && !info.contains(e.target) && !e.target.closest('.ss-var-card')) {
      info.classList.remove('open');
      state.contactInfoOpen = false;
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

  initUpdateWatcher();
  checkForUpdates();
}

const startApp = async () => {
  const shadowHost = document.createElement('div');
  shadowHost.id = 'ss-extension-host';
  document.body.appendChild(shadowHost);
  shadowRoot = shadowHost.attachShadow({ mode: 'open' });

  const styleEl = document.createElement('style');
  styleEl.textContent = styles;
  shadowRoot.appendChild(styleEl);

  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap';
  shadowRoot.appendChild(fontLink);

  setShadowRoot(shadowRoot);

  await initStorage();
  initState();

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
};

startApp();
