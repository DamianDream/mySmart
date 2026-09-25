import { state } from './state.js';
import { getPreset } from './storage.js';
import { logAction } from './logger.js';

const __apiCache = new Map();

export const getApiCache = (key) => {
  if (!state.globalSettings.useApiCache) return null;
  const item = __apiCache.get(key);
  if (item && Date.now() - item.ts < 5 * 60 * 1000) return item.data; // 5 mins
  return null;
};

export const setApiCache = (key, data) => {
  __apiCache.set(key, { data, ts: Date.now() });
};

export const authHeaders = () => {
  const t = getPreset(state.projectId)?.apiToken;
  return t ? { 'Accept': 'application/json', 'Authorization': `Bearer ${t}` } : null;
};

export function bgFetch(url, method = 'GET', headers = {}, body = null) {
  const cleanUrl = url.split('?')[0];
  return new Promise((resolve, reject) => {
    try {
      chrome.runtime.sendMessage({ type: 'API_REQUEST', url, method, headers, body }, (res) => {
        if (chrome.runtime.lastError) {
          const m = chrome.runtime.lastError.message;
          logAction('API Error', `${method} ${cleanUrl} - Extension Error`, { url, method, body, error: m });
          if (m.includes('context invalidated')) {
            return reject(new Error('Extension was updated 🔄 Please refresh this page to continue.'));
          }
          return reject(new Error(m));
        }
        if (!res?.ok) {
          const validationMsg = res?.data?.errors ? Object.values(res.data.errors).flat().join(', ') : '';
          const errMsg = validationMsg || res?.data?.message || res?.error || `HTTP ${res?.status}`;
          logAction('API Error', `${method} ${cleanUrl} - HTTP ${res?.status}`, { url, method, body, status: res?.status, error: errMsg, data: res?.data });
          return reject(new Error(errMsg));
        }
        logAction('API Request', `${method} ${cleanUrl} - Success`, { url, method, body, status: res.status, response: res.data });
        resolve(res.data);
      });
    } catch (e) {
      logAction('API Error', `${method} ${cleanUrl} - Catch Error`, { url, method, body, error: e.message });
      if (e.message.includes('context invalidated')) {
        reject(new Error('Extension was updated 🔄 Please refresh this page to continue.'));
      } else {
        reject(e);
      }
    }
  });
}
