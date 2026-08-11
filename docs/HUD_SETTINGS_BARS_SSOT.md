# HUD Settings + Bars pack SSOT

**Host:** https://ui.grudge-studio.com  
**Repo:** `MolochDaGod/grudge-ui-editor`  
**Disk art:** `D:\Games\Models\bars-hud-pack` → ship `/assets/bars-hud/**`

Do **not** invent a second HUD engine. Extend `GrudgeGameUI` + `HudSettings` + `BarsHudSSOT`.

## Modules (load order)

```html
<script src="https://ui.grudge-studio.com/bars-hud-ssot.js"></script>
<script src="https://ui.grudge-studio.com/hud-settings.js"></script>
<script src="https://ui.grudge-studio.com/game-ui-runtime.js"></script>
```

| File | Role |
|------|------|
| `bars-hud-ssot.js` | Frame paths, boss 002/004, alternatives for swap |
| `hud-settings.js` | Move Anything, scale, visibility, skins, advanced hotkeys |
| `game-ui-runtime.js` | Pack mount, bindWeaponSkills, setTarget, setCastBar |
| `hotkeys.html` | Full keyboard editor (HYDRA) — synced storage |

## Boss frames (user SSOT)

| Role | Asset |
|------|--------|
| Primary boss | `boss-frames/boss_frame_002.png` |
| Alternate / skull | `boss-frames/boss_frame_004.png` |

Also: player unit frames, enemy frames, ally / ToT frames, CraftPix cast bar.

## Warlords pack components

| id | type | Notes |
|----|------|--------|
| `pf1` | player-frame | Self vitals |
| `tf1` | target-frame | Hostile (non-boss) |
| `boss1` | boss-frame | World/elite — skin 002 default |
| `tot1` | target-of-target | Ally-style frame |
| `cast1` | cast-bar | CraftPix cast chrome |
| `hb1` | hotbar-2row | Weapon skills (10 slots) |

## Game API

```js
const ui = await GrudgeGameUI.load('warlords');
ui.mount(document.getElementById('hud'));
ui.setState('combat');

// Weapon skill bar (icons + CD + hotkeys from advanced binds)
ui.bindWeaponSkills([
  { id: 'slash', name: 'Slash', iconUrl: '…', cd: 2, cdMax: 8 },
]);

// Boss promotes boss-frame; ToT optional
ui.setTarget(
  { name: 'Hellmaw', level: 50, hp: 9e4, hpMax: 1.2e5, boss: true },
  { name: 'Reaver', hp: 400, hpMax: 800 },
);

ui.setCastBar({ label: 'Slash', progress: 0.4, iconUrl: '…' });

HudSettings.attach(ui);
HudSettings.setMoveAnything(true); // drag any .ggui-comp
HudSettings.open();                // panel
```

## HUD Settings panel

- **Move anything** — drag components; layout in `localStorage` `grudge.hud.settings.v1`
- **HUD size** — 60–150%
- **Visibility** — target, boss, ToT, cast, player, hotbar, minimap
- **Frame swap** — boss 002 / 004, cycle target skins via `BarsHudSSOT.alternativesFor`
- **Advanced hotkeys** — click bind → press key; skill_1…skill_10 + combat/UI
- **Full keyboard** — opens `hotkeys.html`

### Storage

| Key | Content |
|-----|---------|
| `grudge.hud.settings.v1` | layout, scale, skins, flags |
| `grudge.hud.hotkeys.v1` | action → `{ key, modifier }` |
| `grudge_hydra_input_v1` | HYDRA bindings (kept in sync) |

Events: `grudge:hotkeys-changed` when binds change.

## Preview / deploy

- Preview: https://ui.grudge-studio.com/games.html → Warlords → **HUD Settings** / **Demo skills**
- Hotkeys: https://ui.grudge-studio.com/hotkeys.html
- Assets: https://ui.grudge-studio.com/assets/bars-hud/boss-frames/boss_frame_002.png

## Related

- Skill: `craftpix-rpg-mmo-ui`
- Main panel: `docs/MAIN_PANEL_ERA.md`
- Fleet combat hotkeys: skill `grudge-fleet-combat` (do not invent Alt+Space melee residual)
