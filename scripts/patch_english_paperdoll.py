# Merge English abbr + CDN empty-slot icons into f190ef8 equipment-paperdoll.js
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
text = subprocess.check_output(
    ["git", "show", "f190ef8:equipment-paperdoll.js"], cwd=ROOT
).decode("utf-8")

I496 = "https://assets.grudge-studio.com/icons/496_rpg_icons"
slots = f"""  var I496 = "{I496}";

  const SLOTS_LEFT = [
    {{ id: "helmet", gear: "head", label: "Helmet", abbr: "HEL", icon: I496 + "/A_Armour04.png" }},
    {{ id: "chest", gear: "chest", label: "Chest", abbr: "CHS", icon: I496 + "/A_Armour01.png" }},
    {{ id: "gloves", gear: "hands", label: "Gloves", abbr: "GLV", icon: I496 + "/A_Armour02.png" }},
    {{ id: "legs", gear: "legs", label: "Legs", abbr: "LEG", icon: I496 + "/A_Armour03.png" }},
    {{ id: "boots", gear: "feet", label: "Boots", abbr: "BOT", icon: I496 + "/A_Shoes01.png" }},
  ];
  const SLOTS_RIGHT = [
    {{ id: "weapon", gear: "weapon", label: "Weapon 1", abbr: "W1", icon: I496 + "/W_Sword001.png" }},
    {{ id: "offhand", gear: "offhand", label: "Off 1", abbr: "O1", icon: I496 + "/E_Wood01.png" }},
    {{ id: "relic", gear: "accessory", label: "Relic", abbr: "RLC", icon: I496 + "/I_Gem01.png" }},
    {{ id: "back", gear: "cape", label: "Back", abbr: "BCK", icon: I496 + "/I_Bag.png" }},
    {{ id: "mount", gear: "mount", label: "Mount", abbr: "MNT", icon: I496 + "/S_Buff01.png" }},
  ];
  const SLOT_SECONDARY = {{
    id: "secondary",
    gear: "SecondaryWeapon",
    label: "Weapon 2",
    abbr: "W2",
    icon: I496 + "/W_Sword001.png",
  }};
  const SLOT_OFF2 = {{
    id: "offhand2",
    gear: "OffHand2",
    label: "Off 2",
    abbr: "O2",
    icon: I496 + "/E_Wood01.png",
  }};
  const SLOT_ADD = {{ id: "add", gear: null, label: "Bag", abbr: "BAG", icon: I496 + "/I_Bag.png" }};
"""

start = text.index("  const SLOTS_LEFT")
end = text.index("  const RARITY_CLASS")
text = text[:start] + slots + "\n\n" + text[end:]

m = re.search(
    r"const icon = iconUrl\s*\?\s*`[\s\S]*?def\.emoji\}</span>`;",
    text,
)
if not m:
    raise SystemExit("icon branch not found")

new_icon = """const emptyIcon = def.icon || "";
    const abbr = def.abbr || String(def.label || "").slice(0, 3).toUpperCase();
    const icon = iconUrl
      ? `<img class="eq-slot-icon" src="${esc(iconUrl)}" alt="" draggable="false" referrerpolicy="no-referrer" onerror="this.style.opacity=.2" />`
      : emptyIcon
        ? `<img class="eq-slot-icon eq-slot-icon--empty" src="${esc(emptyIcon)}" alt="" draggable="false" referrerpolicy="no-referrer" /><span class="eq-slot-ph" aria-hidden="true">${esc(abbr)}</span>`
        : `<span class="eq-slot-ph">${esc(abbr)}</span>`;"""
text = text[: m.start()] + new_icon + text[m.end() :]

m2 = re.search(
    r"\$\{slotHtml\(SLOT_RING, equipped\.ring, \{ readOnly \}\)\}[\s\S]*?"
    r"\$\{slotHtml\(SLOT_ADD, null, \{ readOnly \}\)\}",
    text,
)
if not m2:
    raise SystemExit("bottom slots not found")

bottom = """${slotHtml(SLOT_SECONDARY, equipped.secondary, { readOnly })}
            <div class="eq-bottom-rule"></div>
            ${slotHtml(SLOT_OFF2, equipped.offhand2, { readOnly })}
            <div class="eq-bottom-rule"></div>
            ${slotHtml(SLOT_ADD, null, { readOnly })}"""
text = text[: m2.start()] + bottom + text[m2.end() :]

if "eq-secondary-hint" not in text:
    needle = (
        '${mode === "inspect" ? `<div class="eq-inspect-badge">Inspecting</div>` : ""}'
    )
    insert = (
        needle
        + '\n        <p class="eq-secondary-hint">Weapon 2 / Off 2 = combat Q-swap loadout (not looted from corpse).</p>'
    )
    if needle not in text:
        raise SystemExit("inspect badge needle missing")
    text = text.replace(needle, insert, 1)

# Alias map: ring/amulet -> dual weapon / relic where sensible
text = text.replace('accessory: "amulet"', 'accessory: "relic"')
text = text.replace('accessory2: "amulet"', 'accessory2: "relic"')
text = text.replace('amulet: "amulet"', 'amulet: "relic"')
text = text.replace('relic: "belt"', 'relic: "relic"')

# Soften mesh hint punctuation
text = re.sub(
    r"mesh variants.{1,6}texture atlas",
    "mesh variants · texture atlas",
    text,
)

out = ROOT / "equipment-paperdoll.js"
out.write_text(text, encoding="utf-8")
print(
    "ok",
    out.stat().st_size,
    "HEL" in text,
    "InfoCatalog" in text,
    "MainPanelMesh" in text,
    "SLOT_SECONDARY" in text,
)

# main-panel title cleanup
html = subprocess.check_output(
    ["git", "show", "f190ef8:main-panel.html"], cwd=ROOT
).decode("utf-8")
html = re.sub(r"<h1>[^A-Za-z0-9]*Grudge Warlords</h1>", "<h1>Grudge Warlords</h1>", html)
(ROOT / "main-panel.html").write_text(html, encoding="utf-8")
print("html", "Grudge Warlords" in html, html.count("\n"))
