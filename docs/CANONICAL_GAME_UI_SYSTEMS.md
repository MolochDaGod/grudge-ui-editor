# Canonical Game UI Systems — Review & SSOT

**Hosts**

| Domain | Role |
|--------|------|
| **https://ui.grudge-studio.com** | **SSOT** for game HUD chrome, packs, main panel, spellbook, studio, hotkeys |
| https://grudge6.grudge-studio.com | Production hub / lab links — **not** the pack host (many `/hud` `/spellbook` paths 404) |
| https://client.grudge-studio.com | Live play (ModePlayHUD + craftpix React slots) |
| https://assets.grudge-studio.com/ui/craftpix-rpg/ | RPG CSS 9-slice skin |

**Repo:** `MolochDaGod/grudge-ui-editor` → deploys to `ui.grudge-studio.com`

---

## Review summary (2026-07-28)

### What is strong

1. **Craftpix fantasy pack** under `/assets/craftpix/` is production-grade (unit frames, action bar, spell book, inventory, cast bars, minimap, dialog slots).
2. **Game UI packs** (`/game-ui-packs/*.json` + `game-ui-runtime.js`) give every fleet game a loadable HUD layout + usage states.
3. **Main panel** (`main-panel.html?era=warlords`) is the SSOT for equipment paperdoll, bag, skills, WCS professions.
4. **Warlords client** already consumes the kit: `ModePlayHUD` + `UiKitActionSlot` / `UiKitPlayerFrame` + `GrudgeGameUiLayer` + `loadGrudgeGameUI.ts`.
5. **Themes** d/f/c/q (default / fantasy / cyber / quiet) cover fleet genres.

### Gaps / defects

| Issue | Severity | Fix |
|-------|----------|-----|
| `grudge6.grudge-studio.com/hud`, `/spellbook`, `/panel` **404** | **P0** | Shell must deep-link to **ui.grudge-studio.com** surfaces (or restore lab routes) |
| No `spellbook` component in runtime (until this update) | P0 | Added `spellbook` + `cast-bar` + `action-bar` |
| No dedicated **grudge6** pack | P1 | Added `game-ui-packs/grudge6.json` |
| Only **6 craftpix 128 icons** for all skills | P1 | Map ObjectStore skill icons; craftpix as fallback only |
| Harvest tool icons reuse combat icons poorly | P2 | Prefer dedicated tool glyphs / ObjectStore `icons/` |
| Lucide icons on ModePlayHUD chrome (modes, build) vs craftpix slots | P2 | Accept hybrid: chrome = vector, slots = craftpix |
| `systems.json` / `catalog.json` SPA-fallback HTML | P2 | Publish real JSON (`systems.json`) |
| Kenney pixel UI vs craftpix | P3 | Kenney for VoxGrudge/z-brawl; **craftpix for Warlords/grudge6** |
| Pack hotbars are decorative until `bindData` | P1 | Games must call `ui.bindData` every tick / on change |

### UX best practices (fleet)

1. **One chrome language per genre** — Warlords/grudge6 = craftpix fantasy gold; never mix cyber neon in the same HUD.
2. **Readable combat** — player frame bottom-left, target top-center, hotbar bottom-center, cast bar above hotbar, minimap top-right.
3. **Spellbook = modal**, not permanent HUD (groups: `spellbook` / `menu`); hotkey **B**.
4. **Main panel = modal** for bag/equip/craft (**P** / **I**); do not duplicate inventory grids on the live HUD.
5. **Slots 48–56px** touch-friendly; number badges bottom-right; cooldown radial overlay on press state.
6. **Tooltips** on hover (title + cost + CD); keyboard focus rings for accessibility.
7. **Embed mode** `?embed=1` hides site chrome when iframed from client.
8. **postMessage contracts** — `GRUDGE_MAIN_PANEL`, `GRUDGE_SPELLBOOK`, `GRUDGE_MESH_EQUIP`.

---

## Canonical surface map

| System | Canonical URL | Consumer |
|--------|---------------|----------|
| Pack index | `/game-ui-packs/index.json` | All games |
| Runtime | `/game-ui-runtime.js` | `GrudgeGameUI.load(id)` |
| Warlords HUD pack | `/game-ui-packs/warlords.json` | island-3d, client |
| **Grudge6 pack** | `/game-ui-packs/grudge6.json` | grudge6 lab, play shell |
| Main panel | `/main-panel.html?era=warlords` | InventoryModal, MainPanelHost |
| **Spellbook page** | `/spellbook.html` | Grudge6PlayShell B key |
| Studio editor | `/studio.html` | Designers |
| Games gallery | `/games.html` | Browse packs |
| Hotkeys | `/hotkeys.html` | Binding UX |
| Craftpix assets | `/assets/craftpix/**` | Frames, slots, icons |
| RPG CSS | `assets.grudge-studio.com/ui/craftpix-rpg/craftpix-rpg-ui.css` | `.cpx-*` |

### React import pattern (Warlords)

```ts
import { ensureCraftpixRpgCss, loadUiPack } from '@/lib/uiKit/loadGrudgeGameUI';
import { UiKitActionSlot } from '@/components/uiKit/UiKitActionSlot';
import { UI_ICONS, iconForSkillLabel } from '@/lib/uiKit/craftpixAssets';
import { UI_STUDIO_MAIN_PANEL } from '@/lib/uiKit/uiStudioConfig';

// Live interactive HUD = ModePlayHUD (controls)
// Optional decorative pack layer = GrudgeGameUiLayer packId="warlords"|"grudge6"
```

### Vanilla / any game

```js
const ui = await GrudgeGameUI.load('grudge6'); // or warlords
ui.mount(document.getElementById('hud'));
ui.setState('combat'); // explore | combat | spellbook | inventory | menu
ui.bindData({ pf1: { name: 'Korgath', hp: 900, hpMax: 1000 } });
```

---

## Component catalog (runtime)

| type | Purpose |
|------|---------|
| `player-frame` / `target-frame` / `ally-frame` | Unit frames |
| `hotbar` / `hotbar-2row` / **`action-bar`** | Skill slots |
| **`spellbook`** | Modal ability book (craftpix) |
| **`cast-bar`** | Casting progress |
| `inventory-grid` / `paperdoll-equipment` | Bag / gear |
| `minimap` / `quest-tracker` / `chat-window` | World HUD |
| `skill-tree` / `attr-panel` | Progression (panel) |

---

## Icon & asset rules

1. **Prefer ObjectStore / R2 skill icons** when the skill has `iconUrl` in catalog.
2. **Fallback** to craftpix `Icons 128x128` via `iconForSkillLabel`.
3. **Never** invent AI icons for production gear — use D1/ObjectStore.
4. Spell Book tab glyphs: Flame / Shield / Sword under `assets/craftpix/Spell Book/Tabs/`.
5. Rarity slots: Dialog_Rewards_ItemSlot_{White,Green,Blue,Purple,Orange}.

---

## Hotkey SSOT (Warlords / grudge6)

| Key | Action | Surface |
|-----|--------|---------|
| 1–5 | Weapon skills | Hotbar |
| 6–8 | Consumables | Hotbar |
| Shift+1–5 | Class abilities | Hotbar |
| B | Spellbook | `spellbook.html` / pack state |
| P | Main panel | `main-panel.html` |
| I | Inventory tab | main-panel `?tab=inventory` |
| H | HUD focus / toggle chrome | play shell |
| Q | Mode toggle combat↔harvest | ModePlayHUD |
| R | Harvest tool radial | ModePlayHUD |
| Esc | Close modal | shell |

Skill macros: `SkillMacroSystem` (GrudgeBuilder) binds sequences onto the same slot map.

---

## Adoption checklist

```
[x] ui.grudge-studio.com craftpix assets live
[x] game-ui-runtime + warlords pack
[x] ModePlayHUD craftpix slots + frames
[x] Main panel warlords era
[x] grudge6 pack + spellbook component + spellbook.html
[ ] Wire Grudge6PlayShell → ui.grudge-studio.com (client fix)
[ ] Bind live cooldowns into action-bar slots
[ ] Expand icon set from ObjectStore weapon skill catalog
[ ] grudge6 hub 302 /spellbook → ui spellbook (ops optional)
[ ] systems.json real JSON for fleet map
```

---

## Do not

- Point play shells at **404** paths on grudge6.grudge-studio.com for HUD/spellbook  
- Host a third spellbook on random Replit URLs  
- Mix Kenney pixel + craftpix in the same Warlords HUD  
- Store pack SSOT only in localStorage — use Puter KV / fleet packs  
- Bypass `ui.grudge-studio.com` for main-panel chrome  
