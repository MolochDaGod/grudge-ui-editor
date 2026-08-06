/**
 * InfoCatalog — fleet item + icon SSOT for main-panel / paperdoll / bag.
 *
 * Canonical sources (in order):
 *   1. https://objectstore.grudge-studio.com/api/v1/master-items.json
 *   2. https://molochdagod.github.io/ObjectStore/api/v1/master-items.json (mirror)
 * Icons:
 *   assets.grudge-studio.com (+ game-assets prefix) via path rewrite / path-index
 * Never invent AI icons; never use emoji as production item art.
 */
(function (global) {
  "use strict";

  var CDN = "https://assets.grudge-studio.com";
  var OBJECTSTORE = "https://objectstore.grudge-studio.com/api/v1";
  var OBJECTSTORE_MIRROR = "https://molochdagod.github.io/ObjectStore/api/v1";
  var ICON_PATH_INDEX_URL =
    "https://assets.grudge-studio.com/game-assets/api/v1/icon-path-index.json";

  /** Prefer ObjectStore; info.* /api/v1/master-items is dead (404 / SPA HTML). */
  var MASTER_ITEM_URLS = [
    OBJECTSTORE + "/master-items.json",
    OBJECTSTORE_MIRROR + "/master-items.json",
  ];
  var MASTER_MATERIALS_URLS = [
    OBJECTSTORE + "/master-materials.json",
    OBJECTSTORE_MIRROR + "/master-materials.json",
  ];

  var ready = null;
  var byId = Object.create(null);
  var byName = Object.create(null);
  var byUuid = Object.create(null);
  var all = [];
  var pathIndex = null; // /icons/... → { cdnUrl, grudgeUuid }
  var sourceLabel = "unloaded";

  /**
   * Category pack fallbacks (CDN-relative). Prefer game-assets for skill packs;
   * bare /icons for swords/materials that only exist there.
   */
  var PACK = {
    sword: "/icons/pack/weapons/Sword_01.png",
    axe: "/icons/pack/weapons/Axe_01.png",
    dagger: "/icons/pack/weapons/Dagger_01.png",
    hammer: "/icons/pack/weapons/Hammer_01.png",
    spear: "/icons/pack/weapons/Spear_01.png",
    bow: "/icons/pack/weapons/Bow_01.png",
    crossbow: "/icons/pack/weapons/Crossbow_01.png",
    staff: "/icons/pack/weapons/Staff_01.png",
    shield: "/icons/pack/weapons/Shield_01.png",
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
    ore: "/icons/materials/scrap-ore.png",
    wood: "/icons/pack/misc/Burns.png",
    hide: "/icons/pack/misc/Effect.png",
    material: "/icons/pack/misc/Effect.png",
    default: "/icons/pack/misc/Effect.png",
  };

  function absPack(path) {
    if (!path) return resolveIconPath(PACK.default);
    return resolveIconPath(path);
  }

  /**
   * Normalize any icon ref → CDN URL.
   * Uses path-index when loaded; otherwise dual-prefix heuristics.
   */
  function resolveIconPath(raw) {
    if (!raw) return CDN + "/icons/pack/misc/Effect.png";
    var u = String(raw).trim();
    if (!u) return CDN + "/icons/pack/misc/Effect.png";
    if (/^(data:|blob:)/i.test(u)) return u;

    // Absolute → strip known bad hosts to path
    if (/^https?:\/\//i.test(u)) {
      u = rewriteIconUrl(u);
      if (/^https?:\/\/assets\.grudge-studio\.com/i.test(u)) return u;
    }

    // ICON-UUID via path index not available as uuid map here — treat as path
    var path = u;
    if (/^ICON-/i.test(u)) {
      // cannot resolve without full registry entries; leave for path fallbacks
      return CDN + "/icons/pack/misc/Effect.png";
    }

    path = path.replace(/^\/+/, "");
    if (path.indexOf("game-assets/") === 0) return CDN + "/" + path;
    if (path.indexOf("icons/") !== 0) path = "icons/" + path.replace(/^\/+/, "");

    var norm = "/" + path; // /icons/...
    if (pathIndex && pathIndex[norm] && pathIndex[norm].cdnUrl) {
      return pathIndex[norm].cdnUrl;
    }
    if (pathIndex && pathIndex.index && pathIndex.index[norm] && pathIndex.index[norm].cdnUrl) {
      return pathIndex.index[norm].cdnUrl;
    }

    // skill_nobg / 496 packs live under game-assets only
    if (/^icons\/(skill_nobg|496_rpg|ability|spell|class)\//i.test(path)) {
      return CDN + "/game-assets/" + path;
    }
    // pack weapons/armor exist under both; prefer game-assets (registry SSOT)
    if (/^icons\/pack\//i.test(path)) {
      return CDN + "/game-assets/" + path;
    }
    // swords, materials, armor_full, food often on bare /icons/
    return CDN + "/" + path;
  }

  /** info.* often HTML-shells icons; github.io ObjectStore → assets CDN. */
  function rewriteIconUrl(url) {
    var u = String(url || "").trim();
    if (!u) return CDN + "/icons/pack/misc/Effect.png";
    u = u
      .replace(/https?:\/\/molochdagod\.github\.io\/ObjectStore/gi, CDN)
      .replace(/https?:\/\/objectstore\.grudge-studio\.com/gi, CDN)
      .replace(/https?:\/\/info\.grudge-studio\.com\/api\/v1\/icons\//gi, CDN + "/icons/")
      .replace(/https?:\/\/info\.grudge-studio\.com\/icons\//gi, CDN + "/icons/")
      .replace(/https?:\/\/info\.grudge-studio\.com\/gamedata\/gi, OBJECTSTORE)
      .replace(/^https?:\/\/assets\.grudge-studio\.com\/api\/assets/i, CDN)
      .replace(/\/api\/assets\//gi, "/");

    // already assets CDN
    if (/^https?:\/\/assets\.grudge-studio\.com\//i.test(u)) {
      // promote paths that only exist under game-assets/
      u = u.replace(
        /^(https?:\/\/assets\.grudge-studio\.com)\/icons\/(skill_nobg|496_rpg|resources|pack)\//i,
        "$1/game-assets/icons/$2/",
      );
      return u;
    }
    // relative leftover
    return resolveIconPath(u);
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
    return "default";
  }

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
    if (
      type === "weapon" ||
      cat.indexOf("sword") >= 0 ||
      cat.indexOf("axe") >= 0 ||
      cat.indexOf("bow") >= 0 ||
      cat.indexOf("staff") >= 0 ||
      cat.indexOf("dagger") >= 0
    )
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
    return null;
  }

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
    // rewrite icon at index time so bag always has CDN URL
    if (it.iconUrl) it.iconUrl = resolveIconPath(it.iconUrl);
    if (it.icon && !it.iconUrl) it.iconUrl = resolveIconPath(it.icon);
    all.push(it);
    if (it.id) byId[String(it.id).toLowerCase()] = it;
    if (it.uuid) byUuid[String(it.uuid).toLowerCase()] = it;
    if (it.baseUuid) byUuid[String(it.baseUuid).toLowerCase()] = it;
    var nk = normKey(it.name || it.baseName);
    if (nk && !byName[nk]) byName[nk] = it;
    var bk = normKey(it.baseName);
    if (bk && !byName[bk]) byName[bk] = it;
  }

  function fetchJsonFirst(urls) {
    var i = 0;
    function next() {
      if (i >= urls.length) return Promise.reject(new Error("all sources failed"));
      var url = urls[i++];
      return fetch(url, { mode: "cors", credentials: "omit", cache: "force-cache" }).then(function (r) {
        if (!r.ok) return next();
        var ct = (r.headers.get("content-type") || "").toLowerCase();
        if (ct.indexOf("html") >= 0) return next(); // SPA shell, not JSON
        return r.json().then(function (j) {
          if (!j || (typeof j === "object" && j.error)) return next();
          return { data: j, url: url };
        });
      }).catch(function () {
        return next();
      });
    }
    return next();
  }

  function loadPathIndex() {
    return fetch(ICON_PATH_INDEX_URL, { mode: "cors", credentials: "omit", cache: "force-cache" })
      .then(function (r) {
        if (!r.ok) return null;
        return r.json();
      })
      .then(function (j) {
        if (!j) return;
        // support both { index: { path: meta } } and flat path map
        pathIndex = j.index || j;
      })
      .catch(function () {
        pathIndex = null;
      });
  }

  function load() {
    if (ready) return ready;
    ready = Promise.all([loadPathIndex(), fetchJsonFirst(MASTER_ITEM_URLS)])
      .then(function (pair) {
        var pack = pair[1];
        var raw = pack.data;
        sourceLabel = pack.url;
        var items = Array.isArray(raw) ? raw : raw.items || [];
        byId = Object.create(null);
        byName = Object.create(null);
        byUuid = Object.create(null);
        all = [];
        for (var i = 0; i < items.length; i++) indexItem(items[i]);

        // optional materials enrich name lookup
        return fetchJsonFirst(MASTER_MATERIALS_URLS)
          .then(function (m) {
            var mats = m.data.materials || m.data.items || [];
            for (var k = 0; k < mats.length; k++) {
              var mat = mats[k];
              if (!mat) continue;
              indexItem({
                id: mat.id,
                uuid: mat.uuid,
                name: mat.name,
                type: "material",
                category: mat.category || "material",
                tier: mat.tier,
                iconUrl: mat.iconUrl || mat.icon,
                description: mat.description || (mat.gatheredBy ? "Gathered by " + mat.gatheredBy : ""),
              });
            }
            return { count: all.length, source: sourceLabel };
          })
          .catch(function () {
            return { count: all.length, source: sourceLabel };
          });
      })
      .catch(function (err) {
        console.warn("[InfoCatalog] load failed", err);
        sourceLabel = "error";
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
    var base = nk.replace(/\s+t\d+$/, "").replace(/\s+tier\s*\d+$/, "");
    if (base && byName[base]) return byName[base];
    return null;
  }

  function resolveIcon(opts) {
    opts = opts || {};
    var def = lookup(opts);
    var explicit = opts.iconUrl || opts.icon || (def && (def.iconUrl || def.icon));
    if (explicit && String(explicit).trim()) {
      return resolveIconPath(String(explicit).trim());
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
    return absPack(PACK[cat] || PACK.default);
  }

  function imgTag(url, alt, size) {
    size = size || 28;
    var fb = absPack(PACK.default);
    var safe = String(url || fb).replace(/"/g, "");
    return (
      '<img class="item-icon" src="' +
      safe +
      '" alt="' +
      esc(alt || "") +
      '" width="' +
      size +
      '" height="' +
      size +
      '" loading="lazy" decoding="async" referrerpolicy="no-referrer" draggable="false" onerror="if(!this.dataset.fb){this.dataset.fb=1;this.src=\'' +
      fb +
      "'}\" />"
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
      .join(" · ");
  }

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
        esc([type, tier, slot ? "slot: " + slot : ""].filter(Boolean).join(" · ")) +
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
    if (opts.qty > 1) lines.push('<div class="itt-meta">Quantity ×' + esc(opts.qty) + "</div>");
    lines.push('<div class="itt-foot">ObjectStore master-items · assets CDN</div>');
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
    return parts.join(" — ");
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

  /** Guest bag: real catalog items + materials (icons from CDN SSOT). */
  function starterBagFromCatalog() {
    var picks = [
      { name: "Minor Health Potion", qty: 5 },
      { name: "Training Sword", qty: 1 },
      { name: "Hand Axe", qty: 1 },
      { name: "Bloodfeud Helm", qty: 1 },
      { name: "Grudge Bulwark", qty: 1 },
      { name: "Scrap Ore", qty: 12 },
      { name: "Burnt Skewer", qty: 4 },
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
    // materials by id when name miss
    var mats = [
      { id: "scrap-ore", name: "Scrap Ore", qty: 12, category: "ore" },
      { id: "plank", name: "Oak Plank", qty: 16, category: "wood" },
      { id: "herb_green", name: "Green Herb", qty: 8, category: "food" },
      { id: "leather", name: "Leather", qty: 10, category: "hide" },
      { id: "stone", name: "Stone", qty: 20, category: "material" },
    ];
    for (var j = 0; j < mats.length; j++) {
      if (bag.some(function (b) {
        return normKey(b.name) === normKey(mats[j].name);
      }))
        continue;
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
    resolveIconPath: resolveIconPath,
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
    OBJECTSTORE: OBJECTSTORE,
    get source() {
      return sourceLabel;
    },
    get ready() {
      return ready;
    },
    get size() {
      return all.length;
    },
  };

  global.GrudgeItemIcons = {
    CDN: CDN,
    resolve: function (opts) {
      return resolveIcon(opts);
    },
    fallback: function () {
      return absPack(PACK.default);
    },
    imgTag: imgTag,
    categoryFromId: function (id, name) {
      return categoryGuess(id, name, "", "");
    },
  };

  load();
})(typeof window !== "undefined" ? window : globalThis);
