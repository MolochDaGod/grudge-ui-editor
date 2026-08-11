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
            { id: "warrior.power_strike", n: "Power Strike", d: "150% overhead slash", slot: 1, abbr: "SK" },
            { id: "warrior.shield_bash", n: "Shield Bash", d: "Stun 1.5s", slot: 2, abbr: "SK" },
            { id: "warrior.war_cry", n: "War Cry", d: "AoE taunt", slot: 3, abbr: "SK" },
          ],
        },
        {
          lvl: 10,
          label: "Line",
          skills: [
            { id: "warrior.cleave", n: "Cleave", d: "Wide arc hit", slot: 4, abbr: "SK" },
            { id: "warrior.charge", n: "Charge", d: "Gap closer", slot: 5, abbr: "SK" },
            { id: "warrior.fortify", n: "Fortify", d: "+DEF 8s", slot: 6, abbr: "SK" },
          ],
        },
        {
          lvl: 20,
          label: "Mastery",
          skills: [
            { id: "warrior.execute", n: "Execute", d: "Finisher under 30% HP", slot: null, abbr: "SK" },
            { id: "warrior.bulwark", n: "Bulwark", d: "Party shield wall", slot: null, abbr: "SK" },
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
            { id: "mage.fireball", n: "Fireball", d: "Ranged fire bolt", slot: 1, abbr: "SK" },
            { id: "mage.frost", n: "Frost Bolt", d: "Slow + chip", slot: 2, abbr: "SK" },
            { id: "mage.arcane_shield", n: "Arcane Shield", d: "Absorb barrier", slot: 3, abbr: "SK" },
          ],
        },
        {
          lvl: 10,
          label: "Confluence",
          skills: [
            { id: "mage.chain", n: "Chain Lightning", d: "Jump 3 targets", slot: 4, abbr: "SK" },
            { id: "mage.blink", n: "Blink", d: "Short teleport", slot: 5, abbr: "SK" },
            { id: "mage.meteor", n: "Meteor", d: "AoE delay strike", slot: 6, abbr: "SK" },
          ],
        },
        {
          lvl: 20,
          label: "Arch",
          skills: [
            { id: "mage.time_warp", n: "Time Warp", d: "Haste self 6s", slot: null, abbr: "SK" },
            { id: "mage.nova", n: "Mana Nova", d: "Burst + restore", slot: null, abbr: "SK" },
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
            { id: "ranger.precise", n: "Precise Shot", d: "High accuracy shot", slot: 1, abbr: "SK" },
            { id: "ranger.trap", n: "Spike Trap", d: "Root 2s", slot: 2, abbr: "SK" },
            { id: "ranger.volley", n: "Volley", d: "3-arrow spray", slot: 3, abbr: "SK" },
          ],
        },
        {
          lvl: 10,
          label: "Hunt",
          skills: [
            { id: "ranger.mark", n: "Hunter's Mark", d: "+dmg target", slot: 4, abbr: "SK" },
            { id: "ranger.dash", n: "Sidestep", d: "I-frames dodge", slot: 5, abbr: "SK" },
            { id: "ranger.poison", n: "Poison Arrow", d: "DoT 6s", slot: 6, abbr: "SK" },
          ],
        },
        {
          lvl: 20,
          label: "Master",
          skills: [
            { id: "ranger.rain", n: "Arrow Rain", d: "Ground AoE", slot: null, abbr: "SK" },
            { id: "ranger.camo", n: "Camouflage", d: "Stealth 4s", slot: null, abbr: "SK" },
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
            { id: "worge.rend", n: "Rend", d: "Bleed slash", slot: 1, abbr: "SK" },
            { id: "worge.howl", n: "Howl", d: "Fear pulse", slot: 2, abbr: "SK" },
            { id: "worge.pounce", n: "Pounce", d: "Leap attack", slot: 3, abbr: "SK" },
          ],
        },
        {
          lvl: 10,
          label: "Primal",
          skills: [
            { id: "worge.form", n: "Beast Form", d: "Hybrid morph", slot: 4, abbr: "SK" },
            { id: "worge.thrash", n: "Thrash", d: "Multi-hit", slot: 5, abbr: "SK" },
            { id: "worge.pack", n: "Pack Bond", d: "Ally haste", slot: 6, abbr: "SK" },
          ],
        },
        {
          lvl: 20,
          label: "Alpha",
          skills: [
            { id: "worge.ravage", n: "Ravage", d: "Execute leap", slot: null, abbr: "SK" },
            { id: "worge.totem", n: "Spirit Totem", d: "Heal aura", slot: null, abbr: "SK" },
          ],
        },
      ],
    },
  };
  CLASS_SKILL_TREES.worg = CLASS_SKILL_TREES.worge;

  /** Weapon skill bars by equipped weapon type. */
  const WEAPON_SKILL_BARS = {
    sword: [
      { id: "ws.slash", n: "Slash", d: "Light chain", abbr: "SK", slot: 1 },
      { id: "ws.riposte", n: "Riposte", d: "Parry counter", abbr: "SK", slot: 2 },
      { id: "ws.overhead", n: "Overhead", d: "Heavy", abbr: "SK", slot: 3 },
      { id: "ws.thrust", n: "Thrust", d: "Pierce", abbr: "SK", slot: 4 },
    ],
    shield: [
      { id: "ws.block", n: "Block", d: "Hold guard", abbr: "SK", slot: 1 },
      { id: "ws.bash", n: "Bash", d: "Stun", abbr: "SK", slot: 2 },
    ],
    bow: [
      { id: "ws.shot", n: "Shot", d: "Standard", abbr: "SK", slot: 1 },
      { id: "ws.aimed", n: "Aimed", d: "Charge", abbr: "SK", slot: 2 },
      { id: "ws.scatter", n: "Scatter", d: "Cone", abbr: "SK", slot: 3 },
      { id: "ws.retreat", n: "Retreat Shot", d: "Backstep", abbr: "SK", slot: 4 },
    ],
    staff: [
      { id: "ws.bolt", n: "Bolt", d: "School bolt", abbr: "SK", slot: 1 },
      { id: "ws.channel", n: "Channel", d: "Beam", abbr: "SK", slot: 2 },
      { id: "ws.burst", n: "Burst", d: "AoE", abbr: "SK", slot: 3 },
      { id: "ws.ward", n: "Ward", d: "Shield", abbr: "SK", slot: 4 },
    ],
    axe: [
      { id: "ws.hack", n: "Hack", d: "Heavy chop", abbr: "SK", slot: 1 },
      { id: "ws.whirl", n: "Whirl", d: "Spin", abbr: "SK", slot: 2 },
      { id: "ws.cleave", n: "Cleave", d: "Arc", abbr: "SK", slot: 3 },
    ],
    hammer: [
      { id: "ws.smash", n: "Smash", d: "Ground pound", abbr: "SK", slot: 1 },
      { id: "ws.quake", n: "Quake", d: "Shockwave", abbr: "SK", slot: 2 },
    ],
    unarmed: [
      { id: "ws.jab", n: "Jab", d: "Quick hit", abbr: "SK", slot: 1 },
      { id: "ws.hook", n: "Hook", d: "Heavy", abbr: "SK", slot: 2 },
      { id: "ws.kick", n: "Kick", d: "Stagger", abbr: "SK", slot: 3 },
    ],
  };

  /**
   * Profession trees — stub until WcsProfessions.loadCatalog() installs WCS SSOT.
   * Canonical source: warlords-crafting-suite client/src/data/{miner,forester,engineer,mystic,chef}.ts
   * Runtime: wcs-professions-ssot.js + data/wcs-professions.json
   */
  let PROFESSION_TREES = {
    miner: { name: "Miner", abbr: "SK", color: "#f59e0b", nodes: [] },
    forester: { name: "Forester", abbr: "SK", color: "#22c55e", nodes: [] },
    engineer: { name: "Engineer", abbr: "SK", color: "#fb923c", nodes: [] },
    mystic: { name: "Mystic", abbr: "SK", color: "#a78bfa", nodes: [] },
    chef: { name: "Chef", abbr: "SK", color: "#f97316", nodes: [] },
  };

  /** Quick craft recipes (ObjectStore-shaped). */
  const CRAFT_RECIPES = [
    {
      id: "iron_ingot",
      name: "Iron Ingot",
      profession: "smith",
      abbr: "SK",
      inputs: [{ id: "ore_iron", name: "Iron Ore", qty: 3 }],
      output: { id: "ingot_iron", name: "Iron Ingot", qty: 1 },
      timeSec: 4,
    },
    {
      id: "healing_tonic",
      name: "Healing Tonic",
      profession: "chef",
      abbr: "SK",
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
      abbr: "SK",
      inputs: [{ id: "plank", name: "Plank", qty: 8 }],
      output: { id: "shield_wood", name: "Wooden Shield", qty: 1 },
      timeSec: 8,
    },
    {
      id: "mana_dust",
      name: "Mana Dust",
      profession: "mystic",
      abbr: "SK",
      inputs: [{ id: "crystal_shard", name: "Crystal Shard", qty: 1 }],
      output: { id: "dust_mana", name: "Mana Dust", qty: 2 },
      timeSec: 2,
    },
    {
      id: "iron_sword",
      name: "Iron Cutlass",
      profession: "smith",
      abbr: "SK",
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
      abbr: "SK",
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
      abbr: "SK",
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
      abbr: "SK",
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
    { id: "ore_iron", name: "Iron Ore", qty: 12, abbr: "SK", tier: 1, slot: "material" },
    { id: "plank", name: "Plank", qty: 16, abbr: "SK", tier: 1, slot: "material" },
    { id: "herb_green", name: "Green Herb", qty: 8, abbr: "SK", tier: 1, slot: "material" },
    { id: "water", name: "Water", qty: 6, abbr: "SK", tier: 1, slot: "material" },
    { id: "crystal_shard", name: "Crystal Shard", qty: 3, abbr: "SK", tier: 2, slot: "material" },
    { id: "leather", name: "Leather", qty: 10, abbr: "SK", tier: 1, slot: "material" },
    { id: "string", name: "Bowstring", qty: 4, abbr: "SK", tier: 1, slot: "material" },
    { id: "stone", name: "Stone", qty: 20, abbr: "SK", tier: 1, slot: "material" },
    { id: "food_bread", name: "Bread", qty: 5, abbr: "SK", tier: 1, slot: "consumable" },
    { id: "tool_stone_axe", name: "Stone Axe", qty: 1, abbr: "SK", tier: 1, slot: "tool" },
  ];

  /**
   * mesh_ids — Warlords SSOT only (warlords-character-ssot.js).
   * No invented letter kits; exact GLB node names per race×class.
   */
  function normalizeClass(cls) {
    if (global.WarlordsCharacter?.normalizeClass) {
      return global.WarlordsCharacter.normalizeClass(cls);
    }
    const c = String(cls || "warrior").toLowerCase();
    if (c === "worg" || c === "worge" || c === "knight") return "warrior";
    if (c === "archer") return "ranger";
    if (c === "wizard") return "mage";
    return c === "mage" || c === "ranger" || c === "unarmed" ? c : "warrior";
  }

  function normalizeRace(race) {
    if (global.WarlordsCharacter?.normalizeRace) {
      return global.WarlordsCharacter.normalizeRace(race);
    }
    const r = String(race || "human").toLowerCase().replace(/[^a-z]/g, "");
    if (r.includes("barb")) return "barbarian";
    if (r.includes("dwarf")) return "dwarf";
    if (r.includes("elf")) return "elf";
    if (r.includes("orc")) return "orc";
    if (r.includes("undead") || r === "ud") return "undead";
    return "human";
  }

  function meshIdsFor(race, classId, unarmed) {
    if (global.WarlordsCharacter?.meshIdsFor) {
      return global.WarlordsCharacter.meshIdsFor(race, classId, unarmed);
    }
    // Minimal WK warrior fallback if SSOT script missing
    return {
      prefix: "WK_",
      kit: { weaponType: "sword" },
      meshIds: [
        "WK_Units_head_D",
        "WK_Units_Body_C",
        "WK_Units_Arms_B",
        "WK_Units_Legs_B",
        "WK_Units_shoulderpads_A",
        "WK_weapon_sword_B",
        "WK_Shield_B",
      ],
      weaponType: "sword",
      kitGlb: "https://assets.grudge-studio.com/models/grudge6/races/WK_Characters.glb",
    };
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
    normalizeClass,
    normalizeRace,
    meshIdsFor,
    model3dToEquipment,
    classTree,
    weaponBar,
    hotbarFromClass,
  };
})(typeof window !== "undefined" ? window : globalThis);

