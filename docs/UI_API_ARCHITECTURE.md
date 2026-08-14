# ui.grudge-studio.com — API & AI architecture

**Live:** https://ui.grudge-studio.com  
**Repo:** `MolochDaGod/grudge-ui-editor`  
**AI:** https://ai.grudge-studio.com (Cloudflare Worker `grudge-ai-hub`)

## Goals

1. **Solid API surface** from the static UI editor (no Node server on Vercel).
2. **UI/UX AI worker** via fleet AI Hub (`ui` + `ux` agents).
3. **Cloudflare + fleet best practices** — same-origin proxies, JWT auth, CORS, Puter KV for per-user packs.

## Topology

```
Browser (ui.grudge-studio.com)
  │
  ├─ same-origin /api/auth/*     → Railway grudge-api-production (JWT / Puter / guest)
  ├─ same-origin /api/characters → Railway game-data SSOT
  ├─ same-origin /api/account/*  → Railway bag / wallet
  ├─ same-origin /api/ai/*       → ai.grudge-studio.com/v1/*  (Workers AI + Gemini BYOK)
  ├─ same-origin /api/objectstore/* → objectstore.grudge-studio.com/api/v1
  ├─ same-origin /api/assets/*   → assets.grudge-studio.com (R2 CDN)
  │
  ├─ static JSON APIs (Vercel rewrites, no Node):
  │     /api/systems          → /systems.json
  │     /api/ui-packs         → /game-ui-packs/index.json
  │     /api/craftpix/usage   → /data/craftpix-usage.json
  │     /api/craftpix/manifest→ /craftpix-manifest.json
  │     /api/health           → /data/ui-health.json
  │     /api/eras             → /eras/index.json
  │     /api/main-panel       → /data/main-panel-contract.json
  │     /api/main-panel/:era  → /eras/:era.json
  │
  ├─ CraftPix browser          /craftpix  (+ craftpix-swaps.js)
  ├─ Puter SDK (js.puter.com)  → user-pays KV packs: grudge:{grudgeId}:ui-*
  └─ id.grudge-studio.com      → login popup / redirect (?grudge_token=)
```

### CraftPix usage API

| Endpoint | Body |
|----------|------|
| `GET /api/craftpix/usage` | HYDRA types → layer stacks + **swaps** + usage options |
| `GET /api/craftpix/manifest` | Full 323-file catalog (`path` / `url`) |
| Browser | https://ui.grudge-studio.com/craftpix |
| Runtime helper | `/craftpix-swaps.js` → `CraftpixSwaps.renderSlot` / `applySwaps` |

**Render law:** `image-rendering: pixelated`; slot stack **bg → icon → overlay → cooldown → press**.

### Main-panel era API

| Endpoint | Body |
|----------|------|
| `GET /api/eras` | Era registry (ids, roster max, panel URLs, pack ids) |
| `GET /api/main-panel` | Shared chrome + encoding law |
| `GET /api/main-panel/warlords` | Full Warlords contract: slots, tabs, icons, bindings |
| `GET /api/main-panel/nexus` | Nexus (Toon / voxel interim) |
| `GET /api/main-panel/voxel` | Voxel explorer slots |
| `GET /api/main-panel/armada` | Mech hardpoints |
| Client | `/main-panel-api.js` → `GrudgeMainPanelApi.loadEra(id)` |

**Slot law:** empty cell = Latin **abbr** (HEL, WPN, …) + faint CDN icon. Never emoji or alchemy glyphs.

```html
<script src="https://ui.grudge-studio.com/main-panel-api.js"></script>
<script>
  const era = await GrudgeMainPanelApi.loadEra("warlords");
  const slots = GrudgeMainPanelApi.listSlots(era);
  const icon = GrudgeMainPanelApi.iconUrl(slots[0]);
</script>
```

## Auth (do not reinvent)

| Step | Action |
|------|--------|
| 1 | Popup/redirect to `id.grudge-studio.com/login?redirect_uri=` |
| 2 | Receive `?grudge_token=` → exchange / store session JWT |
| 3 | `linkPuterCloud()` for `puter.kv` |
| 4 | AI calls: `Authorization: Bearer <jwt>` |

Spec: [AUTH.md](../AUTH.md)

## AI client (`grudge-ai.js`)

Priority order:

1. **Hub** `POST /api/ai/agents/ui/chat` (or `/api/ai/ui/chat`) with Grudge JWT  
2. **Puter** `puter.ai.chat` (user pays)  
3. **Anthropic** key in `localStorage.gsk` (`sk-ant-…`)

Helpers:

| Method | Role |
|--------|------|
| `GrudgeAI.chat({ role, messages })` | Unified |
| `GrudgeAI.configureUIKit(payload)` | Theme patch JSON |
| `GrudgeAI.generateRadial(prompt)` | Hold-Q radial JSON |
| `GrudgeAI.generateHotkeys(prompt)` | Binding map JSON |
| `GrudgeAI.probe()` | `{ hubOk, hasJwt, ready, route }` |

## AI Hub agents (Cloudflare Worker)

| Role | Endpoint | Purpose |
|------|----------|---------|
| **ui** | `POST /v1/agents/ui/chat` · alias `/v1/ui/chat` | Kits, HUD, radials, panels |
| **ux** | `POST /v1/agents/ux/chat` · alias `/v1/ux/chat` | Auth/editor flows |
| general / dev / … | `/v1/agents/:role/chat` | Existing catalog |

Seed: `grudge-ai-hub/migrations/003_ui_ux_agent.sql`  
Auth: D1 API key **or** fleet JWT when `JWT_SECRET` is set on the Worker.

### Cloudflare best practices (this stack)

| Practice | How we apply it |
|----------|-----------------|
| Edge AI gateway | Single public host `ai.grudge-studio.com` |
| Rate limit | KV `rl:key:` / `rl:ip:` RPM |
| Secrets | `wrangler secret put GEMINI_API_KEY` · `JWT_SECRET` |
| Observability | Worker logs + optional Observatory |
| CORS | `*.grudge-studio.com`, `*.vercel.app`, `*.puter.site` |
| No secrets in SPA | JWT from user session only; Gemini stays on Worker |
| Static front | Vercel rewrites only — no server secrets on ui host |
| D1 roles | Config without redeploy (`agent_roles` table) |

## Packages from the fleet stack

Prefer these over ad-hoc URLs when building React satellites:

| Package | Use |
|---------|-----|
| `@grudge-studio/core` | `getFleetUrls()` — auth, gameData, ai, assets, objectStore |
| `@grudge-studio/stack` | `buildFleetSatelliteRewrites()` + `buildAiProxyRewrites()` |
| `@grudge-studio/sdk` | Umbrella export |
| TanStack Query + React 19 + Tailwind v4 | dash / modern shells (HYDRA remains multi-page HTML) |

UI editor is intentionally **static HTML + shared JS** for Puter mirror + zero build; React satellites should still use the npm packages.

## Deploy checklist

### AI Hub
```bash
cd F:\GitHub\grudge-ai-hub
npx wrangler d1 execute grudge-ai-hub --remote --file=migrations/003_ui_ux_agent.sql
npm run deploy
# Confirm JWT_SECRET + GEMINI_API_KEY secrets exist
curl -s https://ai.grudge-studio.com/v1/agents | jq '.agents[] | select(.role=="ui" or .role=="ux")'
```

### UI Editor
```bash
cd F:\GitHub\grudge-ui-editor
# static — push main → Vercel ui.grudge-studio.com
git add vercel.json grudge-ai.js docs/UI_API_ARCHITECTURE.md AUTH.md
git commit -m "feat(api): same-origin AI proxy + hub-first UI agent client"
git push origin main
```

### Smoke
1. Open https://ui.grudge-studio.com → sign in  
2. Console: `await GrudgeAI.probe()` → `hubOk: true`, `hasJwt: true`  
3. `await GrudgeAI.chat({ role: 'ui', message: 'Suggest a fantasy HUD palette' })`  
4. Puter mirror still works offline for packs (no AI proxy there — uses Puter AI / key)

## What not to do

- Do **not** call Anthropic/Gemini with studio API keys from the browser  
- Do **not** route session exchange through dead `api.grudge-studio.com` tunnel  
- Do **not** invent a second AI worker for UI — extend `grudge-ai-hub` roles  
- Do **not** store pack SSOT only in localStorage — Puter KV scoped by Grudge ID  
