// Opens a contact in the detached pop-up window. The window itself is managed by
// the background service worker (the only context that can call chrome.windows
// from both the side panel and content scripts).
import { state } from './state.js';
import { getFullProjectFromUrl } from '../utils/url.js';

export function openContactInPopup(contactId) {
  const projectSlug = state.projectId || getFullProjectFromUrl() || '';
  try {
    chrome.runtime.sendMessage({ type: 'OPEN_CONTACT_POPUP', contactId: String(contactId), projectSlug });
  } catch { /* extension context may be reloading */ }
}
