# UI fonts + icons SSOT (Main Panel / Warlords)

**Host:** https://ui.grudge-studio.com/main-panel.html?era=warlords  
**Repo:** grudge-ui-editor  

## Problem (fixed)

Equipment tab showed “strange letters / hieroglyphics” because:

1. Empty paperdoll slots used **emoji** (color fonts / missing glyphs → tofu / odd symbols)
2. **Google Fonts** load failures left body text on system fonts that mis-render specials
3. Mixed em-dash / arrow / bullet Unicode in chrome

## Fonts (brand)

| Role | Family | File |
|------|--------|------|
| Display / titles / tabs | **Cinzel** 500/700 | `css/grudge-game-fonts.css` |
| Body / panel text | **Crimson Text** 400/600 | same |
| Stats / keys / mono | **JetBrains Mono** | same |

- Loaded from **fontsource** via jsDelivr (woff2, `font-display: swap`)
- **No Google Fonts** runtime on production game UI
- CSS vars: `--font-display` · `--font-body` · `--font-mono`

## Icons

| Source | Use |
|--------|-----|
| `https://assets.grudge-studio.com/icons/496_rpg_icons/*.png` | Primary empty-slot + bag icons |
| `item-icons.js` `GrudgeItemIcons.resolve` | Prefer catalog `iconUrl`; else category PNG |
| info.grudge-studio.com catalog | Explicit URLs rewritten to assets CDN |

**Never** use emoji as production slot art.

## Paperdoll empty slots

- Latin **abbr** (HEL, W1, RLC, …) in Cinzel
- Faint grayscale CDN icon under abbr
- Equipped: real item PNG from resolve / bag

## English-only UI chrome

- Labels: Helmet, Weapon 1, Off 1, Relic, Back, Mount, Weapon 2, Off 2
- No alchemy glyphs, no craft emoji titles
- Dual loadout matches Casting: Weapon 1/2 · Off 1/2 · Relic · Back

## Deploy

```bash
# from grudge-ui-editor
vercel --prod
# or project deploy for ui.grudge-studio.com
```

Smoke: open Equipment tab — empty slots show **HEL / W1** style Latin, not symbols.
