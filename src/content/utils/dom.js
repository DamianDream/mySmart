import { logAction } from '../core/logger.js';

export let shadowRootRef = null;
export const setShadowRoot = (root) => { shadowRootRef = root; };

export function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Toasts are shown for errors only — info/success calls are ignored.
// Plain text, no icons; styling lives in .ss-toast (sidebar.css).
export const showNotice = (msg, type = 'error') => {
  if (type !== 'error' || !shadowRootRef) return;

  let container = shadowRootRef.getElementById('ss-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'ss-toast-container';
    shadowRootRef.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'ss-toast';
  toast.textContent = msg;
  container.appendChild(toast);
  void toast.offsetWidth; // force reflow so the transition runs
  toast.classList.add('visible');

  const dismiss = () => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 300);
  };
  toast.onclick = dismiss;
  setTimeout(() => { if (toast.parentNode) dismiss(); }, 3000);
};

export const copyToClipboard = (text, actionName = 'Copy Data', detailText = '') => {
  logAction(actionName, detailText || `Copied: ${text}`);
  return navigator.clipboard.writeText(text).catch(() => {
    const ta = document.createElement('textarea'); ta.value = text;
    document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
  });
};
