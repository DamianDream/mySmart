// Set session storage access level for content scripts
chrome.storage.session.setAccessLevel({ accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS' }).catch(() => {});

// Toggle sidebar on icon click
chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) return;
  chrome.tabs.sendMessage(tab.id, { type: 'TOGGLE_SIDEBAR' }).catch(() => {
    // Content script might not be loaded (e.g. on chrome:// pages or before reload)
    console.log('Content script not detected on this page.');
  });
});

// CORS-free API requests
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'API_REQUEST') {
    handleApiRequest(message).then(sendResponse).catch(err => {
      sendResponse({ ok: false, error: err.message });
    });
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
