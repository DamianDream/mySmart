import { state } from '../core/state.js';
import { loadFromCache, saveToStorage, saveVarHistory, loadVarHistory, loadSearchHist, saveSearchHist, loadVarPresets, saveVarPresets, getPreset, loadTagSearchHist, saveTagSearchHist, loadContactSearchHist, saveContactSearchHist, loadContactSettings, saveContactSettings, loadLogs, saveLogs } from '../core/storage.js';
import { getUrlContactId, getFullProjectFromUrl } from '../utils/url.js';
import { showNotice, copyToClipboard, esc, shadowRootRef, debounce } from '../utils/dom.js';
import { logAction, clearLogs } from '../core/logger.js';
import { bgFetch } from '../core/api.js';
import { checkForUpdates } from '../core/updater.js';
import { countContacts, searchDefinitions, fetchDefinitionsByIds, updateDefinition, searchTags } from '../models/smartsender.js';
import { iCopy, iEdit, iDone, iReset, iHistory, iSearch, iPreset, iStar, iStarFill, iSave, iTrash, iPen, iAddToPreset, iBack, iX, iTag, iFunnel, iChat, iGear } from '../icons.js';



// ─── LOGS TAB ──────────────────────────────────────────────────────────────
  export function renderLogsTab() {
    const body = shadowRootRef.getElementById('ss-body');
    body.innerHTML = `
      <div style="margin-bottom:12px;">
        <div class="ss-section-label">Action Logs</div>
        <div style="display:flex;gap:6px;align-items:center;margin-bottom:8px;">
          <input class="ss-input" id="ss-log-filter" type="text" placeholder="Filter by action or details..." autocomplete="off" style="flex:1;" />
        </div>
        <div style="display:flex;gap:6px;align-items:center;">
          <div style="font-size:11px;color:var(--text4);">Showing latest 1000 actions across all projects.</div>
        </div>
      </div>
      <div id="ss-log-list" style="display:flex;flex-direction:column;gap:6px;"></div>
    `;

    const filterInput = shadowRootRef.getElementById('ss-log-filter');
    const listEl = shadowRootRef.getElementById('ss-log-list');

    const renderList = (filterText = '') => {
      const logs = loadLogs();
      const filtered = logs.filter(l => 
        l.action.toLowerCase().includes(filterText.toLowerCase()) || 
        l.detail.toLowerCase().includes(filterText.toLowerCase()) ||
        (l.project && l.project.toLowerCase().includes(filterText.toLowerCase()))
      );

      if (!filtered.length) {
        listEl.innerHTML = `<div class="ss-empty">${logs.length === 0 ? 'No logs recorded yet.' : 'No logs match filter.'}</div>`;
        return;
      }

      listEl.innerHTML = filtered.map(log => {
        const date = new Date(log.time);
        const timeStr = date.toLocaleTimeString([], { hour12: false });
        const dateStr = date.toLocaleDateString();
        const hasPayload = !!log.payload;
        return `
          <div class="ss-var-card ${hasPayload ? 'ss-log-expandable' : ''}" style="padding:10px;display:flex;flex-direction:column;gap:4px;${hasPayload ? 'cursor:pointer;' : ''}">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <div style="font-size:12px;font-weight:600;color:${log.action.includes('Error') ? 'var(--error)' : log.action.includes('API Request') ? 'var(--accent)' : 'var(--text)'};">${esc(log.action)}</div>
              <div style="font-size:11px;color:var(--text5);">${dateStr} ${timeStr}</div>
            </div>
            <div style="font-size:13px;color:var(--text2);word-break:break-word;line-height:1.4;">
              ${esc(log.detail)}
              ${hasPayload ? '<span style="font-size:10px;color:var(--text4);margin-left:8px;opacity:0.7;">(Click to expand)</span>' : ''}
            </div>
            ${log.project ? `<div style="font-size:11px;color:var(--text4);margin-top:4px;">Project ID: ${esc(log.project)}</div>` : ''}
            ${hasPayload ? `<div class="ss-log-payload" style="display:none;margin-top:8px;padding:8px;background:var(--bg3);border:1px solid var(--border);border-radius:6px;font-family:monospace;font-size:11px;color:var(--text3);white-space:pre-wrap;word-break:break-all;">${esc(log.payload)}</div>` : ''}
          </div>
        `;
      }).join('');

      listEl.querySelectorAll('.ss-log-expandable').forEach(card => {
        card.onclick = () => {
          const payload = card.querySelector('.ss-log-payload');
          if (payload.style.display === 'none') {
            payload.style.display = 'block';
          } else {
            payload.style.display = 'none';
          }
        };
      });
    };

    filterInput.oninput = debounce((e) => renderList(e.target.value.trim()), 300);
    renderList();
  }

  

  
