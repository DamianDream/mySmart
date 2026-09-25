/* global Blob, URL */
import { shadowRootRef, esc, showNotice } from '../utils/dom.js';
import { iX, iDone } from '../icons.js';
import { state } from '../core/state.js';
import { loadPresets, getPreset } from '../core/storage.js';
import { fetchAllDefinitions, fetchAllTags, createDefinition, createTag } from '../models/smartsender.js';
import { logAction } from '../core/logger.js';

export async function exportProjectData(projectId) {
  const pid = projectId || state.projectId;
  if (!pid) throw new Error('No project selected');
  const preset = getPreset(pid);
  if (!preset?.apiToken) throw new Error('No API token configured for this project. Open Settings ⚙');

  const [defs, tags] = await Promise.all([
    fetchAllDefinitions(pid),
    fetchAllTags(pid)
  ]);

  const data = {
    version: 1,
    sourceProject: pid,
    sourceProjectName: preset.customName || preset.name || pid,
    exportedAt: new Date().toISOString(),
    definitions: (defs || []).map(d => ({
      name: d.name,
      type: d.type || 'string'
    })),
    tags: (tags || []).map(t => ({
      name: t.name
    }))
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `smartsender-data-${pid}-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  logAction('Export Project Data', `Exported ${data.definitions.length} vars, ${data.tags.length} tags from ${pid}`);
  return data;
}

export function openDataTransferModal(importData, defaultTargetPid = null) {
  let target = null;
  if (shadowRootRef) {
    target = shadowRootRef.getElementById('ss-sidebar');
  }
  if (!target) {
    target = document.getElementById('ss-sidebar') || document.body;
  }
  if (!target) return;

  const existing = (target.getRootNode?.() || document).querySelector?.('#ss-data-transfer-overlay') || target.querySelector?.('#ss-data-transfer-overlay');
  if (existing) existing.remove();

  if (!importData || typeof importData !== 'object' || (!Array.isArray(importData.definitions) && !Array.isArray(importData.tags))) {
    showNotice(target.querySelector('#ss-body') || target, 'Invalid export file structure', 'error');
    return;
  }

  const fileDefs = Array.isArray(importData.definitions) ? importData.definitions.filter(d => d && d.name) : [];
  const fileTags = Array.isArray(importData.tags) ? importData.tags.filter(t => t && t.name) : [];

  const presets = loadPresets();
  let selectedTargetPid = defaultTargetPid || state.projectId || presets[0]?.projectId || '';

  const overlay = document.createElement('div');
  overlay.id = 'ss-data-transfer-overlay';
  overlay.className = 'ss-modal-overlay';

  overlay.innerHTML = `
    <div class="ss-modal-box" style="max-width:380px;">
      <div class="ss-modal-header" style="background:var(--bg-solid,#282828);padding:14px 16px;border-bottom:1px solid var(--border,rgba(255,255,255,0.1));display:flex;align-items:center;justify-content:space-between;">
        <div class="ss-modal-title" style="font-size:15px;font-weight:700;color:var(--text,#ffffff);display:flex;align-items:center;gap:8px;">
          <span>Import Variables & Tags</span>
        </div>
        <button class="ss-close" id="ss-transfer-close" title="Close" style="background:none;border:none;color:var(--text4,rgba(255,255,255,0.6));cursor:pointer;display:flex;align-items:center;justify-content:center;padding:4px;border-radius:6px;">${iX}</button>
      </div>

      <div class="ss-modal-body" id="ss-transfer-body" style="background:var(--bg-solid,#282828);padding:16px;display:flex;flex-direction:column;gap:12px;max-height:480px;overflow-y:auto;">
        <div style="background:var(--bg2,rgba(255,255,255,0.06));padding:10px 12px;border-radius:8px;border:1px solid var(--border,rgba(255,255,255,0.1));display:flex;flex-direction:column;gap:4px;">
          <div style="font-size:11px;color:var(--text4,rgba(255,255,255,0.6));text-transform:uppercase;font-weight:700;letter-spacing:0.04em;">Source File</div>
          <div style="font-size:13px;font-weight:600;color:var(--text,#ffffff);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
            ${esc(importData.sourceProjectName || importData.sourceProject || 'Custom Export')}
          </div>
          <div style="font-size:11px;color:var(--text4,rgba(255,255,255,0.6));">
            Contains: <b style="color:var(--accent);">${fileDefs.length}</b> vars, <b style="color:var(--accent);">${fileTags.length}</b> tags
          </div>
        </div>

        <div>
          <label style="display:block;font-size:12px;font-weight:600;color:var(--text3,#ebebf5);margin-bottom:6px;">
            Target Project
          </label>
          <div style="position:relative;">
            <select id="ss-transfer-target-select" class="ss-input" style="width:100%;cursor:pointer;">
              ${presets.map(p => `<option value="${esc(p.projectId)}"${p.projectId === selectedTargetPid ? ' selected' : ''}>${esc(p.customName || p.name || p.projectId)} (${esc(p.projectId)})</option>`).join('')}
            </select>
          </div>
        </div>

        <div id="ss-transfer-diff-container">
          <div class="ss-loading" style="display:flex;padding:16px 0;"><div class="ss-spinner"></div><span class="ss-loading-text">Analyzing target project...</span></div>
        </div>
      </div>

      <div class="ss-modal-footer" id="ss-transfer-footer" style="background:var(--bg-solid,#282828);padding:12px 16px;border-top:1px solid var(--border,rgba(255,255,255,0.1));display:flex;gap:8px;justify-content:flex-end;">
        <button class="ss-btn-search" id="ss-transfer-cancel" style="background:var(--bg3,rgba(255,255,255,0.08));color:var(--text2,#f2f2f7);padding:6px 14px;justify-content:center;border-radius:8px;cursor:pointer;">Cancel</button>
        <button class="ss-btn-search" id="ss-transfer-start" disabled style="background:var(--accent,#0a84ff);color:var(--accent-text,#ffffff);padding:6px 16px;justify-content:center;border-radius:8px;display:flex;align-items:center;gap:6px;cursor:pointer;font-weight:600;opacity:0.5;">
          ${iDone}
          <span>Start Import</span>
        </button>
      </div>
    </div>
  `;

  target.appendChild(overlay);

  const closeBtn = overlay.querySelector('#ss-transfer-close');
  const cancelBtn = overlay.querySelector('#ss-transfer-cancel');
  const startBtn = overlay.querySelector('#ss-transfer-start');
  const targetSelect = overlay.querySelector('#ss-transfer-target-select');
  const diffContainer = overlay.querySelector('#ss-transfer-diff-container');
  const bodyEl = overlay.querySelector('#ss-transfer-body');
  const footerEl = overlay.querySelector('#ss-transfer-footer');

  const closeModal = () => { overlay.remove(); };
  closeBtn.onclick = closeModal;
  cancelBtn.onclick = closeModal;
  overlay.onclick = (e) => { if (e.target === overlay) closeModal(); };

  let currentNewDefs = [];
  let currentNewTags = [];

  const updateDiff = async (pid) => {
    selectedTargetPid = pid;
    diffContainer.innerHTML = `<div class="ss-loading" style="display:flex;padding:20px 0;"><div class="ss-spinner"></div><span class="ss-loading-text">Comparing with ${esc(pid)}...</span></div>`;
    startBtn.disabled = true;
    startBtn.style.opacity = '0.5';

    const preset = getPreset(pid);
    if (!preset?.apiToken) {
      diffContainer.innerHTML = `
        <div class="ss-error visible" style="margin:8px 0;font-size:12px;">
          ⚠ No API token configured for target project <b>${esc(pid)}</b>. Please add token in Settings first.
        </div>
      `;
      return;
    }

    try {
      const [existingDefs, existingTags] = await Promise.all([
        fetchAllDefinitions(pid),
        fetchAllTags(pid)
      ]);

      const existDefMap = new Set((existingDefs || []).map(d => (d.name || '').toLowerCase().trim()));
      currentNewDefs = fileDefs.filter(d => !existDefMap.has(d.name.toLowerCase().trim()));
      const skipDefs = fileDefs.filter(d => existDefMap.has(d.name.toLowerCase().trim()));

      const existTagMap = new Set((existingTags || []).map(t => (t.name || '').toLowerCase().trim()));
      currentNewTags = fileTags.filter(t => !existTagMap.has(t.name.toLowerCase().trim()));
      const skipTags = fileTags.filter(t => existTagMap.has(t.name.toLowerCase().trim()));

      diffContainer.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:10px;">
          <!-- Variables Diff Card -->
          <div style="background:var(--bg2);padding:10px 12px;border-radius:8px;border:1px solid var(--border);">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
              <label style="display:flex;align-items:center;gap:6px;font-weight:600;font-size:13px;cursor:pointer;">
                <input type="checkbox" id="ss-import-check-defs"${currentNewDefs.length > 0 ? ' checked' : ' disabled'} />
                <span>Variables (${fileDefs.length})</span>
              </label>
              <div style="display:flex;gap:4px;">
                <span class="ss-diff-badge-new">+${currentNewDefs.length} new</span>
                <span class="ss-diff-badge-skip">${skipDefs.length} exist</span>
              </div>
            </div>
            ${currentNewDefs.length ? `
              <div style="font-size:11px;color:var(--text4);max-height:60px;overflow-y:auto;line-height:1.5;">
                ${currentNewDefs.map(d => `<span style="display:inline-block;background:var(--bg3);padding:1px 6px;border-radius:4px;margin:2px 3px 2px 0;">${esc(d.name)} <span style="color:var(--text5);">(${esc(d.type)})</span></span>`).join('')}
              </div>
            ` : '<div style="font-size:11px;color:var(--text5);">All variables in file already exist in target project.</div>'}
          </div>

          <!-- Tags Diff Card -->
          <div style="background:var(--bg2);padding:10px 12px;border-radius:8px;border:1px solid var(--border);">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
              <label style="display:flex;align-items:center;gap:6px;font-weight:600;font-size:13px;cursor:pointer;">
                <input type="checkbox" id="ss-import-check-tags"${currentNewTags.length > 0 ? ' checked' : ' disabled'} />
                <span>Tags (${fileTags.length})</span>
              </label>
              <div style="display:flex;gap:4px;">
                <span class="ss-diff-badge-new">+${currentNewTags.length} new</span>
                <span class="ss-diff-badge-skip">${skipTags.length} exist</span>
              </div>
            </div>
            ${currentNewTags.length ? `
              <div style="font-size:11px;color:var(--text4);max-height:60px;overflow-y:auto;line-height:1.5;">
                ${currentNewTags.map(t => `<span style="display:inline-block;background:var(--bg3);padding:1px 6px;border-radius:4px;margin:2px 3px 2px 0;">${esc(t.name)}</span>`).join('')}
              </div>
            ` : '<div style="font-size:11px;color:var(--text5);">All tags in file already exist in target project.</div>'}
          </div>
        </div>
      `;

      const checkDefs = diffContainer.querySelector('#ss-import-check-defs');
      const checkTags = diffContainer.querySelector('#ss-import-check-tags');

      const refreshStartBtn = () => {
        const canStart = (checkDefs?.checked && currentNewDefs.length > 0) || (checkTags?.checked && currentNewTags.length > 0);
        startBtn.disabled = !canStart;
        startBtn.style.opacity = canStart ? '1' : '0.5';
      };

      if (checkDefs) checkDefs.onchange = refreshStartBtn;
      if (checkTags) checkTags.onchange = refreshStartBtn;
      refreshStartBtn();
    } catch (err) {
      diffContainer.innerHTML = `<div class="ss-error visible" style="margin:8px 0;font-size:12px;">⚠ ${esc(err.message || 'Failed to compare data')}</div>`;
    }
  };

  targetSelect.onchange = () => updateDiff(targetSelect.value);
  updateDiff(selectedTargetPid);

  startBtn.onclick = async () => {
    const checkDefs = diffContainer.querySelector('#ss-import-check-defs');
    const checkTags = diffContainer.querySelector('#ss-import-check-tags');

    const queue = [];
    if (checkDefs?.checked) {
      currentNewDefs.forEach(d => queue.push({ kind: 'def', name: d.name, type: d.type || 'string' }));
    }
    if (checkTags?.checked) {
      currentNewTags.forEach(t => queue.push({ kind: 'tag', name: t.name }));
    }

    if (!queue.length) return;

    closeBtn.style.display = 'none';
    footerEl.innerHTML = '';

    bodyEl.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:14px;padding:8px 0;">
        <div style="font-size:14px;font-weight:700;color:var(--text);">Importing items into ${esc(selectedTargetPid)}...</div>
        <div class="ss-progress-track">
          <div class="ss-progress-bar" id="ss-import-progress-bar" style="width:0%;"></div>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text3);">
          <span id="ss-import-progress-count">0 / ${queue.length}</span>
          <span id="ss-import-progress-pct">0%</span>
        </div>
        <div id="ss-import-status-text" style="font-size:12px;color:var(--text4);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
          Preparing...
        </div>
        <div id="ss-import-errors-box" style="display:none;max-height:100px;overflow-y:auto;background:rgba(255,69,58,0.1);border:1px solid rgba(255,69,58,0.3);border-radius:6px;padding:8px;font-size:11px;color:var(--error);"></div>
      </div>
    `;

    const bar = bodyEl.querySelector('#ss-import-progress-bar');
    const countEl = bodyEl.querySelector('#ss-import-progress-count');
    const pctEl = bodyEl.querySelector('#ss-import-progress-pct');
    const statusEl = bodyEl.querySelector('#ss-import-status-text');
    const errorsBox = bodyEl.querySelector('#ss-import-errors-box');

    let successDefs = 0;
    let successTags = 0;
    const errors = [];

    for (let i = 0; i < queue.length; i++) {
      const item = queue[i];
      const pct = Math.round(((i + 1) / queue.length) * 100);
      bar.style.width = `${pct}%`;
      countEl.textContent = `${i + 1} / ${queue.length}`;
      pctEl.textContent = `${pct}%`;
      statusEl.textContent = `Creating ${item.kind === 'def' ? 'variable' : 'tag'}: "${item.name}"...`;

      try {
        if (item.kind === 'def') {
          await createDefinition(selectedTargetPid, { name: item.name, type: item.type });
          successDefs++;
        } else {
          await createTag(selectedTargetPid, { name: item.name });
          successTags++;
        }
      } catch (err) {
        errors.push(`${item.name}: ${err.message}`);
        errorsBox.style.display = 'block';
        errorsBox.innerHTML = errors.map(e => `<div>• ${esc(e)}</div>`).join('');
      }

      await new Promise(r => setTimeout(r, 60));
    }

    statusEl.innerHTML = `<span style="color:#22c55e;font-weight:600;">✓ Import completed!</span> Created <b>${successDefs}</b> vars, <b>${successTags}</b> tags.`;
    logAction('Import Project Data', `Imported to ${selectedTargetPid}: ${successDefs} vars, ${successTags} tags. Errors: ${errors.length}`);

    footerEl.innerHTML = `
      <button class="ss-btn-primary" id="ss-transfer-done" style="width:100%;justify-content:center;">Done</button>
    `;
    footerEl.querySelector('#ss-transfer-done').onclick = closeModal;
  };
}
