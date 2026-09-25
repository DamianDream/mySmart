/* global URLSearchParams */
import { state } from '../core/state.js';
import { bgFetch, authHeaders, getApiCache, setApiCache } from '../core/api.js';
import { getPreset } from '../core/storage.js';

  export async function searchTags(pid, term = '') {
    const pId = pid || state.projectId;
    const cacheKey = `tags_${pId}_${term}`;
    const cached = getApiCache(cacheKey);
    if (cached) return cached;

    const preset = getPreset(pId);
    if (!preset?.apiToken) throw new Error('No API token. Open Settings ⚙');
    const h = { 'Accept': 'application/json', 'Authorization': `Bearer ${preset.apiToken}` };
    const all = []; let page = 1, tp = 1;
    while (page <= tp) {
      const params = new URLSearchParams({ page, limitation: 20 });
      if (term) params.set('term', term);
      const d = await bgFetch(`https://api.smartsender.com/v1/tags?${params}`, 'GET', h);
      all.push(...(d.collection || [])); tp = d.cursor?.pages ?? 1; page++;
    }
    const tl = (term || '').toLowerCase().trim();
    const exact = tl ? all.filter(t => t.name.toLowerCase().trim() === tl) : [];
    const result = {
      collection: tl ? (exact.length ? exact : all.filter(t => t.name.toLowerCase().includes(tl))) : all,
      isExact: exact.length > 0
    };
    setApiCache(cacheKey, result);
    return result;
  }

  export async function fetchAllDefinitions(pid) {
    const pId = pid || state.projectId;
    const preset = getPreset(pId);
    if (!preset?.apiToken) throw new Error('No API token. Open Settings ⚙');
    const h = { 'Accept': 'application/json', 'Authorization': `Bearer ${preset.apiToken}` };
    const all = []; let page = 1, tp = 1;
    while (page <= tp) {
      const d = await bgFetch(`https://api.smartsender.com/v1/definitions?page=${page}&limitation=20`, 'GET', h);
      all.push(...(d.collection || []));
      tp = d.cursor?.pages ?? 1;
      page++;
    }
    return all;
  }

  export async function fetchAllTags(pid) {
    const pId = pid || state.projectId;
    const preset = getPreset(pId);
    if (!preset?.apiToken) throw new Error('No API token. Open Settings ⚙');
    const h = { 'Accept': 'application/json', 'Authorization': `Bearer ${preset.apiToken}` };
    const all = []; let page = 1, tp = 1;
    while (page <= tp) {
      const d = await bgFetch(`https://api.smartsender.com/v1/tags?page=${page}&limitation=20`, 'GET', h);
      all.push(...(d.collection || []));
      tp = d.cursor?.pages ?? 1;
      page++;
    }
    return all;
  }

  export async function createDefinition(pid, { name, type = 'string' }) {
    const pId = pid || state.projectId;
    const preset = getPreset(pId);
    if (!preset?.apiToken) throw new Error('No API token. Open Settings ⚙');
    const h = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': `Bearer ${preset.apiToken}` };
    return bgFetch('https://api.smartsender.com/v1/definitions', 'POST', h, { name, type });
  }

  export async function createTag(pid, { name }) {
    const pId = pid || state.projectId;
    const preset = getPreset(pId);
    if (!preset?.apiToken) throw new Error('No API token. Open Settings ⚙');
    const h = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': `Bearer ${preset.apiToken}` };
    return bgFetch('https://api.smartsender.com/v1/tags', 'POST', h, { name });
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

