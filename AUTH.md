# Grudge UI Editor — Account & Persistence

Live: [ui.grudge-studio.com](https://ui.grudge-studio.com)

## Model (fleet-canonical)

**Puter-primary → Grudge ID → per-user Puter KV**

1. User signs in at `id.grudge-studio.com` (Puter is the primary button).
2. Auth page mints a short-lived **launch token** and redirects back with `?grudge_token=…`.
3. `grudge-cloud-save.js` exchanges the launch token for a **session JWT** via proxied `POST /api/auth/session/exchange`.
4. On success, the app calls **`linkPuterCloud()`** so Puter is signed in and `puter.kv` works for cloud saves.
5. Session JWT + profile live in `localStorage`; packs also mirror to Puter KV when cloud is on.

## Client modules

| File | Role |
|------|------|
| `grudge-cloud-save.js` | Auth bootstrap, logout, pack CRUD (local + Puter KV) |
| `grudge-ai.js` | AI chat / UI Kit director (Puter AI or Anthropic key) |
| `grudge-shell.js` | Fleet nav + account menu (sign out, switch account, cloud status) |
| `grudge-uikit-persist.js` | UI Kit `gameuikit:*` → Puter KV (index only) |
| `grudge-engine.js` | Characters API + island engine preview URLs |
| `grudge-camera-controls.js` | Gamepad/keyboard camera for `/assets` |

## Vercel API proxies (`vercel.json`)

| Path | Backend |
|------|---------|
| `/api/auth/me` | `grudge-api-production` (Railway) |
| `/api/auth/verify` | `grudge-api-production` (Railway) |
| `/api/auth/session/exchange` | `api.grudge-studio.com` |
| `/api/auth/puter-sso` | `grudge-api-production` (Railway — JWT in JSON after deploy) |
| `/api/auth/*` | `grudge-api-production` (Railway) |
| `/api/registry` | `api.grudge-studio.com/assets` (D1 asset browser) |
| `/api/characters` | `grudge-api-production` (JWT required; guest roster blocked) |

## localStorage keys

| Key | Purpose |
|-----|---------|
| `grudge_auth_token` | Session JWT |
| `grudge_ui_user` | Cached profile `{ username, grudgeId, userId }` |
| `grudge_id` / `grudge_username` | Fleet convention (other tools read these) |
| `grudge_cloud_ready` | Last-known Puter cloud link state |
| `grudge_ui_packs_v1` | Local studio pack index |
| `grudge_ui_pack_last` | Last opened studio pack id |
| `grudge_hydra_input_v1` | Hotkeys (local fallback) |

## Puter KV keys (scoped by Grudge ID)

| Key | Page |
|-----|------|
| `grudge:{grudgeId}:ui-pack:{id}` | `/studio` scene packs |
| `grudge:{grudgeId}:ui-packs:index` | Pack id list |
| `grudge:{grudgeId}:ui-pack:last` | Last pack id |
| `grudge:{grudgeId}:ui-input:default` | `/hotkeys` bindings |
| `grudge:{grudgeId}:ui-kit:editor-state` | `/` UI Kit theme editor (zustand) |
| `grudge:{grudgeId}:ui-kit:profiles` | `/` saved theme profiles |
| `grudge:{grudgeId}:main-panel:state` | `/main-panel` tab + entity selection |
| `grudge:{grudgeId}:camera:assets` | `/assets` orbit camera pose |

Legacy unscoped keys (`grudge:ui-pack:…`) are still read for migration; new writes use the scoped form.

Local UI Kit keys (mirrored to cloud): `gameuikit:editor-state`, `gameuikit:profiles` — synced by `grudge-uikit-persist.js`.

Local studio packs: `grudge_ui_packs_{grudgeId}` (falls back to `grudge_ui_packs_v1`).

## Silent re-auth

If the session JWT expires but Puter is still signed in, `bootstrapAuth()` calls `silentReauthFromPuter()`:

`POST /api/auth/puter` with `{ puterUuid, puterUsername, email }` → fresh JWT in JSON (no redirect).

## Embed handshake (`GRUDGE_AUTH` / `GRUDGE_READY`)

When `main-panel.html` (or any ui-editor page) loads inside an iframe, `grudge-engine.js` posts `GRUDGE_READY` to the parent. The parent should reply with:

```js
iframe.contentWindow.postMessage({
  type: 'GRUDGE_AUTH',
  token: '<session-jwt>',
  grudgeId: 'GRUDGE_…',
  username: 'Player',
  characterId: 'optional-char-uuid',
}, 'https://ui.grudge-studio.com');
```

`GrudgeCloud.acceptSession()` stores the JWT, fires `grudge:auth:ready`, and links Puter cloud.

## Popup auth (editor pages)

On `/`, `/studio`, `/assets`, `/hotkeys`, `/main-panel`, `login()` opens a **popup** to `id.grudge-studio.com` instead of a full redirect (preserves unsaved editor state).

The auth page posts `grudge-auth:success` with a launch token; `grudge-cloud-save.js` exchanges it and calls `linkPuterCloud()`.

Use `GrudgeCloud.login(null, { popup: false })` to force redirect.

## Account menu (nav pill)

- **Signed out** → click opens Grudge ID login.
- **Signed in** → click opens menu:
  - **Enable cloud saves** — runs `linkPuterCloud()` / Puter `signIn()`
  - **Switch account** — `logout()` then redirect to auth page
  - **Sign out** — clears JWT, Puter session, and cached profile

Cloud indicator: green dot = Puter signed in; amber = Grudge ID only (local saves still work).

## Integrating another page

```html
<script src="https://js.puter.com/v2/" async></script>
<script src="./grudge-ai.js"></script>
<script src="./grudge-cloud-save.js"></script>
<script src="./grudge-shell.js"></script>
```

```js
await GrudgeCloud.bootstrapAuth();
if (GrudgeCloud.isLoggedIn()) {
  await GrudgeCloud.linkPuterCloud(); // if not auto-called
}
```

## Cross-tab sync

`grudge-cloud-save.js` listens for `storage` events on auth and pack keys; the nav pill refreshes on `grudge:auth:storage`. UI Kit page reloads when another tab updates `gameuikit:editor-state`.

## Related fleet docs

- Grudge ID auth page: `GrudgeBuilder/server/templates/auth-page.html`
- Fleet map: `~/.agents/skills/grudge-fleet/SKILL.md`
- Puter patterns: `~/.agents/skills/puter/SKILL.md`