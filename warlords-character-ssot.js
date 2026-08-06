/**
 * warlords-character-ssot.js — Warlords grudge6 heroes (matches GRUDGE6_Characters lab).
 *
 * GOLDEN kit (info.grudge-studio.com/GRUDGE6_Characters.html default):
 *   asset-packs/toon-rts-characters/glb/characters/{raceId}.glb
 *   → keep embedded textures (never force-atlas rebind)
 *
 * Compare bake only (not visual SSOT until it matches Toon):
 *   models/grudge6/races/{PREFIX}_Characters.glb
 *
 * PURGE:
 *   - models/grudge6/metaverse/* as play default
 *   - models/characters/grudge6/*
 *   - FBX as browser play default
 *   - forceAtlas on good Toon/prod GLBs
 *   - whole-body GLB swap for equip
 */
(function (global) {
  "use strict";

  var CDN = "https://assets.grudge-studio.com";
  var HUMAN_HEIGHT_M = 1.8;
  var VERSION = "2026-08-06.toon-rts-golden";
  var LAB = "https://info.grudge-studio.com/GRUDGE6_Characters.html";
  var TOON_RTS_CHAR = CDN + "/asset-packs/toon-rts-characters/glb/characters";

  /** Short race id → GOLDEN Toon RTS kit + stone atlas (fallback only). */
  var RACES = {
    human: {
      id: "human",
      prefix: "WK_",
      label: "Western Kingdoms",
      /** GOLDEN — same as Characters lab activeSource=toonRts */
      kitGlb: TOON_RTS_CHAR + "/human.glb",
      kitProdCompare: CDN + "/models/grudge6/races/WK_Characters.glb",
      atlasUrl: CDN + "/textures/grudge6/western-kingdoms/WK_Standard_Units.webp",
      source: "toonRts",
    },
    barbarian: {
      id: "barbarian",
      prefix: "BRB_",
      label: "Barbarians",
      kitGlb: TOON_RTS_CHAR + "/barbarian.glb",
      kitProdCompare: CDN + "/models/grudge6/races/BRB_Characters.glb",
      atlasUrl: CDN + "/textures/grudge6/barbarians/BRB_StandardUnits_texture.webp",
      source: "toonRts",
    },
    elf: {
      id: "elf",
      prefix: "ELF_",
      label: "High Elves",
      kitGlb: TOON_RTS_CHAR + "/elf.glb",
      kitProdCompare: CDN + "/models/grudge6/races/ELF_Characters.glb",
      atlasUrl: CDN + "/textures/grudge6/elves/ELF_HighElves_Texture.webp",
      source: "toonRts",
    },
    dwarf: {
      id: "dwarf",
      prefix: "DWF_",
      label: "Dwarves",
      kitGlb: TOON_RTS_CHAR + "/dwarf.glb",
      kitProdCompare: CDN + "/models/grudge6/races/DWF_Characters.glb",
      atlasUrl: CDN + "/textures/grudge6/dwarves/DWF_Standard_Units.webp",
      source: "toonRts",
    },
    orc: {
      id: "orc",
      prefix: "ORC_",
      label: "Orcs",
      kitGlb: TOON_RTS_CHAR + "/orc.glb",
      kitProdCompare: CDN + "/models/grudge6/races/ORC_Characters.glb",
      atlasUrl: CDN + "/textures/grudge6/orcs/ORC_StandardUnits.webp",
      source: "toonRts",
    },
    undead: {
      id: "undead",
      prefix: "UD_",
      label: "Undead",
      kitGlb: TOON_RTS_CHAR + "/undead.glb",
      kitProdCompare: CDN + "/models/grudge6/races/UD_Characters.glb",
      atlasUrl: CDN + "/textures/grudge6/undead/UD_Standard_Units.webp",
      source: "toonRts",
    },
  };

  /**
   * Exact mesh node names from production GLBs (verified 2026-08).
   * Keys: race short id → class id → { meshIds, animPack, weaponType }
   */
  var LOADOUTS = {
    human: {
      warrior: {
        animPack: "sword_shield",
        weaponType: "sword",
        meshIds: [
          "WK_Units_head_D",
          "WK_Units_Body_C",
          "WK_Units_Arms_B",
          "WK_Units_Legs_B",
          "WK_Units_shoulderpads_A",
          "WK_weapon_sword_B",
          "WK_Shield_B",
        ],
      },
      mage: {
        animPack: "magic",
        weaponType: "staff",
        meshIds: [
          "WK_Units_head_A",
          "WK_Units_Body_A",
          "WK_Units_Arms_A",
          "WK_Units_Legs_A",
          "WK_weapon_staff_C",
        ],
      },
      ranger: {
        animPack: "longbow",
        weaponType: "bow",
        meshIds: [
          "WK_Units_head_C",
          "WK_Units_Body_B",
          "WK_Units_Arms_B",
          "WK_Units_Legs_B",
          "WK_weapon_Bow",
          "WK_Xtra_quiver",
        ],
      },
      unarmed: {
        animPack: "unarmed",
        weaponType: "unarmed",
        meshIds: [
          "WK_Units_head_A",
          "WK_Units_Body_B",
          "WK_Units_Arms_A",
          "WK_Units_Legs_A",
        ],
      },
    },
    barbarian: {
      warrior: {
        animPack: "sword_shield",
        weaponType: "sword",
        meshIds: [
          "BRB_head_B",
          "BRB_body_C",
          "BRB_arms_B",
          "BRB_legs_B",
          "BRB_shoulderpads_B",
          "BRB_weapon_sword_B",
          "BRB_Shield_B",
        ],
      },
      mage: {
        animPack: "magic",
        weaponType: "staff",
        meshIds: ["BRB_head_A", "BRB_body_A", "BRB_arms_A", "BRB_legs_A", "BRB_weapon_staff_C"],
      },
      ranger: {
        animPack: "longbow",
        weaponType: "bow",
        meshIds: [
          "BRB_head_C",
          "BRB_body_B",
          "BRB_arms_B",
          "BRB_legs_B",
          "BRB_shoulderpads_A",
          "BRB_weapon_Bow",
          "BRB_Xtra_quiver",
        ],
      },
      unarmed: {
        animPack: "unarmed",
        weaponType: "unarmed",
        meshIds: ["BRB_head_A", "BRB_body_B", "BRB_arms_A", "BRB_legs_A"],
      },
    },
    elf: {
      warrior: {
        animPack: "sword_shield",
        weaponType: "sword",
        meshIds: [
          "ELF_Units_Head_D",
          "ELF_Units_Body_C",
          "ELF_Units_Arms_B",
          "ELF_Units_Legs_B",
          "ELF_Units_Shoulderpads_B",
          "ELF_weapon_sword_B",
          "ELF_shield_B",
        ],
      },
      mage: {
        animPack: "magic",
        weaponType: "staff",
        meshIds: [
          "ELF_Units_Head_B",
          "ELF_Units_Body_A",
          "ELF_Units_Arms_A",
          "ELF_Units_Legs_A",
          "ELF_weapon_staff_C",
        ],
      },
      ranger: {
        animPack: "longbow",
        weaponType: "bow",
        meshIds: [
          "ELF_Units_Head_C",
          "ELF_Units_Body_B",
          "ELF_Units_Arms_B",
          "ELF_Units_Legs_B",
          "ELF_Units_Shoulderpads_A",
          "ELF_weapon_bow",
          "ELF_Xtra_quiver",
        ],
      },
      unarmed: {
        animPack: "unarmed",
        weaponType: "unarmed",
        meshIds: [
          "ELF_Units_Head_A",
          "ELF_Units_Body_B",
          "ELF_Units_Arms_A",
          "ELF_Units_Legs_A",
        ],
      },
    },
    dwarf: {
      warrior: {
        animPack: "sword_shield",
        weaponType: "sword",
        meshIds: [
          "DWF_Units_Head_G",
          "DWF_Units_Body_C",
          "DWF_Units_Arms_B",
          "DWF_Units_Legs_B",
          "DWF_Units_Shoulderpads_B",
          "DWF_Weapon_sword_B",
          "DWF_Shield_B",
        ],
      },
      mage: {
        animPack: "magic",
        weaponType: "staff",
        meshIds: [
          "DWF_Units_Head_A",
          "DWF_Units_Body_A",
          "DWF_Units_Arms_A",
          "DWF_Units_Legs_A",
          "DWF_Weapon_staff_B",
        ],
      },
      ranger: {
        animPack: "longbow",
        weaponType: "bow",
        meshIds: [
          "DWF_Units_Head_C",
          "DWF_Units_Body_B",
          "DWF_Units_Arms_B",
          "DWF_Units_Legs_B",
          "DWF_Units_Shoulderpads_A",
          "DWF_Weapon_bow",
          "DWF_Xtra_quiver",
        ],
      },
      unarmed: {
        animPack: "unarmed",
        weaponType: "unarmed",
        meshIds: [
          "DWF_Units_Head_A",
          "DWF_Units_Body_B",
          "DWF_Units_Arms_A",
          "DWF_Units_Legs_A",
        ],
      },
    },
    orc: {
      warrior: {
        animPack: "2h_melee",
        weaponType: "axe",
        meshIds: [
          "ORC_Units_Head_E",
          "ORC_Units_Body_C",
          "ORC_Units_Arms_B",
          "ORC_Units_Legs_B",
          "ORC_Units_Shoulderpads_C",
          "ORC_weapon_Axe_B",
          "ORC_Shield_C",
        ],
      },
      mage: {
        animPack: "magic",
        weaponType: "staff",
        meshIds: [
          "ORC_Units_Head_A",
          "ORC_Units_Body_A",
          "ORC_Units_Arms_A",
          "ORC_Units_Legs_A",
          "ORC_weapon_staff_C",
        ],
      },
      ranger: {
        animPack: "longbow",
        weaponType: "bow",
        meshIds: [
          "ORC_Units_Head_B",
          "ORC_Units_Body_B",
          "ORC_Units_Arms_B",
          "ORC_Units_Legs_B",
          "ORC_Units_Shoulderpads_A",
          "ORC_weapon_Bow",
          "ORC_Xtra_quiver",
        ],
      },
      unarmed: {
        animPack: "unarmed",
        weaponType: "unarmed",
        meshIds: [
          "ORC_Units_Head_A",
          "ORC_Units_Body_A",
          "ORC_Units_Arms_A",
          "ORC_Units_Legs_A",
        ],
      },
    },
    undead: {
      warrior: {
        animPack: "sword_shield",
        weaponType: "sword",
        meshIds: [
          "UD_Units_head_G",
          "UD_Units_body_D",
          "UD_Units_arms_C",
          "UD_Units_legs_C",
          "UD_Units_shoulderpads_B",
          "UD_weapon_Sword_B",
          "UD_Shield_C",
        ],
      },
      mage: {
        animPack: "magic",
        weaponType: "staff",
        meshIds: [
          "UD_Units_head_A",
          "UD_Units_body_G",
          "UD_Units_arms_B",
          "UD_Units_legs_B",
          "UD_weapon_staff_D",
        ],
      },
      ranger: {
        animPack: "longbow",
        weaponType: "bow",
        meshIds: [
          "UD_Units_head_C",
          "UD_Units_body_B",
          "UD_Units_arms_B",
          "UD_Units_legs_B",
          "UD_Units_shoulderpads_A",
          "UD_weapon_Bow",
          "UD_Xtra_Quiver",
        ],
      },
      unarmed: {
        animPack: "unarmed",
        weaponType: "unarmed",
        meshIds: [
          "UD_Units_head_A",
          "UD_Units_body_B",
          "UD_Units_arms_A",
          "UD_Units_legs_A",
        ],
      },
    },
  };

  // Class aliases (Warlords UI)
  function normalizeClass(cls) {
    var c = String(cls || "warrior").toLowerCase();
    if (c === "worg" || c === "worge" || c === "knight" || c === "berserker") return "warrior";
    if (c === "archer" || c === "hunter") return "ranger";
    if (c === "wizard" || c === "lich" || c === "shaman") return "mage";
    if (c === "unarmed" || c === "brawler" || c === "risen") return "unarmed";
    if (LOADOUTS.human[c]) return c;
    return "warrior";
  }

  function normalizeRace(race) {
    var r = String(race || "human").toLowerCase().replace(/[^a-z-]/g, "");
    if (r.includes("barb") || r === "barbarians") return "barbarian";
    if (r.includes("dwarf") || r === "dwarves") return "dwarf";
    if (r.includes("elf") || r === "highelves" || r === "high-elves") return "elf";
    if (r.includes("orc") || r === "orcs") return "orc";
    if (r.includes("undead") || r === "ud") return "undead";
    if (r.includes("western") || r === "wk" || r === "human") return "human";
    return "human";
  }

  function getRace(race) {
    return RACES[normalizeRace(race)] || RACES.human;
  }

  function getLoadout(race, classId, unarmed) {
    var raceN = normalizeRace(race);
    var classN = unarmed ? "unarmed" : normalizeClass(classId);
    var byRace = LOADOUTS[raceN] || LOADOUTS.human;
    var lo = byRace[classN] || byRace.warrior || byRace.unarmed;
    return {
      raceId: raceN,
      classId: classN,
      prefix: (RACES[raceN] || RACES.human).prefix,
      kitGlb: (RACES[raceN] || RACES.human).kitGlb,
      atlasUrl: (RACES[raceN] || RACES.human).atlasUrl,
      meshIds: (lo.meshIds || []).slice(),
      animPack: lo.animPack || "sword_shield",
      weaponType: lo.weaponType || "sword",
    };
  }

  /** mesh_ids for panel / EquipmentManager (simple API). */
  function meshIdsFor(race, classId, unarmed) {
    var lo = getLoadout(race, classId, unarmed);
    return {
      prefix: lo.prefix,
      kit: { weaponType: lo.weaponType },
      meshIds: lo.meshIds,
      weaponType: lo.weaponType,
      kitGlb: lo.kitGlb,
      atlasUrl: lo.atlasUrl,
      animPack: lo.animPack,
    };
  }

  function meshKey(name) {
    return String(name || "")
      .toLowerCase()
      .replace(/^wk_|^brb_|^orc_|^elf_|^ud_|^dwf_/, "")
      .replace(/units_/g, "")
      .replace(/xtra_/g, "")
      .replace(/weapon_/g, "weapon")
      .replace(/shield_/g, "shield")
      .replace(/shoulderpads_/g, "shoulders")
      .replace(/[^a-z0-9]/g, "");
  }

  function meshMatchesId(meshName, meshId) {
    if (!meshName || !meshId) return false;
    if (meshName === meshId) return true;
    if (meshName.endsWith(meshId) || meshId.endsWith(meshName)) return true;
    var a = meshKey(meshName);
    var b = meshKey(meshId);
    return a === b || a.endsWith(b) || b.endsWith(a);
  }

  /** Apply mesh_ids: hide all → show matches only. */
  function applyMeshIds(root, meshIds) {
    var wanted = (meshIds || []).map(String).filter(Boolean);
    var all = [];
    root.traverse(function (o) {
      if (o.isMesh || o.isSkinnedMesh) all.push(o);
    });
    for (var i = 0; i < all.length; i++) all[i].visible = false;
    var matched = [];
    var missing = [];
    for (var w = 0; w < wanted.length; w++) {
      var hit = null;
      for (var m = 0; m < all.length; m++) {
        if (meshMatchesId(all[m].name, wanted[w])) {
          hit = all[m];
          break;
        }
      }
      if (hit) {
        hit.visible = true;
        matched.push(hit.name);
      } else missing.push(wanted[w]);
    }
    // Safe fallback: body A only (never all variants)
    if (!matched.length) {
      for (var j = 0; j < all.length; j++) {
        var n = all[j].name || "";
        if (/weapon|shield|bag|quiver|wood/i.test(n)) continue;
        if (/Body_A|body_A|Units_Body_A/i.test(n)) all[j].visible = true;
        else if (/Arms_A|arms_A/i.test(n)) all[j].visible = true;
        else if (/Legs_A|legs_A/i.test(n)) all[j].visible = true;
        else if (/head_A|Head_A|Units_head_A/i.test(n)) all[j].visible = true;
      }
    }
    return { matched: matched, missing: missing };
  }

  var BLOCKED = [
    "models/characters/grudge6/",
    "models/grudge6/metaverse/",
    "models/grudge6/atlases/",
    "Characters_customizable",
    "30characters.glb",
  ];

  function isBlockedUrl(url) {
    var s = String(url || "");
    for (var i = 0; i < BLOCKED.length; i++) {
      if (s.indexOf(BLOCKED[i]) >= 0) return true;
    }
    return false;
  }

  /** Full equip part lists from production GLBs (optional). */
  var _meshCatalog = null;
  function loadMeshCatalog() {
    if (_meshCatalog) return Promise.resolve(_meshCatalog);
    return fetch("./data/warlords-mesh-catalog.json", { cache: "force-cache" })
      .then(function (r) {
        return r.ok ? r.json() : null;
      })
      .then(function (j) {
        _meshCatalog = j;
        return j;
      })
      .catch(function () {
        return null;
      });
  }

  /**
   * uMMORPG-style paperdoll → mesh_ids.
   * slots: { head, body, arms, legs, shoulders, weapon, offhand }
   * Values are full mesh node names (e.g. WK_Units_Body_C).
   */
  function paperdollToMeshIds(race, slots) {
    var raceN = normalizeRace(race);
    var def = RACES[raceN] || RACES.human;
    var base = getLoadout(raceN, "unarmed", true).meshIds.slice();
    var ids = base.slice();
    function replaceGroup(pred, nextId) {
      ids = ids.filter(function (id) {
        return !pred(id);
      });
      if (nextId) ids.push(nextId);
    }
    slots = slots || {};
    if (slots.head) replaceGroup(function (id) { return /head|Head/i.test(id); }, slots.head);
    if (slots.body) replaceGroup(function (id) { return /Body|body/i.test(id); }, slots.body);
    if (slots.arms) replaceGroup(function (id) { return /Arms|arms/i.test(id); }, slots.arms);
    if (slots.legs) replaceGroup(function (id) { return /Legs|legs/i.test(id); }, slots.legs);
    if (slots.shoulders)
      replaceGroup(function (id) { return /shoulder|Shoulder/i.test(id); }, slots.shoulders);
    if (slots.weapon) replaceGroup(function (id) { return /weapon/i.test(id); }, slots.weapon);
    if (slots.offhand || slots.shield)
      replaceGroup(function (id) { return /shield|Shield/i.test(id); }, slots.offhand || slots.shield);
    return {
      raceId: raceN,
      prefix: def.prefix,
      kitGlb: def.kitGlb,
      atlasUrl: def.atlasUrl,
      meshIds: ids,
    };
  }

  global.WarlordsCharacter = {
    VERSION: VERSION,
    CDN: CDN,
    LAB: LAB,
    TOON_RTS_CHAR: TOON_RTS_CHAR,
    HUMAN_HEIGHT_M: HUMAN_HEIGHT_M,
    /** Always prefer Toon RTS pack for fleet play / panel. */
    GOLDEN_SOURCE: "toonRts",
    RACES: RACES,
    LOADOUTS: LOADOUTS,
    normalizeRace: normalizeRace,
    normalizeClass: normalizeClass,
    getRace: getRace,
    getLoadout: getLoadout,
    meshIdsFor: meshIdsFor,
    meshKey: meshKey,
    meshMatchesId: meshMatchesId,
    applyMeshIds: applyMeshIds,
    isBlockedUrl: isBlockedUrl,
    BLOCKED: BLOCKED,
    loadMeshCatalog: loadMeshCatalog,
    paperdollToMeshIds: paperdollToMeshIds,
    get meshCatalog() {
      return _meshCatalog;
    },
  };

  // Bridge: keep MainPanelContent.meshIdsFor accurate if content loaded first/later
  function installIntoMainPanel() {
    var MPC = global.MainPanelContent;
    if (!MPC) return;
    MPC.meshIdsFor = function (race, classId, unarmed) {
      return meshIdsFor(race, classId, unarmed);
    };
    MPC.normalizeRace = normalizeRace;
    MPC.normalizeClass = function (c) {
      return normalizeClass(c);
    };
    MPC.RACE_PREFIX = {
      human: "WK_",
      barbarian: "BRB_",
      dwarf: "DWF_",
      elf: "ELF_",
      orc: "ORC_",
      undead: "UD_",
    };
    MPC.WARLORDS_CHARACTER = true;
  }
  installIntoMainPanel();
  if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", installIntoMainPanel);
  }
})(typeof window !== "undefined" ? window : globalThis);
