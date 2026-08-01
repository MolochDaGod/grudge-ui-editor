/**
 * item-icons.js — CDN icon resolve for main-panel bag / paperdoll / loot.
 * Mirrors shared/inventory/itemIcons.ts (browser standalone).
 */
(function (global) {
  "use strict";

  var CDN = "https://assets.grudge-studio.com";
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
    armor: "/icons/pack/armor/Chest_01.png",
    helm: "/icons/pack/armor/Chest_01.png",
    boots: "/icons/pack/armor/Chest_01.png",
    gloves: "/icons/pack/armor/Chest_01.png",
    food: "/icons/pack/misc/Burns.png",
    potion: "/icons/pack/misc/Effect.png",
    ore: "/icons/pack/weapons/Hammer_01.png",
    wood: "/icons/pack/weapons/Axe_01.png",
    hide: "/icons/pack/weapons/Dagger_01.png",
    gem: "/icons/pack/misc/Electro.png",
    bag: "/icons/pack/misc/Effect.png",
    default: "/icons/pack/misc/Effect.png",
  };

  function abs(path) {
    if (!path) return CDN + PACK.default;
    if (/^(data:|blob:|https?:)/i.test(path)) return path;
    return CDN + (path.charAt(0) === "/" ? path : "/" + path);
  }

  function categoryFromId(itemId, name) {
    var s = String(itemId || "") + " " + String(name || "");
    s = s.toLowerCase();
    if (/shield/.test(s)) return "shield";
    if (/bow|crossbow|xbow/.test(s)) return "bow";
    if (/staff|wand|scepter/.test(s)) return "staff";
    if (/axe|hatchet/.test(s)) return "axe";
    if (/dagger|knife/.test(s)) return "dagger";
    if (/hammer|mace|pick/.test(s)) return "hammer";
    if (/spear|lance/.test(s)) return "spear";
    if (/sword|blade/.test(s)) return "sword";
    if (/helm|hood|hat|head/.test(s)) return "helm";
    if (/boot|feet/.test(s)) return "boots";
    if (/glove|gauntlet|hand/.test(s)) return "gloves";
    if (/chest|vest|robe|armor|plate/.test(s)) return "armor";
    if (/potion|tonic|elixir/.test(s)) return "potion";
    if (/meat|stew|bread|food|herb/.test(s)) return "food";
    if (/ore|ingot|metal|scrap/.test(s)) return "ore";
    if (/wood|plank|log/.test(s)) return "wood";
    if (/hide|leather|pelt/.test(s)) return "hide";
    if (/gem|crystal|dust|essence/.test(s)) return "gem";
    if (/bag|pack|quiver|back/.test(s)) return "bag";
    return "default";
  }

  function resolveItemIconUrl(opts) {
    opts = opts || {};
    var explicit = opts.iconUrl || opts.icon;
    if (explicit && String(explicit).trim()) {
      var raw = String(explicit).trim();
      if (/[./]/.test(raw) || /^https?:/i.test(raw)) {
        return abs(
          raw
            .replace(/https?:\/\/molochdagod\.github\.io\/ObjectStore/gi, CDN)
            .replace(/https?:\/\/info\.grudge-studio\.com(\/api\/v1)?/gi, CDN)
            .replace(/^https?:\/\/assets\.grudge-studio\.com/i, "")
            .replace(/^\/api\/assets/i, ""),
        );
      }
    }
    var id = opts.itemId || opts.name || "";
    var cat = categoryFromId(id, opts.name);
    return abs(PACK[cat] || PACK.default);
  }

  function fallbackUrl() {
    return abs(PACK.default);
  }

  function imgTag(url, alt, size) {
    var fb = fallbackUrl();
    var s = size || 28;
    var safe = (url || fb).replace(/"/g, "");
    return (
      '<img src="' +
      safe +
      '" alt="' +
      String(alt || "").replace(/"/g, "") +
      '" width="' +
      s +
      '" height="' +
      s +
      '" loading="lazy" draggable="false" style="object-fit:contain;width:' +
      s +
      "px;height:" +
      s +
      'px" onerror="if(!this.dataset.fb){this.dataset.fb=1;this.src=\'' +
      fb +
      "'}\" />"
    );
  }

  global.GrudgeItemIcons = {
    CDN: CDN,
    resolve: resolveItemIconUrl,
    fallback: fallbackUrl,
    imgTag: imgTag,
    categoryFromId: categoryFromId,
  };
})(typeof window !== "undefined" ? window : globalThis);
