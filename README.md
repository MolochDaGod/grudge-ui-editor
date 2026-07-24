# Grudge UI Editor

> Game UI Kit & Showcase — visual editor for Grudge Warlords game interfaces
>
> **Created by Racalvin The Pirate King**

Live at:
- **[ui.grudge-studio.com](https://ui.grudge-studio.com)** (Vercel + Cloudflare DNS)
- **[grudge-ui-editor.puter.site](https://grudge-ui-editor.puter.site)** (Puter mirror)

## What is this?

A visual UI editor and showcase for building game interfaces used across Grudge Warlords. Includes pre-built kits for:
- **Fantasy** — medieval RPG menus, inventory, skill trees
- **Cyberpunk** — sci-fi HUDs, neon panels, terminal UI
- **RPG** — stat bars, item tooltips, character sheets

**HYDRA tools** on the same domain:
- `/studio` — drag-and-drop UI scene editor + Craftpix assets
- `/games` — **game-ready fleet UI packs** (inventory, crafting, combat states per game)
- `/hotkeys` — input binding configurator
- `/assets` — 3D / D1 asset browser
- `/main-panel` — character panel preview

### Game-ready packs
15 saved layouts under `/game-ui-packs/` (Warlords, Open, GRUDOX, Grass, Survival, Arena, Mech, …).
Each pack includes **usage states**, **features** (inventory/craft/etc.), and **dataBindings** for live APIs.

```js
// In any game client:
const ui = await GrudgeGameUI.load('warlords'); // from game-ui-runtime.js
ui.mount(document.getElementById('hud'));
ui.setState('combat'); // explore | inventory | crafting | ...
```

## Account & cloud saves

Sign in via the nav pill → Grudge ID (`id.grudge-studio.com`). After redirect, the app:

1. Exchanges `?grudge_token=` for a session JWT (proxied API)
2. Links **Puter** for cloud KV (studio packs, hotkeys)
3. Shows cloud status in the account menu (green = cloud on)

Full auth/persistence spec: **[AUTH.md](./AUTH.md)**

Persistence layers:
- **Grudge ID JWT** — session across pages (silent re-auth via Puter when JWT expires)
- **Puter KV** — cloud packs/hotkeys scoped to `grudge:{grudgeId}:…`
- **localStorage** — offline fallback per account
- **UI Kit** (`/`) — `grudge-uikit-persist.js` mirrors `gameuikit:*` to Puter KV; cross-tab reload on edit
- **Popup auth** on editor routes — sign in without losing studio/workbench state
- **Grudge Engine** (`grudge-engine.js`) — `/api/characters` + island preview link from `/assets`
- **Camera** (`grudge-camera-controls.js`) — gamepad + WASD on 3D asset browser

## Deployment

### Vercel (primary)
Push to `main` → Vercel auto-deploys. Static site — no build step.

Fleet API rewrites live in `vercel.json`:
- `/api/auth/*`, `/api/characters` → Railway game-data
- `/api/ai/*` → **ai.grudge-studio.com** (UI/UX agents, JWT)
- `/api/objectstore/*`, `/api/assets/*` → ObjectStore + R2 CDN

AI client: `grudge-ai.js` → hub-first with Grudge JWT. Architecture: [docs/UI_API_ARCHITECTURE.md](./docs/UI_API_ARCHITECTURE.md).

### Puter (mirror)
```bash
puter site deploy . grudge-ui-editor
```

### DNS
`ui.grudge-studio.com` → CNAME → Vercel project domain (configured in Cloudflare)

## Part of Grudge Studio

This is a tool in the [Grudge Studio](https://grudge-studio.com) ecosystem.

- Fleet map: `grudge-fleet` skill / [The-ENGINE](https://github.com/MolochDaGod/The-ENGINE)
- Auth backend: `GrudgeBuilder` Railway (`/api/auth/*`)
- Puter mirror notes: [DEPLOY-PUTER.md](./DEPLOY-PUTER.md)