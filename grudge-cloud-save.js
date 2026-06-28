/**
 * Grudge Cloud Save — persistent auth + UI pack storage (Puter KV + localStorage).
 * Fleet model: Grudge ID session JWT + linked Puter cloud for per-user KV saves.
 */
(function (global) {
  const API = 'https://api.grudge-studio.com';
  const AUTH = 'https://id.grudge-studio.com';
  const RAILWAY = 'https://grudge-builder-production.up.railway.app';
  const LS_PACKS_LEGACY = 'grudge_ui_packs_v1';
  const LEGACY_KV = {
    pack: (id) => `grudge:ui-pack:${id}`,
    index: 'grudge:ui-packs:index',
    last: 'grudge:ui-pack:last',
    input: 'grudge:ui-input:default',
  };
  const UIKIT_LS_PREFIX = 'gameuikit:';
  const UIKIT_SLICES = ['editor-state', 'profiles'];
  const LS_LAST = 'grudge_ui_pack_last';
  const LS_TOKEN = 'grudge_auth_token';
  const LS_USER = 'grudge_ui_user';
  const LS_CLOUD = 'grudge_cloud_ready';
  const AUTH_LS_KEYS = [LS_TOKEN, LS_USER, LS_CLOUD, 'grudge_id', 'grudge_username', LS_LAST];

  function sameOriginApi() {
    const host = global.location?.hostname || '';
    return (
      host === 'ui.grudge-studio.com' ||
      host === 'localhost' ||
      host.endsWith('.vercel.app')
    );
  }

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

  function getGrudgeId() {
    try {
      const u = JSON.parse(lsGet(LS_USER) || 'null');
      if (u?.grudgeId) return u.grudgeId;
    } catch {}
    return lsGet('grudge_id') || '';
  }

  function scopedKv(suffix) {
    const gid = getGrudgeId();
    return gid ? `grudge:${gid}:${suffix}` : `grudge:ui:${suffix}`;
  }

  function kvPackKey(id) {
    return scopedKv(`ui-pack:${id}`);
  }

  function kvIndexKey() {
    return scopedKv('ui-packs:index');
  }

  function kvLastKey() {
    return scopedKv('ui-pack:last');
  }

  function kvInputKey() {
    return scopedKv('ui-input:default');
  }

  function kvUIKitKey(slice) {
    return scopedKv(`ui-kit:${slice}`);
  }

  function uikitLsKey(slice) {
    return UIKIT_LS_PREFIX + slice;
  }

  function localPacksLsKey() {
    const gid = getGrudgeId();
    return gid ? `grudge_ui_packs_${gid}` : LS_PACKS_LEGACY;
  }

  function localPacks() {
    const key = localPacksLsKey();
    try {
      const raw = lsGet(key);
      if (raw) return JSON.parse(raw);
      if (key !== LS_PACKS_LEGACY) {
        const legacy = lsGet(LS_PACKS_LEGACY);
        if (legacy) return JSON.parse(legacy);
      }
      return {};
    } catch {
      return {};
    }
  }

  function writeLocalPacks(packs) {
    lsSet(localPacksLsKey(), JSON.stringify(packs));
  }

  async function waitForPuter(timeoutMs = 10000) {
    const start = Date.now();
    while (typeof puter === 'undefined' && Date.now() - start < timeoutMs) {
      await new Promise((r) => setTimeout(r, 120));
    }
    return typeof puter !== 'undefined';
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
    if (!(await waitForPuter())) return false;
    if (await puterReady()) return true;
    try {
      await puter.auth.signIn();
      return await puterReady();
    } catch {
      return false;
    }
  }

  /** Re-mint Grudge JWT from an active Puter session (no full redirect). */
  async function silentReauthFromPuter() {
    if (!(await waitForPuter()) || !(await puterReady())) return null;
    let pu;
    try {
      pu = await puter.auth.getUser();
    } catch {
      return null;
    }
    if (!pu?.uuid) return null;

    const puterUrls = sameOriginApi()
      ? ['/api/auth/puter', `${RAILWAY}/api/auth/puter`]
      : [`${RAILWAY}/api/auth/puter`, '/api/auth/puter'];

    const bodies = [
      { puterUuid: pu.uuid, puterId: pu.uuid, puterUsername: pu.username, email: pu.email || undefined },
      { puterId: pu.uuid, puterUsername: pu.username, email: pu.email || undefined },
    ];
    const endpoints = [
      ...puterUrls.map((url) => ({ url, body: bodies[0] })),
      ...puterUrls.map((url) => ({ url: url.replace('/puter', '/puter-sso'), body: bodies[1] })),
    ];
    for (const { url, body } of endpoints) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(body),
        });
        if (!res.ok) continue;
        const data = await res.json();
        const token = data.token || data.sessionToken;
        if (!token) continue;
        return {
          token,
          user: data.user || {
            username: data.username || data.displayName,
            grudgeId: data.grudgeId,
            userId: data.userId || data.id,
          },
        };
      } catch {}
    }
    return null;
  }

  /** After Grudge ID login, open Puter so cloud KV/AI work under the same user. */
  async function linkPuterCloud() {
    const linked = await ensurePuterSignIn();
    if (linked) {
      lsSet(LS_CLOUD, '1');
      global.dispatchEvent(new CustomEvent('grudge:cloud:ready'));
    } else {
      lsDel(LS_CLOUD);
      global.dispatchEvent(new CustomEvent('grudge:cloud:off'));
    }
    return linked;
  }

  async function isCloudReady() {
    return await puterReady();
  }

  async function exchangeLaunchToken(token) {
    const audience = global.location?.origin || '';
    const exchangeUrls = sameOriginApi()
      ? ['/api/auth/session/exchange', `${API}/api/auth/session/exchange`]
      : [`${API}/api/auth/session/exchange`, '/api/auth/session/exchange'];

    for (const url of exchangeUrls) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ token, audience }),
        });
        if (!res.ok) continue;
        const data = await res.json();
        const session = data.token || data.sessionToken;
        if (session) {
          return {
            token: session,
            user: {
              username: data.username || data.displayName,
              grudgeId: data.grudgeId,
              userId: data.id || data.userId,
            },
          };
        }
      } catch {}
    }

    const verifyUrls = sameOriginApi()
      ? [`/api/auth/verify?token=${encodeURIComponent(token)}`, `${RAILWAY}/api/auth/verify?token=${encodeURIComponent(token)}`]
      : [`${RAILWAY}/api/auth/verify?token=${encodeURIComponent(token)}`, `/api/auth/verify?token=${encodeURIComponent(token)}`];

    for (const url of verifyUrls) {
      try {
        const res = await fetch(url, { headers: { Accept: 'application/json' } });
        if (!res.ok) continue;
        const data = await res.json();
        if (data.valid) return { token, user: data.user || parseJwt(token) };
      } catch {}
    }

    return tokenValid(token) ? { token, user: parseJwt(token) } : null;
  }

  async function fetchProfile(token) {
    const profileUrls = sameOriginApi()
      ? ['/api/auth/me', `${RAILWAY}/api/auth/me`]
      : [`${RAILWAY}/api/auth/me`, '/api/auth/me'];

    for (const url of profileUrls) {
      try {
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        });
        if (!res.ok) continue;
        return await res.json();
      } catch {}
    }
    return null;
  }

  function storeSession(token, user) {
    if (!token) return;
    lsSet(LS_TOKEN, token);
    const p = parseJwt(token);
    const profile = {
      username: user?.username || user?.displayName || p?.username || 'Player',
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
      const recovered = await silentReauthFromPuter();
      if (recovered?.token) {
        token = recovered.token;
        const profile = storeSession(token, recovered.user);
        linkPuterCloud().catch(() => {});
        return profile;
      }
      lsDel(LS_TOKEN);
      lsDel(LS_USER);
      lsDel(LS_CLOUD);
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

    if (profile) {
      linkPuterCloud().catch(() => {});
    }

    return profile;
  }

  function getToken() {
    const t = lsGet(LS_TOKEN);
    return tokenValid(t) ? t : null;
  }

  function isLoggedIn() {
    return !!getToken();
  }

  function getUser() {
    try {
      return JSON.parse(lsGet(LS_USER) || 'null');
    } catch {
      return null;
    }
  }

  function login(returnUrl, opts) {
    const usePopup = opts?.popup ?? shouldPreferPopup();
    if (usePopup && typeof global.open === 'function') {
      return loginPopup(returnUrl);
    }
    const ret = returnUrl || global.location.href.split('?')[0];
    global.location.href =
      AUTH + '/api/auth/page?app=ui-editor&redirect=' + encodeURIComponent(ret);
  }

  function shouldPreferPopup() {
    const path = (global.location?.pathname || '/').replace(/\/$/, '') || '/';
    return path === '/' || ['/studio', '/assets', '/hotkeys', '/main-panel'].includes(path);
  }

  let popupListenerInstalled = false;

  function installPopupAuthListener() {
    if (popupListenerInstalled) return;
    popupListenerInstalled = true;
    global.addEventListener('message', async (e) => {
      const okOrigin =
        e.origin === 'https://id.grudge-studio.com' ||
        e.origin === 'https://grudge-studio.com' ||
        e.origin.endsWith('.grudge-studio.com');
      if (!okOrigin || e.data?.type !== 'grudge-auth:success') return;
      try {
        const launch = e.data.token;
        if (!launch) return;
        const exchanged = await exchangeLaunchToken(launch);
        const token = exchanged?.token || launch;
        storeSession(token, e.data.user || exchanged?.user);
        await linkPuterCloud();
      } catch (err) {
        console.warn('[GrudgeCloud] popup auth failed', err);
      }
    });
  }

  function loginPopup() {
    installPopupAuthListener();
    const origin = global.location.origin;
    const url =
      AUTH +
      '/api/auth/page?app=ui-editor&handoff=1&origin=' +
      encodeURIComponent(origin);
    const popup = global.open(url, 'grudge-auth', 'width=480,height=740,noopener');
    if (!popup) {
      return login(null, { popup: false });
    }
    return new Promise((resolve) => {
      const done = async () => {
        global.removeEventListener('grudge:auth:ready', onReady);
        resolve(getUser());
      };
      const onReady = () => done();
      global.addEventListener('grudge:auth:ready', onReady);
      setTimeout(() => {
        if (isLoggedIn()) done();
      }, 120000);
    });
  }

  function kvMainPanelKey() {
    return scopedKv('main-panel:state');
  }

  function mainPanelLsKey() {
    const gid = getGrudgeId();
    return gid ? `grudge_main_panel_${gid}` : 'grudge_main_panel_v1';
  }

  async function saveMainPanel(state) {
    const payload = { ...state, savedAt: Date.now(), version: 1 };
    lsSet(mainPanelLsKey(), JSON.stringify(payload));
    if (await puterReady()) {
      try {
        await puter.kv.set(kvMainPanelKey(), payload);
      } catch (e) {
        console.warn('[GrudgeCloud] main-panel save failed', e);
      }
    }
    return payload;
  }

  async function loadMainPanel() {
    if (await puterReady()) {
      try {
        const cloud = await puter.kv.get(kvMainPanelKey());
        if (cloud) return cloud;
      } catch {}
    }
    try {
      return JSON.parse(lsGet(mainPanelLsKey()) || 'null');
    } catch {
      return null;
    }
  }

  async function saveCameraState(sceneId, pose) {
    const slice = `camera:${sceneId || 'default'}`;
    const payload = { ...pose, savedAt: Date.now() };
    const lsKey = getGrudgeId()
      ? `grudge_camera_${getGrudgeId()}_${sceneId || 'default'}`
      : `grudge_camera_${sceneId || 'default'}`;
    lsSet(lsKey, JSON.stringify(payload));
    if (await puterReady()) {
      try {
        await puter.kv.set(scopedKv(slice), payload);
      } catch {}
    }
    return payload;
  }

  async function loadCameraState(sceneId) {
    const slice = `camera:${sceneId || 'default'}`;
    if (await puterReady()) {
      try {
        const cloud = await puter.kv.get(scopedKv(slice));
        if (cloud) return cloud;
      } catch {}
    }
    const lsKey = getGrudgeId()
      ? `grudge_camera_${getGrudgeId()}_${sceneId || 'default'}`
      : `grudge_camera_${sceneId || 'default'}`;
    try {
      return JSON.parse(lsGet(lsKey) || 'null');
    } catch {
      return null;
    }
  }

  async function logout() {
    const logoutUrls = sameOriginApi()
      ? ['/api/auth/logout', `${RAILWAY}/api/auth/logout`]
      : [`${RAILWAY}/api/auth/logout`, '/api/auth/logout'];

    for (const url of logoutUrls) {
      try {
        await fetch(url, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: '{}',
        });
        break;
      } catch {}
    }

    if (typeof puter !== 'undefined') {
      try {
        await puter.auth.signOut();
      } catch {}
    }

    AUTH_LS_KEYS.forEach(lsDel);
    global.dispatchEvent(new CustomEvent('grudge:auth:logout'));
  }

  async function switchAccount() {
    await logout();
    login();
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
        await puter.kv.set(kvPackKey(id), payload);
        const index = (await puter.kv.get(kvIndexKey())) || [];
        const ids = Array.isArray(index) ? index : [];
        if (!ids.includes(id)) {
          ids.push(id);
          await puter.kv.set(kvIndexKey(), ids);
        }
        await puter.kv.set(kvLastKey(), id);
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
        let cloud = await puter.kv.get(kvPackKey(id));
        if (!cloud?.scene) cloud = await puter.kv.get(LEGACY_KV.pack(id));
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
        const mergeCloudIndex = async (indexKey, packKeyFn) => {
          const index = (await puter.kv.get(indexKey)) || [];
          for (const pid of Array.isArray(index) ? index : []) {
            const item = await puter.kv.get(packKeyFn(pid));
            if (!item) continue;
            const existing = map.get(pid);
            if (!existing || (item.savedAt || 0) > (existing.savedAt || 0)) {
              map.set(pid, {
                id: pid,
                name: item.scene?.name || pid,
                savedAt: item.savedAt,
                source: 'cloud',
              });
            }
          }
        };
        await mergeCloudIndex(kvIndexKey(), kvPackKey);
        await mergeCloudIndex(LEGACY_KV.index, LEGACY_KV.pack);
      } catch {}
    }

    return [...map.values()].sort((a, b) => (b.savedAt || 0) - (a.savedAt || 0));
  }

  async function restoreLastPack() {
    let last = lsGet(LS_LAST);
    if (await puterReady()) {
      try {
        const cloudLast = (await puter.kv.get(kvLastKey())) || (await puter.kv.get(LEGACY_KV.last));
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
        await puter.kv.del(kvPackKey(id));
        await puter.kv.del(LEGACY_KV.pack(id));
        const index = (await puter.kv.get(kvIndexKey())) || [];
        if (Array.isArray(index)) {
          await puter.kv.set(
            kvIndexKey(),
            index.filter((x) => x !== id)
          );
        }
      } catch {}
    }
  }

  async function saveInputConfig(data) {
    try {
      lsSet('grudge_hydra_input_v1', JSON.stringify(data));
    } catch {}
    if (await puterReady()) {
      try {
        await puter.kv.set(kvInputKey(), data);
      } catch (e) {
        console.warn('[GrudgeCloud] input kv save failed', e);
      }
    }
  }

  async function saveUIKitSlice(slice, data) {
    if (await puterReady()) {
      try {
        await puter.kv.set(kvUIKitKey(slice), { data, savedAt: Date.now() });
      } catch (e) {
        console.warn('[GrudgeCloud] ui-kit kv save failed', e);
      }
    }
  }

  async function restoreUIKitFromCloud() {
    if (!(await puterReady())) return false;
    let restored = false;
    for (const slice of UIKIT_SLICES) {
      try {
        const cloud = await puter.kv.get(kvUIKitKey(slice));
        if (!cloud?.data) continue;
        const lsKey = uikitLsKey(slice);
        const localRaw = global.localStorage.getItem(lsKey);
        let apply = !localRaw;
        if (localRaw && cloud.savedAt) {
          try {
            const metaKey = uikitLsKey('_meta:' + slice);
            const meta = JSON.parse(global.localStorage.getItem(metaKey) || '{}');
            apply = (cloud.savedAt || 0) > (meta.savedAt || 0);
          } catch {
            apply = true;
          }
        }
        if (apply) {
          global.localStorage.setItem(lsKey, JSON.stringify(cloud.data));
          global.localStorage.setItem(
            uikitLsKey('_meta:' + slice),
            JSON.stringify({ savedAt: cloud.savedAt || Date.now() })
          );
          restored = true;
        }
      } catch {}
    }
    if (restored) global.dispatchEvent(new CustomEvent('grudge:uikit:restored'));
    return restored;
  }

  function installCrossTabSync() {
    if (global.__grudgeCrossTabSync) return;
    global.__grudgeCrossTabSync = true;
    global.addEventListener('storage', (e) => {
      if (!e.key) return;
      if (e.key === LS_TOKEN || e.key === LS_USER || e.key === 'grudge_id') {
        global.dispatchEvent(new CustomEvent('grudge:auth:storage', { detail: { key: e.key } }));
      }
      if (e.key.startsWith(UIKIT_LS_PREFIX)) {
        global.dispatchEvent(new CustomEvent('grudge:uikit:storage', { detail: { key: e.key } }));
      }
      if (e.key.startsWith('grudge_ui_packs')) {
        global.dispatchEvent(new CustomEvent('grudge:packs:storage'));
      }
    });
  }

  async function loadInputConfig() {
    if (await puterReady()) {
      try {
        const scoped = await puter.kv.get(kvInputKey());
        if (scoped) return scoped;
        const legacy = await puter.kv.get(LEGACY_KV.input);
        if (legacy) return legacy;
      } catch {}
    }
    try {
      return JSON.parse(lsGet('grudge_hydra_input_v1') || 'null');
    } catch {
      return null;
    }
  }

  const GrudgeCloud = {
    bootstrapAuth,
    getToken,
    getUser,
    getGrudgeId,
    kvInputKey,
    isLoggedIn,
    isCloudReady,
    linkPuterCloud,
    silentReauthFromPuter,
    login,
    loginPopup,
    logout,
    switchAccount,
    saveMainPanel,
    loadMainPanel,
    saveCameraState,
    loadCameraState,
    ensurePuterSignIn,
    saveInputConfig,
    loadInputConfig,
    saveUIKitSlice,
    restoreUIKitFromCloud,
    savePack,
    loadPack,
    listPacks,
    restoreLastPack,
    deletePack,
    slugify,
  };

  global.GrudgeCloud = GrudgeCloud;

  installCrossTabSync();
  installPopupAuthListener();

  global.addEventListener('DOMContentLoaded', () => {
    bootstrapAuth().catch(() => {});
  });
  if (global.document?.readyState !== 'loading') {
    bootstrapAuth().catch(() => {});
  }
})(typeof window !== 'undefined' ? window : globalThis);