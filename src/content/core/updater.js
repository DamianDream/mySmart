import { state } from './state.js';
import { loadFromCache, saveToStorage } from './storage.js';
import { shadowRootRef } from '../utils/dom.js';

export const updateListeners = [];

export const updateVersionDisplay = () => {
  if (!shadowRootRef) return;
  const el = shadowRootRef.getElementById('ss-footer-version');
  if (!el) return;
  const v = chrome.runtime.getManifest().version;
  if (state.updatePending) {
    el.innerHTML = `<span style="color:var(--error);font-weight:700;">v${v} (Update Ready)</span>`;
  } else {
    el.innerHTML = `v${v}`;
  }
};

// Background flags a pending update via chrome.storage.local (updatePending / newVersion).
// React live so the footer badge appears even if the sidebar is already open.
export const initUpdateWatcher = () => {
  try {
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area !== 'local') return;
      if (!('updatePending' in changes) && !('newVersion' in changes)) return;
      if ('updatePending' in changes) state.updatePending = changes.updatePending.newValue === true;
      if ('newVersion' in changes) state.newVersion = changes.newVersion.newValue || null;
      updateVersionDisplay();
      updateListeners.forEach(fn => fn());
    });
  } catch (err) {
    console.log('Update watcher init failed:', err);
  }
};

export const checkForUpdates = (force = false) => {
  const lastCheckMs = loadFromCache('ss_last_update_check', 0);
  const now = Date.now();
  if (!force && now - lastCheckMs < 24 * 60 * 60 * 1000) return;

  try {
    chrome.runtime.sendMessage({ type: 'CHECK_FOR_UPDATES' }, (res) => {
      if (!chrome.runtime.lastError && res && res.version) {
        state.latestVersion = res.version;
        saveToStorage('ss_latest_version', res.version);
        saveToStorage('ss_last_update_check', now);
        updateVersionDisplay();
        
        updateListeners.forEach(fn => fn());
      }
    });
  } catch (err) {
    console.log('Update check failed:', err);
  }
};
