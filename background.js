// Toggle sidebar on icon click
chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.url?.includes('smartsender.com')) return;
  chrome.tabs.sendMessage(tab.id, { type: 'TOGGLE_SIDEBAR' });
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
    const options = { method, headers };
    if (body) options.body = body;
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
