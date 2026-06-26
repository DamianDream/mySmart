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

export const showNotice = (msg, type = 'error') => {
  if (!shadowRootRef) return;
  
  let container = shadowRootRef.getElementById('ss-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'ss-toast-container';
    shadowRootRef.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = 'ss-toast';
  toast.style.background = type === 'error' ? 'var(--error, #ef4444)' : 'var(--success, #10b981)';
  
  if (type === 'info') toast.style.background = 'var(--accent, #3b82f6)';
  
  toast.innerHTML = `
    <div style="display:flex;align-items:center;gap:8px;">
      <span>${type === 'error' ? '⚠️' : (type === 'info' ? 'ℹ️' : '✅')}</span>
      <span>${esc(msg)}</span>
    </div>
    <div class="ss-toast-progress" style="animation-duration: 3s;"></div>
  `;
  
  container.appendChild(toast);
  void toast.offsetWidth; // Force reflow
  toast.classList.add('visible');
  
  toast.onclick = () => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 300);
  };

  setTimeout(() => {
    if (toast.parentNode) {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 300);
    }
  }, 3000);
};

export const copyToClipboard = (text, actionName = 'Copy Data', detailText = '') => {
  logAction(actionName, detailText || `Copied: ${text}`);
  return navigator.clipboard.writeText(text).catch(() => {
    const ta = document.createElement('textarea'); ta.value = text;
    document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
  });
};
