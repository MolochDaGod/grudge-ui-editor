/**
 * WCS Profession SSOT for ui.grudge-studio.com main-panel.
 *
 * Source of truth (canonical):
 *   warlords-crafting-suite/client/src/data/{miner,forester,engineer,mystic,chef}.ts
 * Extracted to: data/wcs-professions.json (node scripts/extract-wcs-professions.mjs)
 *
 * Icons: ObjectStore resource pack + craftpix skill slots + node-type glyphs.
 * Wiring: MainPanelContent.PROFESSION_TREES is replaced after load.
 */
(function (global) {
  "use strict";

  const OS_RES = "https://molochdagod.github.io/ObjectStore/icons/resources";
  const OS_ICONS = "https://molochdagod.github.io/ObjectStore/icons";
  /** Craftpix skill-book slots (local on ui host). */
  const PIX = "./assets/craftpix/Spell Book/Slots";

  /** Canonical 5 WCS professions (order = hub display). */
  const PROFESSION_ORDER = ["miner", "forester", "engineer", "mystic", "chef"];

  /** Profession header icons (wired systems — not random emoji only). */
  const PROFESSION_ICONS = {
    miner: `${OS_RES}/Res_80.png`,
    forester: `${OS_RES}/Res_30.png`,
    engineer: `${OS_RES}/Res_12.png`,
    mystic: `${OS_RES}/Res_05.png`,
    chef: `${OS_RES}/Res_03.png`,
  };

  const PROFESSION_COLORS = {
    miner: "#f59e0b",
    forester: "#22c55e",
    engineer: "#fb923c",
    mystic: "#a78bfa",
    chef: "#f97316",
  };

  /** Node-type → craftpix / glyph for tree chips. */
  const NODE_TYPE_ICON = {
    stat: `${PIX}/SpellBook_SpellSlot_Blue.png`,
    effect: `${PIX}/SpellBook_SpellSlot_Green.png`,
    combat: `${PIX}/SpellBook_SpellSlot_Red.png`,
    recipe: `${PIX}/SpellBook_SpellSlot_Purple.png`,
  };

  const NODE_TYPE_EMOJI = {
    stat: "◈",
    effect: "✦",
    combat: "⚔",
    recipe: "📜",
  };

  const BONUS_LABELS = {
    qualityBoost: "Quality",
    successChance: "Success",
    materialReduction: "Materials",
    speedBoost: "Speed",
    tierUnlock: "Tier",
    doubleYield: "Double yield",
    socketChance: "Socket",
    enchantPower: "Enchant",
    essenceEfficiency: "Essence",
    gemQuality: "Gem quality",
  };

  /** WCS titles (from professionTitles.ts) — canonical ranks. */
  const PROFESSION_TITLES = {
    miner: [
      { level: 25, title: "Prospector" },
      { level: 50, title: "Tunnelwarden" },
      { level: 75, title: "Forgemaster" },
      { level: 100, title: "Mountainbreaker" },
    ],
    forester: [
      { level: 25, title: "Woodwalker" },
      { level: 50, title: "Beastbinder" },
      { level: 75, title: "Grovekeeper" },
      { level: 100, title: "Wildshaper" },
    ],
    engineer: [
      { level: 25, title: "Tinkerer" },
      { level: 50, title: "Mechanist" },
      { level: 75, title: "Siegewright" },
      { level: 100, title: "Warforger" },
    ],
    mystic: [
      { level: 25, title: "Acolyte" },
      { level: 50, title: "Spellweaver" },
      { level: 75, title: "Arcanist" },
      { level: 100, title: "Voidtouched" },
    ],
    chef: [
      { level: 25, title: "Apprentice Cook" },
      { level: 50, title: "Field Cook" },
      { level: 75, title: "Warfeast Chef" },
      { level: 100, title: "Sovereign of the Hearth" },
    ],
  };

  let _catalog = null;
  let _loadPromise = null;

  function resolveIconPath(raw, professionId) {
    if (!raw) return PROFESSION_ICONS[professionId] || PROFESSION_ICONS.miner;
    if (String(raw).startsWith("http")) return raw;
    if (/^[\u{1F300}-\u{1FAFF}]/u.test(String(raw)) || String(raw).length <= 3) {
      return null; // emoji — render as text
    }
    // /icons/resources/Res_80.png → ObjectStore
    if (String(raw).includes("/icons/resources/") || /Res_\d+\.png/i.test(raw)) {
      const name = String(raw).split("/").pop();
      return `${OS_RES}/${name}`;
    }
    if (String(raw).startsWith("/icons/")) {
      return `${OS_ICONS}${String(raw).replace(/^\/icons/, "")}`;
    }
    if (String(raw).startsWith("./") || String(raw).startsWith("assets/")) {
      return raw.startsWith("./") ? raw : `./${raw}`;
    }
    return raw;
  }

  function titleFor(professionId, level) {
    const list = PROFESSION_TITLES[professionId] || [];
    let t = "Novice";
    for (const row of list) {
      if (level >= row.level) t = row.title;
    }
    return t;
  }

  function formatBonuses(bonuses) {
    if (!bonuses?.length) return "";
    return bonuses
      .map((b) => {
        const lab = BONUS_LABELS[b.type] || b.type;
        const sign = b.type === "materialReduction" ? "−" : "+";
        const suf = b.type === "tierUnlock" ? "" : "%";
        const tgt = b.target ? ` (${b.target})` : "";
        return `${lab} ${sign}${b.value}${suf}${tgt}`;
      })
      .join(" · ");
  }

  /**
   * Normalize WCS profession into main-panel tree shape.
   */
  function normalizeProfession(raw) {
    const id = raw.id || String(raw.name).toLowerCase();
    const iconUrl = resolveIconPath(raw.icon, id) || PROFESSION_ICONS[id];
    const emojiFallback =
      id === "miner"
        ? "⛏"
        : id === "forester"
          ? "🌲"
          : id === "engineer"
            ? "🔧"
            : id === "mystic"
              ? "🔮"
              : "🍲";

    const nodes = (raw.treeData || [])
      .slice()
      .sort((a, b) => (a.req || 0) - (b.req || 0) || (a.id || 0) - (b.id || 0))
      .map((n) => ({
        id: `${id}_${n.id}`,
        rawId: n.id,
        n: n.n,
        d: n.desc || formatBonuses(n.bonuses) || n.n,
        lvl: n.req ?? 0,
        branch: n.branch || "Core",
        nodeType: n.nodeType || "stat",
        bonuses: n.bonuses || [],
        unlocks: n.unlocks || [],
        parent: n.p,
        x: n.x,
        y: n.y,
        iconUrl: NODE_TYPE_ICON[n.nodeType] || NODE_TYPE_ICON.stat,
        emoji: NODE_TYPE_EMOJI[n.nodeType] || "◈",
      }));

    // Group into tier bands for panel display
    const bands = [
      { label: "Initiate", min: 0, max: 14 },
      { label: "Journeyman", min: 15, max: 34 },
      { label: "Artisan", min: 35, max: 59 },
      { label: "Master", min: 60, max: 84 },
      { label: "Legend", min: 85, max: 200 },
    ];
    const tiers = bands
      .map((b) => ({
        label: b.label,
        minLvl: b.min,
        maxLvl: b.max,
        nodes: nodes.filter((n) => n.lvl >= b.min && n.lvl <= b.max),
      }))
      .filter((t) => t.nodes.length);

    const recipes = (raw.recipes || []).map((r) => ({
      id: String(r.id),
      name: r.n,
      profession: id,
      emoji: typeof r.icon === "string" && r.icon.length <= 3 ? r.icon : "⚒",
      iconUrl: resolveIconPath(r.icon, id),
      lvl: r.lvl || 1,
      mats: r.mats || {},
      type: r.type || "item",
      desc: r.desc || "",
      category: r.category || null,
    }));

    return {
      id,
      name: raw.name,
      role: raw.role,
      color: PROFESSION_COLORS[id] || "#d4a400",
      colorClass: raw.color,
      emoji: emojiFallback,
      iconUrl,
      bgImage: raw.bgImage,
      nodes,
      tiers,
      recipes,
      titles: PROFESSION_TITLES[id] || [],
    };
  }

  async function loadCatalog() {
    if (_catalog) return _catalog;
    if (_loadPromise) return _loadPromise;
    _loadPromise = (async () => {
      try {
        const res = await fetch("./data/wcs-professions.json", { cache: "force-cache" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const map = {};
        for (const id of PROFESSION_ORDER) {
          if (json[id]) map[id] = normalizeProfession(json[id]);
        }
        // any extra keys
        for (const [k, v] of Object.entries(json)) {
          if (!map[k]) map[k] = normalizeProfession(v);
        }
        _catalog = map;
      } catch (e) {
        console.warn("[WcsProfessions] failed to load JSON, using stub", e);
        _catalog = {};
      }
      // Publish into MainPanelContent
      installIntoMainPanelContent(_catalog);
      global.dispatchEvent(
        new CustomEvent("grudge:wcs:professions", { detail: _catalog }),
      );
      return _catalog;
    })();
    return _loadPromise;
  }

  function installIntoMainPanelContent(catalog) {
    const MPC = global.MainPanelContent;
    if (!MPC) return;
    // Replace weak stub trees with WCS canonical
    const trees = {};
    for (const [id, p] of Object.entries(catalog)) {
      trees[id] = {
        name: p.name,
        emoji: p.emoji,
        iconUrl: p.iconUrl,
        color: p.color,
        role: p.role,
        nodes: p.nodes.map((n) => ({
          id: n.id,
          n: n.n,
          d: n.d,
          lvl: n.lvl,
          emoji: n.emoji,
          iconUrl: n.iconUrl,
          branch: n.branch,
          nodeType: n.nodeType,
        })),
        tiers: p.tiers,
        recipes: p.recipes,
        titles: p.titles,
      };
    }
    MPC.PROFESSION_TREES = trees;
    MPC.WCS_PROFESSIONS = catalog;
    MPC.PROFESSION_ORDER = PROFESSION_ORDER.slice();
    MPC.getProfessionTitle = titleFor;
    MPC.resolveProfessionIcon = (id) => PROFESSION_ICONS[id] || PROFESSION_ICONS.miner;
  }

  function getAll() {
    return _catalog || {};
  }

  function get(id) {
    return (_catalog || {})[String(id).toLowerCase()] || null;
  }

  /** Flat craft list from all WCS professions (for craft tab enrichment). */
  function allRecipes() {
    const list = [];
    for (const p of Object.values(_catalog || {})) {
      for (const r of p.recipes || []) list.push({ ...r, profession: p.id });
    }
    return list;
  }

  global.WcsProfessions = {
    OS_RES,
    PROFESSION_ORDER,
    PROFESSION_ICONS,
    PROFESSION_COLORS,
    PROFESSION_TITLES,
    NODE_TYPE_ICON,
    BONUS_LABELS,
    loadCatalog,
    getAll,
    get,
    allRecipes,
    titleFor,
    formatBonuses,
    resolveIconPath,
    normalizeProfession,
  };

  // Auto-load when included after main-panel-content.js
  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        loadCatalog().catch(() => {});
      });
    } else {
      loadCatalog().catch(() => {});
    }
  }
})(typeof window !== "undefined" ? window : globalThis);
