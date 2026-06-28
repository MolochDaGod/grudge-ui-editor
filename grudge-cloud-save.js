/**
 * Grudge Cloud Save — persistent auth + UI pack storage (Puter KV + localStorage).
 */
(function (global) {
  const API = 'https://api.grudge-studio.com';
  const AUTH = 'https://id.grudge-studio.com';
  const KV_PACK = (id) => `grudge:ui-pack:${id}`;
  const KV_INDEX = 'grudge:ui-packs:index';
  const KV_LAST = 'grudge:ui-pack:last';
  const LS_PACKS = 'grudge_ui_packs_v1';
  const LS_LAST = 'grudge_ui_pack_last';
  const LS_TOKEN = 'grudge_auth_token';
  const LS_USER = 'grudge_ui_user';

  function lsGet(k) {
    try {
      return global.localStorage.getItem(k);
    } catch {
      return null;
    }
  }

  function lsSet(k, v) {
    try {
      global.localStorage.setItem(k, v);
    } catch {}
  }

  function lsDel(k) {
    try {
      global.localStorage.removeItem(k);
    } catch {}
  }

  function parseJwt(token) {
    try {
      const b = token.split('.')[1];
      if (!b) return null;
      return JSON.parse(atob(b.replace(/-/g, '+').replace(/_/g, '/')));
    } catch {
      return null;
    }
  }

  function tokenValid(token) {
    if (!token) return false;
    const p = parseJwt(token);
    if (!p?.exp) return true;
    return p.exp * 1000 > Date.now() + 30000;
  }

  function slugify(name) {
    return (name || 'untitled')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 48) || 'untitled';
  }

  function localPacks() {
    try {
      return JSON.parse(lsGet(LS_PACKS) || '{}');
    } catch {
      return {};
    }
  }

  function writeLocalPacks(packs) {
    lsSet(LS_PACKS, JSON.stringify(packs));
  }

  async function puterReady() {
    if (typeof puter === 'undefined') return false;
    try {
      return !!(await puter.auth?.isSignedIn?.());
    } catch {
      return false;
    }
  }

  async function ensurePuterSignIn() {
    if (typeof puter === 'undefined' || !puter.auth) return false;
    if (await puterReady()) return true;
    try {
      await puter.auth.signIn();
      return await puterReady();
    } catch {
      return false;
    }
  }

  async function exchangeLaunchToken(token) {
    const endpoints = [
      `${AUTH}/api/auth/session/exchange`,
      `${API}/api/auth/session/exchange`,
      `${AUTH}/api/auth/verify`,
    ];
    for (const url of endpoints) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ token }),
        });
        if (!res.ok) continue;
        const data = await res.json();
        if (data.token) return data;
        if (data.valid && token) return { token, user: data.user };
      } catch {}
    }
    return tokenValid(token) ? { token, user: parseJwt(token) } : null;
  }

  async function fetchProfile(token) {
    try {
      const res = await fetch(`${API}/api/auth/user`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  function storeSession(token, user) {
    if (!token) return;
    lsSet(LS_TOKEN, token);
    const p = parseJwt(token);
    const profile = {
      username: user?.username || p?.username || 'Player',
      grudgeId: user?.grudgeId || p?.grudgeId || lsGet('grudge_id') || '',
      userId: user?.id || user?.userId || p?.sub || null,
    };
    if (profile.grudgeId) lsSet('grudge_id', profile.grudgeId);
    if (profile.username) lsSet('grudge_username', profile.username);
    lsSet(LS_USER, JSON.stringify(profile));
    global.dispatchEvent(new CustomEvent('grudge:auth:ready', { detail: profile }));
    return profile;
  }

  async function bootstrapAuth() {
    const qs = new URLSearchParams(global.location.search);
    let token = qs.get('grudge_token') || qs.get('sso_token') || qs.get('token');
    if (token) {
      const exchanged = await exchangeLaunchToken(token);
      if (exchanged?.token) token = exchanged.token;
      storeSession(token, exchanged?.user);
      ['grudge_token', 'sso_token', 'token', 'grudge_id', 'grudge_username', 'username'].forEach((k) =>
        qs.delete(k)
      );
      const tail = qs.toString();
      global.history.replaceState(
        {},
        '',
        global.location.pathname + (tail ? '?' + tail : '') + (global.location.hash || '')
      );
    } else {
      token = lsGet(LS_TOKEN);
    }

    if (!tokenValid(token)) {
      lsDel(LS_TOKEN);
      lsDel(LS_USER);
      return null;
    }

    let profile = null;
    try {
      profile = JSON.parse(lsGet(LS_USER) || 'null');
    } catch {}
    const remote = await fetchProfile(token);
    if (remote) profile = storeSession(token, remote);
    else if (profile) storeSession(token, profile);
    else profile = storeSession(token, parseJwt(token));

    return profile;
  }

  function getToken() {
    const t = lsGet(LS_TOKEN);
    return tokenValid(t) ? t : null;
  }

  function isLoggedIn() {
    return !!getToken() || (global.GrudgeAI && global.GrudgeAI.loggedIn && global.GrudgeAI.loggedIn());
  }

  function getUser() {
    try {
      return JSON.parse(lsGet(LS_USER) || 'null');
    } catch {
      return null;
    }
  }

  function login(returnUrl) {
    const ret = returnUrl || global.location.href.split('?')[0];
    global.location.href =
      AUTH + '/api/auth/page?app=ui-editor&redirect=' + encodeURIComponent(ret);
  }

  async function savePack(scene, packId) {
    const id = packId || slugify(scene?.name) || 'untitled';
    const payload = {
      id,
      scene,
      savedAt: Date.now(),
      version: 1,
      tool: 'HYDRA UI Studio',
    };

    const packs = localPacks();
    packs[id] = payload;
    writeLocalPacks(packs);
    lsSet(LS_LAST, id);

    let cloud = false;
    if (await puterReady()) {
      try {
        await puter.kv.set(KV_PACK(id), payload);
        const index = (await puter.kv.get(KV_INDEX)) || [];
        const ids = Array.isArray(index) ? index : [];
        if (!ids.includes(id)) {
          ids.push(id);
          await puter.kv.set(KV_INDEX, ids);
        }
        await puter.kv.set(KV_LAST, id);
        cloud = true;
      } catch (e) {
        console.warn('[GrudgeCloud] puter.kv save failed', e);
      }
    }

    global.dispatchEvent(new CustomEvent('grudge:pack:saved', { detail: { id, cloud } }));
    return { id, cloud, local: true };
  }

  async function loadPack(id) {
    if (await puterReady()) {
      try {
        const cloud = await puter.kv.get(KV_PACK(id));
        if (cloud?.scene) return cloud.scene;
      } catch {}
    }
    const packs = localPacks();
    return packs[id]?.scene || null;
  }

  async function listPacks() {
    const local = Object.values(localPacks()).map((p) => ({
      id: p.id,
      name: p.scene?.name || p.id,
      savedAt: p.savedAt,
      source: 'local',
    }));
    const map = new Map(local.map((p) => [p.id, p]));

    if (await puterReady()) {
      try {
        const index = (await puter.kv.get(KV_INDEX)) || [];
        for (const id of Array.isArray(index) ? index : []) {
          const item = await puter.kv.get(KV_PACK(id));
          if (!item) continue;
          const existing = map.get(id);
          if (!existing || (item.savedAt || 0) > (existing.savedAt || 0)) {
            map.set(id, {
              id,
              name: item.scene?.name || id,
              savedAt: item.savedAt,
              source: 'cloud',
            });
          }
        }
      } catch {}
    }

    return [...map.values()].sort((a, b) => (b.savedAt || 0) - (a.savedAt || 0));
  }

  async function restoreLastPack() {
    let last = lsGet(LS_LAST);
    if (await puterReady()) {
      try {
        const cloudLast = await puter.kv.get(KV_LAST);
        if (cloudLast) last = cloudLast;
      } catch {}
    }
    if (!last) return null;
    return loadPack(last);
  }

  async function deletePack(id) {
    const packs = localPacks();
    delete packs[id];
    writeLocalPacks(packs);
    if (await puterReady()) {
      try {
        await puter.kv.del(KV_PACK(id));
        const index = (await puter.kv.get(KV_INDEX)) || [];
        if (Array.isArray(index)) {
          await puter.kv.set(
            KV_INDEX,
            index.filter((x) => x !== id)
          );
        }
      } catch {}
    }
  }

  const GrudgeCloud = {
    bootstrapAuth,
    getToken,
    getUser,
    isLoggedIn,
    login,
    ensurePuterSignIn,
    savePack,
    loadPack,
    listPacks,
    restoreLastPack,
    deletePack,
    slugify,
  };

  global.GrudgeCloud = GrudgeCloud;

  global.addEventListener('DOMContentLoaded', () => {
    bootstrapAuth().catch(() => {});
  });
  if (global.document?.readyState !== 'loading') {
    bootstrapAuth().catch(() => {});
  }
})(typeof window !== 'undefined' ? window : globalThis);