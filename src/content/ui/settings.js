/* global Blob, URL, FileReader, crypto */
import { state } from '../core/state.js';
import { getPreset, savePresets, loadPresets, saveGlobalSettings, __localCache } from '../core/storage.js';
import { shadowRootRef, esc, showNotice } from '../utils/dom.js';
import { setProjectMode, switchProject } from '../models/project.js';
import { isSmartsender } from '../utils/url.js';
import { applyTheme } from './themes.js';
import { switchView, toggleSidePanel, renderHeader } from './sidebar.js';
import { logAction } from '../core/logger.js';
import { iMenu, iTune, iSave, iBack, iPlus, iPen, iTrash, iX, iLock, iUnlock } from '../icons.js';

  export function renderSettings() {
    const body = shadowRootRef.getElementById('ss-body');
    const ep = state.editingProjectId ? getPreset(state.editingProjectId) : null;
    const sysName = ep ? ep.projectId : (state.projectId || '');
    const dispName = ep ? (ep.customName || '') : '';
    const token = ep ? (ep.apiToken || '') : '';

    body.innerHTML = `
      <div style="margin-bottom:14px;">
        <div class="ss-section-label" style="margin-bottom:12px;">Appearance</div>
        <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:12px;">
          <div style="display:flex;flex-direction:column;gap:6px;align-items:center;">
            <span style="font-size:11px;color:var(--text5);font-family:Roboto,sans-serif;text-transform:uppercase;letter-spacing:0.05em;line-height:1;">${state.theme === 'dark' ? 'Dark' : 'Light'} Mode</span>
            <label class="ss-theme-switch" title="Toggle Theme" style="flex-shrink:0;">
              <input type="checkbox" id="ss-theme-toggle-input"${state.theme === 'dark' ? ' checked' : ''}>
              <span class="ss-slider"></span>
            </label>
          </div>
          <div style="display:flex;flex-direction:column;gap:6px;align-items:center;">
            <span style="font-size:11px;color:var(--text5);font-family:Roboto,sans-serif;text-transform:uppercase;letter-spacing:0.05em;line-height:1;">API Cache</span>
            <label class="ss-theme-switch" title="Smart API Caching" style="flex-shrink:0;">
              <input type="checkbox" id="ss-cache-toggle-input"${state.globalSettings.useApiCache ? ' checked' : ''}>
              <span class="ss-slider"></span>
            </label>
          </div>
          <div style="display:flex;flex-direction:column;gap:6px;align-items:center;">
            <span style="font-size:11px;color:var(--text5);font-family:Roboto,sans-serif;text-transform:uppercase;letter-spacing:0.05em;line-height:1;">Auto Fetch</span>
            <label class="ss-theme-switch" title="Search as you type" style="flex-shrink:0;">
              <input type="checkbox" id="ss-autofetch-toggle-input"${state.globalSettings.autoFetch ? ' checked' : ''}>
              <span class="ss-slider"></span>
            </label>
          </div>
        </div>
      </div>
      <div class="ss-divider"></div>
      <div style="margin-top:14px;">
        <div class="ss-section-label">${state.editingProjectId ? 'Edit Project' : 'Add Project'}</div>
        
        <label class="ss-field-label">Display Name (Optional)</label>
        <input class="ss-input" id="ss-preset-custom-name" type="text" placeholder="e.g. My Main Project" style="margin-bottom:12px;" value="${esc(dispName)}" />

        <label class="ss-field-label">System Name (URL identifier)</label>
        <div style="position:relative;margin-bottom:12px;">
          <input class="ss-input" id="ss-preset-name" type="text" placeholder="newlook" 
                 style="padding-right:36px;${state.systemicNameLocked ? 'color:var(--text5);' : ''}" 
                 value="${esc(sysName)}" ${state.systemicNameLocked ? 'disabled' : ''} />
          <button id="ss-lock-toggle" style="position:absolute;right:8px;top:50%;transform:translateY(-50%);background:none;border:none;color:${state.systemicNameLocked ? 'var(--text4)' : 'var(--error)'};cursor:pointer;padding:4px;display:flex;align-items:center;justify-content:center;">
            ${state.systemicNameLocked ? iLock : iUnlock}
          </button>
        </div>

        <label class="ss-field-label">API Token</label>
        <input class="ss-input" id="ss-preset-token" type="password" placeholder="••••••••••••••••" style="margin-bottom:12px;" value="${token ? '********' : ''}" />
        <div id="ss-preset-msg" style="display:none;font-size:13px;margin-bottom:8px;font-family:Roboto,sans-serif;"></div>
        <div style="display:flex;gap:8px;">
          <button class="ss-btn-primary" id="ss-preset-save" style="flex:1;">${state.editingProjectId ? 'Update' : 'Save'} Project</button>
          ${state.editingProjectId ? '<button class="ss-btn-search" id="ss-preset-cancel" style="background:var(--bg3);color:var(--text);border:1px solid var(--border);">Cancel</button>' : ''}
        </div>
      </div>
      <div class="ss-divider"></div>
      <div style="margin-top:14px;">
        <div class="ss-section-label">Data Management</div>
        <div style="display:flex;gap:8px;">
          <button class="ss-btn-search" id="ss-export-btn" style="flex:1;">Export Data</button>
          <button class="ss-btn-search" id="ss-import-btn" style="flex:1;background:var(--bg3);border:1px solid var(--border);">Import Data</button>
          <input type="file" id="ss-import-file" accept=".json" style="display:none;" />
        </div>
      </div>
    `;

    shadowRootRef.getElementById('ss-theme-toggle-input').onchange = (e) => { const theme = e.target.checked ? 'dark' : 'light'; applyTheme(theme); logAction('Change Theme', `Theme changed to ${theme}`); renderSettings(); };
    shadowRootRef.getElementById('ss-cache-toggle-input').onchange = (e) => { 
      state.globalSettings.useApiCache = e.target.checked;
      saveGlobalSettings(state.globalSettings);
      logAction('Settings', `API Cache ${e.target.checked ? 'enabled' : 'disabled'}`);
      if (e.target.checked) showNotice('API Cache enabled', 'info');
      else showNotice('API Cache disabled', 'info');
    };
    shadowRootRef.getElementById('ss-autofetch-toggle-input').onchange = (e) => { 
      state.globalSettings.autoFetch = e.target.checked;
      saveGlobalSettings(state.globalSettings);
      logAction('Settings', `Auto Fetch ${e.target.checked ? 'enabled' : 'disabled'}`);
      if (e.target.checked) showNotice('Auto Fetch enabled', 'info');
      else showNotice('Auto Fetch disabled', 'info');
    };

    shadowRootRef.getElementById('ss-lock-toggle').onclick = () => {
      state.systemicNameLocked = !state.systemicNameLocked;
      renderSettings();
    };

    if (state.editingProjectId) {
      shadowRootRef.getElementById('ss-preset-cancel').onclick = () => {
        state.editingProjectId = null;
        state.systemicNameLocked = true;
        renderSettings();
      };
    }

    shadowRootRef.getElementById('ss-export-btn').onclick = () => {
      chrome.storage.local.get(null, (data) => {
        const exportData = {};
        for (const [key, val] of Object.entries(data)) {
          if (key.startsWith('ss_')) exportData[key] = val;
        }
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `smartsender_backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        logAction('Data Management', 'Settings exported successfully');
        showNotice('Settings exported successfully', 'info');
      });
    };

    shadowRootRef.getElementById('ss-import-btn').onclick = () => shadowRootRef.getElementById('ss-import-file').click();
    shadowRootRef.getElementById('ss-import-file').onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target.result);
          const toSave = {};
          for (const [key, val] of Object.entries(data)) {
            if (key.startsWith('ss_')) {
              toSave[key] = val;
              __localCache[key] = val;
            }
          }
          chrome.storage.local.set(toSave, () => {
            logAction('Data Management', 'Settings imported successfully');
            showNotice('Settings imported successfully. Reloading...', 'info');
            setTimeout(() => location.reload(), 1500);
          });
        } catch (err) {
          showNotice('Invalid JSON file', 'error');
        }
      };
      reader.readAsText(file);
    };

    shadowRootRef.getElementById('ss-preset-save').onclick = () => {
      const pid = shadowRootRef.getElementById('ss-preset-name').value.trim();
      const customName = shadowRootRef.getElementById('ss-preset-custom-name').value.trim();
      let token = shadowRootRef.getElementById('ss-preset-token').value.trim();
      const msg = shadowRootRef.getElementById('ss-preset-msg');

      if (!pid) { msg.textContent = '⚠ System name required'; msg.style.cssText = 'display:block;color:var(--error);font-size:13px;margin-bottom:8px;font-family:Roboto,sans-serif;'; return; }

      const presets = loadPresets();

      // If token is just placeholders, use existing one
      if (token === '********') {
        const existing = presets.find(p => p.projectId === (state.editingProjectId || pid));
        token = existing ? existing.apiToken : '';
      }

      const preset = { projectId: pid, apiToken: token, name: pid, customName: customName };

      if (state.editingProjectId && state.editingProjectId !== pid) {
        const oldIdx = presets.findIndex(p => p.projectId === state.editingProjectId);
        if (oldIdx >= 0) presets.splice(oldIdx, 1);
      }

      const targetIdx = presets.findIndex(p => p.projectId === pid);
      if (targetIdx >= 0) presets[targetIdx] = preset;
      else presets.push(preset);

      savePresets(presets);
      if (pid === state.projectId) {
        state.activePreset = preset;
        state.projectName = customName || pid;
        renderHeader();
      }

      msg.textContent = '✅ Saved!';
      msg.style.cssText = 'display:block;color:var(--success);font-size:13px;margin-bottom:8px;font-family:Roboto,sans-serif;';

      state.editingProjectId = null;
      state.systemicNameLocked = true;

      setTimeout(() => {
        msg.style.display = 'none';
        renderSettings();
      }, 1500);

      renderProjectSwitcherPanel();
    };
  }

  // ─── SWITCH ───────────────────────────────────────────────────────────────

  export function renderProjectSwitcherPanel() {
    const p = shadowRootRef.getElementById('ss-project-switcher-panel'); if (!p) return;
    const presets = loadPresets();

    const listHtml = presets.length
      ? presets.map((pr, idx) => `
        <div class="ss-hist-term ${state.projectId === pr.projectId ? 'active' : ''}" style="display:flex;justify-content:space-between;align-items:center;gap:8px;padding: 10px 14px;border-bottom:1px solid var(--border);">
          <div style="min-width:0;flex:1;cursor:pointer;" class="ss-project-select-trigger" data-pid="${pr.projectId}">
            <div style="font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--text);">${esc(pr.customName || pr.name)}</div>
            ${pr.customName ? `<div style="font-size:11px;color:var(--text5);">${esc(pr.projectId)}</div>` : ''}
          </div>
          <div style="display:flex;gap:4px;">
            <button class="ss-project-edit-btn" data-pid="${pr.projectId}" style="background:none;border:none;color:var(--text4);cursor:pointer;padding:4px;display:flex;align-items:center;justify-content:center;transition:color 0.2s;" title="Edit Project">${iPen}</button>
            <button class="ss-preset-delete" data-index="${idx}" style="background:none;border:none;color:var(--text5);cursor:pointer;font-size:18px;padding:4px;display:flex;align-items:center;justify-content:center;transition:color 0.2s;">${iX}</button>
          </div>
        </div>
      `).join('')
      : '<div class="ss-empty" style="border:none;padding:12px;">No projects saved. Click below to add one.</div>';

    p.innerHTML = `
      <div class="ss-info-header">
        <div class="ss-info-title">Switch Project</div>
        <button class="ss-close" id="ss-project-switcher-close">${iX}</button>
      </div>
      <div class="ss-panel-list-content" style="flex:1;overflow-y:auto;">
        ${listHtml}
      </div>
      <div style="padding: 16px; border-top: 1px solid var(--border); background: var(--bg);">
        <button class="ss-btn-primary" id="ss-project-add-btn" style="width: 100%; justify-content: center; gap: 8px;">
          <span style="font-size: 18px; line-height: 1;">+</span>
          <span>Add Project</span>
        </button>
      </div>
    `;

    shadowRootRef.getElementById('ss-project-switcher-close').onclick = () => {
      toggleSidePanel('ss-project-switcher-panel');
    };

    p.querySelectorAll('.ss-project-select-trigger').forEach(el => {
      el.onclick = () => {
        setProjectMode('MANUAL');
        switchProject(el.dataset.pid);
        if (state.view !== 'settings') {
          toggleSidePanel('ss-project-switcher-panel');
        } else {
          renderProjectSwitcherPanel(); // Update active state highlight
        }
      };
    });

    p.querySelectorAll('.ss-project-edit-btn').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        state.editingProjectId = btn.dataset.pid;
        state.systemicNameLocked = true;
        switchView('settings');
      };
    });

    p.querySelectorAll('.ss-preset-delete').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.dataset.index);
        const presets = loadPresets();
        const deletedId = presets[idx].projectId;
        presets.splice(idx, 1);
        savePresets(presets);
        if (state.editingProjectId === deletedId) {
          state.editingProjectId = null;
        }
        renderProjectSwitcherPanel();
        if (state.view === 'settings') renderSettings();
      };
    });

    shadowRootRef.getElementById('ss-project-add-btn').onclick = () => {
      state.editingProjectId = null;
      state.systemicNameLocked = false;
      switchView('settings');
    };
  }

  export function updateModeUI() {
    const textEl = shadowRootRef.getElementById('ss-mode-text');
    const checkbox = shadowRootRef.getElementById('ss-mode-checkbox');
    const label = shadowRootRef.getElementById('ss-mode-switch-label');

    if (!textEl || !checkbox || !label) return;

    const isAuto = state.projectMode === 'AUTO';

    if (!isSmartsender()) {
      label.classList.add('disabled');
      checkbox.disabled = false;
      textEl.textContent = 'MANUAL';
      textEl.style.color = 'var(--text5)';
      checkbox.checked = false;
    } else {
      label.classList.remove('disabled');
      checkbox.disabled = false;
      if (isAuto) {
        textEl.textContent = 'AUTO';
        textEl.style.color = 'var(--success)';
        checkbox.checked = true;
      } else {
        textEl.textContent = 'MANUAL';
        textEl.style.color = 'var(--error)';
        checkbox.checked = false;
      }
    }
  }
