# UI fonts + icons SSOT (Main Panel / eras)

**Host:** https://ui.grudge-studio.com/main-panel.html?era=warlords  
**Repo:** grudge-ui-editor  
**Production:** Vercel `grudgenexus/grudge-ui-editor` · alias `ui.grudge-studio.com`  
**API:** `/api/eras` · `/api/main-panel/:era` · `/main-panel-api.js`

## Goals

1. **English-only chrome** — no emoji / alchemy / color-font “hieroglyphs” on equipment, bag, skills  
2. **Brand fonts** — Cinzel + Crimson Text + JetBrains Mono  
3. **Icons from fleet CDN / info catalog** — never invent AI icons as production art  

## Fonts (production)

| Role | Family | Load |
|------|--------|------|
| Display / titles / tabs / slot abbr | **Cinzel** 500/700 | `grudge-fonts.css` |
| Body / panel text | **Crimson Text** 400/600 | same |
| Stats / keys / mono | **JetBrains Mono** | same |

- **SSOT file:** `grudge-fonts.css` (fontsource woff2 via jsDelivr, `font-display: swap`)  
- Optional mirror: `css/grudge-game-fonts.css`  
- **No Google Fonts** on production game UI  
- CSS vars: `--font-display` · `--font-body` · `--font-mono`

## Icons

| Source | Use |
|--------|-----|
| `assets.grudge-studio.com/icons/496_rpg_icons/*.png` | Empty paperdoll slots + bag category fallbacks |
| `info-catalog.js` / ObjectStore master-items | Equipped item `iconUrl` |
| `item-icons.js` | Shim → InfoCatalog + 496 fallbacks |

**Never** use emoji as production slot or skill art.

## UI chrome patterns

| Surface | Empty / missing art | Filled |
|---------|---------------------|--------|
| Paperdoll | Latin **abbr** (HEL, W1, …) + faint CDN icon | Item PNG |
| Bag / craft mats | `.inv-abbr` 3-letter code | Item PNG |
| Class / weapon skills | `.sk-abbr` from skill name | Catalog iconUrl |
| Hotbar 1–6 | 2-letter code or number | Catalog iconUrl |
| Professions | 3-letter from name | WCS iconUrl |

## Paperdoll slots (Warlords dual loadout)

| Column | Slots |
|--------|--------|
| Left | Helmet · Chest · Gloves · Legs · Boots |
| Right | Weapon 1 · Off 1 · Relic · Back · Mount |
| Bottom | Weapon 2 · Off 2 · Bag |

Combat **Q** swaps Weapon 1↔2 (Casting / Open parity).

## Deploy checklist

```bash
cd grudge-ui-editor
# review: equipment-paperdoll.js · main-panel.html · grudge-fonts.css · main-panel.css
npx vercel --prod --yes
# smoke:
#   https://ui.grudge-studio.com/main-panel.html?era=warlords&tab=equipment
#   empty slots = HEL / W1 Latin — not symbols
#   View Source Content-Type utf-8; Cinzel loads from jsDelivr
```

| Cache | Path |
|-------|------|
| 60s | `main-panel.html` |
| 1d | `grudge-fonts.css`, `/css/*` |
| 5m | `equipment-paperdoll.js` |

## Related

- Casting lab dual weapons: `CastingAbilitiesThreeJS` · skill `casting-t0-weapon-play`  
- CraftPix chrome: skill `craftpix-rpg-mmo-ui`  
- Info catalog: `info.grudge-studio.com`  
