/**
 * item-icons.js — thin shim → InfoCatalog (ObjectStore + assets CDN SSOT).
 * Kept for pages that only load this file; main-panel prefers info-catalog.js.
 */
(function (global) {
  "use strict";

  function ensure() {
    if (global.InfoCatalog && global.GrudgeItemIcons) return global.GrudgeItemIcons;
    // Fallback if info-catalog not loaded: minimal CDN pack
    var CDN = "https://assets.grudge-studio.com";
    var PACK = {
      sword: CDN + "/game-assets/icons/pack/weapons/Sword_01.png",
      axe: CDN + "/game-assets/icons/pack/weapons/Axe_01.png",
      dagger: CDN + "/game-assets/icons/pack/weapons/Dagger_01.png",
      hammer: CDN + "/game-assets/icons/pack/weapons/Hammer_01.png",
      spear: CDN + "/game-assets/icons/pack/weapons/Spear_01.png",
      bow: CDN + "/game-assets/icons/pack/weapons/Bow_01.png",
      crossbow: CDN + "/game-assets/icons/pack/weapons/Crossbow_01.png",
      staff: CDN + "/game-assets/icons/pack/weapons/Staff_01.png",
      shield: CDN + "/game-assets/icons/pack/weapons/Shield_01.png",
      armor: CDN + "/icons/armor_full/Chest_01.png",
      helm: CDN + "/icons/armor_full/Helm_01.png",
      boots: CDN + "/icons/armor_full/Boots_01.png",
      gloves: CDN + "/icons/armor_full/Gloves_01.png",
      food: CDN + "/icons/pack/misc/Burns.png",
      potion: CDN + "/icons/pack/misc/Effect.png",
      ore: CDN + "/icons/materials/scrap-ore.png",
      wood: CDN + "/icons/pack/misc/Burns.png",
      hide: CDN + "/icons/pack/misc/Effect.png",
      gem: CDN + "/icons/pack/misc/Electro.png",
      bag: CDN + "/icons/pack/misc/Effect.png",
      default: CDN + "/icons/pack/misc/Effect.png",
    };
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
    function resolve(opts) {
      opts = opts || {};
      var explicit = opts.iconUrl || opts.icon;
      if (explicit && String(explicit).trim()) {
        var raw = String(explicit).trim();
        if (/^(data:|blob:|https?:)/i.test(raw)) {
          return raw
            .replace(/https?:\/\/molochdagod\.github\.io\/ObjectStore/gi, CDN)
            .replace(/https?:\/\/info\.grudge-studio\.com\/icons\//gi, CDN + "/icons/");
        }
      }
      var cat = categoryFromId(opts.itemId || opts.name, opts.name);
      return PACK[cat] || PACK.default;
    }
    global.GrudgeItemIcons = {
      CDN: CDN,
      resolve: resolve,
      fallback: function () {
        return PACK.default;
      },
      imgTag: function (url, alt, size) {
        var s = size || 28;
        var fb = PACK.default;
        return (
          '<img src="' +
          String(url || fb).replace(/"/g, "") +
          '" alt="' +
          String(alt || "").replace(/"/g, "") +
          '" width="' +
          s +
          '" height="' +
          s +
          '" loading="lazy" draggable="false" style="object-fit:contain" onerror="if(!this.dataset.fb){this.dataset.fb=1;this.src=\'' +
          fb +
          "'}\" />"
        );
      },
      categoryFromId: categoryFromId,
    };
    return global.GrudgeItemIcons;
  }

  // If InfoCatalog already defined GrudgeItemIcons, keep it; else install fallback.
  if (!global.GrudgeItemIcons) ensure();
  else {
    // expose ensure for late re-bind after InfoCatalog
    global.GrudgeItemIcons._ensure = ensure;
  }
})(typeof window !== "undefined" ? window : globalThis);
