# Main Panel + Equipment Paperdoll (Warlords era)

## Authority

| Surface | Role |
|---------|------|
| **ui.grudge-studio.com** | **SSOT host** — edit, host, era versions, packs |
| `main-panel.html?era=warlords` | Full main panel (equipment / bag / skills / **weapon mastery** / craft / quests) |
| `equipment-paperdoll.js` | Tactical paperdoll (portrait + 12 slots) |
| `game-ui-packs/warlords.json` | HYDRA pack with `paperdoll-equipment` |
| `eras/index.json` | Era registry |
| info.grudge-studio.com/main-panel.html | **Legacy** — migrate consumers to UI host |
| tactical-infinity `/equipment` | **Layout reference** (not production host) |

## Equipment UI contract

- **Layout:** left armor column · center portrait · right weapons/jewelry · bottom ring/add  
- **Modes:** `self` (equip) · `inspect` (other unit/player, read-only)  
- **Events:** `grudge:equip:slot` · postMessage `GRUDGE_MAIN_PANEL`  
- **Portraits:** `race-portraits.js` → client.grudge-studio.com CDN  

## Embed in games

```html
<iframe
  src="https://ui.grudge-studio.com/main-panel.html?era=warlords&embed=1&tab=equipment"
  title="Warlords Main Panel"
></iframe>
```

React (Warlords client):

```tsx
import MainPanelHost from "@/components/MainPanelHost";
// open overlay → Equipment paperdoll + bag tabs
```

Routes:

- `https://client.grudge-studio.com/main-panel`
- `https://client.grudge-studio.com/equipment`
- `https://ui.grudge-studio.com/main-panel.html?era=warlords&tab=mastery&characterId=`
- Standalone `grudgewarlords.com/weaponmastery.html` **redirects** here (`?embed=1` stays for the iframe)

## Fleet adoption checklist

```
[x] ui.grudge-studio.com/main-panel.html?era=warlords
[x] equipment-paperdoll.js + tactical CSS
[x] warlords pack paperdoll-equipment component
[x] game-ui-runtime paperdoll render
[x] eras/index.json
[x] client MainPanelHost + /main-panel route
[ ] Point info.grudge-studio.com/main-panel.html → 302 to UI host (ops)
[ ] Island3D C/I hotkey optional open MainPanelHost
```

## Crafting tab (wired to grudgewarlords.com/craft)

| Concern | Rule |
|---------|------|
| **Full suite (SSOT)** | **Embed** `/craft/?embed=1&from=ui-main-panel` + SSO postMessage |
| **Quick rail** | Optional native recipes (`Quick` button) — not a second bag |
| **Pop-out** | Always available |
| **WCS brand hub** | `wcs.grudge-studio.com` — routes only |
| **Frame policy** | Suite CSP `frame-ancestors` allows ui/info (no XFO on `/craft`) |
| **Bag scope** | Railway account bag — suite authority; `GRUDGE_BAG` syncs panel |
| **XP scope** | Active character only |
| **Code** | GrudgeBuilder `craftSsot.ts` · `docs/CRAFT_INVENTORY_SSOT.md` |
| **info mirror** | Same suite URL; prefer **ui host** for paperdoll SSOT |

## Paperdoll hero facing

| Surface | Default yaw |
|---------|-------------|
| Main-panel `grudge6-viewport.js` | **`Math.PI`** — face user (camera at +Z) |
| Toon play world | **0** (+Z forward) |
| FBX author +X kits | **π/2** only in author tools — not main-panel |

Do **not** continuous-spin the paperdoll (backs half the time). Gentle idle sway around face-user yaw is OK.

## Scale · containers · icons (production UI)

| Token | Value / rule |
|-------|----------------|
| Design space | HYDRA **1920×1080** (embed scales with host) |
| Panel root | `.mp-root` flex column; tab body fills remaining height |
| Craft layout | CSS grid `1fr · 160–220px` materials rail; stack &lt;900px |
| Craft cards | `minmax(168px, 1fr)` auto-fill; min-height ~96px |
| Slot / icon | Craft icon **22px**; bag materials **28px**; inventory ~70% of slot |
| Containers | Gold-border panels (`rgba(201,149,10,.28–.35)`), 8–12px radius |
| Image render | `image-rendering: pixelated` on UI icons |
| Account wire | `GrudgeCloud` JWT → Railway bag (suite authority); guest = local demo only |
| SPA harvest | GrudgeBuilder `depositHarvestType` → `/api/account/resources/batch` |

## Do not

- Host a third main-panel on a random Replit URL  
- Invent a second equipment slot schema outside Railway character.equipment  
- Replace paperdoll with a plain bag-only tab for Warlords  
- Point craft at Puter legacy host (`grudge-crafting.puter.site`) as SSOT  
- Invent a second Railway bag only for main-panel  
- Face paperdoll with continuous Y spin or FBX π/2 author yaw 
