/* global alert */
// Reusable contact-card renderer (used by the contact pop-up window). Mirrors
// the slide-panel card layout, with inline variable editing.
import { esc, copyToClipboard } from '../utils/dom.js';
import { iCopy, iDone, iEdit, iExternal, iX, iZap } from '../icons.js';
import { openFireEventModal } from './eventModal.js';
import { searchTags, createTag } from '../models/smartsender.js';
import { attachContactTag, detachContactTag, fetchContactInfo } from '../tabs/contacts.js';

const STANDARD_KEYS = ['id', 'name', 'firstName', 'lastName', 'fullName', 'email', 'phone', 'photo', 'createdAt', 'notes', 'tags', 'values', 'thumb', 'updatedAt', 'system_city', 'system_country', 'system_continent', 'system_timezone', 'system_os', 'system_browser', 'is_active', 'userId', 'projectId'];

function collectVars(data) {
  const vars = (data.values || []).map(v => ({ name: v.name, value: v.value }));
  Object.keys(data).forEach(k => {
    if (!STANDARD_KEYS.includes(k) && data[k] !== null && typeof data[k] !== 'object') {
      if (!vars.find(v => v.name === k)) vars.push({ name: k, value: data[k] });
    }
  });
  return vars;
}

function varRow(v, editingKey, editable) {
  const isEditing = editable && v.name === editingKey;
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
          ${editable ? `<button class="ss-info-copy-btn ss-cvar-edit" data-key="${esc(v.name)}" title="Edit value">${iEdit}</button>` : ''}
          <button class="ss-info-copy-btn" data-copy="${esc(String(v.value))}" title="Copy value">${iCopy}</button>
        `}
      </div>
    </div>
  `;
}

function bodyHTML(data, vars, { settings, priorityKeys, projectSlug, filter, editingKey, editable }) {
  const terms = filter.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
  const filteredTags = (data.tags || []).filter(t => !terms.length || terms.some(term => t.name.toLowerCase().includes(term)));
  const filteredVars = vars.filter(v => !terms.length || terms.some(t => v.name.toLowerCase().includes(t) || String(v.value).toLowerCase().includes(t)));
  const priorityVars = filteredVars.filter(v => priorityKeys.includes(v.name.toLowerCase()));

  let html = '';

  if (settings.showProfile) {
    html += `
      <div class="ss-info-section" style="display:flex;align-items:center;gap:12px;background:var(--bg2);padding:12px;border-radius:12px;margin-bottom:16px;">
        ${data.photo ? `<img src="${data.photo}" style="width:48px;height:48px;border-radius:50%;object-fit:cover;border:2px solid var(--border);">` : `<div style="width:48px;height:48px;border-radius:50%;background:var(--bg3);display:flex;align-items:center;justify-content:center;font-size:20px;">👤</div>`}
        <div style="flex:1;overflow:hidden;">
          <div style="font-weight:800;font-size:16px;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:flex;align-items:center;">
            <span style="overflow:hidden;text-overflow:ellipsis;">${esc(data.fullName || data.name || 'Unnamed')}</span>
            ${projectSlug ? `<a href="https://messenger.smartsender.com/chats?project=${projectSlug}&selectedContactId=${data.id}" target="_blank" title="Open chat" style="color:var(--text4);text-decoration:none;display:inline-flex;margin-left:8px;flex-shrink:0;">${iExternal}</a>` : ''}
            <button class="ss-card-fire-btn" title="Fire Event" style="color:var(--accent);display:inline-flex;align-items:center;justify-content:center;padding:0;width:24px;height:24px;margin-left:6px;border-radius:6px;background:none;border:none;cursor:pointer;flex-shrink:0;">
              ${iZap}
            </button>
          </div>
          <div style="font-size:13px;color:var(--text4);">ID: <span style="color:var(--accent);font-weight:600;">${data.id}</span></div>
        </div>
      </div>
    `;
  }

  if (settings.showDetails) {
    html += `
      <div class="ss-info-section">
        <div class="ss-info-label">Basic Data</div>
        ${data.email ? `<div class="ss-info-detail-row" title="Email: ${esc(data.email)}"><span class="ss-info-detail-label">Email</span><div class="ss-info-detail-value"><span>${esc(data.email)}</span><button class="ss-info-copy-btn" data-copy="${esc(data.email)}" title="Copy email">${iCopy}</button></div></div>` : ''}
        ${data.phone ? `<div class="ss-info-detail-row" title="Phone: ${esc(data.phone)}"><span class="ss-info-detail-label">Phone</span><div class="ss-info-detail-value"><span>${esc(data.phone)}</span><button class="ss-info-copy-btn" data-copy="${esc(data.phone)}" title="Copy phone">${iCopy}</button></div></div>` : ''}
        <div class="ss-info-detail-row" title="Created: ${data.createdAt ? new Date(data.createdAt).toLocaleString() : ''}"><span class="ss-info-detail-label">Created</span><div class="ss-info-detail-value"><span>${data.createdAt ? new Date(data.createdAt).toLocaleDateString() : '—'}</span></div></div>
      </div>
    `;
  }

  if (priorityVars.length > 0) {
    html += `
      <div class="ss-priority-section">
        <div class="ss-priority-label">Priority Variables</div>
        ${priorityVars.map(v => varRow(v, editingKey, editable)).join('')}
      </div>
    `;
  }

  if (settings.showTags) {
    html += `
      <div class="ss-info-accordion" id="ss-tags-accordion">
        <div class="ss-info-accordion-header"><span>Tags (${filteredTags.length})</span><span class="ss-info-accordion-icon">▾</span></div>
        <div class="ss-info-accordion-content">
          <div class="ss-info-tags">
            ${filteredTags.map(t => `
              <span class="ss-info-tag ss-tag-chip" data-id="${esc(String(t.id))}" data-name="${esc(t.name)}">
                <span>${esc(t.name)}</span>
                ${editable ? `<button class="ss-tag-remove-btn" data-id="${esc(String(t.id))}" data-name="${esc(t.name)}" title="Remove tag">${iX}</button>` : ''}
              </span>
            `).join('') || '<div class="ss-hint">No tags matched</div>'}
            ${editable ? `<button class="ss-btn-add-tag-trigger" id="ss-btn-add-tag-trigger" title="Attach tag">+ Tag</button>` : ''}
          </div>
          ${editable ? `
            <div class="ss-add-tag-popover" id="ss-add-tag-popover" style="display:none;margin-top:8px;position:relative;">
              <div style="display:flex;gap:6px;align-items:center;">
                <input type="text" class="ss-input ss-add-tag-input" id="ss-add-tag-input" placeholder="Search or type tag name..." autocomplete="off" style="font-size:12px;padding:4px 8px;height:26px;flex:1;" />
                <button class="ss-btn-search ss-add-tag-confirm" id="ss-add-tag-confirm" style="padding:4px 10px;height:26px;font-size:12px;background:var(--accent);color:var(--accent-text);border-radius:6px;cursor:pointer;">Add</button>
                <button class="ss-btn-search ss-add-tag-cancel" id="ss-add-tag-cancel" style="padding:4px 8px;height:26px;font-size:12px;background:var(--bg3);color:var(--text3);border-radius:6px;cursor:pointer;">${iX}</button>
              </div>
              <div class="ss-add-tag-suggestions" id="ss-add-tag-suggestions" style="display:none;position:absolute;top:32px;left:0;right:0;max-height:160px;overflow-y:auto;background:var(--bg-solid,#282828);border:1px solid var(--border);border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,0.5);z-index:100;padding:4px 0;"></div>
              <div class="ss-add-tag-error" id="ss-add-tag-error" style="display:none;color:var(--error);font-size:11px;margin-top:4px;"></div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  if (settings.showVars) {
    html += `
      <div class="ss-info-accordion" id="ss-vars-accordion">
        <div class="ss-info-accordion-header"><span>Variables (${filteredVars.length})</span><span class="ss-info-accordion-icon">▾</span></div>
        <div class="ss-info-accordion-content">
          <div class="ss-info-vars">${filteredVars.map(v => varRow(v, editingKey, editable)).join('') || '<div class="ss-hint">No variables matched</div>'}</div>
        </div>
      </div>
    `;
  }

  return html;
}

// Render a contact card into `container`.
// opts: { settings, priorityKeys, projectSlug, editable, onSave(key,value)->Promise<freshData> }
export function mountContactCard(container, data, opts) {
  let current = data;
  let editingKey = null;
  let curFilter = '';
  const expanded = new Set();   // accordion ids that are open (collapsed by default)
  const editable = !!(opts.editable && opts.onSave);

  const showSearch = opts.settings.showVars || opts.settings.showTags;
  container.innerHTML = `
    ${showSearch ? `<div class="ss-info-search-sticky" style="padding:10px 16px;background:var(--bg-solid);border-bottom:1px solid var(--border);">
      <input class="ss-input ss-card-filter" type="text" placeholder="Filter variables..." style="font-size:13px;padding:6px 10px;height:28px;" />
    </div>` : ''}
    <div class="ss-info-body ss-card-body"></div>
  `;
  const body = container.querySelector('.ss-card-body');

  const render = () => {
    const vars = collectVars(current);
    body.innerHTML = bodyHTML(current, vars, { ...opts, filter: curFilter, editingKey, editable });
    expanded.forEach(id => body.querySelector('#' + id)?.classList.add('expanded'));
    bind();
  };

  function bind() {
    body.querySelectorAll('.ss-info-accordion-header').forEach(h => {
      h.onclick = () => {
        const acc = h.closest('.ss-info-accordion');
        if (expanded.has(acc.id)) { expanded.delete(acc.id); acc.classList.remove('expanded'); }
        else { expanded.add(acc.id); acc.classList.add('expanded'); }
      };
    });
    body.querySelectorAll('[data-copy]').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        copyToClipboard(btn.dataset.copy, 'Copy', `Copied: ${btn.dataset.copy}`);
        const old = btn.innerHTML; btn.innerHTML = iDone;
        setTimeout(() => { btn.innerHTML = old; }, 1500);
      };
    });
    body.querySelectorAll('.ss-info-detail-row, .ss-info-var').forEach(el => {
      el.onclick = (e) => { if (e.target.closest('button') || e.target.closest('input')) return; el.classList.toggle('expanded'); };
    });

    body.querySelectorAll('.ss-card-fire-btn').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        openFireEventModal({
          contactId: current.id,
          contactName: current.fullName || current.name || '',
          customRoot: btn.closest('#ss-sidebar') || container.closest?.('#ss-sidebar') || container.getRootNode()
        });
      };
    });

    if (!editable) return;

    // ─── Tag Removal ──────────────────────────────────────────────────────────
    body.querySelectorAll('.ss-tag-remove-btn').forEach(btn => {
      btn.onclick = async (e) => {
        e.stopPropagation();
        const tagId = btn.dataset.id;
        if (!tagId) return;
        btn.disabled = true;
        btn.innerHTML = '<span class="ss-spinner" style="width:8px;height:8px;border-width:1px;"></span>';
        try {
          if (opts.onDetachTag) {
            const fresh = await opts.onDetachTag(current.id, tagId);
            if (fresh) current = fresh;
          } else {
            await detachContactTag(current.id, tagId, opts.projectSlug);
            current.tags = (current.tags || []).filter(t => String(t.id) !== String(tagId));
          }
          expanded.add('ss-tags-accordion');
          render();
        } catch (err) {
          btn.disabled = false;
          btn.innerHTML = iX;
          alert('Failed to remove tag: ' + (err.message || 'Error'));
        }
      };
    });

    // ─── Tag Addition ─────────────────────────────────────────────────────────
    const addTagTrigger = body.querySelector('#ss-btn-add-tag-trigger');
    const addTagPopover = body.querySelector('#ss-add-tag-popover');
    const addTagInput = body.querySelector('#ss-add-tag-input');
    const addTagConfirm = body.querySelector('#ss-add-tag-confirm');
    const addTagCancel = body.querySelector('#ss-add-tag-cancel');
    const addTagSuggestions = body.querySelector('#ss-add-tag-suggestions');
    const addTagError = body.querySelector('#ss-add-tag-error');

    const showTagError = (msg) => {
      if (!addTagError) return;
      if (msg) {
        addTagError.textContent = msg;
        addTagError.style.display = 'block';
      } else {
        addTagError.textContent = '';
        addTagError.style.display = 'none';
      }
    };

    const doAttachTag = async (tagId, tagName) => {
      showTagError('');
      if (addTagConfirm) {
        addTagConfirm.disabled = true;
        addTagConfirm.innerHTML = '<span class="ss-spinner" style="width:10px;height:10px;border-width:1px;"></span>';
      }
      try {
        if (opts.onAttachTag) {
          const fresh = await opts.onAttachTag(current.id, tagId, tagName);
          if (fresh) current = fresh;
        } else {
          await attachContactTag(current.id, tagId, tagName, opts.projectSlug);
          if (!current.tags) current.tags = [];
          if (!current.tags.some(t => String(t.id) === String(tagId))) {
            current.tags.push({ id: tagId, name: tagName });
          }
        }
        expanded.add('ss-tags-accordion');
        render();
      } catch (err) {
        showTagError(err.message || 'Failed to attach tag');
        if (addTagConfirm) {
          addTagConfirm.disabled = false;
          addTagConfirm.textContent = 'Add';
        }
      }
    };

    const doAttachNewTag = async (name) => {
      const trimmed = (name || '').trim();
      if (!trimmed) return;
      showTagError('');
      if (addTagConfirm) {
        addTagConfirm.disabled = true;
        addTagConfirm.innerHTML = '<span class="ss-spinner" style="width:10px;height:10px;border-width:1px;"></span>';
      }
      try {
        const created = await createTag(opts.projectSlug, { name: trimmed });
        const newTagId = created?.id || created?.data?.id;
        if (!newTagId) throw new Error('Tag created without ID');
        await doAttachTag(newTagId, trimmed);
      } catch (err) {
        showTagError(err.message || 'Failed to create tag');
        if (addTagConfirm) {
          addTagConfirm.disabled = false;
          addTagConfirm.textContent = 'Add';
        }
      }
    };

    const loadSuggestions = async (term = '') => {
      if (!addTagSuggestions) return;
      try {
        const res = await searchTags(opts.projectSlug, term);
        const allTags = res?.collection || [];
        const existingIds = new Set((current.tags || []).map(t => String(t.id)));
        const existingNames = new Set((current.tags || []).map(t => t.name.toLowerCase().trim()));
        const available = allTags.filter(t => !existingIds.has(String(t.id)) && !existingNames.has(t.name.toLowerCase().trim()));

        let itemsHtml = '';
        const trimmed = term.trim();
        const hasExactMatch = available.some(t => t.name.toLowerCase().trim() === trimmed.toLowerCase());

        if (trimmed && !hasExactMatch && !existingNames.has(trimmed.toLowerCase())) {
          itemsHtml += `
            <div class="ss-tag-suggestion-item ss-tag-create-item" data-create="true" data-name="${esc(trimmed)}">
              <span>+ Create & attach "<b>${esc(trimmed)}</b>"</span>
            </div>
          `;
        }

        itemsHtml += available.slice(0, 15).map(t => `
          <div class="ss-tag-suggestion-item" data-id="${esc(String(t.id))}" data-name="${esc(t.name)}">
            <span>${esc(t.name)}</span>
            <span style="font-size:10px;color:var(--text5);">ID: ${t.id}</span>
          </div>
        `).join('');

        if (!itemsHtml) {
          itemsHtml = '<div style="padding:8px 10px;font-size:11px;color:var(--text4);">No matching tags</div>';
        }

        addTagSuggestions.innerHTML = itemsHtml;
        addTagSuggestions.style.display = 'block';

        addTagSuggestions.querySelectorAll('.ss-tag-suggestion-item').forEach(item => {
          item.onclick = async (e) => {
            e.stopPropagation();
            if (item.dataset.create === 'true') {
              await doAttachNewTag(item.dataset.name);
            } else {
              await doAttachTag(item.dataset.id, item.dataset.name);
            }
          };
        });
      } catch (err) {
        console.warn('Failed to load tag suggestions:', err.message);
      }
    };

    if (addTagTrigger && addTagPopover) {
      addTagTrigger.onclick = (e) => {
        e.stopPropagation();
        const isOpen = addTagPopover.style.display !== 'none';
        if (isOpen) {
          addTagPopover.style.display = 'none';
          if (addTagSuggestions) addTagSuggestions.style.display = 'none';
        } else {
          addTagPopover.style.display = 'block';
          if (addTagInput) {
            addTagInput.value = '';
            addTagInput.focus();
            loadSuggestions('');
          }
        }
      };
    }

    if (addTagCancel && addTagPopover) {
      addTagCancel.onclick = (e) => {
        e.stopPropagation();
        addTagPopover.style.display = 'none';
        if (addTagSuggestions) addTagSuggestions.style.display = 'none';
        showTagError('');
      };
    }

    if (addTagInput) {
      let debTimer = null;
      addTagInput.oninput = (e) => {
        clearTimeout(debTimer);
        const q = e.target.value;
        debTimer = setTimeout(() => loadSuggestions(q), 180);
      };
      addTagInput.onkeydown = async (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const q = addTagInput.value.trim();
          if (!q) return;
          const existingItem = addTagSuggestions?.querySelector(`.ss-tag-suggestion-item:not(.ss-tag-create-item)`);
          if (existingItem && existingItem.dataset.name.toLowerCase() === q.toLowerCase()) {
            await doAttachTag(existingItem.dataset.id, existingItem.dataset.name);
          } else {
            await doAttachNewTag(q);
          }
        }
        if (e.key === 'Escape') {
          addTagCancel?.click();
        }
      };
    }

    if (addTagConfirm && addTagInput) {
      addTagConfirm.onclick = async (e) => {
        e.stopPropagation();
        const q = addTagInput.value.trim();
        if (!q) return;
        const existingItem = addTagSuggestions?.querySelector(`.ss-tag-suggestion-item:not(.ss-tag-create-item)`);
        if (existingItem && existingItem.dataset.name.toLowerCase() === q.toLowerCase()) {
          await doAttachTag(existingItem.dataset.id, existingItem.dataset.name);
        } else {
          await doAttachNewTag(q);
        }
      };
    }

    body.querySelectorAll('.ss-cvar-edit').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        editingKey = btn.dataset.key;
        expanded.add('ss-vars-accordion');   // keep the var visible while editing
        render();
        setTimeout(() => body.querySelector('.ss-cvar-input')?.focus(), 30);
      };
    });
    body.querySelectorAll('.ss-cvar-cancel').forEach(btn => {
      btn.onclick = (e) => { e.stopPropagation(); editingKey = null; render(); };
    });
    body.querySelectorAll('.ss-cvar-save').forEach(btn => {
      btn.onclick = async (e) => {
        e.stopPropagation();
        const key = btn.dataset.key;
        const input = btn.closest('.ss-info-var').querySelector('.ss-cvar-input');
        const newVal = input.value;
        btn.disabled = true; btn.innerHTML = '<span class="ss-spinner" style="width:10px;height:10px;border-width:1px;"></span>';
        try {
          const fresh = await opts.onSave(key, newVal);
          if (fresh) current = fresh;
          editingKey = null;
          render();
        } catch (err) {
          btn.disabled = false; btn.innerHTML = iDone;
          const valEl = btn.closest('.ss-info-var-val');
          if (valEl) valEl.insertAdjacentHTML('beforeend', `<span style="color:var(--error);font-size:11px;margin-left:6px;">${esc(err.message)}</span>`);
        }
      };
    });
    body.querySelectorAll('.ss-cvar-input').forEach(inp => {
      inp.onkeydown = (e) => {
        if (e.key === 'Enter') inp.closest('.ss-info-var').querySelector('.ss-cvar-save')?.click();
        if (e.key === 'Escape') inp.closest('.ss-info-var').querySelector('.ss-cvar-cancel')?.click();
      };
    });
  }

  render();

  const filterInput = container.querySelector('.ss-card-filter');
  if (filterInput) {
    filterInput.oninput = (e) => {
      curFilter = e.target.value;
      if (curFilter.trim()) { expanded.add('ss-tags-accordion'); expanded.add('ss-vars-accordion'); }
      render();
    };
  }
}
