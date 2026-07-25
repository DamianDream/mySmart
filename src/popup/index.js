// Contact pop-up window. A detached window that hosts multiple contact cards as
// in-window tabs. Each contact selection in the side panel adds a tab here;
// switching tabs is instant (cached), and each tab has a force-refresh button.
import styles from '../sidebar.css?inline';
import { setShadowRoot } from '../content/utils/dom.js';
import { initStorage, loadContactSettings, loadContactPriorityVars } from '../content/core/storage.js';
import { initState, state } from '../content/core/state.js';
import { applyTheme } from '../content/ui/themes.js';
import { fetchContactInfo, updateContactVar } from '../content/tabs/contacts.js';
import { mountContactCard } from '../content/ui/contactCard.js';
import { esc } from '../content/utils/dom.js';
import { iReset, iX } from '../content/icons.js';

const QUEUE_KEY = 'ss_popup_queue';

const POPUP_CSS = `
  #ss-sidebar {
    position: relative !important;
    inset: auto !important;
    width: 100% !important;
    min-width: 0 !important;
    max-width: none !important;
    height: 100vh !important;
    transform: none !important;
    box-shadow: none !important;
    border: none !important;
    display: flex;
    flex-direction: column;
  }
  /* Sit above the #ss-sidebar::before frosted-glass layer (z-index:0). */
  .ssp-tabs, .ssp-content { position: relative; z-index: 1; }
  .ssp-tabs { display: flex; align-items: stretch; gap: 2px; padding: 6px 6px 0; background: var(--bg-solid); border-bottom: 1px solid var(--border); overflow-x: auto; flex-shrink: 0; }
  .ssp-tab { display: flex; align-items: center; gap: 6px; max-width: 200px; padding: 8px 10px; border-radius: 8px 8px 0 0; background: var(--bg2); color: var(--text4); font-family: var(--font-main); font-size: 13px; font-weight: 600; cursor: pointer; white-space: nowrap; border: 1px solid transparent; border-bottom: none; }
  .ssp-tab.active { background: var(--bg3); color: var(--text); }
  .ssp-tab-name { overflow: hidden; text-overflow: ellipsis; max-width: 130px; }
  .ssp-tab-close { display: inline-flex; align-items: center; justify-content: center; width: 16px; height: 16px; border-radius: 4px; opacity: 0.6; }
  .ssp-tab-close:hover { opacity: 1; background: rgba(255,255,255,0.1); }
  .ssp-tab-close svg { width: 12px; height: 12px; }
  .ssp-content { flex: 1; overflow-y: auto; display: flex; flex-direction: column; }
  .ssp-toolbar { display: flex; align-items: center; justify-content: space-between; padding: 8px 16px; border-bottom: 1px solid var(--border); background: var(--bg-solid); }
  .ssp-toolbar-title { font-family: var(--font-main); font-size: 14px; font-weight: 700; color: var(--text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .ssp-refresh { display: inline-flex; align-items: center; gap: 6px; padding: 6px 10px; border-radius: 8px; background: var(--bg3); color: var(--text2); font-family: var(--font-main); font-size: 12px; font-weight: 600; cursor: pointer; border: none; flex-shrink: 0; }
  .ssp-refresh:hover { background: var(--accent-bg); color: var(--accent); }
  .ssp-refresh svg { width: 14px; height: 14px; }
  .ssp-refresh.spinning svg { animation: ssp-spin 0.8s linear infinite; }
  @keyframes ssp-spin { to { transform: rotate(360deg); } }
  .ssp-empty { flex: 1; display: flex; align-items: center; justify-content: center; color: var(--text4); font-family: var(--font-main); font-size: 14px; padding: 24px; text-align: center; }
`;

let shadowRoot = null;
let tabsEl = null;
let contentEl = null;
const tabs = [];      // { contactId, projectSlug, name, data, status, error }
let activeId = null;

function getTab(id) { return tabs.find(t => t.contactId === id); }

function renderTabs() {
  tabsEl.innerHTML = tabs.map(t => `
    <div class="ssp-tab${t.contactId === activeId ? ' active' : ''}" data-id="${esc(t.contactId)}">
      <span class="ssp-tab-name">${esc(t.name || t.contactId)}</span>
      <span class="ssp-tab-close" data-close="${esc(t.contactId)}" title="Close tab">${iX}</span>
    </div>
  `).join('');

  tabsEl.querySelectorAll('.ssp-tab').forEach(el => {
    el.onclick = (e) => {
      if (e.target.closest('[data-close]')) return;
      setActive(el.dataset.id);
    };
  });
  tabsEl.querySelectorAll('[data-close]').forEach(el => {
    el.onclick = (e) => { e.stopPropagation(); closeTab(el.dataset.close); };
  });
}

function renderContent() {
  const tab = getTab(activeId);
  if (!tab) {
    contentEl.innerHTML = `<div class="ssp-empty">No contact open.<br>Select a contact in the side panel.</div>`;
    return;
  }

  const title = tab.data ? (tab.data.fullName || tab.data.name || tab.contactId) : tab.contactId;
  contentEl.innerHTML = `
    <div class="ssp-toolbar">
      <div class="ssp-toolbar-title">${esc(title)}</div>
      <button class="ssp-refresh" id="ssp-refresh-btn" title="Reload this contact's data">${iReset} Refresh</button>
    </div>
    <div class="ssp-card" id="ssp-card"></div>
  `;
  contentEl.querySelector('#ssp-refresh-btn').onclick = () => loadContact(tab.contactId, true);

  const card = contentEl.querySelector('#ssp-card');
  if (tab.status === 'loading') {
    card.innerHTML = `<div class="ss-loading" style="display:flex;padding:24px;"><div class="ss-spinner"></div><span class="ss-loading-text">Loading details...</span></div>`;
  } else if (tab.status === 'error') {
    card.innerHTML = `<div class="ss-error visible" style="margin:16px;">⚠ ${esc(tab.error || 'Failed to load')}</div>`;
  } else if (tab.data) {
    mountContactCard(card, tab.data, {
      settings: loadContactSettings(),
      priorityKeys: loadContactPriorityVars(tab.projectSlug).split(',').map(s => s.trim().toLowerCase()).filter(Boolean),
      projectSlug: tab.projectSlug,
      editable: true,
      onSave: async (key, value) => {
        state.projectId = tab.projectSlug;          // resolve token by project slug
        await updateContactVar(tab.contactId, key, value);
        const fresh = await fetchContactInfo(tab.contactId);
        tab.data = fresh;                            // keep the tab cache in sync
        tab.name = fresh.fullName || fresh.name || tab.contactId;
        renderTabs();
        return fresh;
      }
    });
  }
}

function setActive(id) {
  activeId = id;
  renderTabs();
  renderContent();
}

function closeTab(id) {
  const idx = tabs.findIndex(t => t.contactId === id);
  if (idx === -1) return;
  tabs.splice(idx, 1);
  if (activeId === id) activeId = tabs.length ? tabs[Math.max(0, idx - 1)].contactId : null;
  renderTabs();
  renderContent();
}

async function loadContact(id, force = false) {
  const tab = getTab(id);
  if (!tab) return;
  if (tab.status === 'ready' && !force) return;
  tab.status = 'loading';
  if (id === activeId) renderContent();

  const btn = contentEl.querySelector('#ssp-refresh-btn');
  if (force && btn) btn.classList.add('spinning');

  try {
    state.projectId = tab.projectSlug;     // authHeaders() resolves the token by project slug
    const data = await fetchContactInfo(id);
    tab.data = data;
    tab.name = data.fullName || data.name || id;
    tab.status = 'ready';
  } catch (err) {
    tab.status = 'error';
    tab.error = err.message;
  }
  renderTabs();
  if (id === activeId) renderContent();
}

function openContact(contactId, projectSlug) {
  contactId = String(contactId);
  let tab = getTab(contactId);
  if (!tab) {
    tab = { contactId, projectSlug, name: contactId, data: null, status: 'idle', error: null };
    tabs.push(tab);
    setActive(contactId);
    loadContact(contactId);
  } else {
    setActive(contactId);     // already open — just focus the tab, no refetch
  }
}

async function drainQueue() {
  let queue = [];
  try {
    const got = await chrome.storage.session.get(QUEUE_KEY);
    queue = got[QUEUE_KEY] || [];
    await chrome.storage.session.set({ [QUEUE_KEY]: [] });
  } catch { /* ignore */ }
  queue.forEach(req => openContact(req.contactId, req.projectSlug));
}

async function start() {
  const root = document.getElementById('ss-popup-root');
  shadowRoot = root.attachShadow({ mode: 'open' });

  const styleEl = document.createElement('style');
  styleEl.textContent = styles + POPUP_CSS;
  shadowRoot.appendChild(styleEl);

  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap';
  shadowRoot.appendChild(fontLink);

  const wrap = document.createElement('div');
  wrap.id = 'ss-sidebar';
  wrap.innerHTML = `<div class="ssp-tabs" id="ssp-tabs"></div><div class="ssp-content" id="ssp-content"></div>`;
  shadowRoot.appendChild(wrap);

  setShadowRoot(shadowRoot);
  tabsEl = shadowRoot.getElementById('ssp-tabs');
  contentEl = shadowRoot.getElementById('ssp-content');

  await initStorage();
  initState();
  applyTheme(state.theme);

  renderTabs();
  renderContent();

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg?.type === 'SS_POPUP_DRAIN') drainQueue();
  });

  await drainQueue();
}

start();
