/**
 * One-shot: strip emoji placeholders from equipment-paperdoll + main-panel title.
 * Empty slots = Latin abbr + CDN icons from assets 496 set.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const paperPath = path.join(root, "equipment-paperdoll.js");
const htmlPath = path.join(root, "main-panel.html");

let p = fs.readFileSync(paperPath, "utf8");
if (p.charCodeAt(0) === 0xfeff) p = p.slice(1);

const I496 = "https://assets.grudge-studio.com/icons/496_rpg_icons";

const slotsBlock = `  /** Empty-slot icons: assets.grudge-studio.com / 496 RPG (info catalog family) */
  var I496 = "${I496}";

  const SLOTS_LEFT = [
    { id: "helmet", gear: "head", label: "Helmet", abbr: "HEL", icon: I496 + "/A_Armour04.png" },
    { id: "chest", gear: "chest", label: "Chest", abbr: "CHS", icon: I496 + "/A_Armour01.png" },
    { id: "gloves", gear: "hands", label: "Gloves", abbr: "GLV", icon: I496 + "/A_Armour02.png" },
    { id: "legs", gear: "legs", label: "Legs", abbr: "LEG", icon: I496 + "/A_Armour03.png" },
    { id: "boots", gear: "feet", label: "Boots", abbr: "BOT", icon: I496 + "/A_Shoes01.png" },
  ];
  const SLOTS_RIGHT = [
    { id: "weapon", gear: "weapon", label: "Weapon 1", abbr: "W1", icon: I496 + "/W_Sword001.png" },
    { id: "offhand", gear: "offhand", label: "Off 1", abbr: "O1", icon: I496 + "/E_Wood01.png" },
    { id: "relic", gear: "accessory", label: "Relic", abbr: "RLC", icon: I496 + "/I_Gem01.png" },
    { id: "back", gear: "cape", label: "Back", abbr: "BCK", icon: I496 + "/I_Bag.png" },
    { id: "mount", gear: "mount", label: "Mount", abbr: "MNT", icon: I496 + "/S_Buff01.png" },
  ];
  /** Combat Q-swap loadout (Weapon 2) - not a corpse drop */
  const SLOT_SECONDARY = {
    id: "secondary",
    gear: "SecondaryWeapon",
    label: "Weapon 2",
    abbr: "W2",
    icon: I496 + "/W_Sword001.png",
  };
  const SLOT_OFF2 = {
    id: "offhand2",
    gear: "OffHand2",
    label: "Off 2",
    abbr: "O2",
    icon: I496 + "/E_Wood01.png",
  };
  const SLOT_ADD = { id: "add", gear: null, label: "Bag", abbr: "BAG", icon: I496 + "/I_Bag.png" };
`;

const slotsRe = /const SLOTS_LEFT = \[[\s\S]*?const SLOT_ADD = \{[^}]+\};/;
if (!slotsRe.test(p)) {
  console.error("SLOTS block not found");
  process.exit(1);
}
p = p.replace(slotsRe, slotsBlock.trim());

// slotHtml icon branch
const iconRe =
  /const icon = iconUrl\s*\?\s*`[\s\S]*?`\s*:\s*`<span class="eq-slot-ph">\$\{def\.emoji\}<\/span>`;/;
if (!iconRe.test(p)) {
  console.error("icon branch not found");
  process.exit(1);
}
p = p.replace(
  iconRe,
  `const emptyIcon = def.icon || "";
    const abbr = def.abbr || String(def.label || "").slice(0, 3).toUpperCase();
    const icon = iconUrl
      ? \`<img class="eq-slot-icon" src="\${esc(iconUrl)}" alt="" draggable="false" referrerpolicy="no-referrer" onerror="this.style.opacity=.2" />\`
      : emptyIcon
        ? \`<img class="eq-slot-icon eq-slot-icon--empty" src="\${esc(emptyIcon)}" alt="" draggable="false" referrerpolicy="no-referrer" /><span class="eq-slot-ph" aria-hidden="true">\${esc(abbr)}</span>\`
        : \`<span class="eq-slot-ph">\${esc(abbr)}</span>\`;`
);

// bottom row
const bottomRe =
  /\$\{slotHtml\(SLOT_RING, equipped\.ring, \{ readOnly \}\)\}[\s\S]*?\$\{slotHtml\(SLOT_ADD, null, \{ readOnly \}\)\}/;
if (!bottomRe.test(p)) {
  // maybe already patched
  if (!p.includes("SLOT_SECONDARY")) {
    console.error("bottom slots not found");
    process.exit(1);
  }
} else {
  p = p.replace(
    bottomRe,
    `\${slotHtml(SLOT_SECONDARY, equipped.secondary, { readOnly })}
            <div class="eq-bottom-rule"></div>
            \${slotHtml(SLOT_OFF2, equipped.offhand2, { readOnly })}
            <div class="eq-bottom-rule"></div>
            \${slotHtml(SLOT_ADD, null, { readOnly })}`
  );
}

if (!p.includes("eq-secondary-hint")) {
  p = p.replace(
    "${mode === \"inspect\" ? `<div class=\"eq-inspect-badge\">Inspecting</div>` : \"\"}",
    `${"${mode === \"inspect\" ? `<div class=\"eq-inspect-badge\">Inspecting</div>` : \"\"}"}
        <p class="eq-secondary-hint">Weapon 2 / Off 2 = combat Q-swap loadout (not looted from corpse).</p>`
  );
}

// mesh hint clean
p = p.replace(
  /Click armor\/weapon slots to cycle grudge6 mesh variants[^`]*?texture atlas by race/,
  "Click armor/weapon slots to cycle grudge6 mesh variants · texture atlas by race"
);

// alias map relic/back
p = p.replace(/accessory:\s*"amulet"/g, 'accessory: "relic"');
p = p.replace(/accessory2:\s*"amulet"/g, 'accessory2: "relic"');
p = p.replace(/amulet:\s*"amulet"/g, 'amulet: "relic"');
p = p.replace(/relic:\s*"belt"/g, 'relic: "relic"');

fs.writeFileSync(paperPath, p, "utf8");
console.log(
  "paperdoll",
  p.includes('abbr: "HEL"'),
  p.includes("eq-slot-icon--empty"),
  p.includes("SLOT_SECONDARY")
);

// main-panel title: strip leading non-ascii sword emoji
let h = fs.readFileSync(htmlPath, "utf8");
if (h.charCodeAt(0) === 0xfeff) h = h.slice(1);
h = h.replace(/<h1>[^A-Za-z0-9]*Grudge Warlords<\/h1>/, "<h1>Grudge Warlords</h1>");
h = h.replace(/HP\s*[^\x20-\x7E]+/g, "HP -");
h = h.replace(/MP\s*[^\x20-\x7E]+/g, "MP -");
h = h.replace(/SP\s*[^\x20-\x7E]+/g, "SP -");
// ensure fonts link
if (!h.includes("grudge-fonts.css") && !h.includes("grudge-game-fonts.css")) {
  h = h.replace(
    "</title>",
    '</title>\n  <link rel="stylesheet" href="./grudge-fonts.css" />'
  );
}
fs.writeFileSync(htmlPath, h, "utf8");
console.log("html title clean", h.includes("<h1>Grudge Warlords</h1>"));
