# Warlords-era character load (simple SSOT)

**One path. No parallel systems.**

Toon RTS modular kits (body / arms / legs / head / shoulders / weapons / shields / mount)
are the art source — same parts shown on the race set sheets
([Imgur sets](https://imgur.com/gallery/sets-sFHXx2X)).  
**Runtime does not spawn separate armor GLBs.** Armor and weapons are **child meshes**
inside the race kit, toggled like uMMORPG paperdoll slots.

| Step | What |
|------|------|
| 1. Kit | **GOLDEN** `asset-packs/toon-rts-characters/glb/characters/{raceId}.glb` (lab default). Compare-only: `models/grudge6/races/{PREFIX}_Characters.glb` |
| 2. Equip | `mesh_ids` visibility only — class lists + full catalog |
| 3. Fit | Bone structural box → **1.8 m** · feet ground · **+π/2** yaw once |
| 4. Atlas | Only if bake missing: `textures/grudge6/{folder}/*.webp` |

## Code

| File | Role |
|------|------|
| `warlords-character-ssot.js` | Races, kit URLs, class mesh_ids, applyMeshIds, paperdollToMeshIds |
| `data/warlords-mesh-catalog.json` | **All** equip mesh names per race (from production GLBs) |
| `data/grudge6-characters.json` | Fleet race table (mirrors ObjectStore / R2) |
| `grudge6-viewport.js` | Main-panel 3D preview |
| CDN `js/grudge6-kit.js` | Shared equip helper (GLB default) |
| CDN `api/v1/grudge6-characters.json` | Canonical race + classLoadouts |

## uMMORPG paperdoll → kit meshes

| Paperdoll slot | Mesh group in race GLB |
|----------------|------------------------|
| Head | `*_head_*` / `*_Units_head_*` |
| Chest | `*_Body_*` |
| Hands | `*_Arms_*` |
| Legs / Feet | `*_Legs_*` |
| Shoulders | `*_shoulderpads_*` |
| MainHand | one of `*_weapon_*` |
| OffHand | `*_Shield_*` or bow/staff (exclusive) |

Complete prefab = **one race kit GLB** + **one mesh_id per exclusive group**.

## Purge list (do not load)

- `models/characters/grudge6/*`
- `models/grudge6/metaverse/*` (stub textures)
- `*_Characters_customizable.FBX` in browser
- `models/grudge6/atlases/*`
- Primary `assets/{folder}/textures` (use `textures/grudge6/`)
- Unskinned multi-variant body show-all
- Pelvis-as-feet / `groundYHip` as primary

## Class map

`warrior` · `mage` · `ranger` · `unarmed`  
Aliases: worge/knight → warrior · archer → ranger · wizard → mage


## Lab

- https://info.grudge-studio.com/GRUDGE6_Characters.html (authoritative UI)
- https://ui.grudge-studio.com/GRUDGE6_Characters (copy)
