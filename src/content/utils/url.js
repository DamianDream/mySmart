/* global URL */
export const getXsrfToken = () => document.querySelector('meta[name="csrf-token"]')?.content ?? '';

export const getXsrfCookie = () => decodeURIComponent(document.cookie.split('; ').find(r => r.startsWith('XSRF-TOKEN='))?.split('=')[1] ?? '');

export const getProjectFromUrl = () => {
  const url = new URL(location.href);
  const path = url.pathname.toLowerCase();
  
  if (path.includes('/project/')) {
    const parts = path.split('/');
    const pidx = parts.indexOf('project');
    if (pidx !== -1 && pidx + 1 < parts.length) {
      return parts[pidx + 1];
    }
  }
  return url.searchParams.get('project') || null;
};

export const getUrlContactId = () => {
  const url = new URL(location.href);
  const path = url.pathname.toLowerCase();
  
  if (path.includes('/contacts/')) {
    const parts = path.split('/');
    const pidx = parts.indexOf('contacts');
    if (pidx !== -1 && pidx + 1 < parts.length) {
      const maybeId = parts[pidx + 1];
      if (/^\d+$/.test(maybeId)) return maybeId;
    }
  }
  return url.searchParams.get('selectedContactId') || url.searchParams.get('contactId') || url.searchParams.get('contact_id') || null;
};

export const getFullProjectFromUrl = () => {
  const pid = getProjectFromUrl();
  if (pid) return pid;
  
  const m = location.pathname.match(/^\/([^/]+)/);
  if (m && m[1] && m[1] !== 'home' && m[1] !== 'dashboard' && m[1] !== 'projects') {
    return m[1];
  }
  return null;
};

export const isSmartsender = () => location.hostname.endsWith('smartsender.com');
