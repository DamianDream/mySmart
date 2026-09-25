import { state } from '../core/state.js';
import { loadFunnelSnapshot, saveFunnelSnapshot } from '../core/storage.js';
import { fetchFunnels } from '../models/smartsender.js';
import { getFullProjectFromUrl } from '../utils/url.js';
import { shadowRootRef, esc, debounce, copyToClipboard } from '../utils/dom.js';
import { logAction } from '../core/logger.js';
import { iReset, iExternal, iCopy, iDone } from '../icons.js';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export async function renderFunnelsTab(forceRefresh = false, manualResetBaseline = false) {
  const body = shadowRootRef.getElementById('ss-body');
  if (!body) return;

  const pid = state.projectId;
  const projectSlug = pid || getFullProjectFromUrl() || '';

  body.innerHTML = `
    <div style="margin-bottom:12px;">
      <!-- Search & Refresh Toolbar -->
      <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px;">
        <input class="ss-input" id="ss-funnel-search-input" type="text" placeholder="Search funnels..." autocomplete="off" value="${esc(state.funnelSearchTerm || '')}" style="flex:1;box-sizing:border-box;" />
        <button class="ss-btn-search" id="ss-funnel-reset-search-btn" title="Reset Search" style="width:auto;padding:8px 12px;justify-content:center;background:var(--bg3);color:var(--text2);display:${state.funnelSearchTerm ? 'inline-flex' : 'none'};">
          ✕
        </button>
        <button class="ss-btn-search" id="ss-funnel-refresh-btn" title="Refresh data from server" style="width:auto;padding:8px 12px;justify-content:center;background:var(--bg3);color:var(--text2);">
          ${iReset.replace('width="24" height="24"', 'width="16" height="16"')}
        </button>
      </div>

      <!-- Snapshot Info Banner -->
      <div id="ss-funnel-snapshot-bar" style="background:var(--bg2);border:1px solid var(--border);border-radius:8px;padding:8px 12px;display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:12px;">
        <div id="ss-funnel-snapshot-text" style="color:var(--text3);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
          Loading baseline...
        </div>
        <button id="ss-funnel-reset-baseline-btn" class="ss-text-link" style="font-size:11px;flex-shrink:0;cursor:pointer;border:none;background:none;color:var(--accent);font-weight:600;" title="Reset baseline snapshot to current counts now">
          Update Baseline
        </button>
      </div>
    </div>

    <!-- Funnels List Container -->
    <div id="ss-funnel-list" style="display:flex;flex-direction:column;gap:8px;">
      <div class="ss-loading" style="display:flex;padding:24px 0;"><div class="ss-spinner"></div><span class="ss-loading-text">Loading funnels...</span></div>
    </div>
    <div class="ss-error" id="ss-funnel-error" style="display:none;margin-top:8px;"></div>
  `;

  bindFunnelsEvents();
  await loadFunnelsData(forceRefresh, manualResetBaseline);
}

function bindFunnelsEvents() {
  const searchInput = shadowRootRef.getElementById('ss-funnel-search-input');
  const resetSearchBtn = shadowRootRef.getElementById('ss-funnel-reset-search-btn');
  const refreshBtn = shadowRootRef.getElementById('ss-funnel-refresh-btn');
  const resetBaselineBtn = shadowRootRef.getElementById('ss-funnel-reset-baseline-btn');

  if (searchInput) {
    searchInput.addEventListener('input', debounce((e) => {
      state.funnelSearchTerm = e.target.value.trim();
      if (resetSearchBtn) resetSearchBtn.style.display = state.funnelSearchTerm ? 'inline-flex' : 'none';
      renderFunnelsList();
    }, 200));
  }

  if (resetSearchBtn) {
    resetSearchBtn.onclick = () => {
      if (searchInput) searchInput.value = '';
      state.funnelSearchTerm = '';
      resetSearchBtn.style.display = 'none';
      renderFunnelsList();
    };
  }

  if (refreshBtn) {
    refreshBtn.onclick = () => {
      refreshBtn.classList.add('ss-spinning');
      loadFunnelsData(true, false).finally(() => refreshBtn.classList.remove('ss-spinning'));
    };
  }

  if (resetBaselineBtn) {
    resetBaselineBtn.onclick = () => {
      loadFunnelsData(false, true);
    };
  }
}

async function loadFunnelsData(forceRefresh = false, manualResetBaseline = false) {
  const listEl = shadowRootRef.getElementById('ss-funnel-list');
  const errEl = shadowRootRef.getElementById('ss-funnel-error');
  const pid = state.projectId;

  if (!state.funnelResults.length || forceRefresh || manualResetBaseline) {
    state.isSearchingFunnels = true;
    if (errEl) errEl.style.display = 'none';
    try {
      logAction('Fetch Funnels', `Project: ${pid}`);
      state.funnelResults = await fetchFunnels();
    } catch (err) {
      if (errEl) {
        errEl.textContent = `⚠ ${err.message || 'Failed to load funnels'}`;
        errEl.style.display = 'block';
      }
      if (listEl) listEl.innerHTML = '';
      state.isSearchingFunnels = false;
      return;
    } finally {
      state.isSearchingFunnels = false;
    }
  }

  // Handle snapshot logic:
  // "Результаит счетсика воронок перезаписывается раз в день и только при запуске пункта меню Funnels"
  let snapshot = loadFunnelSnapshot(pid);
  const now = Date.now();

  const isExpired = snapshot && snapshot.timestamp && (now - snapshot.timestamp >= ONE_DAY_MS);
  const isFirstTime = !snapshot || !snapshot.counts;
  const snapshotHasOnlyZeros = snapshot && snapshot.counts && Object.values(snapshot.counts).length > 0 && Object.values(snapshot.counts).every(c => c === 0);
  const hasRealData = state.funnelResults.some(f => (f.runs || 0) > 0);

  if (isFirstTime || manualResetBaseline || (snapshotHasOnlyZeros && hasRealData)) {
    const counts = {};
    state.funnelResults.forEach(f => { counts[f.id] = f.runs; });
    snapshot = {
      timestamp: now,
      counts,
      prevTimestamp: null,
      prevCounts: null
    };
    saveFunnelSnapshot(pid, snapshot);
  } else if (isExpired && !forceRefresh) {
    // 24 hours have elapsed since the baseline was established: roll over once per day
    const newCounts = {};
    state.funnelResults.forEach(f => { newCounts[f.id] = f.runs; });
    snapshot = {
      timestamp: now,
      counts: newCounts,
      prevTimestamp: snapshot.timestamp,
      prevCounts: snapshot.counts
    };
    saveFunnelSnapshot(pid, snapshot);
  }

  updateSnapshotBar(snapshot);
  renderFunnelsList(snapshot);
}

function updateSnapshotBar(snapshot) {
  const textEl = shadowRootRef.getElementById('ss-funnel-snapshot-text');
  if (!textEl || !snapshot || !snapshot.timestamp) return;

  const d = new Date(snapshot.timestamp);
  const dateStr = d.toLocaleDateString();
  const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const hoursLeft = Math.max(0, Math.ceil((ONE_DAY_MS - (Date.now() - snapshot.timestamp)) / (60 * 60 * 1000)));

  textEl.innerHTML = `
    <span>📌 Baseline: <strong style="color:var(--text);">${dateStr}, ${timeStr}</strong> (next reset in ~${hoursLeft}h)</span>
  `;
}

function renderFunnelsList(providedSnapshot = null) {
  const listEl = shadowRootRef.getElementById('ss-funnel-list');
  if (!listEl) return;

  const pid = state.projectId;
  const projectSlug = pid || getFullProjectFromUrl() || '';
  const snapshot = providedSnapshot || loadFunnelSnapshot(pid) || { counts: {} };
  const baselineCounts = snapshot.counts || {};

  const query = (state.funnelSearchTerm || '').toLowerCase();
  const funnels = state.funnelResults.filter(f => {
    if (!query) return true;
    return f.name.toLowerCase().includes(query) || String(f.id).includes(query);
  });

  if (!funnels.length) {
    listEl.innerHTML = `<div class="ss-empty" style="padding:32px 16px;text-align:center;color:var(--text4);font-size:13px;">${query ? 'No funnels matching search' : 'No funnels found in project'}</div>`;
    return;
  }

  listEl.innerHTML = '';

  funnels.forEach(f => {
    const card = document.createElement('div');
    card.className = 'ss-var-card';
    card.style.padding = '12px 14px';
    card.style.display = 'flex';
    card.style.flexDirection = 'column';
    card.style.gap = '8px';

    const currentRuns = f.runs || 0;
    const hasBaseline = baselineCounts[f.id] !== undefined;
    const baseRuns = hasBaseline ? baselineCounts[f.id] : currentRuns;
    const delta = currentRuns - baseRuns;

    let deltaBadgeHtml = '';
    if (!hasBaseline) {
      deltaBadgeHtml = `<span style="background:var(--accent-bg);color:var(--accent);font-size:11px;font-weight:700;padding:2px 8px;border-radius:6px;border:1px solid rgba(var(--accent-rgb),0.3);">NEW</span>`;
    } else if (delta > 0) {
      deltaBadgeHtml = `<span style="background:rgba(34,197,94,0.15);color:#22c55e;font-size:12px;font-weight:800;padding:2px 8px;border-radius:6px;border:1px solid rgba(34,197,94,0.3);">+${delta.toLocaleString()}</span>`;
    } else if (delta === 0) {
      deltaBadgeHtml = `<span style="background:var(--bg3);color:var(--text4);font-size:12px;font-weight:600;padding:2px 8px;border-radius:6px;border:1px solid var(--border);">0</span>`;
    } else {
      deltaBadgeHtml = `<span style="background:rgba(239,68,68,0.15);color:var(--error);font-size:12px;font-weight:800;padding:2px 8px;border-radius:6px;border:1px solid rgba(239,68,68,0.3);">${delta.toLocaleString()}</span>`;
    }

    const funnelUrl = projectSlug 
      ? `https://messenger.smartsender.com/funnels/${f.id}?project=${projectSlug}`
      : `https://messenger.smartsender.com/funnels/${f.id}`;

    const dateFormatted = f.updatedAt ? new Date(f.updatedAt).toLocaleDateString() : '—';

    card.innerHTML = `
      <!-- Row 1: Name, Status, Link -->
      <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
        <div style="min-width:0;flex:1;display:flex;align-items:center;gap:8px;">
          <a href="${funnelUrl}" target="_blank" class="ss-funnel-title-link" title="Open funnel in SmartSender" style="font-weight:700;font-size:15px;color:var(--text);text-decoration:none;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
            ${esc(f.name)}
          </a>
          <a href="${funnelUrl}" target="_blank" title="Open funnel builder" class="ss-var-btn" style="color:var(--text4);display:inline-flex;padding:0;width:20px;height:20px;flex-shrink:0;">
            ${iExternal.replace('width="16" height="16"', 'width="12" height="12"')}
          </a>
        </div>
        <div>
          ${f.active 
            ? `<span style="background:rgba(34,197,94,0.15);color:#22c55e;font-size:11px;font-weight:700;padding:2px 6px;border-radius:4px;border:1px solid rgba(34,197,94,0.3);">ACTIVE</span>`
            : `<span style="background:var(--bg3);color:var(--text4);font-size:11px;font-weight:600;padding:2px 6px;border-radius:4px;border:1px solid var(--border);">DRAFT</span>`
          }
        </div>
      </div>

      <!-- Row 2: Counters & Delta -->
      <div style="background:var(--bg3);border-radius:8px;padding:8px 12px;display:flex;align-items:center;justify-content:space-between;margin:2px 0;">
        <div style="display:flex;gap:16px;align-items:center;">
          <div>
            <div style="font-size:11px;color:var(--text4);text-transform:uppercase;font-weight:600;letter-spacing:0.3px;">Total Runs</div>
            <div style="font-size:16px;font-weight:800;color:var(--text);">${currentRuns.toLocaleString()}</div>
          </div>
          <div style="width:1px;height:24px;background:var(--border);"></div>
          <div>
            <div style="font-size:11px;color:var(--text4);text-transform:uppercase;font-weight:600;letter-spacing:0.3px;">Baseline</div>
            <div style="font-size:14px;font-weight:600;color:var(--text3);">${baseRuns.toLocaleString()}</div>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:2px;">
          <div style="font-size:10px;color:var(--text4);text-transform:uppercase;font-weight:600;">Change</div>
          <div>${deltaBadgeHtml}</div>
        </div>
      </div>

      <!-- Row 3: Meta & ID -->
      <div style="display:flex;align-items:center;justify-content:space-between;font-size:12px;color:var(--text4);padding-top:2px;">
        <div style="display:flex;align-items:center;gap:6px;">
          <span>ID: <strong style="color:var(--accent);font-weight:600;">${f.id}</strong></span>
          <button class="ss-info-copy-btn ss-funnel-copy-btn" data-copy="${f.id}" title="Copy Funnel ID" style="width:16px;height:16px;padding:0;background:none;border:none;cursor:pointer;color:var(--text4);">
            ${iCopy}
          </button>
        </div>
        <div>Modified: ${dateFormatted}</div>
      </div>
    `;

    const copyBtn = card.querySelector('.ss-funnel-copy-btn');
    if (copyBtn) {
      copyBtn.onclick = (e) => {
        e.stopPropagation();
        copyToClipboard(f.id, 'Copy Funnel ID', `Copied ID: ${f.id}`);
        copyBtn.innerHTML = iDone;
        setTimeout(() => copyBtn.innerHTML = iCopy, 1500);
      };
    }

    listEl.appendChild(card);
  });
}
