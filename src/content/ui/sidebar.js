import { iMenu, iBack, iX, iVariable, iTag, iUsers, iLog, iInfo, iExternal, iGear, iFunnel, iChat, iMonitor } from '../icons.js';
import { shadowRootRef } from '../utils/dom.js';
import { state } from '../core/state.js';
import { getPreset, saveLastTab } from '../core/storage.js';
import { isSmartsender } from '../utils/url.js';
import { renderSettings, renderProjectSwitcherPanel } from './settings.js';
import { renderVarsTab, closeAllExtraPanels } from '../tabs/vars.js';
import { renderTagsTab } from '../tabs/tags.js';
import { renderContactsTab, renderInfoTab } from '../tabs/info.js';
import { renderLogsTab } from '../tabs/logs.js';

// ─── HEADER ───────────────────────────────────────────────────────────────
export function renderHeader() {
  const disp = shadowRootRef.getElementById('ss-project-display');
  const status = shadowRootRef.getElementById('ss-api-status');
  if (state.projectId) {
    const name = state.projectName || '—';
    if (disp) disp.innerHTML = `<span style="color:var(--text4);font-size:13px;">Project:</span> <span style="color:var(--accent);font-weight:700;font-size:13px;">${name}</span>`;
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
export function renderNav() {
  const nav = shadowRootRef.getElementById('ss-nav'); if (!nav) return;
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

  const closeBtn = shadowRootRef.getElementById('ss-nav-close');
  if (closeBtn) closeBtn.onclick = () => toggleSidePanel('ss-nav');
}

// ─── VIEW / TAB SWITCHING ──────────────────────────────────────────────────
export function switchView(view) {
  closeAllExtraPanels();
  state.view = view;
  const sb = shadowRootRef.getElementById('ss-settings-btn'), bb = shadowRootRef.getElementById('ss-back-btn');
  const nav = shadowRootRef.getElementById('ss-nav');
  const labelEl = shadowRootRef.getElementById('ss-current-tab-label');

  if (view === 'settings') {
    sb && (sb.style.display = 'none'); bb && (bb.style.display = 'flex');
    if (nav) nav.classList.remove('open');
    if (labelEl) labelEl.textContent = 'Preference';
    const link = shadowRootRef.getElementById('ss-tab-external-link');
    if (link) link.style.display = 'none';

    renderProjectSwitcherPanel();
    renderSettings();

    // Auto-open project switcher
    setTimeout(() => {
      const p = shadowRootRef.getElementById('ss-project-switcher-panel');
      if (p) p.classList.add('open');
    }, 0);
  } else {
    // Close project switcher when leaving settings
    const p = shadowRootRef.getElementById('ss-project-switcher-panel');
    if (p) p.classList.remove('open');
    sb && (sb.style.display = 'flex'); bb && (bb.style.display = 'none');

    if (labelEl) {
      let label = 'Variables';
      if (state.activeTab === 'tags') label = 'Tags';
      if (state.activeTab === 'contacts') label = 'Contacts';
      if (state.activeTab === 'log') label = 'Action Logs';
      if (state.activeTab === 'info') label = 'About';
      labelEl.textContent = label;
    }

    if (state.activeTab === 'tags') renderTagsTab();
    else if (state.activeTab === 'contacts') renderContactsTab();
    else if (state.activeTab === 'info') renderInfoTab();
    else if (state.activeTab === 'log') renderLogsTab();
    else renderVarsTab();

    updateExternalLink(state.activeTab);
  }
}

export function switchTab(tab) {
  if (state.view === 'settings') switchView('main');
  state.activeTab = tab; saveLastTab(state.projectId, tab);
  let label = 'Variables';
  if (tab === 'tags') label = 'Tags';
  if (tab === 'contacts') label = 'Contacts';
  if (tab === 'log') label = 'Action Logs';
  if (tab === 'info') label = 'About';
  const labelEl = shadowRootRef.getElementById('ss-current-tab-label');
  if (labelEl) labelEl.textContent = label;
  renderNav();
  updateExternalLink(tab);
  if (tab === 'tags') renderTagsTab();
  else if (tab === 'contacts') renderContactsTab();
  else if (tab === 'log') renderLogsTab();
  else if (tab === 'info') renderInfoTab();
  else renderVarsTab();
}

export function updateExternalLink(tab) {
  const link = shadowRootRef.getElementById('ss-tab-external-link');
  if (!link) return;

  if (tab === 'log' || tab === 'info') { link.style.display = 'none'; return; }

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

export const toggleSidePanel = (id) => {
    const panels = [
      'ss-nav', 'ss-info-panel',
      'ss-contact-search-hist', 'ss-contact-fav-panel', 'ss-contact-settings-panel',
      'ss-var-search-hist', 'ss-var-presets-panel', 'ss-var-fav-panel',
      'ss-tag-search-hist', 'ss-tag-fav-panel',
      'ss-project-switcher-panel', 'ss-extra-panel'
    ];
    const target = shadowRootRef.getElementById(id);
    if (!target) return;

    const isExtra = ['ss-contact-search-hist', 'ss-var-search-hist', 'ss-tag-search-hist', 'ss-info-panel', 'ss-contact-fav-panel', 'ss-var-fav-panel', 'ss-tag-fav-panel', 'ss-var-presets-panel', 'ss-contact-settings-panel'].includes(id);

    const alreadyOpenId = panels.find(pId => {
      const p = shadowRootRef.getElementById(pId);
      return p && p !== target && p.classList.contains('open');
    });

    if (alreadyOpenId === id) return;

    if (alreadyOpenId) {
      if (isExtra && ['ss-contact-search-hist', 'ss-var-search-hist', 'ss-tag-search-hist', 'ss-info-panel', 'ss-contact-fav-panel', 'ss-var-fav-panel', 'ss-tag-fav-panel', 'ss-var-presets-panel', 'ss-contact-settings-panel'].includes(alreadyOpenId)) {
        shadowRootRef.getElementById(alreadyOpenId).classList.remove('open');
      } else {
        panels.forEach(pid => shadowRootRef.getElementById(pid)?.classList.remove('open'));
      }
    }
    
    target.classList.toggle('open');
};

  export function buildSidebar() {
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
             <div id="ss-footer-version" style="font-size:11px;color:var(--text5);font-family:Roboto,sans-serif;margin-top:4px;">v${chrome.runtime.getManifest().version}</div>
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
