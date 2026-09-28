/**
 * fleet-game-systems.js — class + weapon skill trees from ObjectStore SSOT.
 *
 * Replaces hard-coded emoji skill stubs in MainPanelContent with:
 *   GET info…/api/v1/master-skillTrees.json  (canonical)
 *   GET objectstore…/master-skillTrees.json  (same JSON, proxied)
 *   GET the same hosts for master-weaponSkills.json
 * Icons: assets.grudge-studio.com (via InfoCatalog.resolveIconPath when present).
 */
(function (global) {
  "use strict";

  var INFO = "https://info.grudge-studio.com/api/v1";
  var OS = "https://objectstore.grudge-studio.com/api/v1";
  var CDN = "https://assets.grudge-studio.com";

  var _trees = null;
  var _weaponBars = null;
  var _meta = { skillTrees: null, weaponSkills: null };
  var _loadPromise = null;

  /** Same rule as info main-panel skillIcon: absolute catalog URL, else assets CDN + path. */
  function iconUrl(raw) {
    if (!raw) return null;
    var u = String(raw).trim();
    if (!u) return null;
    if (/^https?:\/\//i.test(u)) return u;
    return CDN + (u.charAt(0) === "/" ? u : "/" + u);
  }

  function fetchJson(urls) {
    var i = 0;
    function next() {
      if (i >= urls.length) return Promise.reject(new Error("fetch failed"));
      var url = urls[i++];
      return fetch(url, { mode: "cors", credentials: "omit", cache: "no-cache" })
        .then(function (r) {
          if (!r.ok) return next();
          var ct = (r.headers.get("content-type") || "").toLowerCase();
          if (ct.indexOf("html") >= 0) return next();
          return r.json();
        })
        .catch(function () {
          return next();
        });
    }
    return next();
  }

  function classKey(name) {
    var n = String(name || "warrior").toLowerCase();
    if (n === "worg") return "worge";
    return n;
  }

  function normalizeClassTree(raw, key) {
    var color = raw.color || "#c2410c";
    var tiers = (raw.tiers || []).map(function (t, idx) {
      var lvl = t.requiredLevel != null ? t.requiredLevel : t.lvl != null ? t.lvl : idx === 0 ? 1 : (idx + 1) * 10;
      var skills = (t.skills || []).map(function (s, si) {
        var slot = s.slot != null ? s.slot : s.hotbarSlot != null ? s.hotbarSlot : si < 6 ? si + 1 : null;
        // only first tier skills auto-bind hotbar slots 1-6 when no explicit slot
        if (idx > 0 && s.slot == null && s.hotbarSlot == null) slot = null;
        return {
          id: s.id || s.uuid,
          uuid: s.uuid,
          n: s.name || s.n || s.id,
          d: s.description || s.effect || s.d || "",
          effect: s.effect || "",
          slot: slot,
          iconUrl: iconUrl(s.iconUrl || s.icon),
          maxPoints: s.maxPoints,
          passive: !!s.passive,
          bonuses: s.bonuses || null,
        };
      });
      return {
        lvl: lvl,
        label: t.name || t.label || "Tier " + (idx + 1),
        skills: skills,
      };
    });
    // assign hotbar slots 1..6 from first two tiers if none set
    var barN = 1;
    for (var ti = 0; ti < tiers.length && barN <= 6; ti++) {
      for (var si = 0; si < tiers[ti].skills.length && barN <= 6; si++) {
        if (tiers[ti].skills[si].slot == null && !tiers[ti].skills[si].passive) {
          tiers[ti].skills[si].slot = barN++;
        } else if (tiers[ti].skills[si].slot != null) {
          barN = Math.max(barN, tiers[ti].skills[si].slot + 1);
        }
      }
    }
    return {
      name: raw.className || raw.name || key,
      color: color,
      uuid: raw.uuid,
      tiers: tiers,
      source: "https://info.grudge-studio.com/api/v1/master-skillTrees.json",
    };
  }

  function normalizeWeaponType(wt) {
    if (!wt || !wt.id) return null;
    var id = String(wt.id).toLowerCase();
    var skills = [];
    var slots = wt.slots || [];
    for (var i = 0; i < slots.length; i++) {
      var slotSkills = slots[i].skills || [];
      for (var j = 0; j < slotSkills.length; j++) {
        var s = slotSkills[j];
        skills.push({
          id: s.id || s.uuid,
          uuid: s.uuid,
          n: s.name || s.n,
          d: s.description || s.d || "",
          slot: skills.length + 1,
          tier: s.tier,
          damage: s.damage,
          cooldown: s.cooldown,
          iconUrl: iconUrl(s.icon || s.iconUrl || wt.icon),
          resourceCost: s.resourceCost || null,
        });
      }
    }
    // cap bar at 8 for panel display
    skills = skills.slice(0, 8).map(function (s, idx) {
      s.slot = idx + 1;
      return s;
    });
    return { id: id, name: wt.name || id, iconUrl: iconUrl(wt.icon), skills: skills };
  }

  function installIntoMainPanel(trees, weaponBars) {
    var MPC = global.MainPanelContent;
    if (!MPC) return;
    if (trees && Object.keys(trees).length) {
      // keep worge alias
      if (trees.worge && !trees.worg) trees.worg = trees.worge;
      if (trees.worg && !trees.worge) trees.worge = trees.worg;
      MPC.CLASS_SKILL_TREES = trees;
      MPC.classTree = function (classId) {
        var c = classKey(classId);
        return trees[c] || trees.warrior || Object.values(trees)[0];
      };
      MPC.hotbarFromClass = function (classId) {
        var tree = MPC.classTree(classId);
        var out = [];
        if (!tree) return out;
        for (var i = 0; i < tree.tiers.length; i++) {
          for (var j = 0; j < tree.tiers[i].skills.length; j++) {
            var s = tree.tiers[i].skills[j];
            if (s.slot != null) out.push(s);
          }
        }
        return out.sort(function (a, b) {
          return (a.slot || 99) - (b.slot || 99);
        }).slice(0, 6);
      };
    }
    if (weaponBars && Object.keys(weaponBars).length) {
      MPC.WEAPON_SKILL_BARS = weaponBars;
      MPC.weaponBar = function (weaponType) {
        var t = String(weaponType || "unarmed").toLowerCase();
        if (t === "1h_sword" || t === "2h_sword") t = "sword";
        if (t === "longbow") t = "bow";
        return weaponBars[t] || weaponBars.sword || weaponBars.unarmed || [];
      };
    }
    MPC.FLEET_SYSTEMS = {
      skillTrees: _meta.skillTrees,
      weaponSkills: _meta.weaponSkills,
      loaded: true,
    };
  }

  function loadCatalog() {
    if (_trees && _weaponBars) {
      return Promise.resolve({ trees: _trees, weaponBars: _weaponBars });
    }
    if (_loadPromise) return _loadPromise;
    _loadPromise = Promise.all([
      fetchJson([OS + "/master-skillTrees.json", INFO + "/master-skillTrees.json"]),
      fetchJson([OS + "/master-weaponSkills.json", INFO + "/master-weaponSkills.json"]),
    ])
      .then(function (pair) {
        var st = pair[0];
        var ws = pair[1];
        _meta.skillTrees = { version: st.version, generated: st.generated, total: st.totalSkills };
        _meta.weaponSkills = { version: ws.version, generated: ws.generated, total: ws.totalSkills };

        var trees = {};
        var rawTrees = st.skillTrees || st.trees || {};
        Object.keys(rawTrees).forEach(function (k) {
          trees[classKey(k)] = normalizeClassTree(rawTrees[k], k);
        });

        var weaponBars = {};
        var list = Array.isArray(ws.weaponTypes) ? ws.weaponTypes : [];
        for (var i = 0; i < list.length; i++) {
          var norm = normalizeWeaponType(list[i]);
          if (norm && norm.skills.length) {
            weaponBars[norm.id] = norm.skills;
          }
        }
        // unarmed fallback from fist / bare if present, else stub from first skill of sword renamed
        if (!weaponBars.unarmed) {
          weaponBars.unarmed = (weaponBars.fist || weaponBars.sword || [])
            .slice(0, 3)
            .map(function (s, idx) {
              return Object.assign({}, s, {
                id: "unarmed_" + idx,
                n: idx === 0 ? "Jab" : idx === 1 ? "Hook" : "Kick",
                slot: idx + 1,
              });
            });
        }

        _trees = trees;
        _weaponBars = weaponBars;
        installIntoMainPanel(trees, weaponBars);
        global.dispatchEvent(
          new CustomEvent("grudge:fleet:systems", {
            detail: { trees: trees, weaponBars: weaponBars, meta: _meta },
          }),
        );
        console.info(
          "[FleetGameSystems] skillTrees=",
          Object.keys(trees).length,
          "weaponTypes=",
          Object.keys(weaponBars).length,
          st.version,
          ws.version,
        );
        return { trees: trees, weaponBars: weaponBars, meta: _meta };
      })
      .catch(function (e) {
        console.warn("[FleetGameSystems] load failed — keeping MainPanelContent stubs", e);
        return { trees: null, weaponBars: null, error: String(e && e.message) };
      });
    return _loadPromise;
  }

  global.FleetGameSystems = {
    loadCatalog: loadCatalog,
    iconUrl: iconUrl,
    get trees() {
      return _trees;
    },
    get weaponBars() {
      return _weaponBars;
    },
    get meta() {
      return _meta;
    },
  };

  // eager load
  loadCatalog();
})(typeof window !== "undefined" ? window : globalThis);
