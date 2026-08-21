/**
 * Mesh-level definition UUIDs — same algorithm as D1 asset_registry / ICON.
 *   grudgeUuid = sha1("grudge-asset:" + r2Key) → 16 bytes, version 5, RFC-4122
 * r2Key for kit children: `{kitPath}#{meshId}`
 *   e.g. asset-packs/toon-rts-characters/glb/characters/human.glb#WK_weapon_spear
 * Not Railway ledger instances.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cat = JSON.parse(
  fs.readFileSync(path.join(root, "data/warlords-mesh-catalog.json"), "utf8"),
);
const labels = JSON.parse(
  fs.readFileSync(path.join(root, "data/toon-rts-mesh-labels.json"), "utf8"),
);

function buildDeterministicUuid(input) {
  const hash = crypto.createHash("sha1").update(input).digest();
  const b = Buffer.from(hash.subarray(0, 16));
  b[6] = (b[6] & 0x0f) | 0x50;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = b.toString("hex");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20, 32)}`;
}

function meshUuid(kitGlb, meshId) {
  const kitPath = String(kitGlb).replace(/^https:\/\/assets\.grudge-studio\.com\//, "");
  const r2Key = `${kitPath}#${meshId}`;
  return {
    r2Key,
    defUuid: buildDeterministicUuid("grudge-asset:" + r2Key),
  };
}

function pretty(id) {
  return String(id)
    .replace(/^WK_|^BRB_|^ELF_|^DWF_|^ORC_|^UD_/i, "")
    .replace(/^Units_/i, "")
    .replace(/^Xtra_/i, "")
    .replace(/_/g, " ")
    .trim();
}

const UNARMED = {
  human: ["WK_Units_head_A", "WK_Units_Body_B", "WK_Units_Arms_A", "WK_Units_Legs_A"],
  barbarian: ["BRB_head_A", "BRB_body_B", "BRB_arms_A", "BRB_legs_A"],
  elf: ["ELF_Units_Head_A", "ELF_Units_Body_B", "ELF_Units_Arms_A", "ELF_Units_Legs_A"],
  dwarf: ["DWF_Units_Head_A", "DWF_Units_Body_B", "DWF_Units_Arms_A", "DWF_Units_Legs_A"],
  orc: ["ORC_Units_Head_A", "ORC_Units_Body_A", "ORC_Units_Arms_A", "ORC_Units_Legs_A"],
  undead: ["UD_Units_head_A", "UD_Units_body_B", "UD_Units_arms_A", "UD_Units_legs_A"],
};

const LABELS = {
  human: "Western Kingdoms",
  barbarian: "Barbarians",
  elf: "Elves",
  dwarf: "Dwarves",
  orc: "Orcs",
  undead: "Undead",
};

const PREFIX = {
  human: "WK_",
  barbarian: "BRB_",
  elf: "ELF_",
  dwarf: "DWF_",
  orc: "ORC_",
  undead: "UD_",
};

const CORE = new Set(["body", "arms", "legs", "head"]);
const I496 = "https://assets.grudge-studio.com/icons/496_rpg_icons";
const KIND_ICON = {
  sword: I496 + "/W_Sword001.png",
  axe: I496 + "/W_Axe001.png",
  hammer: I496 + "/W_Mace001.png",
  mace: I496 + "/W_Mace001.png",
  dagger: I496 + "/W_Sword001.png",
  spear: I496 + "/W_Spear001.png",
  pick: I496 + "/W_Axe001.png",
  bow: I496 + "/W_Bow01.png",
  staff: "https://assets.grudge-studio.com/game-assets/icons/pack/weapons/Staff_01.png",
  shield: I496 + "/E_Wood01.png",
  bag: I496 + "/I_Bag.png",
  wood: I496 + "/I_Coal.png",
  quiver: I496 + "/I_Bag.png",
  helm: I496 + "/C_Hat01.png",
  chest: I496 + "/A_Armour01.png",
  gloves: I496 + "/A_Armour02.png",
  boots: I496 + "/A_Shoes01.png",
  shoulders: I496 + "/A_Armour01.png",
  ring: I496 + "/I_Gem01.png",
};
const GROUP_SLOT = {
  head: "helmet",
  body: "chest",
  arms: "gloves",
  legs: "boots",
  shoulders: "shoulders",
  weapons: "weapon",
  shields: "offhand",
  utility: "back",
};

function inferKind(meshId, group) {
  const s = String(meshId);
  if (group === "shields" || /shield/i.test(s)) return "shield";
  if (group === "head") return "helm";
  if (group === "body") return "chest";
  if (group === "arms") return "gloves";
  if (group === "legs") return "boots";
  if (group === "shoulders") return "shoulders";
  if (group === "utility") {
    if (/quiver/i.test(s)) return "quiver";
    if (/wood|log|plank/i.test(s)) return "wood";
    return "bag";
  }
  if (/bow/i.test(s)) return "bow";
  if (/axe/i.test(s)) return "axe";
  if (/spear/i.test(s)) return "spear";
  if (/staff|wand/i.test(s)) return "staff";
  if (/hammer|mace/i.test(s)) return "hammer";
  if (/dagger|knife/i.test(s)) return "dagger";
  if (/pick/i.test(s)) return "pick";
  return "sword";
}

let sockets = { races: {} };
try {
  sockets = JSON.parse(fs.readFileSync(path.join(root, "data/toon-rts-named-sockets.json"), "utf8"));
} catch {
  /* optional */
}

const out = {
  version: "1.1.0",
  generated: new Date().toISOString(),
  kind: "definition",
  note: "defUuid = sha1(grudge-asset:{kitPath}#{meshId}) fleet D1/R2 mesh-level SSOT. Ledger grudge_uuid is minted only for owned instances.",
  algorithm: "sha1(grudge-asset:{r2Key}) RFC-4122 v5",
  r2KeyPattern: "{goldenKitPath}#{meshId}",
  golden: cat.golden,
  iconCdn: "https://assets.grudge-studio.com/icons/496_rpg_icons",
  races: {},
  totals: { races: 0, items: 0 },
};

for (const [race, rec] of Object.entries(cat.races || {})) {
  const unarmed = new Set(UNARMED[race] || []);
  const sockById = Object.fromEntries(
    (sockets.races?.[race]?.items || []).map((it) => [it.id, it]),
  );
  const items = [];
  for (const [group, meshIds] of Object.entries(rec.catalog || {})) {
    for (const meshId of meshIds) {
      if (/container/i.test(meshId)) continue;
      const uid = meshUuid(rec.kitGlb, meshId);
      const sock = sockById[meshId] || {};
      const kind = sock.kind || inferKind(meshId, group);
      items.push({
        meshId,
        group,
        slot: sock.slot || GROUP_SLOT[group] || group,
        kind,
        name: sock.name || (labels[race] && labels[race][meshId]) || pretty(meshId),
        defUuid: uid.defUuid,
        r2Key: uid.r2Key,
        iconUrl: KIND_ICON[kind] || KIND_ICON.sword,
        bone: sock.bone || null,
        animPack: sock.animPack || null,
        core: CORE.has(group),
        unarmedBase: unarmed.has(meshId),
        placeholder: !!sock.placeholder,
      });
    }
  }
  out.races[race] = {
    id: race,
    label: LABELS[race] || race,
    prefix: PREFIX[race] || "",
    kitGlb: rec.kitGlb,
    unarmed: [...unarmed],
    counts: items.reduce((a, it) => {
      a[it.group] = (a[it.group] || 0) + 1;
      a.total = (a.total || 0) + 1;
      return a;
    }, {}),
    items,
  };
  out.totals.races += 1;
  out.totals.items += items.length;
}

const dest = path.join(root, "data/mesh-showcase-index.json");
fs.writeFileSync(dest, JSON.stringify(out, null, 2));
console.log("wrote", dest, out.totals);
