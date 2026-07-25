// Reusable contact-card renderer (used by the contact pop-up window). Mirrors
// the slide-panel card layout, with inline variable editing.
import { esc, copyToClipboard } from '../utils/dom.js';
import { iCopy, iDone, iEdit, iExternal, iX } from '../icons.js';

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
          <div class="ss-info-tags">${filteredTags.map(t => `<span class="ss-info-tag">${esc(t.name)}</span>`).join('') || '<div class="ss-hint">No tags matched</div>'}</div>
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

    if (!editable) return;

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
