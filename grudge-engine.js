/**
 * Grudge Engine — fleet bridge for ui.grudge-studio.com
 * Characters API, live engine URLs, embed handshake (GRUDGE_READY / GRUDGE_AUTH).
 */
(function (global) {
  const ENGINE = {
    warlords: 'https://client.grudge-studio.com',
    island3d: 'https://client.grudge-studio.com/island-3d',
    forge: 'https://forge.grudge-studio.com',
    rts: 'https://rts-grudge.vercel.app',
    objectstore: 'https://objectstore.grudge-studio.com/api/v1',
    assets: 'https://assets.grudge-studio.com',
  };

  let characters = [];
  let inventory = [];
  let ledger = [];
  let activeCharacterId = null;
  let activeEra = null;

  function authHeaders(json) {
    const token = global.GrudgeCloud?.getToken?.();
    const h = { Accept: 'application/json' };
    if (json) h['Content-Type'] = 'application/json';
    if (token) h.Authorization = 'Bearer ' + token;
    return h;
  }

  function railwayBase() {
    return global.GrudgeCloud?.RAILWAY || 'https://grudge-api-production-0d46.up.railway.app';
  }

  function eraOf(c) {
    return String(c?.gameEra || c?.game_era || c?.era || '').toLowerCase();
  }

  async function tryGet(paths) {
    const railway = railwayBase();
    const urls = [];
    for (const p of paths) {
      if (p.startsWith('http')) urls.push(p);
      else {
        urls.push(p);
        urls.push(railway + p);
      }
    }
    for (const url of urls) {
      try {
        const res = await fetch(url, { headers: authHeaders(), credentials: 'include' });
        if (res.status === 401 || res.status === 403) return { status: res.status, data: null };
        if (!res.ok) continue;
        return { status: res.status, data: await res.json() };
      } catch {}
    }
    return { status: 0, data: null };
  }

  async function fetchCharacters(era) {
    if (!global.GrudgeCloud?.isLoggedIn?.()) {
      characters = [];
      return [];
    }
    activeEra = era || activeEra || null;
    const q = activeEra ? '?era=' + encodeURIComponent(activeEra) : '';
    const got = await tryGet(['/api/characters' + q, '/api/characters']);
    if (got.status === 401 || got.status === 403) return [];
    const data = got.data;
    let list = Array.isArray(data) ? data : data?.characters || data?.data || [];
    list = list.filter((c) => c && c.userId !== 'guest');
    if (activeEra) {
      const filtered = list.filter((c) => {
        const e = eraOf(c);
        return !e || e === activeEra;
      });
      if (filtered.length) list = filtered;
    }
    characters = list;
    const params = new URLSearchParams(global.location?.search || '');
    const want = params.get('characterId') || params.get('inspect');
    const stored = global.localStorage?.getItem('grudge_active_character');
    if (want && characters.some((c) => c.id === want)) activeCharacterId = want;
    else if (stored && characters.some((c) => c.id === stored)) activeCharacterId = stored;
    else if (characters[0]) activeCharacterId = characters[0].id;
    global.dispatchEvent(new CustomEvent('grudge:engine:characters', { detail: characters }));
    const active = getActiveCharacter();
    if (active) global.dispatchEvent(new CustomEvent('grudge:engine:character', { detail: active }));
    return characters;
  }

  function getCharacters() {
    return characters;
  }

  function getActiveCharacter() {
    return characters.find((c) => c.id === activeCharacterId) || characters[0] || null;
  }

  function selectCharacter(id) {
    activeCharacterId = id;
    try {
      global.localStorage?.setItem('grudge_active_character', id);
    } catch {}
    global.dispatchEvent(new CustomEvent('grudge:engine:character', { detail: getActiveCharacter() }));
    if (global.parent !== global) {
      global.parent.postMessage({ type: 'GRUDGE_CHARACTER_CHANGE', characterId: id }, '*');
    }
  }

  async function fetchInventory() {
    if (!global.GrudgeCloud?.isLoggedIn?.()) {
      inventory = [];
      return [];
    }
    const got = await tryGet([
      '/api/account/inventory',
      '/api/inventory',
      '/api/account/resources',
    ]);
    const data = got.data;
    let rows = [];
    if (Array.isArray(data)) rows = data;
    else if (Array.isArray(data?.items)) rows = data.items;
    else if (Array.isArray(data?.inventory)) rows = data.inventory;
    else if (data && typeof data === 'object') {
      rows = Object.entries(data)
        .filter(([, v]) => v && typeof v === 'object' || typeof v === 'number')
        .map(([k, v]) =>
          typeof v === 'number'
            ? { id: k, itemId: k, quantity: v }
            : { id: v.id || k, itemId: v.itemId || v.id || k, ...v },
        );
    }
    inventory = rows.map((it) => ({
      id: it.itemId || it.id || it.templateId,
      itemId: it.itemId || it.id || it.templateId,
      name: it.name || it.itemId || it.id,
      quantity: it.quantity ?? it.qty ?? 1,
      qty: it.quantity ?? it.qty ?? 1,
      uuid: it.grudge_uuid || it.grudgeUuid || it.uuid,
      grudgeUuid: it.grudge_uuid || it.grudgeUuid || it.uuid,
      slot: it.slot || it.equipSlot,
      iconUrl: it.iconUrl || it.icon,
      owned: true,
      source: 'account',
    }));
    global.dispatchEvent(new CustomEvent('grudge:engine:inventory', { detail: inventory }));
    return inventory;
  }

  async function fetchLedger() {
    if (!global.GrudgeCloud?.isLoggedIn?.()) {
      ledger = [];
      return [];
    }
    const got = await tryGet(['/api/ledger/search', '/api/uuid/list', '/api/ledger']);
    const data = got.data;
    const rows = Array.isArray(data)
      ? data
      : data?.items || data?.entries || data?.ledger || data?.results || [];
    ledger = (rows || []).map((it) => ({
      id: it.templateId || it.itemId || it.id,
      itemId: it.templateId || it.itemId || it.id,
      name: it.name || it.templateId || it.itemId,
      quantity: 1,
      qty: 1,
      uuid: it.grudge_uuid || it.grudgeUuid || it.uuid,
      grudgeUuid: it.grudge_uuid || it.grudgeUuid || it.uuid,
      slot: it.slot || it.equipSlot,
      state: it.state || it.status,
      owned: true,
      source: 'ledger',
    }));
    global.dispatchEvent(new CustomEvent('grudge:engine:ledger', { detail: ledger }));
    return ledger;
  }

  function getInventory() {
    return inventory;
  }

  function getLedger() {
    return ledger;
  }

  function ownedItems() {
    const byUuid = new Map();
    for (const it of inventory.concat(ledger)) {
      const key = it.grudgeUuid || it.uuid || it.id;
      if (!key) continue;
      if (!byUuid.has(key)) byUuid.set(key, it);
    }
    return [...byUuid.values()];
  }

  async function patchCharacterModel3d(characterId, model3d, extra) {
    if (!characterId || characterId === 'local' || String(characterId).startsWith('guest')) return false;
    const body = { model3d, ...(extra || {}) };
    const railway = railwayBase();
    const urls = [
      '/api/characters/' + encodeURIComponent(characterId),
      railway + '/api/characters/' + encodeURIComponent(characterId),
    ];
    for (const url of urls) {
      try {
        const res = await fetch(url, {
          method: 'PATCH',
          headers: authHeaders(true),
          credentials: 'include',
          body: JSON.stringify(body),
        });
        if (res.ok) return true;
      } catch {}
    }
    return false;
  }

  function islandPreviewUrl(opts) {
    const p = new URLSearchParams();
    p.set('engine', opts?.engine || 'legacy');
    p.set('mode', opts?.mode || 'lobby');
    if (opts?.map) p.set('map', opts.map);
    const char = getActiveCharacter();
    if (char?.id) p.set('characterId', char.id);
    return ENGINE.island3d + '?' + p.toString();
  }

  function initEmbedded() {
    global.addEventListener('message', async (e) => {
      if (e.data?.type !== 'GRUDGE_AUTH') return;
      const { token, characterId, grudgeId, username, user } = e.data;
      if (token && global.GrudgeCloud?.acceptSession) {
        await GrudgeCloud.acceptSession({ token, user, grudgeId, username });
      }
      if (characterId) selectCharacter(characterId);
      const era = e.data.era || new URLSearchParams(global.location?.search || '').get('era') || 'warlords';
      await fetchCharacters(era);
      await Promise.all([fetchInventory(), fetchLedger()]);
    });
    if (global.parent !== global) {
      global.parent.postMessage({ type: 'GRUDGE_READY' }, '*');
    }
  }

  async function init(opts) {
    if (global.GrudgeCloud?.bootstrapAuth) await GrudgeCloud.bootstrapAuth();
    const era =
      opts?.era ||
      new URLSearchParams(global.location?.search || '').get('era') ||
      'warlords';
    await fetchCharacters(era);
    await Promise.all([fetchInventory(), fetchLedger()]);
    return GrudgeEngine;
  }

  const GrudgeEngine = {
    ENGINE,
    init,
    initEmbedded,
    fetchCharacters,
    fetchInventory,
    fetchLedger,
    getCharacters,
    getActiveCharacter,
    getInventory,
    getLedger,
    ownedItems,
    selectCharacter,
    patchCharacterModel3d,
    islandPreviewUrl,
  };

  global.GrudgeEngine = GrudgeEngine;

  global.addEventListener('grudge:auth:ready', () => {
    fetchCharacters().catch(() => {});
  });

  if (global.parent !== global) {
    initEmbedded();
  }
})(typeof window !== 'undefined' ? window : globalThis);