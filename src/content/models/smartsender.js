/* global URLSearchParams */
import { state } from '../core/state.js';
import { bgFetch, authHeaders, getApiCache, setApiCache, buildHeaders } from '../core/api.js';
import { getPreset } from '../core/storage.js';
import { isSmartsender } from '../utils/url.js';
import { showNotice } from '../utils/dom.js';

  export async function searchTags(pid, term) {
    const cacheKey = `tags_${pid}_${term}`;
    const cached = getApiCache(cacheKey);
    if (cached) return cached;

    const preset = getPreset(pid);
    if (!preset?.apiToken) throw new Error('No API token. Open Settings ⚙');
    const all = []; let page = 1, tp = 1;
    while (page <= tp) {
      const d = await bgFetch(`https://api.smartsender.com/v1/tags?${new URLSearchParams({ page, limitation: 20, term })}`, 'GET', { 'Accept': 'application/json', 'Authorization': `Bearer ${preset.apiToken}` });
      all.push(...(d.collection || [])); tp = d.cursor?.pages ?? 1; page++;
    }
    const tl = term.toLowerCase().trim();
    const exact = all.filter(t => t.name.toLowerCase().trim() === tl);
    const result = { collection: exact.length ? exact : all.filter(t => t.name.toLowerCase().includes(tl)), isExact: exact.length > 0 };
    setApiCache(cacheKey, result);
    return result;
  }

  export async function countContacts(pid, tags, dv, dop) {
    if (!isSmartsender()) {
      showNotice('This feature is only available on console.smartsender.com', 'error');
      throw new Error('Unsupported domain');
    }
    const scopes = tags.map(tag => ({ resource: { name: tag.name, referable: tag.id, operator: dv ? dop : '=', value: dv || tag.createdAt.split('T')[0] }, type: 'tags', condition: 'includes' }));
    const apiOrigin = location.origin;
    const res = await fetch(`${apiOrigin}/api/i/projects/${pid}/contacts`, {
      method: 'POST', credentials: 'include',
      headers: buildHeaders({ 'Content-Type': 'application/json;charset=UTF-8', 'Accept': 'application/json, text/plain, */*' }),
      body: JSON.stringify({ scopes, page: 1, sort: 'ASC', limitation: 1 }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  export async function searchDefinitions(term) {
    const cacheKey = `defs_${state.projectId}_${term}`;
    const cached = getApiCache(cacheKey);
    if (cached) return cached;

    const h = authHeaders();
    if (!h) throw new Error('No API token. Open Settings ⚙');
    const d = await bgFetch(`https://api.smartsender.com/v1/definitions?${new URLSearchParams({ page: 1, limitation: 20, term })}`, 'GET', h);
    const result = d.collection || [];
    setApiCache(cacheKey, result);
    return result;
  }

  export async function fetchDefinitionsByIds(ids) {
    const h = authHeaders(); if (!h) throw new Error('No API token.');
    const results = [];
    for (const id of ids) {
      try {
        const d = await bgFetch(`https://api.smartsender.com/v1/definitions/${id}`, 'GET', h);
        if (d) results.push(d);
      } catch { }
    }
    return results;
  }

  export async function updateDefinition(id, name, value) {
    const h = authHeaders(); if (!h) throw new Error('No API token.');
    return bgFetch(`https://api.smartsender.com/v1/definitions/${id}`, 'PUT', { ...h, 'Content-Type': 'application/json' }, JSON.stringify({ name, value }));
  }

  export async function verifyDefinition(id, expected) {
    const h = authHeaders(); if (!h) return false;
    try {
      const def = state.varResults.find(d => d.id === id); if (!def) return false;
      const d = await bgFetch(`https://api.smartsender.com/v1/definitions?${new URLSearchParams({ page: 1, limitation: 20, term: def.name })}`, 'GET', h);
      return (d.collection || []).find(d => d.id === id)?.value === expected;
    } catch { return false; }
  }

  // ─── HEADER ───────────────────────────────────────────────────────────────
