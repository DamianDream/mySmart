import { state } from '../core/state.js';
import { loadFromCache, saveToStorage, saveVarHistory, loadVarHistory, loadSearchHist, saveSearchHist, loadVarPresets, saveVarPresets, loadVarFavorites, saveVarFavorites, getPreset, loadTagSearchHist, saveTagSearchHist, loadContactSearchHist, saveContactSearchHist, loadContactSettings, saveContactSettings, loadLogs, saveLogs } from '../core/storage.js';
import { getUrlContactId, getFullProjectFromUrl } from '../utils/url.js';
import { toggleSidePanel } from '../ui/sidebar.js';
import { showNotice, copyToClipboard, esc, shadowRootRef, debounce } from '../utils/dom.js';
import { logAction, clearLogs } from '../core/logger.js';
import { bgFetch } from '../core/api.js';
import { checkForUpdates } from '../core/updater.js';
import { searchDefinitions, fetchDefinitionsByIds, updateDefinition, searchTags, verifyDefinition } from '../models/smartsender.js';
import { iCopy, iEdit, iDone, iReset, iHistory, iSearch, iPreset, iStar, iStarFill, iSave, iTrash, iPen, iAddToPreset, iBack, iX, iTag, iFunnel, iChat, iGear, iPlus } from '../icons.js';
/* global Event */



// ─── VARS TAB ─────────────────────────────────────────────────────────────

  export function renderVarsTab() {
    const body = shadowRootRef.getElementById('ss-body');
    
    let detectedVarsHtml = '';
    const detectedValues = new Set();
    if (location.href.startsWith('https://messenger.smartsender.com/funnels/')) {
      document.querySelectorAll('.variable-template').forEach(vt => {
        const parentSpan = vt.closest('span');
        if (parentSpan) {
          let fv = parentSpan.querySelector('.formatted-value');
          if (!fv && parentSpan.parentElement) fv = parentSpan.parentElement.querySelector('.formatted-value');
          if (fv) {
            const val = fv.textContent.trim();
            if (val && val !== 'null' && val !== 'undefined') detectedValues.add(val);
          }
        }
      });
    }

    if (detectedValues.size > 0) {
      detectedVarsHtml = `
        <div class="ss-detected-vars" id="ss-detected-vars-container">
          <div class="ss-detected-vars-title">Detected on page:</div>
          ${Array.from(detectedValues).map(v => `<div class="ss-var-pill" data-val="${esc(v)}">${esc(v)}</div>`).join('')}
          <div class="ss-var-pill-action" id="ss-var-pill-select-all">Select All</div>
        </div>
      `;
    }

    body.innerHTML = `
      <div style="margin-bottom:12px;">
        <div style="display:flex;gap:12px;align-items:center;margin-bottom:8px;">
          <span class="ss-text-link" id="ss-var-hist-btn">HISTORY</span>
          <span class="ss-text-link" id="ss-var-preset-btn">PRESETS</span>
          <span class="ss-text-link" id="ss-var-fav-tab-btn" style="${state.varFavorites.length > 0 ? '' : 'display:none;'}">FAVORITES</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:8px;">
          <input class="ss-input" id="ss-var-input" type="text" placeholder="name1, name2, name3" autocomplete="off" style="width:100%;box-sizing:border-box;" />
          <div style="display:flex;gap:8px;align-items:center;">
            <button class="ss-btn-search" id="ss-var-btn" title="Search" style="flex:1;justify-content:center;background:var(--accent);color:var(--accent-text);">Search</button>
            <button class="ss-btn-search" id="ss-var-reset-btn" title="Reset Search" style="width:auto;padding:8px 12px;justify-content:center;background:var(--bg3);color:var(--text2);">${iReset.replace('width="24" height="24"', 'width="16" height="16"')}</button>
          </div>
        </div>
        ${detectedVarsHtml}
      </div>
      <div id="ss-var-list" style="display:flex;flex-direction:column;gap:6px;"></div>
      <div class="ss-error" id="ss-var-error"></div>
      <div class="ss-loading" id="ss-var-loading" style="display:none;"><div class="ss-spinner"></div><span class="ss-loading-text">Searching...</span></div>
    `;

    const input = shadowRootRef.getElementById('ss-var-input');
    const btn = shadowRootRef.getElementById('ss-var-btn');
    const listEl = shadowRootRef.getElementById('ss-var-list');
    const errEl = shadowRootRef.getElementById('ss-var-error');
    const loadEl = shadowRootRef.getElementById('ss-var-loading');
    const histPanel = shadowRootRef.getElementById('ss-var-search-hist');
    const presetsPanel = shadowRootRef.getElementById('ss-var-presets-panel');
    const favPanel = shadowRootRef.getElementById('ss-var-fav-panel');

    const updateInputFromPills = () => {
      const activePills = Array.from(shadowRootRef.querySelectorAll('.ss-var-pill.active')).map(p => p.dataset.val);
      input.value = activePills.join(', ');
      if (activePills.length > 0) {
        if (state.globalSettings.autoFetch) doSearch();
      } else {
        input.dispatchEvent(new Event('input')); // trigger debounce logic
      }
    };

    shadowRootRef.querySelectorAll('.ss-var-pill').forEach(pill => {
      pill.onclick = () => {
        pill.classList.toggle('active');
        updateInputFromPills();
      };
    });

    const selectAllBtn = shadowRootRef.getElementById('ss-var-pill-select-all');
    if (selectAllBtn) {
      selectAllBtn.onclick = () => {
        shadowRootRef.querySelectorAll('.ss-var-pill').forEach(p => p.classList.add('active'));
        updateInputFromPills();
      };
    }

    const showVarErr = (msg) => { errEl.textContent = `⚠ ${msg}`; errEl.classList.add('visible'); setTimeout(() => errEl.classList.remove('visible'), 5000); };

    // ── Search history panel ──
    function toggleSearchHist() {
      state.varShowSearchHist = !state.varShowSearchHist;
      if (!state.varShowSearchHist) {
        histPanel.classList.remove('open');
        shadowRootRef.getElementById('ss-var-hist-btn').classList.remove('active');
        return;
      }

      state.varPresetsOpen = false; presetsPanel.classList.remove('open'); shadowRootRef.getElementById('ss-var-preset-btn').classList.remove('active');
      state.varShowFavorites = false; favPanel.classList.remove('open'); shadowRootRef.getElementById('ss-var-fav-tab-btn').classList.remove('active');

      shadowRootRef.getElementById('ss-var-hist-btn').classList.add('active');
      const hist = loadSearchHist(state.projectId);

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
        shadowRootRef.getElementById('ss-var-preset-btn').classList.remove('active');
        return;
      }

      state.varShowSearchHist = false;
      histPanel.classList.remove('open');
      shadowRootRef.getElementById('ss-var-hist-btn').classList.remove('active');
      state.varShowFavorites = false;
      favPanel.classList.remove('open');
      shadowRootRef.getElementById('ss-var-fav-tab-btn').classList.remove('active');

      shadowRootRef.getElementById('ss-var-preset-btn').classList.add('active');
      toggleSidePanel('ss-var-presets-panel');

      const pid = state.projectId;
      function drawPresets() {
        const ps = loadVarPresets(pid);
        presetsPanel.innerHTML = `
          <div class="ss-info-header">
            <div class="ss-info-title">Presets</div>
            <div style="display:flex;gap:4px;align-items:center;">
              <button class="ss-close ss-close-extra-panel">${iX}</button>
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
                <button class="ss-var-btn ss-vpreset-config" data-pi="${i}" title="Configure Preset" style="background:none;">${iGear.replace('width="24" height="24"', 'width="14" height="14"')}</button>
                ${state.varPresetConfigPanelId === i ? `<button class="ss-var-btn ss-vpreset-edit" data-pi="${i}" title="Rename">${iPen}</button>` : ''}
                <button class="ss-var-btn ss-vpreset-delete" data-pi="${i}" title="Delete" style="background:none;">${iTrash.replace('width="24" height="24"', 'width="18" height="18"')}</button>
              </div>
              ${state.varPresetConfigPanelId === i ? `
                <div style="padding:6px 10px;background:var(--bg4);border-bottom:1px solid var(--border);">
                  <div id="ss-preset-cfg-list-${i}" style="margin-bottom:8px;font-size:13px;color:var(--text3);max-height:120px;overflow-y:auto;">
                      Loading variables...
                  </div>

                </div>
              ` : ''}
              `).join('')}
          <!-- Save / Create preset -->
          <div style="padding:8px 16px;border-top:1px solid var(--border);">
            <div style="display:flex;gap:6px;align-items:center;">
              <input class="ss-input" id="ss-new-preset-name" placeholder="Preset name..." style="flex:1;padding:6px 8px;font-size:13px;" />
              <button class="ss-var-btn ss-new-preset-save" title="Save">${iPlus}</button>
            </div>
          </div>
        `;

        // Rename (edit) logic remains but we removed header '+' and copy buttons
        // Save new preset (empty or from current results)
        presetsPanel.querySelector('.ss-new-preset-save')?.addEventListener('click', () => {
          const nameEl = shadowRootRef.getElementById('ss-new-preset-name');
          const name = nameEl?.value.trim();
          if (!name) { nameEl?.focus(); return; }
          const ps = loadVarPresets(pid);
          // If we have search results, use them; otherwise create empty
          const ids = state.varResults.length > 0 ? state.varResults.map(d => d.id) : [];
          const items = state.varResults.length > 0 ? state.varResults.map(d => ({ id: d.id, name: d.name })) : [];

          ps.push({ name, ids, items, ts: new Date().toISOString() });
          saveVarPresets(pid, ps);
          nameEl.value = '';
          drawPresets();
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
          const listDiv = shadowRootRef.getElementById(`ss-preset-cfg-list-${pi}`);
          if (listDiv && p) {
            if (!p.items || p.items.length !== p.ids.length) {
              p.items = p.ids.map(id => ({ id, name: '...' }));
              fetchDefinitionsByIds(p.ids).then(results => {
                p.items = p.ids.map(id => {
                  const f = results.find(r => r.id === id);
                  return f ? { id: f.id, name: f.name } : { id, name: 'Unknown' };
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
                     <button class="ss-var-btn" data-cfg-rm="${item.id}" title="Remove" style="background:none;">${iX.replace('width="24" height="24"', 'width="18" height="18"')}</button>
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
            // Collapse the presets panel and show results immediately (same as History)
            state.varPresetsOpen = false;
            presetsPanel.classList.remove('open');
            shadowRootRef.getElementById('ss-var-preset-btn')?.classList.remove('active');
            state.varPresetConfigPanelId = null;
            btn.disabled = true; btn.textContent = '...'; loadEl.style.display = 'flex';
            listEl.innerHTML = ''; state.varResults = []; state.varEditingId = null; state.varShowHistoryId = null;
            state.varViewingPresetId = pi;
            try {
              const results = await fetchDefinitionsByIds(preset.ids);
              state.varResults = preset.ids.map(id => results.find(r => r.id === id)).filter(Boolean);
              renderVarList(listEl, showVarErr);
            } catch (err) { showVarErr(err.message); }
            finally { btn.disabled = false; btn.innerHTML = iSearch.replace('width="24" height="24"', 'width="16" height="16"'); loadEl.style.display = 'none'; }
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
        shadowRootRef.getElementById('ss-var-fav-tab-btn').classList.remove('active');
        return;
      }

      state.varPresetsOpen = false; presetsPanel.classList.remove('open'); shadowRootRef.getElementById('ss-var-preset-btn').classList.remove('active');
      state.varShowSearchHist = false; histPanel.classList.remove('open'); shadowRootRef.getElementById('ss-var-hist-btn').classList.remove('active');

      shadowRootRef.getElementById('ss-var-fav-tab-btn').classList.add('active');
      const favs = loadVarFavorites();

      const renderFavList = (filter = '') => {
        const filtered = favs.filter(f => f.name.toLowerCase().includes(filter.toLowerCase()) || f.id.toString().includes(filter));
        const listHtml = filtered.length
          ? filtered.map((f, i) => `<div class="ss-hist-term" data-index="${favs.indexOf(f)}">${esc(f.name)} <span style="font-size:11px;color:var(--text4);margin-left:auto;">${f.id}</span></div>`).join('')
          : `<div class="ss-hist-term" style="opacity:0.5;cursor:default;">${filter ? 'No matches' : 'No favorites yet'}</div>`;

        favPanel.innerHTML = `
          <div class="ss-info-header">
            <div class="ss-info-title">Favorites</div>
            <button class="ss-close ss-close-extra-panel">${iX}</button>
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
      logAction('Search Variables', `Query: "${raw}"`);
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
      finally { btn.disabled = false; btn.innerHTML = iSearch.replace('width="24" height="24"', 'width="16" height="16"'); loadEl.style.display = 'none'; }
    }

    btn.onclick = doSearch;
    if (input) {
      input.onkeydown = (e) => { if (e.key === 'Enter') doSearch(); };
      input.addEventListener('input', debounce((e) => {
        const val = e.target.value.trim();
        if (val.length >= 2) {
          if (state.globalSettings.autoFetch) doSearch();
        }
        else if (!val) { state.varResults = []; renderVarList(listEl, showVarErr); }
      }, 400));
    }

    shadowRootRef.getElementById('ss-var-hist-btn').onclick = (e) => { e.stopPropagation(); toggleSearchHist(); };
    shadowRootRef.getElementById('ss-var-preset-btn').onclick = (e) => { e.stopPropagation(); renderPresetsPanel(); };
    shadowRootRef.getElementById('ss-var-fav-tab-btn').onclick = (e) => { e.stopPropagation(); toggleFavPanel(); };
    shadowRootRef.getElementById('ss-var-reset-btn').onclick = () => {
      state.varResults = []; state.varEditingId = null; state.varShowHistoryId = null; state.varPresetPanelId = null;
      state.varViewingPresetId = null;
      state.varShowSearchHist = false; state.varPresetsOpen = false; state.varShowFavorites = false;
      renderVarsTab();
    };

    // Close panels logic removed as per user request to keep them open
    document.addEventListener('click', (e) => {
      // Logic for closing panels on outside click removed
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
            <div class="ss-var-panel-label" style="padding:8px 10px 4px;">Preset Name / Search</div>
            <div style="padding:0 10px 6px; display:flex; gap:4px;">
              <input class="ss-input ss-preset-combined-input" placeholder="Name to create or search..." style="flex:1;padding:5px 8px;font-size:13px;" />
              <button class="ss-var-btn ss-preset-combined-save" title="Save / Create">${iSave}</button>
            </div>
            <div class="ss-preset-list-inner">
              ${ps.length === 0 ? `<div class="ss-empty" style="border:none;padding:6px 10px;font-size:13px;">No presets yet</div>`
            : inPresets.map(p => `
                  <div class="ss-preset-toggle-row" data-pi="${p.i}" style="display:${p.has ? 'flex' : 'none'};">
                    <span class="ss-preset-toggle-name">${esc(p.name)}</span>
                    <span class="ss-preset-toggle-count">${p.ids.length}</span>
                    <button class="ss-var-btn ss-preset-toggle-btn${p.has ? ' active' : ''}" data-pi="${p.i}" data-has="${p.has}" title="${p.has ? 'Remove from preset' : 'Add to preset'}">
                      ${p.has ? iDone : iPlus}
                    </button>
                  </div>`).join('')}
            </div>
          </div>
        `;
      }

      card.innerHTML = `
        <div class="ss-var-card-main">
          <div class="ss-var-info">
            <div class="ss-var-name" style="display:flex;align-items:center;gap:4px;">
              <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(def.name)}</span>
            </div>
            <div style="display:flex;align-items:center;gap:4px;margin-top:2px;">
              <button class="ss-var-btn ss-var-btn-copy" data-action="copy" data-id="${def.id}" title="Copy Value">${iCopy}</button>
              <div class="ss-var-value-preview">${esc(def.value || '—')}</div>
            </div>
          </div>
          <div class="ss-var-actions">
            ${isEditing ? `
              <button class="ss-var-btn ss-var-btn-history${showHist ? ' active' : ''}" data-action="history" data-id="${def.id}" title="Edit history">${iHistory}</button>
              <button class="ss-var-btn ss-var-btn-copy" data-action="copy-edit" data-id="${def.id}" title="Copy">${iCopy}</button>
              <button class="ss-var-btn ss-var-btn-reset" data-action="reset" data-id="${def.id}" title="Reset">${iReset.replace('width="24" height="24"', 'width="12" height="12"')}</button>
              <button class="ss-var-btn ss-var-btn-done" data-action="save" data-id="${def.id}" title="Save">${iDone}</button>
            `: `
              <button class="ss-var-btn ss-fav-var-btn" data-action="fav" data-id="${def.id}" title="${state.varFavorites.some(f => f.id == def.id) ? 'Remove from favorites' : 'Add to favorites'}" style="color:${state.varFavorites.some(f => f.id == def.id) ? 'var(--accent)' : 'var(--border2)'};">
                 ${state.varFavorites.some(f => f.id == def.id) ? iStarFill : iStar}
              </button>
              <button class="ss-var-btn ss-var-btn-addpreset${showPresetPanel ? ' active' : ''}" data-action="addpreset" data-id="${def.id}" title="Add to preset">${iPlus}</button>
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

      // The click listener to automatically open edit mode was removed as requested.


      card.querySelectorAll('.ss-history-item').forEach(item => {
        item.addEventListener('click', () => {
          const h = loadVarHistory(state.projectId, def.id)[parseInt(item.dataset.hi)];
          if (!h) return; const ta = shadowRootRef.getElementById(`ss-var-edit-${def.id}`); if (ta) ta.value = h.value;
        });
      });

      // Preset panel interactions
      function bindPresetPanel() {
        const panel = card.querySelector('.ss-card-preset-panel'); if (!panel) return;

        // Combined Search & Create
        panel.querySelector('.ss-preset-combined-input')?.addEventListener('input', (e) => {
          const q = e.target.value.toLowerCase();
          panel.querySelectorAll('.ss-preset-toggle-row').forEach(row => {
            const name = row.querySelector('.ss-preset-toggle-name')?.textContent.toLowerCase() || '';
            const isAdded = row.querySelector('.ss-preset-toggle-btn')?.dataset.has === 'true';
            if (!q) {
              row.style.display = isAdded ? 'flex' : 'none';
            } else {
              row.style.display = name.includes(q) ? 'flex' : 'none';
            }
          });
        });

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
            } else {
              if (!ps[pi].ids.includes(def.id)) {
                ps[pi].ids.push(def.id);
                if (!ps[pi].items) ps[pi].items = [];
                ps[pi].items.push({ id: def.id, name: def.name });
              }
            }
            saveVarPresets(pid, ps);
            state.varPresetPanelId = def.id;
            renderVarList(listEl, showVarErr);
          });
        });

        panel.querySelector('.ss-preset-combined-save')?.addEventListener('click', (e) => {
          e.stopPropagation();
          const inp = panel.querySelector('.ss-preset-combined-input');
          const name = inp?.value.trim(); if (!name) return;
          const ps = loadVarPresets(pid);
          const existingIdx = ps.findIndex(p => p.name.toLowerCase() === name.toLowerCase());

          if (existingIdx > -1) {
            if (!ps[existingIdx].ids.includes(def.id)) {
              ps[existingIdx].ids.push(def.id);
              if (!ps[existingIdx].items) ps[existingIdx].items = [];
              ps[existingIdx].items.push({ id: def.id, name: def.name });
            }
          } else {
            ps.push({ name, ids: [def.id], items: [{ id: def.id, name: def.name }], ts: new Date().toISOString() });
          }
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
          const favBtnTab = shadowRootRef.getElementById('ss-var-fav-tab-btn');
          if (favBtnTab) favBtnTab.style.display = state.varFavorites.length > 0 ? '' : 'none';
          if (state.varShowFavorites) {
            shadowRootRef.getElementById('ss-var-fav-tab-btn')?.click();
            shadowRootRef.getElementById('ss-var-fav-tab-btn')?.click();
          }
          return;
        }

        if (action === 'copy-name') {
          copyToClipboard(def.name, 'Copy Variable Name', `Copied variable name: ${def.name}`);
          const old = btn.innerHTML; btn.innerHTML = iDone;
          setTimeout(() => btn.innerHTML = old, 1500);
        }

        if (action === 'copy') { copyToClipboard(def.value || '', 'Copy Variable Value', `Copied value for: ${def.name}`); btn.style.color = 'var(--success)'; setTimeout(() => btn.style.color = '', 1500); }
        if (action === 'copy-edit') { const ta = shadowRootRef.getElementById(`ss-var-edit-${id}`); copyToClipboard(ta?.value || def.value || '', 'Copy Variable Editor Value', `Copied edited value for: ${def.name}`); btn.style.color = 'var(--success)'; setTimeout(() => btn.style.color = '', 1500); }
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
        if (action === 'edit') { state.varEditingId = id; state.varShowHistoryId = null; state.varPresetPanelId = null; renderVarList(listEl, showVarErr); setTimeout(() => { const ta = shadowRootRef.getElementById(`ss-var-edit-${id}`); if (ta) { ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); } }, 30); }
        if (action === 'reset') { state.varEditingId = null; state.varShowHistoryId = null; renderVarList(listEl, showVarErr); }
        if (action === 'history') { state.varShowHistoryId = state.varShowHistoryId === id ? null : id; renderVarList(listEl, showVarErr); }

        if (action === 'save') {
          const ta = shadowRootRef.getElementById(`ss-var-edit-${id}`); if (!ta) return;
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

  export function closeAllExtraPanels() {
    shadowRootRef.querySelectorAll('.ss-extra-panel').forEach(p => p.classList.remove('open'));
    shadowRootRef.querySelectorAll('.ss-action-btn, .ss-var-btn').forEach(b => b.classList.remove('active'));
    state.contactShowSearchHist = false; state.contactShowFavorites = false; state.contactSettingsOpen = false;
    state.varShowSearchHist = false; state.varPresetsOpen = false;
  }

  

  
