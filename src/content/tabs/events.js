import { state } from '../core/state.js';
import { loadEventHistory, saveEventHistory, clearEventHistory } from '../core/storage.js';
import { getUrlContactId, getFullProjectFromUrl } from '../utils/url.js';
import { showNotice, copyToClipboard, esc, shadowRootRef } from '../utils/dom.js';
import { logAction } from '../core/logger.js';
import { fireContactEvent } from './contacts.js';
import { iZap, iReset, iCopy, iExternal, iDone, iTrash } from '../icons.js';

export function renderEventsTab() {
  const body = shadowRootRef.getElementById('ss-body');
  if (!body) return;

  const pid = state.projectId;
  const history = loadEventHistory(pid);
  const activeUrlContactId = getUrlContactId() || state.activeUrlContact?.id || '';
  const activeUrlContactName = state.activeUrlContact?.fullName || state.activeUrlContact?.name || '';

  const uniqueEventNames = [...new Set(history.map(e => e.name).filter(Boolean))].slice(0, 6);

  body.innerHTML = `
    <div style="margin-bottom:16px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
        <span class="ss-section-label" style="padding:0;margin:0;">Fire Trigger Event</span>
        ${history.length > 0 ? `<span class="ss-text-link" id="ss-event-clear-hist">CLEAR HISTORY</span>` : ''}
      </div>

      ${activeUrlContactId ? `
        <div id="ss-event-active-contact-banner" style="background:var(--accent-bg);border:1px solid rgba(var(--accent-rgb),0.3);border-radius:8px;padding:8px 12px;margin-bottom:12px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;" title="Click to use this contact">
          <div style="display:flex;align-items:center;gap:8px;overflow:hidden;">
            <span style="color:var(--accent);display:inline-flex;">${iZap}</span>
            <span style="font-size:12px;color:var(--text);font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
              Active contact: ${esc(activeUrlContactName || activeUrlContactId)} (${esc(activeUrlContactId)})
            </span>
          </div>
          <span style="font-size:11px;color:var(--accent);font-weight:700;flex-shrink:0;">USE</span>
        </div>
      ` : ''}

      <div style="background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:14px;display:flex;flex-direction:column;gap:12px;">
        <div>
          <label style="display:block;font-size:11px;font-weight:700;color:var(--text3);text-transform:uppercase;margin-bottom:4px;">
            Contact ID <span style="color:var(--error);">*</span>
          </label>
          <input class="ss-input" id="ss-event-contact-id" type="text" placeholder="Contact ID (e.g. 1234567)" autocomplete="off" value="${esc(state.eventContactId || activeUrlContactId || '')}" style="width:100%;box-sizing:border-box;" />
        </div>

        <div>
          <label style="display:block;font-size:11px;font-weight:700;color:var(--text3);text-transform:uppercase;margin-bottom:4px;">
            Event Name (name) <span style="color:var(--error);">*</span>
          </label>
          <input class="ss-input" id="ss-event-name" type="text" placeholder="Event trigger name (e.g. start_funnel)" autocomplete="off" value="${esc(state.eventName || '')}" style="width:100%;box-sizing:border-box;" />
        </div>

        ${uniqueEventNames.length > 0 ? `
          <div>
            <div style="font-size:11px;color:var(--text4);margin-bottom:6px;">Recent Event Names:</div>
            <div style="display:flex;flex-wrap:wrap;gap:6px;">
              ${uniqueEventNames.map(n => `
                <button type="button" class="ss-tab-event-chip" data-name="${esc(n)}" style="background:var(--bg3);border:1px solid var(--border);border-radius:12px;padding:3px 10px;font-size:11px;color:var(--text2);cursor:pointer;">
                  ${esc(n)}
                </button>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <div style="display:flex;gap:8px;align-items:center;margin-top:4px;">
          <button class="ss-btn-search" id="ss-event-fire-btn" title="Fire Trigger Event" style="flex:1;justify-content:center;background:var(--accent);color:var(--accent-text);display:flex;align-items:center;gap:6px;height:36px;border-radius:8px;">
            ${iZap}
            <span>Fire Event</span>
          </button>
          <button class="ss-btn-search" id="ss-event-reset-btn" title="Clear Inputs" style="width:auto;padding:8px 12px;justify-content:center;background:var(--bg3);color:var(--text2);height:36px;border-radius:8px;">
            ${iReset.replace('width="24" height="24"', 'width="16" height="16"')}
          </button>
        </div>

        <div id="ss-event-feedback" style="display:none;font-size:12px;padding:10px 12px;border-radius:8px;line-height:1.4;"></div>
      </div>
    </div>

    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
      <span class="ss-section-label" style="padding:0;margin:0;">Recent Events (${history.length})</span>
    </div>

    <div id="ss-event-history-list" style="display:flex;flex-direction:column;gap:8px;">
      ${renderHistoryItems(history)}
    </div>
  `;

  bindEventsTabLogic();
}

function renderHistoryItems(history) {
  if (!history || history.length === 0) {
    return `<div class="ss-empty">No events fired yet.</div>`;
  }

  const projectSlug = getFullProjectFromUrl();

  return history.map(item => {
    const timeStr = item.timestamp ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
    const dateStr = item.timestamp ? new Date(item.timestamp).toLocaleDateString() : '';

    return `
      <div class="ss-var-card" style="padding:12px;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
          <div style="min-width:0;flex:1;">
            <div style="display:flex;align-items:center;gap:6px;">
              <span style="color:var(--accent);display:inline-flex;">${iZap}</span>
              <span style="font-weight:700;color:var(--text);font-size:15px;word-break:break-all;">${esc(item.name)}</span>
            </div>
            <div style="font-size:13px;color:var(--text3);margin-top:4px;">
              Contact ID: <span style="color:var(--accent);font-weight:600;">${esc(item.contactId)}</span>
              ${item.contactName ? `<span style="color:var(--text4);"> • ${esc(item.contactName)}</span>` : ''}
            </div>
            <div style="font-size:11px;color:var(--text5);margin-top:4px;">
              ${dateStr} ${timeStr}
            </div>
          </div>
          <div style="display:flex;gap:4px;align-items:center;">
            <button class="ss-var-btn ss-event-refire-btn" data-cid="${esc(item.contactId)}" data-name="${esc(item.name)}" title="Re-fire event" style="color:var(--accent);display:inline-flex;align-items:center;justify-content:center;padding:0;width:28px;height:28px;">
              ${iZap}
            </button>
            ${projectSlug ? `
              <a href="https://messenger.smartsender.com/chats?project=${projectSlug}&selectedContactId=${esc(item.contactId)}" 
                 target="_blank" title="Open chat" class="ss-var-btn" 
                 style="color:var(--text4);text-decoration:none;display:inline-flex;align-items:center;justify-content:center;padding:0;width:28px;height:28px;">
                 ${iExternal.replace('width="16" height="16"', 'width="12" height="12"')}
              </a>
            ` : ''}
            <button class="ss-var-btn ss-event-copy-btn" data-copy="${esc(item.contactId)}" title="Copy Contact ID" style="padding:0;width:28px;height:28px;">
              ${iCopy}
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function bindEventsTabLogic() {
  const contactInput = shadowRootRef.getElementById('ss-event-contact-id');
  const nameInput = shadowRootRef.getElementById('ss-event-name');
  const fireBtn = shadowRootRef.getElementById('ss-event-fire-btn');
  const resetBtn = shadowRootRef.getElementById('ss-event-reset-btn');
  const feedback = shadowRootRef.getElementById('ss-event-feedback');
  const clearHistBtn = shadowRootRef.getElementById('ss-event-clear-hist');
  const activeBanner = shadowRootRef.getElementById('ss-event-active-contact-banner');

  if (activeBanner) {
    activeBanner.onclick = () => {
      const activeId = getUrlContactId() || state.activeUrlContact?.id || '';
      if (contactInput && activeId) {
        contactInput.value = activeId;
        nameInput?.focus();
      }
    };
  }

  shadowRootRef.querySelectorAll('.ss-tab-event-chip').forEach(chip => {
    chip.onclick = () => {
      if (nameInput) {
        nameInput.value = chip.dataset.name;
        nameInput.focus();
      }
    };
  });

  if (clearHistBtn) {
    clearHistBtn.onclick = () => {
      clearEventHistory(state.projectId);
      renderEventsTab();
    };
  }

  if (resetBtn) {
    resetBtn.onclick = () => {
      if (contactInput) contactInput.value = '';
      if (nameInput) nameInput.value = '';
      state.eventContactId = '';
      state.eventName = '';
      if (feedback) feedback.style.display = 'none';
      contactInput?.focus();
    };
  }

  const showFeedback = (msg, isSuccess) => {
    if (!feedback) return;
    feedback.style.display = 'block';
    feedback.style.background = isSuccess ? 'rgba(var(--success-rgb), 0.15)' : 'rgba(var(--error-rgb), 0.15)';
    feedback.style.color = isSuccess ? 'var(--success)' : 'var(--error)';
    feedback.textContent = msg;
  };

  const executeFire = async (cid, evName) => {
    if (!cid) {
      showFeedback('Please provide a Contact ID.', false);
      contactInput?.focus();
      return;
    }
    if (!evName) {
      showFeedback('Please provide an Event Name.', false);
      nameInput?.focus();
      return;
    }

    if (fireBtn) {
      fireBtn.disabled = true;
      fireBtn.innerHTML = '<span class="ss-spinner" style="width:12px;height:12px;border-width:1.5px;"></span> Firing...';
    }

    try {
      await fireContactEvent(cid, evName);
      logAction('Fire Event', `Fired "${evName}" for contact ${cid}`);
      saveEventHistory(state.projectId, {
        contactId: cid,
        name: evName,
        success: true
      });
      showNotice(`Event "${evName}" fired successfully!`, 'success');
      showFeedback(`✓ Event "${evName}" successfully fired for contact ${cid}!`, true);
      renderEventsTab();
    } catch (err) {
      showNotice(`Failed to fire event: ${err.message}`, 'error');
      showFeedback(`⚠ ${err.message}`, false);
      if (fireBtn) {
        fireBtn.disabled = false;
        fireBtn.innerHTML = `${iZap} <span>Fire Event</span>`;
      }
    }
  };

  if (fireBtn) {
    fireBtn.onclick = () => {
      const cid = contactInput?.value?.trim();
      const evName = nameInput?.value?.trim();
      state.eventContactId = cid;
      state.eventName = evName;
      executeFire(cid, evName);
    };
  }

  const handleKey = (e) => {
    if (e.key === 'Enter') {
      const cid = contactInput?.value?.trim();
      const evName = nameInput?.value?.trim();
      executeFire(cid, evName);
    }
  };
  contactInput?.addEventListener('keydown', handleKey);
  nameInput?.addEventListener('keydown', handleKey);

  // History action buttons
  shadowRootRef.querySelectorAll('.ss-event-refire-btn').forEach(btn => {
    btn.onclick = () => {
      const cid = btn.dataset.cid;
      const evName = btn.dataset.name;
      if (contactInput) contactInput.value = cid;
      if (nameInput) nameInput.value = evName;
      executeFire(cid, evName);
    };
  });

  shadowRootRef.querySelectorAll('.ss-event-copy-btn').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const id = btn.dataset.copy;
      copyToClipboard(id, 'Copy Contact ID', `Copied ID: ${id}`);
      const old = btn.innerHTML;
      btn.innerHTML = iDone;
      setTimeout(() => btn.innerHTML = old, 1500);
    };
  });
}
