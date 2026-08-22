# Asset browser — D1, R2, and game delivery

**Live:** https://ui.grudge-studio.com/assets?pack  
**Repo SSOT:** [`game-delivery-packs.js`](../game-delivery-packs.js) · [`game-delivery-packs.json`](../game-delivery-packs.json)

## What this page is

The fleet 3D/2D/audio catalog UI. Games do **not** load binaries from this page — they load from R2 via `assets.grudge-studio.com`. This host is the browse/inspect surface and the `?pack=` deep-link index.

## Authority split

| Layer | Host | Role |
|-------|------|------|
| Binaries (GLB/FBX/PNG/WAV) | `https://assets.grudge-studio.com` | R2 bucket `grudge-assets` |
| Named JSON definitions | `https://info.grudge-studio.com/api/v1/<file>.json` | Weapons, armor, harvest, maps, race kits |
| Definitions fallback | `https://objectstore.grudge-studio.com/api/v1/<file>.json` | Same named files, not a directory index |
| D1 asset registry | `https://api.grudge-studio.com/assets` | 6k+ registered R2 keys by category |
| Player bag / islands | Railway Postgres | **Not D1** |
| This UI proxy | `/api/registry` `/api/info` `/api/assets` | Same-origin rewrites |

`objectstore…/api/v1` with **no file** is 404 by design. Do not probe it as a catalog.

`api.grudge-studio.com` is **not** the auth host (`id.grudge-studio.com`). It **is** the D1 registry.

## `?pack=` IDs

| Pack | Source |
|------|--------|
| `prim-vehicles` `prim-islands` `prim-structures` `prim-animations` | R2 `asset-packs/` |
| `toon-soldiers` | `models/toon-soldiers/catalog.json` |
| `vehicles` | `models/ummorpg-vehicles-catalog.json` |
| `ninja-equipment` | `models/weapons/ninja-equipment/catalog.json` |
| `grudge6` | `info…/grudge6-characters.json` |
| `game-models` | `info…/models3d-game.json` (prefers `_r2Url`) |
| `weapon-models` | `info…/weapon-models.json` → R2 GLBs |
| `def-weapons` `def-armor` | Named item JSON + icon sprites |
| `harvest-nodes` | `master-harvest-nodes.json` |
| `benches` | `bench-mesh-catalog.json` |
| `maps` | `map-registry.json` + pirate lobby GLB |
| `gltf-optimized` | `gltf-manifest.json` (lazy) |
| `d1-<category>` | D1 `asset_registry` (`d1-weapon`, `d1-character`, …) |
| `super-dialogue` | R2 dialogue pack |
| `icon-<folder>` | Icon path index |

Example: https://ui.grudge-studio.com/assets?pack=toon-soldiers&asset=Scout%20A

## GitHub Pages URLs

Catalogs still embed `molochdagod.github.io/ObjectStore` in a few `_cdnUrl` fields. The browser **rewrites those to** `assets.grudge-studio.com` before load (`canonicalizeCdnUrl`).
