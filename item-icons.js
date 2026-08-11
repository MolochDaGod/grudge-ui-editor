/**
 * item-icons.js — CDN icon resolve for main-panel bag / paperdoll / loot.
 * Prefer assets.grudge-studio.com + info catalog paths (English filenames).
 * No emoji glyphs — always PNG URLs.
 */
(function (global) {
  "use strict";

  var CDN = "https://assets.grudge-studio.com";
  /** 496 RPG icon set (production fleet icons) */
  var I496 = CDN + "/icons/496_rpg_icons";
  /** Legacy pack paths (fallback) */
  var PACK_LEGACY = CDN + "/icons/pack";

  var PACK = {
    sword: I496 + "/W_Sword001.png",
    axe: I496 + "/W_Axe001.png",
    dagger: I496 + "/W_Dagger001.png",
    hammer: I496 + "/W_Mace001.png",
    spear: I496 + "/W_Spear001.png",
    bow: I496 + "/W_Bow001.png",
    crossbow: I496 + "/W_Bow001.png",
    gun: I496 + "/W_Gun001.png",
    staff: I496 + "/W_Staff001.png",
    wand: I496 + "/W_Wand001.png",
    shield: I496 + "/E_Wood01.png",
    armor: I496 + "/A_Armour01.png",
    helm: I496 + "/A_Armour04.png",
    boots: I496 + "/A_Shoes01.png",
    gloves: I496 + "/A_Armour02.png",
    food: I496 + "/I_C_Meat.png",
    potion: I496 + "/P_Red01.png",
    ore: I496 + "/I_Coal.png",
    wood: I496 + "/I_Wood01.png",
    hide: I496 + "/I_Fabric.png",
    gem: I496 + "/I_Gem01.png",
    bag: I496 + "/I_Bag.png",
    relic: I496 + "/I_Gem01.png",
    back: I496 + "/I_Bag.png",
    mount: I496 + "/S_Buff01.png",
    default: I496 + "/I_Bag.png",
  };

  function abs(path) {
    if (!path) return PACK.default;
    if (/^(data:|blob:|https?:)/i.test(path)) return path;
    return CDN + (path.charAt(0) === "/" ? path : "/" + path);
  }

  function categoryFromId(itemId, name) {
    var s = String(itemId || "") + " " + String(name || "");
    s = s.toLowerCase();
    if (/shield|offhand|tome/.test(s)) return "shield";
    if (/bow|crossbow|xbow/.test(s)) return "bow";
    if (/gun|pistol|rifle|flintlock/.test(s)) return "gun";
    if (/wand/.test(s)) return "wand";
    if (/staff|scepter|sapling/.test(s)) return "staff";
    if (/axe|hatchet|greataxe/.test(s)) return "axe";
    if (/dagger|knife/.test(s)) return "dagger";
    if (/hammer|mace|pick|warhammer/.test(s)) return "hammer";
    if (/spear|lance/.test(s)) return "spear";
    if (/sword|blade|greatsword/.test(s)) return "sword";
    if (/helm|hood|hat|head/.test(s)) return "helm";
    if (/boot|feet/.test(s)) return "boots";
    if (/glove|gauntlet|hand|arms/.test(s)) return "gloves";
    if (/chest|vest|robe|armor|plate|body/.test(s)) return "armor";
    if (/potion|tonic|elixir/.test(s)) return "potion";
    if (/meat|stew|bread|food|herb/.test(s)) return "food";
    if (/ore|ingot|metal|scrap|coal|stone/.test(s)) return "ore";
    if (/wood|plank|log/.test(s)) return "wood";
    if (/hide|leather|pelt|fabric/.test(s)) return "hide";
    if (/gem|crystal|dust|essence|relic/.test(s)) return "gem";
    if (/bag|pack|quiver|back|cloak|cape|wing|windsurf/.test(s)) return "back";
    if (/mount|horse|cavalry/.test(s)) return "mount";
    return "default";
  }

  function resolveItemIconUrl(opts) {
    opts = opts || {};
    var explicit = opts.iconUrl || opts.icon;
    if (explicit && String(explicit).trim()) {
      var raw = String(explicit).trim();
      // Reject pure emoji / non-path strings
      if (!/[./]/.test(raw) && !/^https?:/i.test(raw)) {
        /* fall through to category */
      } else {
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
    var cat = opts.category || categoryFromId(id, opts.name);
    cat = String(cat).toLowerCase();
    if (PACK[cat]) return PACK[cat];
    return abs(PACK[categoryFromId(id, opts.name)] || PACK.default);
  }

  function fallbackUrl() {
    return PACK.default;
  }

  function imgTag(url, alt, size) {
    var fb = fallbackUrl();
    var s = size || 28;
    var safe = (url || fb).replace(/"/g, "");
    return (
      '<img src="' +
      safe +
      '" alt="' +
      String(alt || "")
        .replace(/"/g, "")
        .replace(/[^\x20-\x7E]/g, "") +
      '" width="' +
      s +
      '" height="' +
      s +
      '" loading="lazy" draggable="false" style="object-fit:contain;image-rendering:pixelated;width:' +
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
    I496: I496,
    PACK: PACK,
    resolve: resolveItemIconUrl,
    fallback: fallbackUrl,
    imgTag: imgTag,
    categoryFromId: categoryFromId,
  };
})(typeof window !== "undefined" ? window : globalThis);
