// Allow extension pages (side panel, pop-up) to read session storage.
chrome.storage.session.setAccessLevel({ accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS' }).catch(() => {});

// Clicking the toolbar icon opens the native Chrome side panel.
chrome.sidePanel?.setPanelBehavior?.({ openPanelOnActionClick: true }).catch(() => {});

// ─── Contact pop-up window ────────────────────────────────────────────────
const POPUP_QUEUE = 'ss_popup_queue';
const POPUP_WIN = 'ss_popup_window_id';

async function openContactPopup(req) {
  // Queue the requested contact; the pop-up drains the queue on load and on ping.
  const got = await chrome.storage.session.get([POPUP_QUEUE, POPUP_WIN]);
  const queue = got[POPUP_QUEUE] || [];
  queue.push(req);
  await chrome.storage.session.set({ [POPUP_QUEUE]: queue });

  let winId = got[POPUP_WIN];
  if (winId != null) {
    try {
      await chrome.windows.get(winId);
      await chrome.windows.update(winId, { focused: true });
      chrome.runtime.sendMessage({ type: 'SS_POPUP_DRAIN' }).catch(() => {});
      return;
    } catch { winId = null; }
  }

  const win = await chrome.windows.create({
    url: chrome.runtime.getURL('contact-popup.html'),
    type: 'popup',
    width: 460,
    height: 720
  });
  await chrome.storage.session.set({ [POPUP_WIN]: win.id });
}

chrome.windows.onRemoved.addListener(async (windowId) => {
  const got = await chrome.storage.session.get(POPUP_WIN);
  if (got[POPUP_WIN] === windowId) await chrome.storage.session.remove(POPUP_WIN);
});

// CORS-free API requests
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'OPEN_CONTACT_POPUP') {
    openContactPopup({ contactId: message.contactId, projectSlug: message.projectSlug });
    return;
  }
  if (message.type === 'API_REQUEST') {
    handleApiRequest(message).then(sendResponse).catch(err => {
      sendResponse({ ok: false, error: err.message });
    });
    return true;
  }
  if (message.type === 'CHECK_FOR_UPDATES') {
    if (chrome.runtime.requestUpdateCheck) {
      chrome.runtime.requestUpdateCheck((status, details) => {
        sendResponse({ status, version: details?.version });
      });
    } else {
      sendResponse({ status: 'no_update', version: chrome.runtime.getManifest().version });
    }
    return true;
  }
});

async function handleApiRequest({ url, method = 'GET', headers = {}, body = null }) {
  try {
    const options = { method, headers: { ...headers } };
    if (body && typeof body === 'object') {
      options.body = JSON.stringify(body);
    } else {
      options.body = body;
    }
    
    // Auto-set Content-Type for JSON payloads if not provided
    if (options.body && (typeof body === 'object' || (typeof options.body === 'string' && options.body.trim().startsWith('{')))) {
      if (!options.headers['Content-Type'] && !options.headers['content-type']) {
        options.headers['Content-Type'] = 'application/json';
      }
    }
    
    const res = await fetch(url, options);
    
    let data = null;
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await res.json();
    } else {
      data = await res.text();
    }
    
    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

// 1. Update is downloaded and waiting to be applied
chrome.runtime.onUpdateAvailable.addListener((details) => {
  console.log(`New version downloaded: ${details.version}`);
  chrome.storage.local.set({ 
    updatePending: true,
    newVersion: details.version 
  });
});

// 2. Extension was installed or updated
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'update') {
    console.log(`Successfully updated from version ${details.previousVersion}`);
    chrome.storage.local.remove(['updatePending', 'newVersion']);
  }
});
