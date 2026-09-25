import { shadowRootRef, esc, showNotice } from '../utils/dom.js';
import { iX, iZap } from '../icons.js';
import { fireContactEvent } from '../tabs/contacts.js';
import { state } from '../core/state.js';
import { loadEventHistory, saveEventHistory } from '../core/storage.js';
import { logAction } from '../core/logger.js';

export function openFireEventModal({ contactId, contactName = '', onSuccess = null, customRoot = null }) {
  // Always mount the modal inside #ss-sidebar so it inherits all styles, CSS variables, and top-level z-index
  let target = null;
  if (customRoot) {
    if (customRoot.id === 'ss-sidebar') target = customRoot;
    else target = customRoot.closest?.('#ss-sidebar') || customRoot.querySelector?.('#ss-sidebar');
  }
  if (!target && shadowRootRef) {
    target = shadowRootRef.getElementById('ss-sidebar');
  }
  if (!target) {
    target = document.getElementById('ss-sidebar');
  }
  if (!target) {
    target = customRoot || shadowRootRef || document.body;
  }
  if (!target) return;

  // Remove existing modal if open
  const existing = (target.getRootNode?.() || document).querySelector?.('#ss-fire-event-overlay') || target.querySelector?.('#ss-fire-event-overlay');
  if (existing) existing.remove();

  const pid = state.projectId;
  const recentEvents = loadEventHistory(pid);
  const uniqueNames = [...new Set(recentEvents.map(e => e.name).filter(Boolean))].slice(0, 5);

  const overlay = document.createElement('div');
  overlay.id = 'ss-fire-event-overlay';
  overlay.className = 'ss-modal-overlay';

  overlay.innerHTML = `
    <div class="ss-modal-box">
      <div class="ss-modal-header" style="background:var(--bg-solid,#282828);padding:14px 16px;border-bottom:1px solid var(--border,rgba(255,255,255,0.1));display:flex;align-items:center;justify-content:space-between;">
        <div class="ss-modal-title" style="font-size:15px;font-weight:700;color:var(--text,#ffffff);display:flex;align-items:center;gap:8px;">
          <span style="color:var(--accent,#0a84ff);display:inline-flex;">${iZap}</span>
          <span>Fire Event</span>
        </div>
        <button class="ss-close" id="ss-modal-close" title="Close" style="background:none;border:none;color:var(--text4,rgba(255,255,255,0.6));cursor:pointer;display:flex;align-items:center;justify-content:center;padding:4px;border-radius:6px;">${iX}</button>
      </div>
      <div class="ss-modal-body" style="background:var(--bg-solid,#282828);padding:16px;display:flex;flex-direction:column;gap:12px;">
        <div style="background:var(--bg2,rgba(255,255,255,0.06));padding:10px 12px;border-radius:8px;border:1px solid var(--border,rgba(255,255,255,0.1));display:flex;flex-direction:column;gap:4px;">
          <div style="font-size:11px;color:var(--text4,rgba(255,255,255,0.6));text-transform:uppercase;font-weight:700;letter-spacing:0.04em;">Target Contact</div>
          <div style="font-size:14px;font-weight:700;color:var(--text,#ffffff);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
            ${esc(contactName || 'Unnamed Contact')}
          </div>
          <div style="font-size:12px;color:var(--text4,rgba(255,255,255,0.6));">
            ID: <span style="color:var(--accent,#0a84ff);font-weight:600;">${esc(contactId)}</span>
          </div>
        </div>

        <div>
          <label style="display:block;font-size:12px;font-weight:600;color:var(--text3,#ebebf5);margin-bottom:6px;">
            Event Name (name) <span style="color:var(--error,#ff453a);">*</span>
          </label>
          <input type="text" id="ss-modal-event-name" class="ss-input" placeholder="e.g. order_success, webhook_event" autocomplete="off" style="width:100%;box-sizing:border-box;background:var(--bg2,#333333);color:var(--text,#ffffff);border:1px solid var(--border,rgba(255,255,255,0.15));border-radius:8px;padding:8px 12px;font-size:14px;" />
        </div>

        ${uniqueNames.length > 0 ? `
          <div>
            <div style="font-size:11px;color:var(--text4,rgba(255,255,255,0.6));margin-bottom:6px;">Recent Events:</div>
            <div style="display:flex;flex-wrap:wrap;gap:6px;">
              ${uniqueNames.map(name => `
                <button type="button" class="ss-event-chip" data-name="${esc(name)}" style="background:var(--bg3,rgba(255,255,255,0.08));border:1px solid var(--border,rgba(255,255,255,0.12));border-radius:12px;padding:3px 10px;font-size:11px;color:var(--text2,#f2f2f7);cursor:pointer;transition:all 0.15s ease;">
                  ${esc(name)}
                </button>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <div id="ss-modal-event-status" style="display:none;font-size:12px;padding:8px;border-radius:6px;line-height:1.4;"></div>
      </div>
      <div class="ss-modal-footer" style="background:var(--bg-solid,#282828);padding:12px 16px;border-top:1px solid var(--border,rgba(255,255,255,0.1));display:flex;gap:8px;justify-content:flex-end;">
        <button class="ss-btn-search" id="ss-modal-cancel" style="background:var(--bg3,rgba(255,255,255,0.08));color:var(--text2,#f2f2f7);padding:6px 14px;justify-content:center;border-radius:8px;cursor:pointer;">Cancel</button>
        <button class="ss-btn-search" id="ss-modal-fire" style="background:var(--accent,#0a84ff);color:var(--accent-text,#ffffff);padding:6px 16px;justify-content:center;border-radius:8px;display:flex;align-items:center;gap:6px;cursor:pointer;font-weight:600;">
          ${iZap}
          <span>Fire Event</span>
        </button>
      </div>
    </div>
  `;

  target.appendChild(overlay);

  const input = overlay.querySelector('#ss-modal-event-name');
  const fireBtn = overlay.querySelector('#ss-modal-fire');
  const cancelBtn = overlay.querySelector('#ss-modal-cancel');
  const closeBtn = overlay.querySelector('#ss-modal-close');
  const statusEl = overlay.querySelector('#ss-modal-event-status');

  setTimeout(() => input?.focus(), 60);

  const closeModal = () => {
    overlay.remove();
  };

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  closeBtn?.addEventListener('click', closeModal);
  cancelBtn?.addEventListener('click', closeModal);

  overlay.querySelectorAll('.ss-event-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      if (input) {
        input.value = chip.dataset.name;
        input.focus();
      }
    });
  });

  const doFire = async () => {
    const eventName = input?.value?.trim();
    if (!eventName) {
      if (statusEl) {
        statusEl.style.display = 'block';
        statusEl.style.background = 'rgba(var(--error-rgb, 255, 69, 58), 0.15)';
        statusEl.style.color = 'var(--error, #ff453a)';
        statusEl.textContent = 'Please enter an event name.';
      }
      input?.focus();
      return;
    }

    fireBtn.disabled = true;
    fireBtn.innerHTML = '<span class="ss-spinner" style="width:12px;height:12px;border-width:1.5px;"></span> Firing...';
    if (statusEl) statusEl.style.display = 'none';

    try {
      await fireContactEvent(contactId, eventName);
      logAction('Fire Event', `Fired "${eventName}" for contact ${contactId} (${contactName})`);
      saveEventHistory(state.projectId, {
        contactId,
        contactName: contactName || '',
        name: eventName,
        success: true
      });
      showNotice(`Event "${eventName}" fired successfully!`, 'success');
      if (onSuccess) onSuccess(eventName);
      closeModal();
    } catch (err) {
      fireBtn.disabled = false;
      fireBtn.innerHTML = `${iZap} <span>Fire Event</span>`;
      if (statusEl) {
        statusEl.style.display = 'block';
        statusEl.style.background = 'rgba(var(--error-rgb, 255, 69, 58), 0.15)';
        statusEl.style.color = 'var(--error, #ff453a)';
        statusEl.textContent = `Error: ${err.message}`;
      }
    }
  };

  fireBtn?.addEventListener('click', doFire);
  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') doFire();
    if (e.key === 'Escape') closeModal();
  });
}
