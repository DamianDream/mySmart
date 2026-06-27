import { state } from '../core/state.js';
import { loadFromCache, saveToStorage, saveVarHistory, loadVarHistory, loadSearchHist, saveSearchHist, loadVarPresets, saveVarPresets, getPreset, loadTagSearchHist, saveTagSearchHist, loadContactSearchHist, saveContactSearchHist, loadContactSettings, saveContactSettings, loadLogs, saveLogs, saveGlobalSettings, loadContactPriorityVars, saveContactPriorityVars, saveContactFavorites } from '../core/storage.js';
import { getUrlContactId, getFullProjectFromUrl } from '../utils/url.js';
import { toggleSidePanel } from '../ui/sidebar.js';
import { showNotice, copyToClipboard, esc, shadowRootRef, debounce } from '../utils/dom.js';
import { logAction, clearLogs } from '../core/logger.js';
import { bgFetch, authHeaders } from '../core/api.js';
import { checkForUpdates } from '../core/updater.js';
import { countContacts, searchDefinitions, fetchDefinitionsByIds, updateDefinition, searchTags } from '../models/smartsender.js';
import { findContacts, renderContactInfoPanel } from './contacts.js';
import { iCopy, iEdit, iDone, iReset, iHistory, iSearch, iPreset, iStar, iStarFill, iSave, iTrash, iPen, iAddToPreset, iBack, iX, iTag, iFunnel, iChat, iGear, iExternal } from '../icons.js';



// ─── ABOUT / INFO TAB ───────────────────────────────────────────────────────
  export function renderInfoTab() {
    const body = shadowRootRef.getElementById('ss-body');
    const settings = state.globalSettings;
    const currentVer = chrome.runtime.getManifest().version;
    const isOutdated = state.updatePending;
    
    const iconCheckSolid = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`;
    const iconRefresh = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>`;
    
    const lastCheckMs = loadFromCache('ss_last_update_check', 0);
    let lastCheckedText = 'Never';
    if (lastCheckMs) {
      const d = new Date(lastCheckMs);
      const now = new Date();
      const isToday = d.toDateString() === now.toDateString();
      const timeStr = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      lastCheckedText = isToday ? `Today at ${timeStr}` : `${d.toLocaleDateString()} at ${timeStr}`;
    }

    body.innerHTML = `
      <div style="background:var(--bg2); border:1px solid var(--border); border-radius:8px; padding:16px; margin-bottom:16px; text-align:left;">
        <div style="font-size:16px; font-weight:700; color:var(--text); margin-bottom:6px;">
          Local Version: v${currentVer}
        </div>
        ${isOutdated 
          ? `<div style="display:flex;align-items:center;gap:6px;font-size:13px;font-weight:600;color:var(--error);">
               ${iconRefresh} Update Ready: v${state.newVersion || 'latest'}
             </div>`
          : `<div style="display:flex;align-items:center;gap:6px;font-size:13px;font-weight:600;color:#22c55e;">
               ${iconCheckSolid} Version is up to date
             </div>`
        }
        <div style="height:2px;background:var(--border);margin:16px 0;opacity:0.6;"></div>
        
        ${isOutdated
          ? `<button class="ss-btn" id="ss-btn-apply-update" style="width:100%;height:40px;border-radius:8px;background:var(--error);color:white;font-weight:600;font-size:14px;display:flex;align-items:center;justify-content:center;gap:8px;border:none;cursor:pointer;">
               ${iconRefresh} Restart to Update
             </button>`
          : `<button class="ss-btn" id="ss-btn-check-update" style="width:100%;height:40px;border-radius:8px;background:var(--accent);color:var(--accent-text);font-weight:600;font-size:14px;display:flex;align-items:center;justify-content:center;gap:8px;border:none;cursor:pointer;">
               ${iconRefresh} Check for Updates
             </button>`
        }
        
        <div style="font-size:12px;font-weight:600;color:var(--text4);text-align:center;margin-top:12px;">
          Last checked: ${lastCheckedText}
        </div>
      </div>

        <div style="font-size:12px;color:var(--text4);margin-top:12px;line-height:1.4;padding:0 10px;">
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
        <div id="ss-feedback-msg" style="display:none;font-size:13px;padding:8px;border-radius:4px;margin-top:4px;"></div>
        <button id="ss-feedback-submit" class="ss-btn-search" style="justify-content:center;margin-top:4px;padding:10px;color:var(--accent-text);">Send Feedback</button>
      </div>

      <div id="ss-feedback-success-container" style="display:none; background:var(--bg2); border:1px solid var(--border); border-radius:6px; padding:32px 16px; flex-direction:column; align-items:center; gap:12px; text-align:center;">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
        <div style="font-size:16px;font-weight:600;color:var(--text2);margin-top:8px;">Feedback Sent!</div>
        <div style="font-size:13px;color:var(--text4);">Thank you for helping us improve SmartSender Assistant.</div>
      </div>
    `;

    const nameIn = shadowRootRef.getElementById('ss-feedback-name');
    const emailIn = shadowRootRef.getElementById('ss-feedback-email');
    const typeIn = shadowRootRef.getElementById('ss-feedback-type');
    const descIn = shadowRootRef.getElementById('ss-feedback-desc');
    const btn = shadowRootRef.getElementById('ss-feedback-submit');
    const msgEl = shadowRootRef.getElementById('ss-feedback-msg');

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
        }
      };

      try {
        const res = await fetch('https://extension-feedback-api.batalshikov-d.workers.dev/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Failed to send feedback');
        const formContainer = shadowRootRef.getElementById('ss-feedback-form-container');
        const successContainer = shadowRootRef.getElementById('ss-feedback-success-container');
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

    const updateBtn = shadowRootRef.getElementById('ss-btn-check-update');
    if (updateBtn) {
      updateBtn.addEventListener('click', () => {
        updateBtn.disabled = true;
        updateBtn.innerHTML = 'Checking...';
        checkForUpdates(true);
        setTimeout(() => {
          if (updateBtn) {
             updateBtn.disabled = false;
             updateBtn.innerHTML = 'Check for Updates';
          }
        }, 3000);
      });
    }

    const applyUpdateBtn = shadowRootRef.getElementById('ss-btn-apply-update');
    if (applyUpdateBtn) {
      applyUpdateBtn.addEventListener('click', () => {
        chrome.runtime.reload();
      });
    }
  }

  export function renderContactsTab() {
    const body = shadowRootRef.getElementById('ss-body');
    body.innerHTML = `
      <div style="margin-bottom:12px;">
        <div style="display:flex;gap:12px;align-items:center;margin-bottom:8px;">
          <span class="ss-text-link" id="ss-contact-hist-btn">HISTORY</span>
          <span class="ss-text-link" id="ss-contact-settings-btn">OPTIONS</span>
          <span class="ss-text-link" id="ss-contact-fav-btn" style="${state.contactFavorites.length > 0 ? '' : 'display:none;'}">FAVORITE</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:8px;">
          <input class="ss-input" id="ss-contact-input" type="text" placeholder="Email or User ID" autocomplete="off" style="width:100%;box-sizing:border-box;" />
          <div style="display:flex;gap:8px;align-items:center;">
            <button class="ss-btn-search" id="ss-contact-btn" title="Search" style="flex:1;justify-content:center;background:var(--accent);color:var(--accent-text);">Search</button>
            <button class="ss-btn-search" id="ss-contact-reset-btn" title="Reset Search" style="width:auto;padding:8px 12px;justify-content:center;background:var(--bg3);color:var(--text2);">${iReset.replace('width="24" height="24"', 'width="16" height="16"')}</button>
          </div>
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

  export async function checkActiveContactUrl() {
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
    const input = shadowRootRef.getElementById('ss-contact-input');
    const btn = shadowRootRef.getElementById('ss-contact-btn');
    const load = shadowRootRef.getElementById('ss-contact-loading');
    const errEl = shadowRootRef.getElementById('ss-contact-error');
    const histBtn = shadowRootRef.getElementById('ss-contact-hist-btn');
    const histPanel = shadowRootRef.getElementById('ss-contact-search-hist');
    const favBtn = shadowRootRef.getElementById('ss-contact-fav-btn');
    const favPanel = shadowRootRef.getElementById('ss-contact-fav-panel');
    const setBtn = shadowRootRef.getElementById('ss-contact-settings-btn');
    const setPanel = shadowRootRef.getElementById('ss-contact-settings-panel');

    const toggleHist = () => {
      state.contactShowSearchHist = !state.contactShowSearchHist;
      if (!state.contactShowSearchHist) {
        shadowRootRef.getElementById('ss-contact-search-hist').classList.remove('open');
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
            <button class="ss-close ss-close-extra-panel">${iX}</button>
          </div>
          <div class="ss-panel-search-wrapper">
            <input type="text" class="ss-panel-search-input" id="ss-hist-filter" placeholder="Quick search..." value="${esc(filter)}">
          </div>
          <div class="ss-panel-list-content">
            ${listHtml}
          </div>
        `;

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
    const resetBtn = shadowRootRef.getElementById('ss-contact-reset-btn');
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
    const p = shadowRootRef.getElementById('ss-contact-fav-panel'); if (!p) return;
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
          <button class="ss-close ss-close-extra-panel">${iX}</button>
        </div>
        <div class="ss-panel-search-wrapper">
          <input type="text" class="ss-panel-search-input" id="ss-fav-filter" placeholder="Filter favorites..." value="${esc(filter)}">
        </div>
        <div class="ss-panel-list-content">
          ${listHtml}
        </div>
      `;

      // Global close handles this

      const filterInput = p.querySelector('#ss-fav-filter');
      filterInput.focus();
      filterInput.oninput = (e) => renderFavList(e.target.value);

      p.querySelectorAll('.ss-hist-term[data-id]').forEach(el => {
        el.onclick = () => {
          shadowRootRef.getElementById('ss-contact-input').value = el.dataset.id;
          state.contactShowFavorites = false;
          p.classList.remove('open');
          shadowRootRef.getElementById('ss-contact-fav-btn').classList.remove('active');
          const btn = shadowRootRef.getElementById('ss-contact-btn');
          if (btn) btn.click();
        };
      });
    };

    renderFavList();
  }

  function renderContactSettingsPanel() {
    const p = shadowRootRef.getElementById('ss-contact-settings-panel'); if (!p) return;
    const pid = state.projectId;
    const priorityVars = loadContactPriorityVars(pid);

    p.innerHTML = `
      <div class="ss-info-header">
        <div class="ss-info-title">Options</div>
        <button class="ss-close ss-close-extra-panel">${iX}</button>
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
    const list = shadowRootRef.getElementById('ss-contact-list'); if (!list) return;
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
            <div style="font-size:13px;color:var(--text4);">ID: <span style="color:var(--accent);font-weight:600;">${c.id}</span></div>
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
        const favBtnTab = shadowRootRef.getElementById('ss-contact-fav-btn');
        if (favBtnTab) favBtnTab.style.display = state.contactFavorites.length > 0 ? '' : 'none';
        const fp = shadowRootRef.getElementById('ss-contact-fav-panel');
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


  

  
