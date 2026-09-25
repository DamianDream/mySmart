/* global URLSearchParams */
import { state } from '../core/state.js';
import { bgFetch, authHeaders, getApiCache, setApiCache } from '../core/api.js';
import { getPreset } from '../core/storage.js';
import { getFullProjectFromUrl } from '../utils/url.js';

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


  function normalizeFunnel(f) {
    const flow = f.flow || {};
    const runs = flow.runsQuantity
      ?? flow.runs_quantity
      ?? flow.runsCount
      ?? flow.runs_count
      ?? flow.runs
      ?? f.runsQuantity
      ?? f.runs_quantity
      ?? f.runsCount
      ?? f.runs_count
      ?? f.runs
      ?? f.usages
      ?? f.usagesQuantity
      ?? f.usages_quantity
      ?? f.subscribers
      ?? f.subscribersCount
      ?? f.subscribers_count
      ?? 0;

    const rawActive = flow.active !== undefined ? flow.active : f.active;
    const isDraft = flow.isDraft !== undefined
      ? flow.isDraft
      : (flow.is_draft !== undefined ? flow.is_draft : (f.isDraft !== undefined ? f.isDraft : f.is_draft || false));
    const active = rawActive !== undefined ? Boolean(rawActive) : !isDraft;

    const updatedAt = f.updatedAt
      ?? f.updated_at
      ?? flow.updatedAt
      ?? flow.updated_at
      ?? f.modifiedAt
      ?? f.modified_at
      ?? null;

    return {
      id: f.id,
      name: flow.name || f.name || `Funnel #${f.id}`,
      runs: Number(runs) || 0,
      active,
      isDraft,
      updatedAt
    };
  }

  async function fetchInternalFunnels(pid, term = '') {
    let numericProjectId = /^\d+$/.test(pid) ? pid : null;

    // Resolve slug to numeric project ID via /projects
    if (!numericProjectId) {
      try {
        const projectsRes = await bgFetch('https://messenger.smartsender.com/api/i/projects', 'GET', {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        });
        const projectsList = Array.isArray(projectsRes) ? projectsRes : (projectsRes?.collection || []);
        if (projectsList.length > 0) {
          const found = projectsList.find(p =>
            String(p.id) === String(pid) ||
            (p.slug && p.slug.toLowerCase() === String(pid).toLowerCase()) ||
            (p.name && p.name.toLowerCase() === String(pid).toLowerCase())
          );
          numericProjectId = found ? found.id : projectsList[0].id;
        }
      } catch (e) {
        console.warn('[Funnels] /projects lookup failed:', e.message);
      }
    }

    if (!numericProjectId) return null;

    const all = [];
    let page = 1;
    let totalPages = 1;
    const limitation = 50;

    while (page <= totalPages) {
      const params = new URLSearchParams({ page, limitation });
      if (term && term.trim()) params.set('term', term.trim());
      const res = await bgFetch(`https://messenger.smartsender.com/api/i/projects/${numericProjectId}/funnels/match?${params}`, 'GET', {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      });

      const collection = res?.collection || (Array.isArray(res) ? res : []);
      all.push(...collection);
      totalPages = res?.cursor?.pages ?? (collection.length === limitation ? page + 1 : page);
      page++;
      if (page > 20) break;
    }

    if (!all.length) return null;
    return all.map(normalizeFunnel);
  }

  async function fetchPublicFunnels(term = '') {
    const h = authHeaders();
    if (!h) throw new Error('No API token. Open Settings ⚙');
    const all = [];
    let page = 1;
    let totalPages = 1;
    const limitation = 20;

    while (page <= totalPages) {
      const params = new URLSearchParams({ page, limitation });
      if (term && term.trim()) params.set('term', term.trim());
      const res = await bgFetch(`https://api.smartsender.com/v1/funnels?${params}`, 'GET', h);
      const collection = res?.collection || (Array.isArray(res) ? res : []);
      all.push(...collection);
      totalPages = res?.cursor?.pages ?? (collection.length === limitation ? page + 1 : page);
      page++;
      if (page > 20) break;
    }

    let funnels = all.map(normalizeFunnel);

    // If all public funnels have 0 runs, check if detail endpoint provides stats
    const allZero = funnels.every(f => f.runs === 0);
    if (allZero && funnels.length > 0) {
      try {
        const detail = await bgFetch(`https://api.smartsender.com/v1/funnels/${funnels[0].id}`, 'GET', h);
        const normDetail = detail ? normalizeFunnel(detail) : null;
        if (normDetail && normDetail.runs > 0) {
          const updated = [];
          for (let i = 0; i < funnels.length; i += 5) {
            const chunk = funnels.slice(i, i + 5);
            const promises = chunk.map(cf =>
              bgFetch(`https://api.smartsender.com/v1/funnels/${cf.id}`, 'GET', h)
                .then(d => normalizeFunnel({ ...cf, ...d }))
                .catch(() => cf)
            );
            const resolved = await Promise.all(promises);
            updated.push(...resolved);
          }
          return updated;
        }
      } catch (e) {
        console.warn('[Funnels] Public details enrichment failed:', e.message);
      }
    }

    return funnels;
  }

  export async function fetchFunnels(term = '') {
    const pid = state.projectId || getFullProjectFromUrl() || '';

    // 1. Try internal SmartSender API first (has full runsQuantity and timestamps)
    try {
      const internal = await fetchInternalFunnels(pid, term);
      if (internal && internal.length > 0) {
        return internal;
      }
    } catch (e) {
      console.warn('[Funnels] Internal API error, falling back to public API:', e.message);
    }

    // 2. Fallback to public SmartSender API
    return fetchPublicFunnels(term);
  }
