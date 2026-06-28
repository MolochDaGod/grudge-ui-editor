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
  let activeCharacterId = null;

  function authHeaders() {
    const token = global.GrudgeCloud?.getToken?.();
    return token ? { Authorization: 'Bearer ' + token, Accept: 'application/json' } : { Accept: 'application/json' };
  }

  async function fetchCharacters() {
    if (!global.GrudgeCloud?.isLoggedIn?.()) {
      characters = [];
      return [];
    }
    const urls = ['/api/characters', 'https://grudge-api-production-0d46.up.railway.app/api/characters'];
    for (const url of urls) {
      try {
        const res = await fetch(url, { headers: authHeaders() });
        if (!res.ok) continue;
        const data = await res.json();
        characters = Array.isArray(data) ? data : data.characters || data.data || [];
        characters = characters.filter((c) => c?.userId !== 'guest');
        const stored = global.localStorage?.getItem('grudge_active_character');
        if (stored && characters.some((c) => c.id === stored)) activeCharacterId = stored;
        else if (characters[0]) activeCharacterId = characters[0].id;
        global.dispatchEvent(new CustomEvent('grudge:engine:characters', { detail: characters }));
        return characters;
      } catch {}
    }
    return [];
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
    global.addEventListener('message', (e) => {
      if (e.data?.type !== 'GRUDGE_AUTH') return;
      const { token, characterId, grudgeId, username } = e.data;
      if (token && global.GrudgeCloud) {
        global.GrudgeCloud.bootstrapAuth?.();
        try {
          global.localStorage.setItem('grudge_auth_token', token);
          if (grudgeId) global.localStorage.setItem('grudge_id', grudgeId);
          if (username) global.localStorage.setItem('grudge_username', username);
        } catch {}
      }
      if (characterId) selectCharacter(characterId);
      fetchCharacters();
    });
    if (global.parent !== global) {
      global.parent.postMessage({ type: 'GRUDGE_READY' }, '*');
    }
  }

  async function init() {
    if (global.GrudgeCloud?.bootstrapAuth) await GrudgeCloud.bootstrapAuth();
    await fetchCharacters();
    return GrudgeEngine;
  }

  const GrudgeEngine = {
    ENGINE,
    init,
    initEmbedded,
    fetchCharacters,
    getCharacters,
    getActiveCharacter,
    selectCharacter,
    islandPreviewUrl,
  };

  global.GrudgeEngine = GrudgeEngine;

  global.addEventListener('grudge:auth:ready', () => {
    fetchCharacters().catch(() => {});
  });
})(typeof window !== 'undefined' ? window : globalThis);