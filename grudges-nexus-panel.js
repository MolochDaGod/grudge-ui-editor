/**
 * Grudges world data for ui.grudge-studio.com/main-panel.html?era=nexus
 *
 * Stats SSOT: grudges.grudge-studio.com/api/stats/*  (BIO…GRA)
 * Items: ObjectStore weapons/armor + Grudges ITEM_DATABASE starter kit
 * Roster: Grudges Railway via /api/grudges/* (same-origin proxy)
 *
 * Does not replace Warlords Railway bag. Product play era for Grudges
 * characters remains voxel; this panel is the Nexus-stat sheet.
 */
(function (global) {
  "use strict";

  var GRUDGES = "https://grudges.grudge-studio.com";
  var GAME = GRUDGES + "/arpg-game";
  var CDN = "https://assets.grudge-studio.com";
  var OS = "https://objectstore.grudge-studio.com/api/v1";
  var SURVIVAL_API = "https://survival-api-production.up.railway.app";

  var STAT_COST = [0, 1, 2, 4, 8, 16, 20];
  var STAT_MAX = 6;
  var START_BUDGET = 24;
  var KEYS = ["bio", "neu", "kin", "qnt", "syn", "chr", "ent", "gra"];
  var VOXEL_STARTER = { bio: 1, neu: 1, kin: 1, qnt: 0, syn: 0, chr: 0, ent: 0, gra: 0 };

  var FALLBACK_PRIMARY = [
    { key: "bio", abbr: "BIO", label: "Biomass", color: "#4caf50", description: "Max health, healing, toxin resist, harvest yields.", archetype: "Survivor / Medic" },
    { key: "neu", abbr: "NEU", label: "Neural Integrity", color: "#00bcd4", description: "Sanity, gadgets, stealth, perception.", archetype: "Hacker / Scout" },
    { key: "kin", abbr: "KIN", label: "Kinetic Efficiency", color: "#ff9800", description: "Melee damage, stamina, movement.", archetype: "Bladesman / Sprinter" },
    { key: "qnt", abbr: "QNT", label: "Quantum Aptitude", color: "#9c27b0", description: "Salvage, rare drops, anomaly tech.", archetype: "Salvager" },
    { key: "syn", abbr: "SYN", label: "Synthetic Affinity", color: "#2196f3", description: "Turrets, builds, drones, hires.", archetype: "Architect" },
    { key: "chr", abbr: "CHR", label: "Chronal Stability", color: "#c9a000", description: "Time-slip, echo strike, causality.", archetype: "Chrono-Op" },
    { key: "ent", abbr: "ENT", label: "Entropic Resistance", color: "#f44336", description: "Durability, decay, salvage quality.", archetype: "Reclaimer" },
    { key: "gra", abbr: "GRA", label: "Gravitic Harmony", color: "#009688", description: "Fall resist, wall-run, zero-G.", archetype: "Orbital" },
  ];

  var PROFESSIONS = [
    { id: "gathering", name: "Gathering", desc: "Forestry, mining, salvage nodes" },
    { id: "hunting", name: "Hunting", desc: "Skinning, tracking, bait" },
    { id: "crafting", name: "Crafting", desc: "Weapons, armor, gadgets" },
    { id: "township", name: "Township", desc: "Camp → Stronghold build ladder" },
    { id: "survival", name: "Survival", desc: "Cooking, camping, cold/heat" },
    { id: "chemistry", name: "Chemistry", desc: "Potions, distill, explosives" },
    { id: "combat", name: "Combat", desc: "Weapon trees and stances" },
  ];

  /** Starter kit from Grudges ITEM_DATABASE (arpg-game/src/game/Items.ts). */
  var STARTER_DEFS = [
    { id: "leather_cap", name: "Leather Cap", slot: "helmet", rarity: "common", icon: "/icons/cyberpunk-weapons/Icon1_09.png", stats: { armor: 4, health: 8 }, description: "Basic head protection." },
    { id: "iron_helm", name: "Iron Helm", slot: "helmet", rarity: "uncommon", icon: "/icons/cyberpunk-weapons/Icon1_15.png", stats: { armor: 10, health: 15 }, description: "Sturdy iron helmet." },
    { id: "cloth_tunic", name: "Cloth Tunic", slot: "chest", rarity: "common", icon: "/icons/cyberpunk-weapons/Icon1_14.png", stats: { armor: 6, mana: 10 }, description: "Simple cloth shirt." },
    { id: "iron_breastplate", name: "Iron Breastplate", slot: "chest", rarity: "uncommon", icon: "/icons/cyberpunk-weapons/Icon1_11.png", stats: { armor: 22, health: 30 }, description: "Heavy iron chest armor." },
    { id: "leather_pants", name: "Leather Pants", slot: "legs", rarity: "common", icon: "/icons/cyberpunk-weapons/Icon1_12.png", stats: { armor: 5, moveSpeed: 2 }, description: "Worn leather leggings." },
    { id: "iron_greaves", name: "Iron Greaves", slot: "legs", rarity: "uncommon", icon: "/icons/cyberpunk-weapons/Icon1_13.png", stats: { armor: 14, health: 20 }, description: "Heavy leg plates." },
    { id: "leather_boots", name: "Leather Boots", slot: "boots", rarity: "common", icon: "/icons/cyberpunk-weapons/Icon1_17.png", stats: { armor: 3, moveSpeed: 3 }, description: "Soft walking boots." },
    { id: "swift_treads", name: "Swift Treads", slot: "boots", rarity: "uncommon", icon: "/icons/cyberpunk-weapons/Icon1_25.png", stats: { armor: 5, moveSpeed: 10 }, description: "Lighter than air." },
    { id: "wooden_shield", name: "Wooden Shield", slot: "offhand", rarity: "common", icon: "/icons/cyberpunk-weapons/Icon1_19.png", stats: { armor: 8, health: 10 }, description: "Simple roundshield." },
    { id: "iron_shield", name: "Iron Shield", slot: "offhand", rarity: "uncommon", icon: "/icons/cyberpunk-weapons/Icon1_20.png", stats: { armor: 18 }, description: "Bound in iron." },
    { id: "copper_ring", name: "Copper Ring", slot: "ring", rarity: "common", icon: "/icons/genetics/Icon11_22.png", stats: { health: 10 }, description: "Simple copper band." },
    { id: "bone_charm", name: "Bone Charm", slot: "amulet", rarity: "common", icon: "/icons/genetics/Icon11_01.png", stats: { health: 12 }, description: "A small bone trinket." },
    { id: "amulet_of_focus", name: "Amulet of Focus", slot: "amulet", rarity: "uncommon", icon: "/icons/genetics/Icon11_15.png", stats: { mana: 25 }, description: "Sharpens the mind." },
    { id: "field_bandage", name: "Field Bandage", slot: null, rarity: "common", icon: "/icons/pack/misc/Effect.png", stats: { health: 40 }, description: "BIO-driven field heal.", qty: 4 },
    { id: "ration", name: "Ration Pack", slot: null, rarity: "common", icon: "/icons/pack/misc/Effect.png", stats: {}, description: "Dried meat + rootstock.", qty: 3 },
  ];

  var STARTER_EQUIP_IDS = {
    helmet: "leather_cap",
    chest: "iron_breastplate",
    legs: "leather_pants",
    boots: "leather_boots",
    offhand: "wooden_shield",
    amulet: "bone_charm",
  };

  var WEAPON_CATS = /sword|axe|dagger|hammer|spear|bow|crossbow|gun|rifle|pistol|staff|wand|mace/i;
  var HELM_CATS = /helm|head|hood|cap|crown/i;
  var CHEST_CATS = /chest|torso|plate|robe|tunic|armor/i;
  var LEG_CATS = /leg|greave|pant/i;
  var BOOT_CATS = /boot|foot|sabaton|tread/i;
  var SHIELD_CATS = /shield|offhand|focus/i;
  var RING_CATS = /ring|band/i;
  var AMULET_CATS = /amulet|charm|pendant|neck/i;

  var state = {
    primary: FALLBACK_PRIMARY.slice(),
    catalogSource: "fallback",
    items: [],
    bagSource: "Grudges starter kit",
    effects: [],
  };

  function iconUrl(p) {
    if (!p) return CDN + "/icons/pack/misc/Effect.png";
    if (/^(https?:|data:|blob:)/i.test(p)) return p;
    if (p.indexOf("/icons/cyberpunk") === 0 || p.indexOf("/icons/genetics") === 0) return GAME + p;
    if (p.charAt(0) === "/") return CDN + p;
    return CDN + "/" + p;
  }

  function slotFor(it, cat) {
    var s = String(it.slot || it.equipSlot || it.gear || "").toLowerCase();
    if (s === "helm" || s === "head") return "helmet";
    if (s === "mainhand" || s === "main-hand" || s === "weapon") return "weapon";
    if (s === "offhand" || s === "off-hand") return "offhand";
    if (s === "chest" || s === "legs" || s === "boots" || s === "ring" || s === "amulet" || s === "helmet") return s;
    var blob = (cat + " " + (it.id || "") + " " + (it.name || "") + " " + (it.category || "")).toLowerCase();
    if (HELM_CATS.test(blob)) return "helmet";
    if (BOOT_CATS.test(blob)) return "boots";
    if (LEG_CATS.test(blob)) return "legs";
    if (CHEST_CATS.test(blob) && !WEAPON_CATS.test(blob)) return "chest";
    if (SHIELD_CATS.test(blob)) return "offhand";
    if (RING_CATS.test(blob)) return "ring";
    if (AMULET_CATS.test(blob)) return "amulet";
    if (WEAPON_CATS.test(blob)) return "weapon";
    return null;
  }

  function rarityFromTier(tier) {
    var t = Number(tier) || 1;
    if (t >= 7) return "legendary";
    if (t >= 5) return "epic";
    if (t >= 3) return "rare";
    if (t >= 2) return "uncommon";
    return "common";
  }

  function flattenCatalog(doc, fallbackSlot) {
    var out = [];
    var cats = (doc && doc.categories) || {};
    Object.keys(cats).forEach(function (cat) {
      var block = cats[cat] || {};
      var items = block.items || [];
      items.slice(0, 4).forEach(function (it) {
        if (!it || !it.id) return;
        var slot = slotFor(it, cat) || fallbackSlot;
        var st = it.stats || {};
        out.push({
          id: it.id,
          name: it.name || it.id,
          slot: slot,
          equipSlot: slot,
          rarity: rarityFromTier(it.tier || 1),
          iconUrl: iconUrl(it.spritePath || it.icon || it.iconUrl),
          stats: {
            damage: st.damageBase,
            armor: st.defenseBase,
            crit: st.critBase,
            speed: st.speedBase,
          },
          type: cat,
          category: cat,
          description: it.lore || it.description || "",
          weaponType: it.weaponType || (slot === "weapon" ? cat : undefined),
          source: "objectstore",
        });
      });
    });
    return out;
  }

  function enrichStarter(def) {
    return {
      id: def.id,
      name: def.name,
      slot: def.slot,
      equipSlot: def.slot,
      rarity: def.rarity,
      iconUrl: iconUrl(def.icon),
      stats: def.stats || {},
      description: def.description || "",
      qty: def.qty || 1,
      type: def.slot ? "equipment" : "consumable",
      source: "grudges-item-database",
    };
  }

  async function fetchFirst(urls) {
    var last = null;
    for (var i = 0; i < urls.length; i++) {
      try {
        var res = await fetch(urls[i], { credentials: "omit" });
        if (res.ok) return await res.json();
        last = new Error(urls[i] + " " + res.status);
      } catch (e) {
        last = e;
      }
    }
    throw last || new Error("fetch failed");
  }

  function sameOriginStats(path) {
    return ["/api/stats/" + path, GRUDGES + "/api/stats/" + path, SURVIVAL_API + "/api/stats/" + path];
  }

  function sameOriginGrudges(path) {
    return ["/api/grudges/" + path, GRUDGES + "/api/" + path, SURVIVAL_API + "/api/" + path];
  }

  async function loadPrimary() {
    try {
      var j = await fetchFirst(sameOriginStats("primary").concat(sameOriginStats("catalog")));
      var list = j.primaryStats || (j.primary && j.primary.primaryStats) || j.stats;
      if (list && list.length) {
        state.primary = list;
        state.catalogSource = "grudges /api/stats";
      }
      if (j.effects) state.effects = j.effects;
    } catch (e) {
      console.warn("[grudges-nexus] stats", e);
    }
    return state.primary;
  }

  async function loadItems() {
    var items = STARTER_DEFS.map(enrichStarter);
    try {
      var weapons = await fetchFirst([OS + "/weapons.json", "/api/objectstore/weapons.json"]);
      items = items.concat(flattenCatalog(weapons, "weapon"));
      state.bagSource = "Grudges ITEM_DATABASE + ObjectStore weapons";
    } catch (e) {
      console.warn("[grudges-nexus] weapons.json", e);
    }
    try {
      var armor = await fetchFirst([OS + "/armor.json", "/api/objectstore/armor.json"]);
      items = items.concat(flattenCatalog(armor, "chest"));
      state.bagSource += " + armor";
    } catch (e) {
      console.warn("[grudges-nexus] armor.json", e);
    }
    var seen = Object.create(null);
    state.items = items.filter(function (it) {
      if (!it.id || seen[it.id]) return false;
      seen[it.id] = true;
      return true;
    });
    return state.items;
  }

  function lookup(id) {
    if (!id) return null;
    for (var i = 0; i < state.items.length; i++) {
      if (state.items[i].id === id) return state.items[i];
    }
    return null;
  }

  function asBagRow(it, qty) {
    return {
      id: it.id,
      name: it.name,
      qty: qty || it.qty || 1,
      iconUrl: it.iconUrl,
      type: it.type,
      category: it.category,
      equipSlot: it.equipSlot || it.slot,
      rarity: it.rarity,
      stats: it.stats,
      description: it.description,
      weaponType: it.weaponType,
    };
  }

  function starterBag() {
    var worn = {};
    Object.keys(STARTER_EQUIP_IDS).forEach(function (k) {
      worn[STARTER_EQUIP_IDS[k]] = true;
    });
    return state.items
      .filter(function (it) {
        return it.source === "grudges-item-database" || it.id === "bloodfeud-blade";
      })
      .slice(0, 24)
      .map(function (it) {
        return asBagRow(it, it.qty || 1);
      });
  }

  function paperdollItem(it) {
    if (!it) return null;
    return {
      id: it.id,
      name: it.name,
      rarity: it.rarity || "common",
      iconUrl: it.iconUrl,
      description: it.description,
      stats: it.stats,
      type: it.type,
      weaponType: it.weaponType,
      slotType: it.slot,
    };
  }

  function starterEquipment() {
    var eq = {};
    Object.keys(STARTER_EQUIP_IDS).forEach(function (slot) {
      var it = lookup(STARTER_EQUIP_IDS[slot]);
      if (it) eq[slot] = paperdollItem(it);
    });
    var blade = lookup("bloodfeud-blade") || state.items.find(function (x) { return x.slot === "weapon"; });
    if (blade) eq.weapon = paperdollItem(blade);
    return eq;
  }

  function toPaperdollEquipment(raw) {
    if (!raw || typeof raw !== "object") return {};
    if (Array.isArray(raw)) {
      var fromArr = {};
      raw.forEach(function (row) {
        var id = row.defId || row.itemId || row.id;
        var it = lookup(id) || enrichFromUnknown(row);
        var slot = it.equipSlot || it.slot || row.slot;
        if (slot === "helm") slot = "helmet";
        if (slot === "mainhand") slot = "weapon";
        if (slot && it) fromArr[slot] = paperdollItem(it);
      });
      return fromArr;
    }
    var out = {};
    var map = {
      helm: "helmet",
      head: "helmet",
      helmet: "helmet",
      chest: "chest",
      legs: "legs",
      boots: "boots",
      mainhand: "weapon",
      weapon: "weapon",
      offhand: "offhand",
      amulet: "amulet",
      ring: "ring",
    };
    Object.keys(raw).forEach(function (k) {
      var slot = map[String(k).toLowerCase()];
      if (!slot) return;
      var v = raw[k];
      if (!v) return;
      if (typeof v === "string") {
        var it = lookup(v);
        if (it) out[slot] = paperdollItem(it);
        else out[slot] = { id: v, name: v, rarity: "common" };
        return;
      }
      var id = v.defId || v.itemId || v.id;
      var found = lookup(id);
      out[slot] = found ? paperdollItem(found) : paperdollItem(enrichFromUnknown(v));
    });
    return out;
  }

  function enrichFromUnknown(row) {
    var id = row.defId || row.itemId || row.id || "item";
    return {
      id: id,
      name: row.name || row.generatedName || id,
      slot: row.slot || row.equipSlot || null,
      equipSlot: row.slot || row.equipSlot || null,
      rarity: row.rarity || "common",
      iconUrl: iconUrl(row.iconUrl || row.icon || ""),
      stats: row.stats || row.bonusStats || {},
      description: row.description || "",
    };
  }

  function inventoryFromCharacter(char) {
    var inv = char && (char.inventory || char.saveData && char.saveData.inventory);
    if (!Array.isArray(inv) || !inv.length) return starterBag();
    return inv.map(function (row) {
      var id = row.defId || row.itemId || row.id;
      var it = lookup(id) || enrichFromUnknown(row);
      return asBagRow(it, row.qty || row.quantity || 1);
    });
  }

  function nexusAttrs(raw) {
    var src = raw || {};
    var out = {};
    KEYS.forEach(function (k) {
      var n = Number(src[k]);
      out[k] = Number.isFinite(n) ? n : VOXEL_STARTER[k] || 0;
    });
    return out;
  }

  function costToReach(level) {
    var t = 0;
    for (var i = 1; i <= level; i++) t += STAT_COST[i] || 0;
    return t;
  }

  function spentPoints(stats) {
    return KEYS.reduce(function (s, k) {
      return s + costToReach(stats[k] || 0);
    }, 0);
  }

  function remaining(stats) {
    return START_BUDGET - spentPoints(stats);
  }

  function itemBonus(eq, kind) {
    var n = 0;
    Object.keys(eq || {}).forEach(function (slot) {
      var it = eq[slot];
      var st = (it && it.stats) || {};
      if (kind === "dmg") n += Number(st.damage || st.damageBase || 0);
      if (kind === "def") n += Number(st.armor || st.defense || st.defenseBase || 0);
      if (kind === "hp") n += Number(st.health || 0);
    });
    return n;
  }

  function deriveVitals(stats, eq) {
    var B = stats.bio || 0,
      N = stats.neu || 0,
      K = stats.kin || 0,
      Q = stats.qnt || 0,
      C = stats.chr || 0,
      E = stats.ent || 0,
      G = stats.gra || 0;
    var hp = Math.floor(100 + B * 80 + E * 20 + K * 10) + itemBonus(eq, "hp");
    var mp = Math.floor(50 + N * 45 + Q * 10 + C * 8);
    var st = Math.floor(100 + K * 40 + G * 15 + E * 10);
    var dmg = Math.floor(8 + K * 6 + B * 1 + Q * 0.5) + itemBonus(eq, "dmg");
    var def = Math.floor(5 + E * 8 + B * 3 + K * 2) + itemBonus(eq, "def");
    var crit = Math.min(75, 5 + N * 1.2 + K * 1.5 + Q * 0.8);
    var move = (1 + (K * 2 + G * 1.5) / 100).toFixed(2);
    return { hp: hp, mp: mp, st: st, dmg: dmg, def: def, move: move, crit: crit };
  }

  function fromCharacter(char) {
    if (!char) return null;
    var attrs = nexusAttrs(char.attributes || char.stats || (char.saveData && char.saveData.stats) || {});
    var eq = toPaperdollEquipment(char.equipment || (char.saveData && char.saveData.equipment) || {});
    if (!Object.keys(eq).length) eq = starterEquipment();
    return {
      name: char.name || "Survivor",
      meta: "Lv." + (char.level || 1) + " · Grudges · " + (char.classId || char.raceId || "survivor"),
      race: char.raceId || char.race || "human",
      classId: char.classId || "survivor",
      level: char.level || 1,
      characterId: char.id,
      attributes: attrs,
      equipment: eq,
      inventory: inventoryFromCharacter(char),
      professionLevels: char.professionLevels || {},
      gold: char.gold || 0,
      hp: char.hp,
      energy: char.energy,
    };
  }

  async function loadRoster(grudgeId) {
    if (!grudgeId) return [];
    try {
      var acc = await fetchFirst(sameOriginGrudges("accounts/" + encodeURIComponent(grudgeId)));
      var accountId = acc && (acc.id || acc.accountId);
      if (!accountId) {
        acc = await fetch(sameOriginGrudges("accounts/upsert")[0], {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ grudgeId: grudgeId }),
        }).then(function (r) {
          return r.ok ? r.json() : null;
        });
        accountId = acc && acc.id;
      }
      if (!accountId) return [];
      var rows = await fetchFirst(sameOriginGrudges("characters?accountId=" + encodeURIComponent(accountId)));
      return Array.isArray(rows) ? rows : rows.characters || [];
    } catch (e) {
      console.warn("[grudges-nexus] roster", e);
      return [];
    }
  }

  async function load() {
    await Promise.all([loadPrimary(), loadItems()]);
    return state;
  }

  global.GrudgesNexusPanel = {
    GRUDGES: GRUDGES,
    GAME: GAME,
    KEYS: KEYS,
    STAT_MAX: STAT_MAX,
    START_BUDGET: START_BUDGET,
    VOXEL_STARTER: VOXEL_STARTER,
    PROFESSIONS: PROFESSIONS,
    iconUrl: iconUrl,
    load: load,
    loadPrimary: loadPrimary,
    loadItems: loadItems,
    loadRoster: loadRoster,
    lookup: lookup,
    starterBag: starterBag,
    starterEquipment: starterEquipment,
    toPaperdollEquipment: toPaperdollEquipment,
    inventoryFromCharacter: inventoryFromCharacter,
    nexusAttrs: nexusAttrs,
    remaining: remaining,
    deriveVitals: deriveVitals,
    fromCharacter: fromCharacter,
    paperdollItem: paperdollItem,
    getPrimary: function () {
      return state.primary;
    },
    getItems: function () {
      return state.items;
    },
    getBagSource: function () {
      return state.bagSource;
    },
    getCatalogSource: function () {
      return state.catalogSource;
    },
  };
})(typeof window !== "undefined" ? window : globalThis);
