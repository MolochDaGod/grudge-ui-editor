/**
 * Info hub catalog ΓÇö master-items SSOT for icons, equip slots, tooltips.
 * Source: https://info.grudge-studio.com/api/v1/master-items.json
 */
(function (global) {
  "use strict";

  var INFO_API = "https://info.grudge-studio.com/api/v1";
  var CDN = "https://assets.grudge-studio.com";
  var ready = null;
  var byId = Object.create(null);
  var byName = Object.create(null);
  var byUuid = Object.create(null);
  var all = [];

  /** Distinct pack fallbacks (never reuse chest for helm/boots). */
  var PACK = {
    sword: "/game-assets/icons/pack/weapons/Sword_01.png",
    axe: "/game-assets/icons/pack/weapons/Axe_01.png",
    dagger: "/game-assets/icons/pack/weapons/Dagger_01.png",
    hammer: "/game-assets/icons/pack/weapons/Hammer_01.png",
    spear: "/game-assets/icons/pack/weapons/Spear_01.png",
    bow: "/game-assets/icons/pack/weapons/Bow_01.png",
    crossbow: "/game-assets/icons/pack/weapons/Crossbow_01.png",
    staff: "/game-assets/icons/pack/weapons/Staff_01.png",
    shield: "/game-assets/icons/pack/weapons/Shield_01.png",
    helm: "/icons/armor_full/Helm_01.png",
    chest: "/icons/armor_full/Chest_01.png",
    gloves: "/icons/armor_full/Gloves_01.png",
    boots: "/icons/armor_full/Boots_01.png",
    legs: "/icons/armor_full/Pants_01.png",
    shoulders: "/icons/armor_full/Shoulder_01.png",
    ring: "/icons/pack/misc/Electro.png",
    amulet: "/icons/pack/misc/Electro.png",
    potion: "/icons/consumables/health_potion.png",
    food: "/icons/food/54_hotdog.png",
    ore: "/icons/pack/misc/Burns.png",
    wood: "/icons/pack/misc/Burns.png",
    hide: "/icons/pack/misc/Effect.png",
    material: "/icons/pack/misc/Effect.png",
    default: "/icons/pack/misc/Effect.png",
  };

  function abs(path) {
    if (!path) return CDN + PACK.default;
    var u = String(path).trim();
    if (/^(data:|blob:)/i.test(u)) return u;
    if (/^https?:/i.test(u)) return rewriteIconUrl(u);
    return CDN + (u.charAt(0) === "/" ? u : "/" + u);
  }

  /** info.* icon paths often serve HTML ΓÇö rewrite to assets CDN binaries. */
  function rewriteIconUrl(url) {
    var u = String(url || "").trim();
    if (!u) return CDN + PACK.default;
    return u
      .replace(/https?:\/\/molochdagod\.github\.io\/ObjectStore/gi, CDN)
      .replace(/https?:\/\/info\.grudge-studio\.com\/icons\//gi, CDN + "/icons/")
      .replace(/https?:\/\/info\.grudge-studio\.com\/api\/v1\/icons\//gi, CDN + "/icons/")
      .replace(/https?:\/\/objectstore\.grudge-studio\.com/gi, CDN);
  }

  function normKey(s) {
    return String(s || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  function categoryGuess(itemId, name, category, type) {
    var s = [itemId, name, category, type].join(" ").toLowerCase();
    if (/shield|bulwark|offhand/.test(s)) return "shield";
    if (/bow|crossbow|xbow|longbow/.test(s)) return "bow";
    if (/staff|wand|scepter/.test(s)) return "staff";
    if (/axe|hatchet|howl/.test(s)) return "axe";
    if (/dagger|knife/.test(s)) return "dagger";
    if (/hammer|mace|pick|maul/.test(s)) return "hammer";
    if (/spear|lance|pike/.test(s)) return "spear";
    if (/sword|blade|cutlass|saber/.test(s)) return "sword";
    if (/helm|hood|hat|head|crown/.test(s)) return "helm";
    if (/boot|feet|greave/.test(s)) return "boots";
    if (/glove|gauntlet|hand|bracer/.test(s) && !/hand axe|hand cannon/.test(s)) return "gloves";
    if (/leg|pant|greaves|skirt/.test(s)) return "legs";
    if (/shoulder|pad|pauldron/.test(s)) return "shoulders";
    if (/chest|vest|cuirass|robe|plate|armor|torso/.test(s)) return "chest";
    if (/ring/.test(s)) return "ring";
    if (/amulet|necklace|pendant|relic/.test(s)) return "amulet";
    if (/potion|tonic|elixir|flask/.test(s)) return "potion";
    if (/food|bread|meat|stew|skewer|herb/.test(s)) return "food";
    if (/ore|ingot|scrap|metal/.test(s)) return "ore";
    if (/wood|plank|log|lumber/.test(s)) return "wood";
    if (/hide|leather|pelt/.test(s)) return "hide";
    if (/mat|fiber|thread|water|stone|crystal/.test(s)) return "material";
    if (/weapon|sword|axe|bow|staff/.test(s)) return "sword";
    return "default";
  }

  /**
   * Map catalog / fleet keys ΓåÆ paperdoll slot id.
   */
  function paperdollSlot(def) {
    if (!def) return null;
    var st = String(def.slotType || def.slot || def.equipSlot || "").toLowerCase();
    var type = String(def.type || "").toLowerCase();
    var cat = String(def.category || "").toLowerCase();
    var wt = String(def.weaponType || "").toUpperCase();
    var name = String(def.name || def.id || "");

    if (st === "helm" || st === "head" || st === "helmet") return "helmet";
    if (st === "shoulder" || st === "shoulders") return "cloak";
    if (st === "chest" || st === "body" || st === "torso") return "chest";
    if (st === "hands" || st === "gloves" || st === "hand") return "gloves";
    if (st === "feet" || st === "boots" || st === "boot") return "boots";
    if (st === "legs" || st === "leg") return "legs";
    if (st === "ring") return "ring";
    if (st === "necklace" || st === "amulet" || st === "neck") return "amulet";
    if (st === "relic" || st === "belt" || st === "waist") return "belt";
    if (st === "offhand" || st === "off_hand" || st === "off-hand") return "offhand";
    if (st === "mainhand" || st === "main_hand" || st === "weapon") return "weapon";

    if (wt === "SHIELD" || cat === "shields" || /shield|bulwark/.test(name.toLowerCase())) return "offhand";
    if (type === "weapon" || cat.indexOf("sword") >= 0 || cat.indexOf("axe") >= 0 || cat.indexOf("bow") >= 0 || cat.indexOf("staff") >= 0 || cat.indexOf("dagger") >= 0)
      return "weapon";
    if (type === "armor") {
      var g = categoryGuess(def.id, name, cat, type);
      if (g === "helm") return "helmet";
      if (g === "boots") return "boots";
      if (g === "gloves") return "gloves";
      if (g === "legs") return "legs";
      if (g === "shoulders") return "cloak";
      return "chest";
    }
    return null; // material / consumable ΓÇö not equippable
  }

  /** Fleet/panel bag keys used by older SSOT. */
  function fleetSlot(paperSlot) {
    var map = {
      helmet: "Head",
      chest: "Chest",
      gloves: "Hands",
      legs: "Legs",
      boots: "Feet",
      weapon: "MainHand",
      offhand: "OffHand",
      cloak: "Back",
      amulet: "Accessory2",
      ring: "Accessory1",
      belt: "Belt",
    };
    return map[paperSlot] || paperSlot;
  }

  function indexItem(it) {
    if (!it) return;
    all.push(it);
    if (it.id) byId[String(it.id).toLowerCase()] = it;
    if (it.uuid) byUuid[String(it.uuid).toLowerCase()] = it;
    if (it.baseUuid) byUuid[String(it.baseUuid).toLowerCase()] = it;
    var nk = normKey(it.name || it.baseName);
    if (nk && !byName[nk]) byName[nk] = it;
    var bk = normKey(it.baseName);
    if (bk && !byName[bk]) byName[bk] = it;
  }

  function load() {
    if (ready) return ready;
    ready = fetch(INFO_API + "/master-items.json", { mode: "cors", credentials: "omit" })
      .then(function (r) {
        if (!r.ok) throw new Error("master-items " + r.status);
        return r.json();
      })
      .then(function (raw) {
        var items = Array.isArray(raw) ? raw : raw.items || [];
        byId = Object.create(null);
        byName = Object.create(null);
        byUuid = Object.create(null);
        all = [];
        for (var i = 0; i < items.length; i++) indexItem(items[i]);
        return { count: all.length };
      })
      .catch(function (err) {
        console.warn("[InfoCatalog] load failed", err);
        return { count: 0, error: String(err && err.message) };
      });
    return ready;
  }

  function lookup(opts) {
    opts = opts || {};
    var id = opts.itemId || opts.id || "";
    var uuid = opts.uuid || "";
    var name = opts.name || opts.baseName || "";
    if (uuid && byUuid[String(uuid).toLowerCase()]) return byUuid[String(uuid).toLowerCase()];
    if (id && byId[String(id).toLowerCase()]) return byId[String(id).toLowerCase()];
    if (id && byUuid[String(id).toLowerCase()]) return byUuid[String(id).toLowerCase()];
    var nk = normKey(name);
    if (nk && byName[nk]) return byName[nk];
    // fuzzy: strip T2/T3 suffix
    var base = nk.replace(/\s+t\d+$/, "").replace(/\s+tier\s*\d+$/, "");
    if (base && byName[base]) return byName[base];
    return null;
  }

  function resolveIcon(opts) {
    opts = opts || {};
    var def = lookup(opts);
    var explicit = opts.iconUrl || opts.icon || (def && def.iconUrl);
    if (explicit && String(explicit).trim()) {
      return abs(String(explicit).trim());
    }
    var cat = categoryGuess(
      opts.itemId || opts.id || (def && def.id),
      opts.name || (def && def.name),
      opts.category || (def && def.category),
      opts.type || (def && def.type),
    );
    if (def && def.slotType) {
      var st = String(def.slotType).toLowerCase();
      if (st === "helm") cat = "helm";
      else if (st === "chest") cat = "chest";
      else if (st === "hands") cat = "gloves";
      else if (st === "feet") cat = "boots";
      else if (st === "legs") cat = "legs";
      else if (st === "shoulder") cat = "shoulders";
      else if (st === "ring") cat = "ring";
      else if (st === "necklace" || st === "relic") cat = "amulet";
      else if (st === "offhand") cat = "shield";
    }
    return CDN + (PACK[cat] || PACK.default);
  }

  function imgTag(url, alt, size) {
    size = size || 28;
    return (
      '<img class="item-icon" src="' +
      esc(url) +
      '" alt="' +
      esc(alt || "") +
      '" width="' +
      size +
      '" height="' +
      size +
      '" loading="lazy" decoding="async" referrerpolicy="no-referrer" draggable="false" onerror="this.style.opacity=.25" />'
    );
  }

  function esc(s) {
    return String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function rarityFromTier(tier, tierLabel) {
    if (tierLabel) {
      var t = String(tierLabel).toLowerCase();
      if (/legend/.test(t)) return "legendary";
      if (/epic/.test(t)) return "epic";
      if (/rare/.test(t)) return "rare";
      if (/uncommon/.test(t)) return "uncommon";
      if (/common|starter/.test(t)) return "common";
    }
    var n = Number(tier) || 0;
    if (n >= 5) return "legendary";
    if (n >= 4) return "epic";
    if (n >= 3) return "rare";
    if (n >= 2) return "uncommon";
    return "common";
  }

  function formatStats(stats) {
    if (!stats || typeof stats !== "object") return "";
    return Object.keys(stats)
      .map(function (k) {
        return k + ": " + stats[k];
      })
      .join(" ┬╖ ");
  }

  /** Rich HTML tooltip body (same fields as info hub cards). */
  function tooltipHtml(opts) {
    opts = opts || {};
    var def = lookup(opts) || {};
    var name = opts.name || def.name || def.baseName || opts.itemId || "Item";
    var type = def.type || opts.type || opts.category || opts.slot || "";
    var tier = def.tierLabel || (def.tier != null ? "Tier " + def.tier : "") || opts.tier || "";
    var rarity = rarityFromTier(def.tier, def.tierLabel);
    var desc = def.description || opts.description || "";
    var stats = formatStats(def.stats || opts.stats);
    var craft = def.craftedBy ? "Crafted by " + def.craftedBy : "";
    var slot = paperdollSlot(def) || opts.slot || "";
    var icon = resolveIcon(Object.assign({}, opts, def, { iconUrl: opts.iconUrl || def.iconUrl }));
    var lines = [];
    lines.push('<div class="itt-head">');
    lines.push(imgTag(icon, name, 36));
    lines.push('<div class="itt-titles">');
    lines.push('<div class="itt-name r-' + rarity + '">' + esc(name) + "</div>");
    lines.push(
      '<div class="itt-sub">' +
        esc([type, tier, slot ? "slot: " + slot : ""].filter(Boolean).join(" ┬╖ ")) +
        "</div>",
    );
    lines.push("</div></div>");
    if (desc) lines.push('<div class="itt-desc">' + esc(desc) + "</div>");
    if (stats) lines.push('<div class="itt-stats">' + esc(stats) + "</div>");
    if (def.passive) lines.push('<div class="itt-extra">Passive: ' + esc(def.passive) + "</div>");
    if (def.proc) lines.push('<div class="itt-extra">Proc: ' + esc(def.proc) + "</div>");
    if (def.setBonus) lines.push('<div class="itt-extra">Set: ' + esc(def.setBonus) + "</div>");
    if (def.buff) lines.push('<div class="itt-extra">Buff: ' + esc(String(def.buff)) + "</div>");
    if (craft) lines.push('<div class="itt-meta">' + esc(craft) + "</div>");
    if (opts.qty > 1) lines.push('<div class="itt-meta">Quantity ├ù' + esc(opts.qty) + "</div>");
    lines.push(
      '<div class="itt-foot">info.grudge-studio.com ┬╖ master-items</div>',
    );
    return lines.join("");
  }

  function plainTooltip(opts) {
    var def = lookup(opts) || {};
    var name = opts.name || def.name || "Item";
    var parts = [name];
    if (def.tierLabel || def.tier != null) parts.push(def.tierLabel || "T" + def.tier);
    if (def.type) parts.push(def.type);
    if (def.description) parts.push(def.description);
    var st = formatStats(def.stats);
    if (st) parts.push(st);
    return parts.join(" ΓÇö ");
  }

  function enrichBagItem(row) {
    if (!row) return row;
    var def = lookup(row);
    var out = Object.assign({}, row);
    if (def) {
      out.name = out.name || def.name;
      out.iconUrl = out.iconUrl || def.iconUrl;
      out.type = out.type || def.type;
      out.category = out.category || def.category;
      out.tier = out.tier != null ? out.tier : def.tier;
      out.tierLabel = out.tierLabel || def.tierLabel;
      out.description = out.description || def.description;
      out.stats = out.stats || def.stats;
      out.slotType = out.slotType || def.slotType;
      out.weaponType = out.weaponType || def.weaponType;
      out.uuid = out.uuid || def.uuid;
      out.rarity = out.rarity || rarityFromTier(def.tier, def.tierLabel);
      var ps = paperdollSlot(def);
      if (ps) out.equipSlot = ps;
    }
    out.iconUrl = resolveIcon(out);
    return out;
  }

  /** Demo / starter rows mapped to real catalog items where possible. */
  function starterBagFromCatalog() {
    var picks = [
      { name: "Minor Health Potion", qty: 5 },
      { name: "Burnt Skewer", qty: 4 },
      { name: "Training Sword", qty: 1 },
      { name: "Hand Axe", qty: 1 },
      { name: "Bloodfeud Helm", qty: 1 },
      { name: "Grudge Bulwark", qty: 1 },
    ];
    var bag = [];
    for (var i = 0; i < picks.length; i++) {
      var def = lookup({ name: picks[i].name });
      if (def) {
        bag.push(
          enrichBagItem({
            id: def.id || def.uuid,
            name: def.name,
            qty: picks[i].qty,
            iconUrl: def.iconUrl,
          }),
        );
      }
    }
    // materials (may not be in master-items ΓÇö keep fallbacks)
    var mats = [
      { id: "ore_iron", name: "Iron Ore", qty: 12, category: "ore" },
      { id: "plank", name: "Oak Plank", qty: 16, category: "wood" },
      { id: "herb_green", name: "Green Herb", qty: 8, category: "food" },
      { id: "leather", name: "Leather", qty: 10, category: "hide" },
      { id: "stone", name: "Stone", qty: 20, category: "material" },
    ];
    for (var j = 0; j < mats.length; j++) {
      bag.push(
        enrichBagItem({
          id: mats[j].id,
          name: mats[j].name,
          qty: mats[j].qty,
          category: mats[j].category,
          type: "material",
          slot: "material",
        }),
      );
    }
    return bag;
  }

  global.InfoCatalog = {
    load: load,
    lookup: lookup,
    resolve: resolveIcon,
    resolveIcon: resolveIcon,
    imgTag: imgTag,
    paperdollSlot: paperdollSlot,
    fleetSlot: fleetSlot,
    tooltipHtml: tooltipHtml,
    plainTooltip: plainTooltip,
    enrichBagItem: enrichBagItem,
    starterBagFromCatalog: starterBagFromCatalog,
    rarityFromTier: rarityFromTier,
    rewriteIconUrl: rewriteIconUrl,
    CDN: CDN,
    INFO_API: INFO_API,
    get ready() {
      return ready;
    },
    get size() {
      return all.length;
    },
  };

  // Browser-compatible item icon API used by paperdoll / legacy pages
  global.GrudgeItemIcons = {
    CDN: CDN,
    resolve: function (opts) {
      return resolveIcon(opts);
    },
    imgTag: imgTag,
    categoryFromId: function (id, name) {
      return categoryGuess(id, name, "", "");
    },
  };

  // Auto-load
  load();
})(typeof window !== "undefined" ? window : globalThis);
