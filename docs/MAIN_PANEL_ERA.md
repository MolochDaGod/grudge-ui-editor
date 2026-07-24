# Main Panel + Equipment Paperdoll (Warlords era)

## Authority

| Surface | Role |
|---------|------|
| **ui.grudge-studio.com** | **SSOT host** — edit, host, era versions, packs |
| `main-panel.html?era=warlords` | Full main panel (equipment / bag / skills / craft / quests) |
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

## Do not

- Host a third main-panel on a random Replit URL  
- Invent a second equipment slot schema outside Railway character.equipment  
- Replace paperdoll with a plain bag-only tab for Warlords  
