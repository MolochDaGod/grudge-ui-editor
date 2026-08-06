/**
 * Main Panel content — mesh kits + guest craft stubs.
 * Canonical game systems load at runtime from ObjectStore:
 *   fleet-game-systems.js → master-skillTrees + master-weaponSkills
 *   wcs-professions-ssot.js → WCS profession trees
 *   info-catalog.js → master-items + materials + CDN icons
 * CLASS_SKILL_TREES / WEAPON_SKILL_BARS below are offline stubs only.
 */
(function (global) {
  "use strict";

  const RACES = ["human", "barbarian", "dwarf", "elf", "orc", "undead"];
  const CLASSES = ["warrior", "mage", "ranger", "worge", "worg"];

  const RACE_PREFIX = {
    human: "WK_",
    barbarian: "BRB_",
    dwarf: "DWF_",
    elf: "ELF_",
    orc: "ORC_",
    undead: "UD_",
  };

  /**
   * Offline stubs — replaced by FleetGameSystems.loadCatalog()
   * from objectstore master-skillTrees.json (emoji is not production art).
   */
  const CLASS_SKILL_TREES = {
    warrior: {
      name: "Warrior",
      color: "#c2410c",
      tiers: [
        {
          lvl: 1,
          label: "Core",
          skills: [
            { id: "warrior.power_strike", n: "Power Strike", d: "150% overhead slash", slot: 1, emoji: "⚔" },
            { id: "warrior.shield_bash", n: "Shield Bash", d: "Stun 1.5s", slot: 2, emoji: "🛡" },
            { id: "warrior.war_cry", n: "War Cry", d: "AoE taunt", slot: 3, emoji: "📯" },
          ],
        },
        {
          lvl: 10,
          label: "Line",
          skills: [
            { id: "warrior.cleave", n: "Cleave", d: "Wide arc hit", slot: 4, emoji: "💥" },
            { id: "warrior.charge", n: "Charge", d: "Gap closer", slot: 5, emoji: "➡" },
            { id: "warrior.fortify", n: "Fortify", d: "+DEF 8s", slot: 6, emoji: "🧱" },
          ],
        },
        {
          lvl: 20,
          label: "Mastery",
          skills: [
            { id: "warrior.execute", n: "Execute", d: "Finisher under 30% HP", slot: null, emoji: "☠" },
            { id: "warrior.bulwark", n: "Bulwark", d: "Party shield wall", slot: null, emoji: "🔰" },
          ],
        },
      ],
    },
    mage: {
      name: "Mage",
      color: "#7c3aed",
      tiers: [
        {
          lvl: 1,
          label: "Core",
          skills: [
            { id: "mage.fireball", n: "Fireball", d: "Ranged fire bolt", slot: 1, emoji: "🔥" },
            { id: "mage.frost", n: "Frost Bolt", d: "Slow + chip", slot: 2, emoji: "❄" },
            { id: "mage.arcane_shield", n: "Arcane Shield", d: "Absorb barrier", slot: 3, emoji: "🔮" },
          ],
        },
        {
          lvl: 10,
          label: "Confluence",
          skills: [
            { id: "mage.chain", n: "Chain Lightning", d: "Jump 3 targets", slot: 4, emoji: "⚡" },
            { id: "mage.blink", n: "Blink", d: "Short teleport", slot: 5, emoji: "✨" },
            { id: "mage.meteor", n: "Meteor", d: "AoE delay strike", slot: 6, emoji: "☄" },
          ],
        },
        {
          lvl: 20,
          label: "Arch",
          skills: [
            { id: "mage.time_warp", n: "Time Warp", d: "Haste self 6s", slot: null, emoji: "⏳" },
            { id: "mage.nova", n: "Mana Nova", d: "Burst + restore", slot: null, emoji: "💠" },
          ],
        },
      ],
    },
    ranger: {
      name: "Ranger",
      color: "#15803d",
      tiers: [
        {
          lvl: 1,
          label: "Core",
          skills: [
            { id: "ranger.precise", n: "Precise Shot", d: "High accuracy shot", slot: 1, emoji: "🏹" },
            { id: "ranger.trap", n: "Spike Trap", d: "Root 2s", slot: 2, emoji: "🪤" },
            { id: "ranger.volley", n: "Volley", d: "3-arrow spray", slot: 3, emoji: "🎯" },
          ],
        },
        {
          lvl: 10,
          label: "Hunt",
          skills: [
            { id: "ranger.mark", n: "Hunter's Mark", d: "+dmg target", slot: 4, emoji: "👁" },
            { id: "ranger.dash", n: "Sidestep", d: "I-frames dodge", slot: 5, emoji: "💨" },
            { id: "ranger.poison", n: "Poison Arrow", d: "DoT 6s", slot: 6, emoji: "☠" },
          ],
        },
        {
          lvl: 20,
          label: "Master",
          skills: [
            { id: "ranger.rain", n: "Arrow Rain", d: "Ground AoE", slot: null, emoji: "🌧" },
            { id: "ranger.camo", n: "Camouflage", d: "Stealth 4s", slot: null, emoji: "🍃" },
          ],
        },
      ],
    },
    worge: {
      name: "Worge",
      color: "#a16207",
      tiers: [
        {
          lvl: 1,
          label: "Core",
          skills: [
            { id: "worge.rend", n: "Rend", d: "Bleed slash", slot: 1, emoji: "🩸" },
            { id: "worge.howl", n: "Howl", d: "Fear pulse", slot: 2, emoji: "🐺" },
            { id: "worge.pounce", n: "Pounce", d: "Leap attack", slot: 3, emoji: "🐾" },
          ],
        },
        {
          lvl: 10,
          label: "Primal",
          skills: [
            { id: "worge.form", n: "Beast Form", d: "Hybrid morph", slot: 4, emoji: "🌙" },
            { id: "worge.thrash", n: "Thrash", d: "Multi-hit", slot: 5, emoji: "💢" },
            { id: "worge.pack", n: "Pack Bond", d: "Ally haste", slot: 6, emoji: "🔗" },
          ],
        },
        {
          lvl: 20,
          label: "Alpha",
          skills: [
            { id: "worge.ravage", n: "Ravage", d: "Execute leap", slot: null, emoji: "💀" },
            { id: "worge.totem", n: "Spirit Totem", d: "Heal aura", slot: null, emoji: "🪵" },
          ],
        },
      ],
    },
  };
  CLASS_SKILL_TREES.worg = CLASS_SKILL_TREES.worge;

  /** Weapon skill bars by equipped weapon type. */
  const WEAPON_SKILL_BARS = {
    sword: [
      { id: "ws.slash", n: "Slash", d: "Light chain", emoji: "⚔", slot: 1 },
      { id: "ws.riposte", n: "Riposte", d: "Parry counter", emoji: "↩", slot: 2 },
      { id: "ws.overhead", n: "Overhead", d: "Heavy", emoji: "⬇", slot: 3 },
      { id: "ws.thrust", n: "Thrust", d: "Pierce", emoji: "➡", slot: 4 },
    ],
    shield: [
      { id: "ws.block", n: "Block", d: "Hold guard", emoji: "🛡", slot: 1 },
      { id: "ws.bash", n: "Bash", d: "Stun", emoji: "🔨", slot: 2 },
    ],
    bow: [
      { id: "ws.shot", n: "Shot", d: "Standard", emoji: "🏹", slot: 1 },
      { id: "ws.aimed", n: "Aimed", d: "Charge", emoji: "🎯", slot: 2 },
      { id: "ws.scatter", n: "Scatter", d: "Cone", emoji: "✴", slot: 3 },
      { id: "ws.retreat", n: "Retreat Shot", d: "Backstep", emoji: "↩", slot: 4 },
    ],
    staff: [
      { id: "ws.bolt", n: "Bolt", d: "School bolt", emoji: "✦", slot: 1 },
      { id: "ws.channel", n: "Channel", d: "Beam", emoji: "〰", slot: 2 },
      { id: "ws.burst", n: "Burst", d: "AoE", emoji: "💥", slot: 3 },
      { id: "ws.ward", n: "Ward", d: "Shield", emoji: "⬡", slot: 4 },
    ],
    axe: [
      { id: "ws.hack", n: "Hack", d: "Heavy chop", emoji: "🪓", slot: 1 },
      { id: "ws.whirl", n: "Whirl", d: "Spin", emoji: "🌀", slot: 2 },
      { id: "ws.cleave", n: "Cleave", d: "Arc", emoji: "〰", slot: 3 },
    ],
    hammer: [
      { id: "ws.smash", n: "Smash", d: "Ground pound", emoji: "⚒", slot: 1 },
      { id: "ws.quake", n: "Quake", d: "Shockwave", emoji: "〰", slot: 2 },
    ],
    unarmed: [
      { id: "ws.jab", n: "Jab", d: "Quick hit", emoji: "✊", slot: 1 },
      { id: "ws.hook", n: "Hook", d: "Heavy", emoji: "👊", slot: 2 },
      { id: "ws.kick", n: "Kick", d: "Stagger", emoji: "🦵", slot: 3 },
    ],
  };

  /**
   * Profession trees — stub until WcsProfessions.loadCatalog() installs WCS SSOT.
   * Canonical source: warlords-crafting-suite client/src/data/{miner,forester,engineer,mystic,chef}.ts
   * Runtime: wcs-professions-ssot.js + data/wcs-professions.json
   */
  let PROFESSION_TREES = {
    miner: { name: "Miner", emoji: "⛏", color: "#f59e0b", nodes: [] },
    forester: { name: "Forester", emoji: "🌲", color: "#22c55e", nodes: [] },
    engineer: { name: "Engineer", emoji: "🔧", color: "#fb923c", nodes: [] },
    mystic: { name: "Mystic", emoji: "🔮", color: "#a78bfa", nodes: [] },
    chef: { name: "Chef", emoji: "🍲", color: "#f97316", nodes: [] },
  };

  /** Quick craft recipes (ObjectStore-shaped). */
  const CRAFT_RECIPES = [
    {
      id: "iron_ingot",
      name: "Iron Ingot",
      profession: "smith",
      emoji: "⛓",
      inputs: [{ id: "ore_iron", name: "Iron Ore", qty: 3 }],
      output: { id: "ingot_iron", name: "Iron Ingot", qty: 1 },
      timeSec: 4,
    },
    {
      id: "healing_tonic",
      name: "Healing Tonic",
      profession: "chef",
      emoji: "🧪",
      inputs: [
        { id: "herb_green", name: "Green Herb", qty: 2 },
        { id: "water", name: "Water", qty: 1 },
      ],
      output: { id: "tonic_heal", name: "Healing Tonic", qty: 1 },
      timeSec: 3,
    },
    {
      id: "wooden_shield",
      name: "Wooden Shield",
      profession: "forester",
      emoji: "🛡",
      inputs: [{ id: "plank", name: "Plank", qty: 8 }],
      output: { id: "shield_wood", name: "Wooden Shield", qty: 1 },
      timeSec: 8,
    },
    {
      id: "mana_dust",
      name: "Mana Dust",
      profession: "mystic",
      emoji: "✨",
      inputs: [{ id: "crystal_shard", name: "Crystal Shard", qty: 1 }],
      output: { id: "dust_mana", name: "Mana Dust", qty: 2 },
      timeSec: 2,
    },
    {
      id: "iron_sword",
      name: "Iron Cutlass",
      profession: "smith",
      emoji: "⚔",
      inputs: [
        { id: "ingot_iron", name: "Iron Ingot", qty: 4 },
        { id: "plank", name: "Plank", qty: 1 },
      ],
      output: { id: "w_sword_iron", name: "Iron Cutlass", qty: 1 },
      timeSec: 12,
      equipSlot: "weapon",
      mesh: { slot: "sword", variant: "B" },
    },
    {
      id: "leather_vest",
      name: "Leather Vest",
      profession: "tailor",
      emoji: "🥋",
      inputs: [{ id: "leather", name: "Leather", qty: 6 }],
      output: { id: "chest_leather", name: "Leather Vest", qty: 1 },
      timeSec: 10,
      equipSlot: "chest",
      mesh: { slot: "body", variant: "B" },
    },
    {
      id: "yew_bow",
      name: "Yew Longbow",
      profession: "forester",
      emoji: "🏹",
      inputs: [
        { id: "plank", name: "Plank", qty: 4 },
        { id: "string", name: "Bowstring", qty: 1 },
      ],
      output: { id: "bow_yew", name: "Yew Longbow", qty: 1 },
      timeSec: 10,
      equipSlot: "weapon",
      mesh: { slot: "bow", variant: "_default" },
    },
    {
      id: "stone_pick",
      name: "Stone Pick",
      profession: "miner",
      emoji: "⛏",
      inputs: [
        { id: "stone", name: "Stone", qty: 5 },
        { id: "plank", name: "Plank", qty: 2 },
      ],
      output: { id: "tool_pick", name: "Stone Pick", qty: 1 },
      timeSec: 6,
    },
  ];

  /** Demo bag when account inventory empty. */
  const STARTER_BAG = [
    { id: "ore_iron", name: "Iron Ore", qty: 12, emoji: "🪨", tier: 1, slot: "material" },
    { id: "plank", name: "Plank", qty: 16, emoji: "🪵", tier: 1, slot: "material" },
    { id: "herb_green", name: "Green Herb", qty: 8, emoji: "🌿", tier: 1, slot: "material" },
    { id: "water", name: "Water", qty: 6, emoji: "💧", tier: 1, slot: "material" },
    { id: "crystal_shard", name: "Crystal Shard", qty: 3, emoji: "💎", tier: 2, slot: "material" },
    { id: "leather", name: "Leather", qty: 10, emoji: "🟧", tier: 1, slot: "material" },
    { id: "string", name: "Bowstring", qty: 4, emoji: "🧵", tier: 1, slot: "material" },
    { id: "stone", name: "Stone", qty: 20, emoji: "🪨", tier: 1, slot: "material" },
    { id: "food_bread", name: "Bread", qty: 5, emoji: "🍞", tier: 1, slot: "consumable" },
    { id: "tool_stone_axe", name: "Stone Axe", qty: 1, emoji: "🪓", tier: 1, slot: "tool" },
  ];

  /**
   * grudge6 starting mesh kits per race×class (Unity visibility names).
   * Maps to EquipmentManager mesh_ids / paperdoll mesh layer.
   */
  const CLASS_MESH_KITS = {
    warrior: {
      body: "C", arms: "B", legs: "B", head: "D", shoulders: "A",
      weapon: "sword", weaponVar: "B", offhand: "shield", offhandVar: "B",
      weaponType: "sword",
    },
    mage: {
      body: "A", arms: "A", legs: "A", head: "A", shoulders: null,
      weapon: "staff", weaponVar: "C", offhand: null, offhandVar: null,
      weaponType: "staff",
    },
    ranger: {
      body: "B", arms: "B", legs: "B", head: "C", shoulders: "A",
      weapon: "bow", weaponVar: "_default", offhand: null, offhandVar: null,
      weaponType: "bow",
    },
    worge: {
      body: "B", arms: "B", legs: "B", head: "C", shoulders: null,
      weapon: "sword", weaponVar: "A", offhand: "staff", offhandVar: "B",
      weaponType: "sword",
    },
  };
  CLASS_MESH_KITS.worg = CLASS_MESH_KITS.worge;

  const UNARMED_MESH = {
    body: "B", arms: "A", legs: "A", head: "A", shoulders: null,
    weapon: null, weaponVar: null, offhand: null, offhandVar: null,
    weaponType: "unarmed",
  };

  function normalizeClass(cls) {
    const c = String(cls || "warrior").toLowerCase();
    if (c === "worg" || c === "worge") return "worge";
    if (CLASS_MESH_KITS[c]) return c;
    return "warrior";
  }

  function normalizeRace(race) {
    const r = String(race || "human").toLowerCase().replace(/[^a-z]/g, "");
    if (r.includes("barb")) return "barbarian";
    if (r.includes("dwarf")) return "dwarf";
    if (r.includes("elf")) return "elf";
    if (r.includes("orc")) return "orc";
    if (r.includes("undead") || r === "ud") return "undead";
    return "human";
  }

  /** Build mesh_ids list for race + class (Unity child mesh names). */
  function meshIdsFor(race, classId, unarmed) {
    const raceN = normalizeRace(race);
    const prefix = RACE_PREFIX[raceN] || "WK_";
    const kit = unarmed ? UNARMED_MESH : CLASS_MESH_KITS[normalizeClass(classId)] || UNARMED_MESH;
    const ids = [];
    const bodyStyle = raceN === "barbarian" ? "short" : "units";

    function pushArmor(slot, letter) {
      if (!letter) return;
      if (bodyStyle === "short") {
        // BRB_head_A style
        const map = { head: "head", body: "body", arms: "arms", legs: "legs", shoulders: "shoulderpads" };
        ids.push(`${prefix}${map[slot] || slot}_${letter}`);
      } else if (raceN === "undead") {
        const map = { head: "Units_head", body: "Units_body", arms: "Units_arms", legs: "Units_legs", shoulders: "Units_shoulderpads" };
        ids.push(`${prefix}${map[slot]}_${letter}`);
      } else {
        const map = {
          head: "Units_head",
          body: "Units_Body",
          arms: "Units_Arms",
          legs: "Units_Legs",
          shoulders: "Units_shoulderpads",
        };
        // Dwarf uses Title case Head/Body
        if (raceN === "dwarf") {
          const dmap = {
            head: "Units_Head",
            body: "Units_Body",
            arms: "Units_Arms",
            legs: "Units_Legs",
            shoulders: "Units_Shoulderpads",
          };
          ids.push(`${prefix}${dmap[slot]}_${letter}`);
        } else {
          ids.push(`${prefix}${map[slot]}_${letter}`);
        }
      }
    }

    pushArmor("head", kit.head);
    pushArmor("body", kit.body);
    pushArmor("arms", kit.arms);
    pushArmor("legs", kit.legs);
    pushArmor("shoulders", kit.shoulders);

    if (kit.weapon) {
      if (kit.weapon === "bow") ids.push(`${prefix}weapon_Bow`, `${prefix}Xtra_quiver`);
      else if (kit.weaponVar && kit.weaponVar !== "_default") {
        ids.push(`${prefix}weapon_${kit.weapon}_${kit.weaponVar}`);
      } else {
        ids.push(`${prefix}weapon_${kit.weapon}`);
      }
    }
    if (kit.offhand === "shield" && kit.offhandVar) {
      ids.push(`${prefix}Shield_${kit.offhandVar}`);
    }
    if (kit.offhand === "staff" && kit.offhandVar) {
      ids.push(`${prefix}weapon_staff_${kit.offhandVar}`);
    }

    return { prefix, kit, meshIds: ids, weaponType: kit.weaponType };
  }

  /** Convert model3d equippedMeshes+weaponSlots → paperdoll equipment bag. */
  function model3dToEquipment(model3d) {
    if (!model3d || typeof model3d !== "object") return {};
    const eq = {};
    const em = model3d.equippedMeshes || {};
    const ws = model3d.weaponSlots || {};
    if (em.head) eq.head = { id: `head_${em.head}`, name: `Head ${em.head}`, rarity: "common", meshSlot: "head", meshVar: em.head };
    if (em.body) eq.chest = { id: `body_${em.body}`, name: `Body ${em.body}`, rarity: "common", meshSlot: "body", meshVar: em.body };
    if (em.arms) eq.gloves = { id: `arms_${em.arms}`, name: `Arms ${em.arms}`, rarity: "common", meshSlot: "arms", meshVar: em.arms };
    if (em.legs) eq.legs = { id: `legs_${em.legs}`, name: `Legs ${em.legs}`, rarity: "common", meshSlot: "legs", meshVar: em.legs };
    if (em.shoulders) eq.cloak = { id: `sh_${em.shoulders}`, name: `Shoulders ${em.shoulders}`, rarity: "uncommon", meshSlot: "shoulders", meshVar: em.shoulders };
    for (const [slot, v] of Object.entries(ws)) {
      if (slot === "shield") {
        eq.offhand = { id: `shield_${v}`, name: `Shield ${v}`, rarity: "uncommon", meshSlot: "shield", meshVar: v };
      } else if (["sword", "axe", "hammer", "bow", "staff", "spear", "dagger", "pick"].includes(slot)) {
        eq.weapon = {
          id: `${slot}_${v}`,
          name: `${slot} ${v}`,
          rarity: "uncommon",
          meshSlot: slot,
          meshVar: v,
          weaponType: slot === "bow" ? "bow" : slot === "staff" ? "staff" : slot === "axe" ? "axe" : slot === "hammer" ? "hammer" : "sword",
        };
      }
    }
    return eq;
  }

  function classTree(classId) {
    return CLASS_SKILL_TREES[normalizeClass(classId)] || CLASS_SKILL_TREES.warrior;
  }

  function weaponBar(weaponType) {
    const t = String(weaponType || "unarmed").toLowerCase();
    return WEAPON_SKILL_BARS[t] || WEAPON_SKILL_BARS.unarmed;
  }

  function hotbarFromClass(classId) {
    const tree = classTree(classId);
    const skills = [];
    for (const tier of tree.tiers) {
      for (const s of tier.skills) {
        if (s.slot != null) skills.push(s);
      }
    }
    return skills.sort((a, b) => (a.slot || 99) - (b.slot || 99)).slice(0, 6);
  }

  global.MainPanelContent = {
    RACES,
    CLASSES,
    RACE_PREFIX,
    CLASS_SKILL_TREES,
    WEAPON_SKILL_BARS,
    PROFESSION_TREES,
    CRAFT_RECIPES,
    STARTER_BAG,
    CLASS_MESH_KITS,
    UNARMED_MESH,
    normalizeClass,
    normalizeRace,
    meshIdsFor,
    model3dToEquipment,
    classTree,
    weaponBar,
    hotbarFromClass,
  };
})(typeof window !== "undefined" ? window : globalThis);
