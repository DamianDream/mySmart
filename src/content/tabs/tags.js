import { state } from '../core/state.js';
import { loadFromCache, saveToStorage, saveVarHistory, loadVarHistory, loadSearchHist, saveSearchHist, loadVarPresets, saveVarPresets, getPreset, loadTagSearchHist, saveTagSearchHist, loadContactSearchHist, saveContactSearchHist, loadContactSettings, saveContactSettings, loadLogs, saveLogs, saveTagFavorites } from '../core/storage.js';
import { getUrlContactId, getFullProjectFromUrl } from '../utils/url.js';
import { toggleSidePanel } from '../ui/sidebar.js';
import { showNotice, copyToClipboard, esc, shadowRootRef, debounce } from '../utils/dom.js';
import { logAction, clearLogs } from '../core/logger.js';
import { bgFetch } from '../core/api.js';
import { checkForUpdates } from '../core/updater.js';
import { countContacts, searchDefinitions, fetchDefinitionsByIds, updateDefinition, searchTags } from '../models/smartsender.js';
import { iCopy, iEdit, iDone, iReset, iHistory, iSearch, iPreset, iStar, iStarFill, iSave, iTrash, iPen, iAddToPreset, iBack, iX, iTag, iFunnel, iChat, iGear } from '../icons.js';



// ─── TAGS TAB ─────────────────────────────────────────────────────────────
  export function renderTagsTab() {
    const body = shadowRootRef.getElementById('ss-body');
    const pid = state.projectId;
    const hasHist = pid ? loadTagSearchHist(pid).length > 0 : false;
    const hasFavs = state.tagFavorites.length > 0;

    body.innerHTML = `
      <div style="margin-bottom:14px;">
        <div style="display:flex;gap:12px;align-items:center;margin-bottom:8px;">
          <span class="ss-text-link ${state.tagShowSearchHist ? 'active' : ''}" id="ss-tag-hist-btn" style="${hasHist ? '' : 'display:none;'}">HISTORY</span>
          <span class="ss-text-link ${state.tagShowFavorites ? 'active' : ''}" id="ss-tag-fav-btn" style="${hasFavs ? '' : 'display:none;'}">FAVORITES</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:8px;">
          <input class="ss-input" id="ss-tag-input" type="text" placeholder="tag name" autocomplete="off" style="width:100%;box-sizing:border-box;" />
          <div style="display:flex;gap:8px;align-items:center;">
            <button class="ss-btn-search" id="ss-btn-search" title="Search" style="flex:1;justify-content:center;background:var(--accent);color:#fff;">Search</button>
            <button class="ss-btn-search" id="ss-btn-tag-reset" title="Reset Search" style="width:auto;padding:8px 12px;justify-content:center;background:var(--bg3);color:var(--text2);">${iReset.replace('width="24" height="24"', 'width="16" height="16"')}</button>
          </div>
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
    const listEl = shadowRootRef.getElementById('ss-tag-list'); if (!listEl) return;
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
        renderTagsTab();
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
    const p = shadowRootRef.getElementById('ss-tag-search-hist'); if (!p) return;
    const hist = loadTagSearchHist(state.projectId);
    const tagInput = shadowRootRef.getElementById('ss-tag-input');

    const renderHistList = (filter = '') => {
      const filtered = hist.filter(t => t.toLowerCase().includes(filter.toLowerCase()));
      const listHtml = filtered.length
        ? filtered.map(t => `<div class="ss-hist-term" data-term="${esc(t)}">${esc(t)}</div>`).join('')
        : `<div class="ss-hist-term" style="opacity:0.5;cursor:default;">${filter ? 'No matches' : 'No history'}</div>`;

      p.innerHTML = `
        <div class="ss-info-header">
          <div class="ss-info-title">Search History</div>
          <button class="ss-close ss-close-extra-panel">${iX}</button>
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
          shadowRootRef.getElementById('ss-tag-hist-btn')?.classList.remove('active');
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
            const searchBtn = shadowRootRef.getElementById('ss-btn-search');
            if (searchBtn) searchBtn.click();
          }
          state.tagShowSearchHist = false;
          p.classList.remove('open');
          shadowRootRef.getElementById('ss-tag-hist-btn')?.classList.remove('active');
        };
      });
    };

    renderHistList();
  }

  function renderTagFavPanel() {
    const p = shadowRootRef.getElementById('ss-tag-fav-panel'); if (!p) return;
    p.innerHTML = `
      <div class="ss-info-header">
        <div class="ss-info-title">Favorite Tags</div>
        <button class="ss-close ss-close-extra-panel">${iX}</button>
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
        renderTagsTab();
      };
    });
  }

  function bindTagEvents() {
    const searchBtn = shadowRootRef.getElementById('ss-btn-search'), tagInput = shadowRootRef.getElementById('ss-tag-input');
    const resetBtn = shadowRootRef.getElementById('ss-btn-tag-reset');
    const histBtn = shadowRootRef.getElementById('ss-tag-hist-btn');
    const favBtn = shadowRootRef.getElementById('ss-tag-fav-btn');

    async function doSearch() {
      const term = tagInput?.value.trim(); if (!term) return;
      if (!state.projectId) { showNotice('Project not selected'); return; }
      if (state.isSearching) return;
      logAction('Search Tags', `Query: "${term}"`);
      state.isSearching = true;
      if (searchBtn) { searchBtn.disabled = true; searchBtn.innerHTML = '...'; }
      const l = shadowRootRef.getElementById('ss-tag-loading'); if (l) l.style.display = 'block';
      state.tagSearchPerformed = true;
      try {
        const data = await searchTags(state.projectId, term);
        state.tagResults = data.collection || [];
        saveTagSearchHist(state.projectId, term);
        renderTagList();
      } catch (err) { showNotice(err.message); }
      finally { state.isSearching = false; if (l) l.style.display = 'none'; if (searchBtn) { searchBtn.disabled = false; searchBtn.innerHTML = iSearch.replace('width="24" height="24"', 'width="16" height="16"'); } renderTagsTab(); }
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
      renderTagsTab();
    });
    histBtn?.addEventListener('click', () => {
      state.tagShowSearchHist = !state.tagShowSearchHist;
      if (state.tagShowSearchHist) {
        state.tagShowFavorites = false;
        shadowRootRef.getElementById('ss-tag-fav-btn')?.classList.remove('active');
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
        shadowRootRef.getElementById('ss-tag-hist-btn')?.classList.remove('active');
        favBtn.classList.add('active');
        renderTagFavPanel();
        toggleSidePanel('ss-tag-fav-panel');
      } else {
        favBtn.classList.remove('active');
        toggleSidePanel('ss-tag-fav-panel');
      }
    });
  }

  

  
