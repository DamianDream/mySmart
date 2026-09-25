/* global URLSearchParams, alert */
import { state } from '../core/state.js';
import { bgFetch, authHeaders } from '../core/api.js';
import { loadContactSettings, saveContactSettings, loadContactPriorityVars } from '../core/storage.js';
import { getUrlContactId, getFullProjectFromUrl } from '../utils/url.js';
import { showNotice, copyToClipboard, shadowRootRef, esc } from '../utils/dom.js';
import { iCopy, iEdit, iDone, iExternal, iX, iZap } from '../icons.js';
import { closeAllExtraPanels } from './vars.js';
import { openFireEventModal } from '../ui/eventModal.js';


// ─── CONTACTS TAB ──────────────────────────────────────────────────────────
  export async function findContacts(term) {
    const h = authHeaders(); if (!h) throw new Error('No API token. Open Settings ⚙');
    const isEmail = term.includes('@');
    const looksLikeId = /^\d+$/.test(term);
    let results = [];

    if (looksLikeId) {
      try {
        const res = await bgFetch(`https://api.smartsender.com/v1/contacts/${term}`, 'GET', h);
        if (res && res.id) results.push(res);
      } catch (e) { console.warn('[Contacts] ID lookup failed:', e.message); }
    }

    if (results.length === 0) {
      const params = new URLSearchParams({ page: 1, limitation: 10, term: term.trim() });
      try {
        const res = await bgFetch(`https://api.smartsender.com/v1/contacts/search?${params}`, 'GET', h);
        results = res?.collection || (Array.isArray(res) ? res : []);
      } catch (e) {
        console.error('[Contacts] Search failed:', e.message);
        throw e;
      }
    }
    return results;
  }

  export async function fetchContactInfo(id) {
    const h = authHeaders(); if (!h) throw new Error('No API token.');
    return bgFetch(`https://api.smartsender.com/v1/contacts/${id}/info`, 'GET', h);
  }

  export async function updateContactVar(contactId, key, value) {
    const h = authHeaders(); if (!h) throw new Error('No API token.');
    return bgFetch(`https://api.smartsender.com/v1/contacts/${contactId}`, 'PUT', h, {
      values: { [key]: value }
    });
  }

  export async function fireContactEvent(contactId, name) {
    const h = authHeaders(); if (!h) throw new Error('No API token. Open Settings ⚙');
    if (!contactId) throw new Error('Contact ID is required');
    if (!name || !name.trim()) throw new Error('Event name is required');
    return bgFetch(`https://api.smartsender.com/v1/contacts/${encodeURIComponent(contactId)}/fire`, 'POST', h, {
      name: name.trim()
    });
  }

  export async function attachContactTag(contactId, tagId, tagName = '', pid = null) {
    const h = authHeaders(pid); if (!h) throw new Error('No API token. Open Settings ⚙');
    if (!contactId) throw new Error('Contact ID is required');
    if (!tagId) throw new Error('Tag ID is required');
    try {
      return await bgFetch(`https://api.smartsender.com/v1/contacts/${contactId}/tags/${tagId}`, 'POST', h);
    } catch {
      return await bgFetch(`https://api.smartsender.com/v1/contacts/${contactId}/tags`, 'POST', h, {
        id: tagId,
        name: tagName
      });
    }
  }

  export async function detachContactTag(contactId, tagId, pid = null) {
    const h = authHeaders(pid); if (!h) throw new Error('No API token. Open Settings ⚙');
    if (!contactId) throw new Error('Contact ID is required');
    if (!tagId) throw new Error('Tag ID is required');
    return bgFetch(`https://api.smartsender.com/v1/contacts/${contactId}/tags/${tagId}`, 'DELETE', h);
  }

  export function renderContactInfoPanel(id) {
    const panel = shadowRootRef.getElementById('ss-info-panel');
    if (!panel) return;

    closeAllExtraPanels();
    state.contactInfoOpen = true;
    state.contactInfoId = id;
    panel.classList.add('open');

    panel.innerHTML = `
      <div class="ss-info-header">
        <div class="ss-info-title">Contact Info</div>
        <button class="ss-close ss-close-extra-panel">${iX}</button>
      </div>
      <div id="ss-info-search-sticky" style="padding:10px 16px;background:var(--bg-solid);border-bottom:1px solid var(--border);display:none;">
        <input class="ss-input" id="ss-info-var-search" type="text" placeholder="Filter variables..." style="font-size:13px;padding:6px 10px;height:28px;" />
      </div>
      <div class="ss-info-body" id="ss-info-body">
        <div class="ss-loading" style="display:flex;"><div class="ss-spinner"></div><span class="ss-loading-text">Loading details...</span></div>
      </div>
    `;

    fetchContactInfo(id).then(data => {
      if (state.contactInfoId !== id) return;
      state.contactInfo = data;
      const body = shadowRootRef.getElementById('ss-info-body');
      if (!body) return;

      const standardKeys = ['id', 'name', 'firstName', 'lastName', 'fullName', 'email', 'phone', 'photo', 'createdAt', 'notes', 'tags', 'values', 'thumb', 'updatedAt', 'system_city', 'system_country', 'system_continent', 'system_timezone', 'system_os', 'system_browser', 'is_active', 'userId', 'projectId'];

      let vars = (data.values || []).map(v => ({ name: v.name, value: v.value }));
      Object.keys(data).forEach(k => {
        if (!standardKeys.includes(k) && data[k] !== null && typeof data[k] !== 'object') {
          if (!vars.find(v => v.name === k)) vars.push({ name: k, value: data[k] });
        }
      });

      const renderVarRow = (v) => {
        const isEditing = state.contactVarEditingKey === v.name;
        return `
          <div class="ss-info-var${isEditing ? ' editing' : ''}" title="${esc(v.name)}: ${esc(String(v.value))}">
            <div class="ss-info-var-name">
              <span>${esc(v.name)}</span>
              <button class="ss-info-copy-btn" data-copy="${esc(v.name)}" title="Copy key">${iCopy}</button>
            </div>
            <div class="ss-info-var-val">
              ${isEditing ? `
                <input class="ss-input ss-cvar-input" value="${esc(String(v.value))}" style="flex:1;height:22px;font-size:13px;padding:2px 6px;margin-right:4px;" />
                <button class="ss-var-btn ss-cvar-save" data-key="${esc(v.name)}" title="Save">${iDone}</button>
                <button class="ss-var-btn ss-cvar-cancel" title="Cancel">${iX}</button>
              ` : `
                <span>${esc(String(v.value))}</span>
                <button class="ss-info-copy-btn ss-cvar-edit" data-key="${esc(v.name)}" title="Edit value">${iEdit}</button>
                <button class="ss-info-copy-btn" data-copy="${esc(String(v.value))}" title="Copy value">${iCopy}</button>
              `}
            </div>
          </div>
        `;
      };

      const renderBodyContent = (filter = '') => {
        const terms = filter.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
        const pid = state.projectId;
        const priorityKeys = loadContactPriorityVars(pid).split(',').map(s => s.trim().toLowerCase()).filter(Boolean);

        const filteredTags = (data.tags || []).filter(t => !terms.length || terms.some(term => t.name.toLowerCase().includes(term)));
        const filteredVars = vars.filter(v => !terms.length || terms.some(t => v.name.toLowerCase().includes(t) || String(v.value).toLowerCase().includes(t)));

        const priorityVars = filteredVars.filter(v => priorityKeys.includes(v.name.toLowerCase()));

        let html = '';

        // Profile
        if (state.contactSettings.showProfile) {
          html += `
            <div class="ss-info-section" style="display:flex;align-items:center;gap:12px;background:var(--bg2);padding:12px;border-radius:12px;margin-bottom:16px;">
              ${data.photo ? `<img src="${data.photo}" style="width:48px;height:48px;border-radius:50%;object-fit:cover;border:2px solid var(--border);">` : `<div style="width:48px;height:48px;border-radius:50%;background:var(--bg3);display:flex;align-items:center;justify-content:center;font-size:20px;">👤</div>`}
              <div style="flex:1;overflow:hidden;">
                <div style="font-weight:800;font-size:16px;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:flex;align-items:center;">
                  <span style="overflow:hidden;text-overflow:ellipsis;">${esc(data.fullName || data.name || 'Unnamed')}</span>
                  ${getFullProjectFromUrl() ? `<a href="https://messenger.smartsender.com/chats?project=${getFullProjectFromUrl()}&selectedContactId=${data.id}" target="_blank" title="Open chat" style="color:var(--text4);text-decoration:none;display:inline-flex;margin-left:8px;flex-shrink:0;">${iExternal}</a>` : ''}
                  <button class="ss-info-fire-btn" title="Fire Event" style="color:var(--accent);display:inline-flex;align-items:center;justify-content:center;padding:0;width:24px;height:24px;margin-left:6px;border-radius:6px;background:none;border:none;cursor:pointer;flex-shrink:0;">
                    ${iZap}
                  </button>
                </div>
                <div style="font-size:13px;color:var(--text4);font-family:Roboto,sans-serif;">ID: ${data.id}</div>
              </div>
            </div>
          `;
        }

        // Basic Data
        if (state.contactSettings.showDetails) {
          html += `
            <div class="ss-info-section">
              <div class="ss-info-label">Basic Data</div>
              ${data.email ? `<div class="ss-info-detail-row" title="Email: ${esc(data.email)}"><span class="ss-info-detail-label">Email</span><div class="ss-info-detail-value"><span>${esc(data.email)}</span><button class="ss-info-copy-btn" data-copy="${esc(data.email)}" title="Copy email">${iCopy}</button></div></div>` : ''}
              ${data.phone ? `<div class="ss-info-detail-row" title="Phone: ${esc(data.phone)}"><span class="ss-info-detail-label">Phone</span><div class="ss-info-detail-value"><span>${esc(data.phone)}</span><button class="ss-info-copy-btn" data-copy="${esc(data.phone)}" title="Copy phone">${iCopy}</button></div></div>` : ''}
              <div class="ss-info-detail-row" title="Created: ${new Date(data.createdAt).toLocaleString()}"><span class="ss-info-detail-label">Created</span><div class="ss-info-detail-value"><span>${new Date(data.createdAt).toLocaleDateString()}</span><button class="ss-info-copy-btn" data-copy="${new Date(data.createdAt).toLocaleDateString()}" title="Copy date">${iCopy}</button></div></div>
            </div>
          `;
        }

        // Priority Variables
        if (priorityVars.length > 0) {
          html += `
            <div class="ss-priority-section">
              <div class="ss-priority-label">Priority Variables</div>
              ${priorityVars.map(v => renderVarRow(v)).join('')}
            </div>
          `;
        }

        // Tags Accordion
        if (state.contactSettings.showTags) {
          html += `
            <div class="ss-info-accordion" id="ss-tags-accordion">
              <div class="ss-info-accordion-header">
                <span>Tags (${filteredTags.length})</span>
                <span class="ss-info-accordion-icon">▾</span>
              </div>
              <div class="ss-info-accordion-content">
                <div class="ss-info-tags">
                  ${filteredTags.map(t => `<span class="ss-info-tag">${esc(t.name)}</span>`).join('') || '<div class="ss-hint">No tags matched</div>'}
                </div>
              </div>
            </div>
          `;
        }

        // Variables Accordion
        if (state.contactSettings.showVars) {
          html += `
            <div class="ss-info-accordion" id="ss-vars-accordion">
              <div class="ss-info-accordion-header">
                <span>Variables (${filteredVars.length})</span>
                <span class="ss-info-accordion-icon">▾</span>
              </div>
              <div class="ss-info-accordion-content">
                <div class="ss-info-vars">
                  ${filteredVars.map(v => renderVarRow(v)).join('') || '<div class="ss-hint">No variables matched</div>'}
                </div>
              </div>
            </div>
          `;
        }

        return html;
      };

      body.innerHTML = renderBodyContent();

      const vSearch = shadowRootRef.getElementById('ss-info-var-search');
      const vSearchSticky = shadowRootRef.getElementById('ss-info-search-sticky');
      if (vSearchSticky) vSearchSticky.style.display = (state.contactSettings.showVars || state.contactSettings.showTags) ? 'block' : 'none';

      if (vSearch) {
        vSearch.value = '';
        vSearch.oninput = (e) => {
          body.innerHTML = renderBodyContent(e.target.value);
          bindAll();
          // Auto-expand if searching
          if (e.target.value.trim()) {
            body.querySelectorAll('.ss-info-accordion').forEach(a => a.classList.add('expanded'));
          }
        };
      }

      const bindAll = () => {
        // Accordion toggle
        body.querySelectorAll('.ss-info-accordion-header').forEach(h => {
          h.onclick = () => h.closest('.ss-info-accordion').classList.toggle('expanded');
        });

        // Copy buttons
        body.querySelectorAll('[data-copy]').forEach(btn => {
          btn.onclick = (e) => {
            e.stopPropagation();
            copyToClipboard(btn.dataset.copy, 'Copy Contact ID', `Copied ID: ${btn.dataset.copy}`);
            const old = btn.innerHTML; btn.innerHTML = iDone;
            setTimeout(() => btn.innerHTML = old, 1500);
          };
        });

        // Fire Event button
        body.querySelectorAll('.ss-info-fire-btn').forEach(btn => {
          btn.onclick = (e) => {
            e.stopPropagation();
            e.preventDefault();
            openFireEventModal({
              contactId: data.id,
              contactName: data.fullName || data.name || '',
              customRoot: btn.closest('#ss-sidebar') || shadowRootRef
            });
          };
        });

        // Detail row expand
        body.querySelectorAll('.ss-info-detail-row').forEach(el => {
          el.onclick = (e) => {
            if (e.target.closest('button')) return;
            el.classList.toggle('expanded');
          };
        });

        // Variable actions
        body.querySelectorAll('.ss-info-var').forEach(el => {
          el.onclick = (e) => {
            if (e.target.closest('input') || e.target.closest('button')) return;
            el.classList.toggle('expanded');
          };

          el.querySelector('.ss-cvar-edit')?.addEventListener('click', (e) => {
            e.stopPropagation();
            state.contactVarEditingKey = e.currentTarget.dataset.key;
            body.innerHTML = renderBodyContent(vSearch?.value || '');
            bindAll();
            // Keep variables expanded when editing
            body.querySelector('#ss-vars-accordion')?.classList.add('expanded');
            setTimeout(() => body.querySelector('.ss-cvar-input')?.focus(), 30);
          });

          el.querySelector('.ss-cvar-cancel')?.addEventListener('click', (e) => {
            e.stopPropagation();
            state.contactVarEditingKey = null;
            body.innerHTML = renderBodyContent(vSearch?.value || '');
            bindAll();
            body.querySelector('#ss-vars-accordion')?.classList.add('expanded');
          });

          el.querySelector('.ss-cvar-save')?.addEventListener('click', async (e) => {
            e.stopPropagation();
            const key = e.currentTarget.dataset.key;
            const input = el.querySelector('.ss-cvar-input');
            const newVal = input.value;
            const b = e.currentTarget;
            b.disabled = true; b.innerHTML = '<span class="ss-spinner" style="width:10px;height:10px;border-width:1px;"></span>';
            try {
              await updateContactVar(id, key, newVal);
              state.contactVarEditingKey = null;
              renderContactInfoPanel(id);
            } catch (err) {
              alert('Update failed: ' + err.message);
              b.disabled = false; b.innerHTML = iDone;
            }
          });

          el.querySelector('.ss-cvar-input')?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') el.querySelector('.ss-cvar-save')?.click();
            if (e.key === 'Escape') el.querySelector('.ss-cvar-cancel')?.click();
          });
        });
      };
      bindAll();
    }).catch(err => {
      const body = shadowRootRef.getElementById('ss-info-body');
      if (body) body.innerHTML = `<div class="ss-error visible">⚠ ${err.message}</div>`;
    });
  }

  

  
