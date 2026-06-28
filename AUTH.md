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

## Vercel API proxies (`vercel.json`)

| Path | Backend |
|------|---------|
| `/api/auth/me` | Railway GrudgeBuilder |
| `/api/auth/verify` | Railway GrudgeBuilder |
| `/api/auth/session/exchange` | `api.grudge-studio.com` |
| `/api/auth/*` | Railway GrudgeBuilder |
| `/api/registry` | `api.grudge-studio.com/assets` (D1 asset browser) |

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

Legacy unscoped keys (`grudge:ui-pack:…`) are still read for migration; new writes use the scoped form.

Local studio packs: `grudge_ui_packs_{grudgeId}` (falls back to `grudge_ui_packs_v1`).

## Silent re-auth

If the session JWT expires but Puter is still signed in, `bootstrapAuth()` calls `silentReauthFromPuter()`:

`POST /api/auth/puter` with `{ puterUuid, puterUsername, email }` → fresh JWT in JSON (no redirect).

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

## Related fleet docs

- Grudge ID auth page: `GrudgeBuilder/server/templates/auth-page.html`
- Fleet map: `~/.agents/skills/grudge-fleet/SKILL.md`
- Puter patterns: `~/.agents/skills/puter/SKILL.md`