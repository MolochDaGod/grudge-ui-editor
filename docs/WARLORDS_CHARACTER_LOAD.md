# Warlords-era character load (simple SSOT)

**One path. No parallel systems.**

| Step | What |
|------|------|
| 1. Kit | `https://assets.grudge-studio.com/models/grudge6/races/{WK\|BRB\|ELF\|DWF\|ORC\|UD}_Characters.glb` |
| 2. Equip | `mesh_ids` visibility only — lists in `warlords-character-ssot.js` |
| 3. Fit | Bone structural box → **1.8 m** · feet ground · **+π/2** yaw once |
| 4. Atlas | Only if bake missing: `textures/grudge6/{folder}/*.webp` |

## Code

| File | Role |
|------|------|
| `warlords-character-ssot.js` | Races, kit URLs, exact mesh_ids, applyMeshIds |
| `grudge6-viewport.js` | Main-panel 3D preview |
| CDN `js/grudge6-kit.js` | Shared equip helper (GLB default) |

## Purge list (do not load)

- `models/characters/grudge6/*`
- `models/grudge6/metaverse/*`
- `*_Characters_customizable.FBX` in browser
- `models/grudge6/atlases/*`
- Unskinned multi-variant body show-all
- Pelvis-as-feet / `groundYHip` as primary

## Class map

`warrior` · `mage` · `ranger` · `unarmed`  
Aliases: worge/knight → warrior · archer → ranger · wizard → mage
