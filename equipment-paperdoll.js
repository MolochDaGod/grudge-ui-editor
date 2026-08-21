/**
 * Grudge Equipment Paperdoll — Tactical Infinity layout (portrait + slots).
 *
 * Canonical Warlords-era equipment UI for:
 *   - ui.grudge-studio.com/main-panel (equipment tab)
 *   - game-ui-runtime.js equipment-slots / paperdoll-equipment
 *   - Embeds in client.grudge-studio.com and other era games
 *
 * Modes:
 *   self   - player equip (click slots emit grudge:equip:slot)
 *   inspect - read-only view of another unit/player
 *
 * UI rules:
 *   - English labels only (no emoji / alchemy / hieroglyph placeholders)
 *   - Empty slots use short Latin abbr + optional CDN icon (info / assets)
 *   - Fonts: css/grudge-game-fonts.css (Cinzel + Crimson Text + JetBrains Mono)
 *
 * SSOT portraits: race-portraits.js -> client.grudge-studio.com
 * Icons: item-icons.js -> assets.grudge-studio.com (info catalog resolve)
 */
(function (global) {
  "use strict";

  /** Empty-slot icon paths under assets.grudge-studio.com (496 RPG set). */
  var I496 = "https://assets.grudge-studio.com/icons/496_rpg_icons";

  const SLOTS_LEFT = [
    { id: "helmet", gear: "Head", label: "Helmet", abbr: "HEL", icon: I496 + "/A_Armour04.png" },
    { id: "chest", gear: "Chest", label: "Chest", abbr: "CHS", icon: I496 + "/A_Armour01.png" },
    { id: "gloves", gear: "Hands", label: "Gloves", abbr: "GLV", icon: I496 + "/A_Armour02.png" },
    { id: "legs", gear: "Legs", label: "Legs", abbr: "LEG", icon: I496 + "/A_Armour03.png" },
    { id: "boots", gear: "Feet", label: "Boots", abbr: "BOT", icon: I496 + "/A_Shoes01.png" },
  ];
  const SLOTS_RIGHT = [
    { id: "weapon", gear: "MainHand", label: "Weapon 1", abbr: "W1", icon: I496 + "/W_Sword001.png" },
    { id: "offhand", gear: "OffHand", label: "Off 1", abbr: "O1", icon: I496 + "/E_Wood01.png" },
    { id: "relic", gear: "Accessory2", label: "Relic", abbr: "RLC", icon: I496 + "/I_Gem01.png" },
    { id: "back", gear: "Back", label: "Back", abbr: "BCK", icon: I496 + "/I_Bag.png" },
    { id: "mount", gear: "Mount", label: "Mount", abbr: "MNT", icon: I496 + "/S_Buff01.png" },
  ];
  /** Non-drop Q-swap reserve - not a corpse drop slot */
  const SLOT_SECONDARY = {
    id: "secondary",
    gear: "SecondaryWeapon",
    label: "Weapon 2",
    abbr: "W2",
    icon: I496 + "/W_Sword001.png",
  };
  const SLOT_OFF2 = {
    id: "offhand2",
    gear: "OffHand2",
    label: "Off 2",
    abbr: "O2",
    icon: I496 + "/E_Wood01.png",
  };
  const SLOT_ADD = { id: "add", gear: null, label: "Bag", abbr: "BAG", icon: I496 + "/I_Bag.png" };

  const RARITY_CLASS = {
    common: "eq-r-common",
    uncommon: "eq-r-uncommon",
    rare: "eq-r-rare",
    epic: "eq-r-epic",
    legendary: "eq-r-legendary",
  };

  /** Map fleet/model3d equipment bag → paperdoll slot items (+ resolve icons). */
  function normalizeEquipped(raw) {
    if (!raw || typeof raw !== "object") return {};
    const out = {};
    const alias = {
      head: "helmet",
      Head: "helmet",
      helmet: "helmet",
      chest: "chest",
      Chest: "chest",
      body: "chest",
      armor: "chest",
      hands: "gloves",
      Hands: "gloves",
      gloves: "gloves",
      legs: "legs",
      Legs: "legs",
      pants: "legs",
      feet: "boots",
      Feet: "boots",
      boots: "boots",
      weapon: "weapon",
      MainHand: "weapon",
      mainhand: "weapon",
      mainHand: "weapon",
      offhand: "offhand",
      OffHand: "offhand",
      offHand: "offhand",
      shield: "offhand",
      SecondaryWeapon: "secondary",
      secondaryweapon: "secondary",
      secondary: "secondary",
      weapon2: "secondary",
      accessory: "relic",
      Accessory2: "relic",
      amulet: "relic",
      relic: "relic",
      neck: "relic",
      necklace: "relic",
      belt: "back",
      waist: "back",
      cape: "back",
      cloak: "back",
      back: "back",
      Back: "back",
      shoulders: "back",
      Shoulder: "back",
      mount: "mount",
      Mount: "mount",
      ring: "offhand2",
      Accessory1: "offhand2",
      ring1: "offhand2",
      offhand2: "offhand2",
      OffHand2: "offhand2",
      weapon2: "secondary",
    };
    const cat = global.InfoCatalog;
    const resolveIcon =
      (cat && cat.resolveIcon && cat.resolveIcon.bind(cat)) ||
      global.GrudgeItemIcons?.resolve;
    for (const [k, v] of Object.entries(raw)) {
      if (v == null || v === "") continue;
      const slot = alias[k] || alias[String(k).toLowerCase()];
      if (!slot) continue;
      if (typeof v === "string") {
        const looked = cat?.lookup?.({ id: v, name: v }) || null;
        const iconUrl = resolveIcon
          ? resolveIcon({ itemId: v, name: looked?.name || v })
          : null;
        out[slot] = {
          id: v,
          name: looked?.name || v,
          iconUrl,
          rarity: cat?.rarityFromTier?.(looked?.tier, looked?.tierLabel) || "common",
        };
      } else if (typeof v === "object") {
        const id = v.id || v.itemId || v.meshId || "";
        const name = v.name || v.label || id || "Item";
        const looked = cat?.lookup?.({ id, name, uuid: v.uuid }) || null;
        const iconUrl =
          v.iconUrl ||
          v.icon ||
          v.image ||
          (resolveIcon
            ? resolveIcon({
                itemId: id,
                name: looked?.name || name,
                category: v.category,
                type: v.type,
              })
            : null);
        out[slot] = {
          id,
          name: looked?.name || name,
          iconUrl,
          rarity:
            (typeof v.rarity === "string" && RARITY_CLASS[v.rarity] ? v.rarity : null) ||
            cat?.rarityFromTier?.(looked?.tier ?? v.tier, looked?.tierLabel || v.tierLabel) ||
            "common",
          description: v.description || looked?.description || "",
          stats: v.stats || looked?.stats || null,
          meshSlot: v.meshSlot,
          meshVar: v.meshVar,
          weaponType: v.weaponType || looked?.weaponType,
        };
      }
    }
    return out;
  }

  function slotHtml(def, item, opts) {
    const equipped = !!item;
    const rar = item?.rarity ? RARITY_CLASS[item.rarity] || "" : "";
    const title = item?.name || def.label;
    const fb = global.GrudgeItemIcons?.fallback?.() || def.icon || "";
    const emptyIcon = def.icon || fb;
    // Prefer CDN item icon; empty slot = slot chrome icon + Latin abbr (no emoji)
    const icon = item?.iconUrl
      ? `<img class="eq-slot-icon" src="${esc(item.iconUrl)}" alt="" draggable="false" onerror="if(!this.dataset.fb&&'${esc(fb)}'){this.dataset.fb=1;this.src='${esc(fb)}'}" />`
      : emptyIcon
        ? `<img class="eq-slot-icon eq-slot-icon--empty" src="${esc(emptyIcon)}" alt="" draggable="false" /><span class="eq-slot-ph" aria-hidden="true">${esc(def.abbr || def.label.slice(0, 3))}</span>`
        : `<span class="eq-slot-ph">${esc(def.abbr || def.label.slice(0, 3))}</span>`;
    const ro = opts.readOnly ? " data-readonly=\"1\"" : "";
    const nonDrop = def.id === "secondary" || def.id === "offhand2" ? " data-nondrop=\"1\"" : "";
    const setCls =
      def.id === "secondary" || def.id === "offhand2" || def.id === "weapon" || def.id === "offhand"
        ? def.id === "secondary" || def.id === "offhand2"
          ? " eq-secondary"
          : " eq-primary-set"
        : "";
    return `<button type="button" class="eq-slot ${equipped ? "equipped" : ""}${rar ? " " + rar : ""}${setCls}" data-slot="${def.id}" data-gear="${def.gear || ""}" title="${esc(title)}"${ro}${nonDrop}>
      ${icon}
      <span class="eq-slot-label">${esc(def.label)}</span>
    </button>`;
  }

  function esc(s) {
    return String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /** Unity Trait Store paperdoll (uMMORPG Character Creation screenshots). */
  const UNITY_DOLL_LEFT = [
    { id: "helmet", gear: "Head", label: "Head", abbr: "HD" },
    { id: "gloves", gear: "Hands", label: "Hands", abbr: "HND" },
    { id: "boots", gear: "Feet", label: "Boots", abbr: "BT" },
    { id: "ring", gear: "Accessory1", label: "Ring", abbr: "RNG" },
  ];
  const UNITY_DOLL_RIGHT = [
    { id: "shoulders", gear: "Shoulders", label: "Shoulders", abbr: "SHD" },
    { id: "chest", gear: "Chest", label: "Body", abbr: "BDY" },
    { id: "back", gear: "Back", label: "Back", abbr: "BCK" },
    { id: "relic", gear: "Accessory2", label: "Relic", abbr: "RLC" },
  ];
  const UNITY_CARDS = [
    { id: "faction", kind: "faction", title: "FACTION" },
    { id: "class", kind: "class", title: "CLASS" },
    { id: "weapon", kind: "equip", title: "MAINHAND", gear: "MainHand", slotFilter: "mainhand" },
    { id: "offhand", kind: "equip", title: "OFFHAND", gear: "OffHand", slotFilter: "offhand" },
    { id: "helmet", kind: "equip", title: "HEAD", gear: "Head", meshGroup: "head" },
    { id: "shoulders", kind: "equip", title: "SHOULDERS", gear: "Shoulders", meshGroup: "shoulders" },
    { id: "chest", kind: "equip", title: "BODY", gear: "Chest", meshGroup: "body" },
    { id: "back", kind: "equip", title: "BACK", gear: "Back", meshGroup: "utility" },
    { id: "gloves", kind: "equip", title: "HANDS", gear: "Hands", meshGroup: "arms" },
    { id: "ring", kind: "equip", title: "RING", gear: "Accessory1" },
    { id: "boots", kind: "equip", title: "BOOTS", gear: "Feet", meshGroup: "legs" },
    { id: "relic", kind: "equip", title: "RELIC", gear: "Accessory2" },
    { id: "mount", kind: "equip", title: "MOUNT", gear: "Mount", slotFilter: "mount" },
    { id: "boat", kind: "equip", title: "BOAT", gear: "Boat", slotFilter: "boat" },
  ];
  const RACES_UI = ["human", "barbarian", "elf", "dwarf", "orc", "undead"];
  const CLASSES_UI = ["warrior", "ranger", "mage", "worge"];
  const KIND_ICON = {
    sword: I496 + "/W_Sword001.png",
    axe: I496 + "/W_Axe001.png",
    hammer: I496 + "/W_Mace001.png",
    mace: I496 + "/W_Mace001.png",
    dagger: I496 + "/W_Sword001.png",
    spear: I496 + "/W_Spear001.png",
    pick: I496 + "/W_Axe001.png",
    bow: I496 + "/W_Bow01.png",
    staff: I496 + "/I_Staff01.png",
    shield: I496 + "/E_Wood01.png",
    bag: I496 + "/I_Bag.png",
    wood: I496 + "/I_Coal.png",
    quiver: I496 + "/I_Bag.png",
  };
  const INFO_BASE = "https://info.grudge-studio.com/api/v1";
  var SOCKETS_CACHE = null;
  var CLASSES_CACHE = null;

  function fetchJson(url) {
    return fetch(url, { mode: "cors" }).then((r) => {
      if (!r.ok) throw new Error(String(r.status));
      return r.json();
    });
  }

  function loadNamedSockets() {
    if (SOCKETS_CACHE) return Promise.resolve(SOCKETS_CACHE);
    if (global.__grudgeNamedSockets) {
      SOCKETS_CACHE = global.__grudgeNamedSockets;
      return Promise.resolve(SOCKETS_CACHE);
    }
    fetchJson("./data/warlords-mesh-catalog.json")
      .then((j) => {
        global.__grudgeMeshCatalog = j;
      })
      .catch(() => {});
    fetchJson("./data/mesh-showcase-index.json")
      .then((j) => {
        global.__grudgeMeshUuidIndex = j;
      })
      .catch(() => {});
    if (global.WarlordsCharacter?.loadMeshCatalog) {
      global.WarlordsCharacter.loadMeshCatalog().then((j) => {
        if (j) global.__grudgeMeshCatalog = j;
      });
    }
    return fetchJson("./data/toon-rts-named-sockets.json")
      .catch(() => fetchJson("https://ui.grudge-studio.com/data/toon-rts-named-sockets.json"))
      .catch(() => fetchJson(INFO_BASE + "/toon-rts-named-sockets.json"))
      .catch(() => fetchJson("https://objectstore.grudge-studio.com/api/v1/toon-rts-named-sockets.json"))
      .then((j) => {
        SOCKETS_CACHE = j;
        global.__grudgeNamedSockets = j;
        return j;
      })
      .catch(() => null);
  }

  function loadClassCatalog() {
    if (CLASSES_CACHE) return Promise.resolve(CLASSES_CACHE);
    return fetchJson(INFO_BASE + "/classes.json")
      .catch(() => fetchJson("https://objectstore.grudge-studio.com/api/v1/classes.json"))
      .then((j) => {
        CLASSES_CACHE = j;
        return j;
      })
      .catch(() => null);
  }

  function unityEquipped(raw) {
    const base = normalizeEquipped(raw);
    const out = { ...base };
    if (raw && typeof raw === "object") {
      if (raw.shoulders && !out.shoulders) {
        out.shoulders = base.back && raw.shoulders.meshSlot === "shoulders" ? base.back : normalizeEquipped({ helmet: raw.shoulders }).helmet;
        if (raw.shoulders && typeof raw.shoulders === "object") {
          const looked = normalizeEquipped({ helmet: raw.shoulders }).helmet;
          if (looked) out.shoulders = looked;
        }
      }
      if (raw.ring && !out.ring) {
        const looked = normalizeEquipped({ helmet: raw.ring }).helmet;
        if (looked) out.ring = looked;
      }
      if (base.offhand2 && !out.ring) out.ring = base.offhand2;
      if (base.back && raw.shoulders && !out.shoulders) out.shoulders = base.back;
    }
    return out;
  }

  function socketsFor(race, filter) {
    const pack = SOCKETS_CACHE?.races?.[race] || SOCKETS_CACHE?.races?.human;
    const items = pack?.items || [];
    if (!filter) return items;
    return items.filter((it) => {
      if (filter === "mainhand") return it.slot === "mainhand";
      if (filter === "offhand") return it.slot === "offhand" || it.kind === "shield";
      if (filter === "utility") return it.slot === "back";
      return it.kind === filter || it.slot === filter;
    });
  }

  const CORE_MESH_GROUPS = { head: true, body: true, arms: true, legs: true };
  const GROUP_TO_SLOT = {
    head: "helmet",
    body: "chest",
    arms: "gloves",
    legs: "boots",
    shoulders: "shoulders",
    weapons: "weapon",
    shields: "offhand",
    utility: "back",
  };

  function meshCatalogAll(race) {
    const WC = global.WarlordsCharacter;
    const fromWc = WC?.catalogFor?.(race);
    if (fromWc) return fromWc;
    const n = WC?.normalizeRace ? WC.normalizeRace(race) : race;
    return global.__grudgeMeshCatalog?.races?.[n]?.catalog || global.__grudgeMeshCatalog?.races?.[race]?.catalog || null;
  }

  function meshCatalogGroup(race, group) {
    const cat = meshCatalogAll(race);
    const list = (cat && cat[group]) || [];
    return list.filter((id) => !/container/i.test(id));
  }

  function unarmedSet(race) {
    const ids = global.WarlordsCharacter?.unarmedMeshIds?.(race) || [];
    return new Set(ids);
  }

  function prettyMeshName(id, race) {
    const rec = global.__grudgeMeshUuidIndex?.races?.[race || "human"];
    const hit = rec?.items?.find((it) => it.meshId === id);
    if (hit?.name) return hit.name;
    return String(id || "")
      .replace(/^WK_|^BRB_|^ELF_|^DWF_|^ORC_|^UD_/i, "")
      .replace(/^Units_/i, "")
      .replace(/^Xtra_/i, "")
      .replace(/_/g, " ")
      .trim();
  }

  function meshDefUuid(id, race) {
    const rec = global.__grudgeMeshUuidIndex?.races?.[race || "human"];
    return rec?.items?.find((it) => it.meshId === id)?.defUuid || "";
  }

  function iconForItem(item, kind) {
    if (item?.iconUrl) return item.iconUrl;
    const cat = global.InfoCatalog;
    if (cat?.resolveIcon && item) {
      const u = cat.resolveIcon({ itemId: item.id, name: item.name, type: item.kind || kind });
      if (u) return u;
    }
    return KIND_ICON[item?.kind || kind] || KIND_ICON.sword;
  }

  function statsLines(item) {
    const st = item?.stats;
    const lines = [];
    if (st && typeof st === "object") {
      for (const [k, v] of Object.entries(st)) {
        if (v == null || v === "") continue;
        const label = String(k).replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
        const n = typeof v === "number" ? (v > 0 ? "+" + v : String(v)) : String(v);
        lines.push(`${label} ${n}`);
      }
    }
    if (item?.kind) lines.push(item.kind === "shield" ? "Offhand" : item.slot === "mainhand" ? "Mainhand Weapon" : item.kind);
    if (item?.bone) lines.push("Bone " + item.bone);
    if (item?.placeholder) lines.push("Placeholder — mesh not on kit");
    if (item?.requiredLevel != null) lines.push("required Lv " + item.requiredLevel);
    else if (item && !item.placeholder) lines.push("required Lv 1");
    return lines;
  }

  function classPassives(cls) {
    const attrs = cls?.startingAttributes || {};
    const map = {
      Strength: "INCREASED STRENGTH",
      Vitality: "INCREASED VITALITY",
      Endurance: "INCREASED ENDURANCE",
      Dexterity: "INCREASED DEXTERITY",
      Agility: "INCREASED AGILITY",
      Intellect: "INCREASED INTELLECT",
      Wisdom: "INCREASED WISDOM",
      Tactics: "INCREASED TACTICS",
    };
    return Object.entries(attrs)
      .filter(([, v]) => Number(v) >= 3)
      .sort((a, b) => Number(b[1]) - Number(a[1]))
      .slice(0, 3)
      .map(([k]) => map[k] || k);
  }

  function classSkills(cls) {
    const list = [];
    (cls?.abilities || []).slice(0, 4).forEach((a) => list.push(a));
    if (cls?.signatureAbility) list.push(cls.signatureAbility);
    return list.slice(0, 4);
  }

  function cdnIcon(path) {
    if (!path) return "";
    if (/^https?:/i.test(path)) return path;
    return "https://assets.grudge-studio.com" + (path.startsWith("/") ? path : "/" + path);
  }

  function skillTip(sk) {
    if (!sk) return "";
    const bits = [
      `<strong>${esc(sk.name || sk.n || sk.id)}</strong>`,
      sk.description || sk.d || sk.tooltip || "",
      sk.cooldown != null ? `CD ${sk.cooldown}s` : "",
      sk.manaCost ? `Mana ${sk.manaCost}` : "",
      sk.staminaCost ? `Stamina ${sk.staminaCost}` : "",
      sk.damage != null ? `Damage ${sk.damage}` : "",
    ].filter(Boolean);
    return bits.join("<br>");
  }

  function collectionHtml(list, activeId, era) {
    const cells = [];
    const src = Array.isArray(list) ? list.slice(0, 4) : [];
    for (let i = 0; i < 8; i++) {
      const c = src[i];
      if (c) {
        const img = c.portraitUrl || c.portrait || "";
        const on = c.id && c.id === activeId ? " on" : "";
        cells.push(`<button type="button" class="eq-cnft${on}" data-cid="${esc(c.id)}" title="${esc(c.name || "Hero")}">
          ${img ? `<img src="${esc(img)}" alt="" />` : `<span>${esc((c.name || "?").slice(0, 1))}</span>`}
        </button>`);
      } else {
        const foundry = `https://character.grudge-studio.com/foundry?era=${encodeURIComponent(era || "warlords")}`;
        cells.push(`<a class="eq-cnft empty" href="${esc(foundry)}" target="_blank" rel="noopener" title="Create CNFT hero">+</a>`);
      }
    }
    return cells.join("");
  }

  function cardSelect(options, value, flags) {
    flags = flags || {};
    const rows = [];
    if (flags.allowNone !== false) rows.push(`<option value="">None</option>`);
    options.forEach((o) => {
      const id = o.id || o;
      const name = o.name || o.label || id;
      const ph = o.placeholder ? " (placeholder)" : "";
      const base = o.baseUnarmed ? " · base" : "";
      const sel = String(value || "") === String(id) ? " selected" : "";
      rows.push(`<option value="${esc(id)}"${sel}>${esc(name + ph + base)}</option>`);
    });
    return `<select class="eq-card-select">${rows.join("")}</select>`;
  }

  function equipCardHtml(def, item, opts) {
    const race = opts.race || "human";
    const core = !!(def.meshGroup && CORE_MESH_GROUPS[def.meshGroup]);
    const baseIds = unarmedSet(race);
    let choices = [];
    if (def.meshGroup) {
      const names = meshCatalogGroup(race, def.meshGroup);
      choices = names.map((id) => ({
        id,
        name: prettyMeshName(id),
        kind: def.meshGroup,
        bone: "skinned",
        onAsset: true,
        baseUnarmed: baseIds.has(id),
      }));
    }
    if (!choices.length && def.slotFilter) {
      choices = socketsFor(race, def.slotFilter).filter((it) => !it.placeholder || def.slotFilter !== "mainhand");
    }
    const val = item?.meshId || (item?.id && choices.some((c) => c.id === item.id) ? item.id : "") || (core ? [...baseIds].find((id) => {
      const g = global.WarlordsCharacter?.groupOfMesh?.(id);
      return g === def.meshGroup;
    }) : "") || "";
    const chosen = choices.find((c) => c.id === val) || item;
    const icon = iconForItem(chosen, item?.kind || def.meshGroup);
    const lines = statsLines(item);
    const req = lines.find((l) => /required Lv/i.test(l));
    const rest = lines.filter((l) => l !== req);
    const locked = core && chosen?.baseUnarmed;
    return `<article class="eq-card" data-slot="${esc(def.id)}" data-gear="${esc(def.gear || "")}">
      <header class="eq-card-h">${esc(def.title)}${core ? ` <span class="eq-core-tag">kit</span>` : ""}</header>
      ${cardSelect(choices, val, { allowNone: !core })}
      <div class="eq-card-body">
        <div class="eq-card-icon">${icon ? `<img src="${esc(icon)}" alt="" />` : `<span>CATEGORY</span>`}</div>
        <div class="eq-card-info">
          ${val ? `<div class="eq-card-name">${esc(prettyMeshName(val))}</div>` : `<div class="eq-card-name muted">None</div>`}
          ${locked ? `<div class="eq-ph-flag">Unarmed base</div>` : ""}
          ${item?.placeholder ? `<div class="eq-ph-flag">Placeholder</div>` : ""}
          ${rest.map((l) => `<div class="eq-stat">${esc(l)}</div>`).join("")}
          ${req ? `<div class="eq-req">${esc(req)}</div>` : ""}
        </div>
      </div>
    </article>`;
  }

  function meshKitHtml(opts) {
    const race = opts.race || "human";
    const cat = meshCatalogAll(race);
    if (!cat) return `<section class="eq-mesh-kit"><p class="eq-loading">Loading race meshes…</p></section>`;
    const baseIds = unarmedSet(race);
    const equipped = unityEquipped(opts.equipped);
    const groups = ["body", "arms", "legs", "head", "shoulders", "weapons", "shields", "utility"];
    const blocks = groups
      .map((g) => {
        const ids = meshCatalogGroup(race, g);
        if (!ids.length) return "";
        const slot = GROUP_TO_SLOT[g];
        const current =
          equipped[slot]?.meshId ||
          equipped[slot]?.id ||
          "";
        const chips = ids
          .map((id) => {
            const base = baseIds.has(id);
            const on = current === id || (!current && base && CORE_MESH_GROUPS[g]);
            const cls = ["eq-mesh-chip", on ? "on" : "", base ? "base" : ""].filter(Boolean).join(" ");
            const title = prettyMeshName(id, race) + (base ? " (unarmed base)" : "");
            const uid = meshDefUuid(id, race);
            return `<button type="button" class="${cls}" data-mesh-pick="${esc(id)}" data-slot="${esc(slot)}" title="${esc(title + (uid ? " · " + uid : ""))}">${esc(prettyMeshName(id, race))}</button>`;
          })
          .join("");
        const none =
          CORE_MESH_GROUPS[g]
            ? ""
            : `<button type="button" class="eq-mesh-chip none${current ? "" : " on"}" data-mesh-pick="" data-slot="${esc(slot)}">None</button>`;
        return `<div class="eq-mesh-group" data-group="${esc(g)}">
          <h4>${esc(g)}</h4>
          <div class="eq-mesh-chips">${none}${chips}</div>
        </div>`;
      })
      .join("");
    const counts = groups.map((g) => meshCatalogGroup(race, g).length).reduce((a, b) => a + b, 0);
    return `<section class="eq-mesh-kit">
      <h3>RACE MESHES · ${esc(String(race).toUpperCase())}</h3>
      <p class="eq-cnft-sub">${counts} kit meshes · unarmed body locked as base · extras optional</p>
      ${blocks}
    </section>`;
  }

  function factionCardHtml(opts) {
    const race = opts.race || "human";
    const portrait =
      opts.portraitUrl ||
      (global.grudgePortraitForRace && global.grudgePortraitForRace(race)) ||
      "";
    const sel = RACES_UI.map((r) => `<option value="${r}"${r === race ? " selected" : ""}>${r[0].toUpperCase() + r.slice(1)}</option>`).join("");
    return `<article class="eq-card eq-card-faction" data-slot="faction">
      <header class="eq-card-h">FACTION</header>
      <select class="eq-card-select" data-faction="1">${sel}</select>
      <div class="eq-card-body eq-card-body-center">
        ${portrait ? `<img class="eq-faction-shot" src="${esc(portrait)}" alt="" />` : ""}
      </div>
    </article>`;
  }

  function classCardHtml(opts) {
    const classId = String(opts.classId || "warrior").toLowerCase();
    const cls = CLASSES_CACHE?.classes?.[classId] || CLASSES_CACHE?.classes?.warrior || {};
    const sel = CLASSES_UI.map((c) => {
      const n = CLASSES_CACHE?.classes?.[c]?.name || c;
      return `<option value="${c}"${c === classId ? " selected" : ""}>${esc(n)}</option>`;
    }).join("");
    const passives = classPassives(cls);
    const skills = classSkills(cls);
    const color = cls.color || "#22c55e";
    const skillsHtml = skills
      .map((sk) => {
        const ic = cdnIcon(sk.iconUrl || sk.icon);
        return `<button type="button" class="eq-skill" data-tip="${esc(skillTip(sk))}" title="${esc(sk.name || sk.id)}">
          ${ic ? `<img src="${esc(ic)}" alt="" />` : `<span>${esc((sk.name || "SK").slice(0, 2))}</span>`}
        </button>`;
      })
      .join("");
    return `<article class="eq-card eq-card-class" data-slot="class">
      <header class="eq-card-h">CLASS</header>
      <select class="eq-card-select" data-class="1">${sel}</select>
      <div class="eq-card-body eq-class-body">
        ${cls.iconUrl ? `<img class="eq-class-icon" src="${esc(cdnIcon(cls.iconUrl))}" alt="" />` : ""}
        <div class="eq-class-name" style="color:${esc(color)}">${esc((cls.name || classId).toUpperCase())}</div>
        <div class="eq-class-pass">${passives.map((p) => esc(p)).join("<br>") || esc(cls.description || "")}</div>
        <div class="eq-class-sk-label">-PASSIVE SKILLS-</div>
        <div class="eq-class-skills">${skillsHtml}</div>
      </div>
    </article>`;
  }

  function renderUnity(el, opts) {
    opts = opts || {};
    const mode = opts.mode === "inspect" ? "inspect" : "self";
    const readOnly = mode === "inspect" || !!opts.readOnly;
    const equipped = unityEquipped(opts.equipped);
    const race = opts.race || "human";
    const classId = opts.classId || "warrior";
    const era = opts.era || "warlords";
    const title = opts.title || "GRUDGE WARLORD";

    el.classList.add("eq-paperdoll", "eq-unity-host");
    el.dataset.mode = mode;
    el.dataset.layout = "unity";

    const left = UNITY_DOLL_LEFT.map((s) => slotHtml(s, equipped[s.id], { readOnly })).join("");
    const right = UNITY_DOLL_RIGHT.map((s) => slotHtml(s, equipped[s.id], { readOnly })).join("");
    const cards = UNITY_CARDS.map((def) => {
      if (def.kind === "faction") return factionCardHtml(opts);
      if (def.kind === "class") return classCardHtml(opts);
      return equipCardHtml(def, equipped[def.id], opts);
    }).join("");

    const ocean = "https://info.grudge-studio.com/backgrounds/hero_creation_ocean.png";

    el.innerHTML = `
      <div class="eq-unity">
        <div class="eq-unity-left">
          <section class="eq-collection">
            <h3>YOUR COLLECTION</h3>
            <p class="eq-cnft-sub">cNFT roster · ${esc(era)} era · 4 slots</p>
            <div class="eq-collection-grid">${collectionHtml(opts.collection, opts.characterId, era)}</div>
          </section>
          <section class="eq-hero-stage">
            <div class="eq-hero-banner">${esc(title)}</div>
            <div class="eq-hero-pills">
              <span class="eq-pill race">${esc(String(race).toUpperCase())}</span>
              <span class="eq-pill class">${esc(String(classId).toUpperCase())}</span>
            </div>
            <div class="eq-hero-body">
              <div class="eq-col left">${left}</div>
              <div class="eq-portrait-wrap" style="background-image:url('${ocean}')">
                <img class="eq-portrait" src="${esc(opts.portraitUrl || "")}" alt="" draggable="false" />
              </div>
              <div class="eq-col right">${right}</div>
            </div>
          </section>
        </div>
        <div class="eq-unity-cards">${cards}</div>
        ${meshKitHtml(opts)}
      </div>
    `;

    const wrap = el.querySelector(".eq-portrait-wrap");
    if (wrap && global.MainPanelMesh?.renderMeshOverlay) {
      global.MainPanelMesh.renderMeshOverlay(wrap, {
        race,
        classId,
        equipment: equipped,
        meshIds: opts.meshIds,
        unarmed: opts.unarmed,
      });
    }
    if (global.Grudge6Viewport?.mount) {
      global.Grudge6Viewport.mount(el, {
        race,
        classId,
        meshIds: opts.meshIds,
        unarmed: opts.unarmed,
      }).catch((e) => console.warn("[trait-store] viewport", e));
    }

    el.onclick = (e) => {
      const cnft = e.target.closest("[data-cid]");
      if (cnft) {
        opts.onSelectCharacter?.(cnft.dataset.cid);
        return;
      }
      const chip = e.target.closest("[data-mesh-pick]");
      if (chip) {
        opts.onCatalogPick?.(chip.dataset.slot, chip.dataset.meshPick || "", chip.dataset.gear || null);
        return;
      }
      const btn = e.target.closest(".eq-slot");
      if (btn && btn.dataset.readonly !== "1") {
        opts.onSlotClick?.(btn.dataset.slot, btn.dataset.gear || null);
        global.dispatchEvent(
          new CustomEvent("grudge:equip:slot", {
            detail: { slotId: btn.dataset.slot, gearKey: btn.dataset.gear || null, mode, entityId: opts.entityId || null },
          }),
        );
      }
    };

    el.onchange = (e) => {
      const sel = e.target.closest("select");
      if (!sel) return;
      if (sel.dataset.faction) {
        opts.onFactionChange?.(sel.value);
        return;
      }
      if (sel.dataset.class) {
        opts.onClassChange?.(sel.value);
        return;
      }
      const card = sel.closest(".eq-card");
      if (!card) return;
      opts.onCatalogPick?.(card.dataset.slot, sel.value, card.dataset.gear || null);
    };

    return {
      el,
      layout: "unity",
      setEquipped(next) {
        renderUnity(el, { ...opts, equipped: next });
      },
      setPortrait(url) {
        renderUnity(el, { ...opts, portraitUrl: url });
      },
      setMode(m) {
        renderUnity(el, { ...opts, mode: m });
      },
      setMesh(meshOpts) {
        renderUnity(el, { ...opts, ...meshOpts });
      },
      getEquipped() {
        return { ...equipped };
      },
    };
  }

  /**
   * Render paperdoll into a container.
   * layout: "unity" (Trait Store / Character Creation) or "tactical"
   */
  function render(el, opts) {
    if (!el) return null;
    opts = opts || {};
    const layout = opts.layout || "unity";
    if (layout === "tactical") return renderTactical(el, opts);
    const run = () => renderUnity(el, opts);
    const meshReady = !!(global.__grudgeMeshCatalog || global.WarlordsCharacter?.meshCatalog);
    if (SOCKETS_CACHE && CLASSES_CACHE && meshReady) return run();
    Promise.all([
      loadNamedSockets(),
      loadClassCatalog(),
      global.WarlordsCharacter?.loadMeshCatalog?.() || Promise.resolve(),
    ]).then((res) => {
      if (res[2]) global.__grudgeMeshCatalog = res[2];
      run();
    });
    el.classList.add("eq-paperdoll", "eq-unity-host");
    if (!el.innerHTML) el.innerHTML = `<div class="eq-unity"><p class="eq-loading">Loading Trait Store catalogs…</p></div>`;
    return { el, layout: "unity", pending: true };
  }

  /**
   * Tactical Infinity paperdoll (portrait + left/right slots).
   */
  function renderTactical(el, opts) {
    if (!el) return null;
    opts = opts || {};
    const mode = opts.mode === "inspect" ? "inspect" : "self";
    const readOnly = mode === "inspect" || !!opts.readOnly;
    const equipped = normalizeEquipped(opts.equipped);
    const width = opts.width || 420;
    const title = opts.title || "GRUDGE WARLORD";
    const subtitle = opts.subtitle || (mode === "inspect" ? "Inspect equipment" : "Equipment loadout");
    const portrait =
      opts.portraitUrl ||
      (global.grudgePortraitForRace && global.grudgePortraitForRace(opts.race || "human")) ||
      "https://client.grudge-studio.com/images/portraits/human.png";

    el.classList.add("eq-paperdoll");
    el.dataset.mode = mode;
    el.style.setProperty("--eq-width", width + "px");

    const cols = opts.slots || null;
    const leftSlots = cols?.left || SLOTS_LEFT;
    const rightSlots = cols?.right || SLOTS_RIGHT;
    const bottomSlots = cols?.bottom || [SLOT_SECONDARY, SLOT_OFF2, SLOT_ADD];
    const left = leftSlots.map((s) => slotHtml(s, equipped[s.id], { readOnly })).join("");
    const right = rightSlots.map((s) => slotHtml(s, equipped[s.id], { readOnly })).join("");
    const bottom = bottomSlots
      .map((s, i) => (i ? `<div class="eq-bottom-rule"></div>` : "") + slotHtml(s, equipped[s.id], { readOnly }))
      .join("");

    el.innerHTML = `
      <div class="eq-paperdoll-inner" style="width:${width}px">
        <div class="eq-title-strip"><h2>${esc(title)}</h2></div>
        <div class="eq-race-pill"><h3>${esc(subtitle)}</h3></div>
        <div class="eq-body">
          <div class="eq-col left">${left}</div>
          <div class="eq-portrait-wrap">
            <img class="eq-portrait" src="${esc(portrait)}" alt="Portrait" draggable="false" />
          </div>
          <div class="eq-col right">${right}</div>
          <div class="eq-bottom">${bottom}</div>
        </div>
        <p class="eq-secondary-hint">Weapon 2 / Off 2 are combat Q-swap loadout (not looted from corpse).</p>
        ${mode === "inspect" ? `<div class="eq-inspect-badge">Inspecting</div>` : ""}
        ${opts.showMeshHint !== false ? `<p class="eq-mesh-hint">Click armor/weapon slots to cycle grudge6 mesh variants · texture atlas by race</p>` : ""}
      </div>
    `;

    // Mesh-level overlay when main-panel-mesh.js is present
    const wrap = el.querySelector(".eq-portrait-wrap");
    if (wrap && global.MainPanelMesh?.renderMeshOverlay) {
      global.MainPanelMesh.renderMeshOverlay(wrap, {
        race: opts.race || "human",
        classId: opts.classId || "warrior",
        equipment: equipped,
        meshIds: opts.meshIds,
        unarmed: opts.unarmed,
      });
    }
    if (global.Grudge6Viewport?.mount) {
      global.Grudge6Viewport.mount(el, {
        race: opts.race || "human",
        classId: opts.classId || "warrior",
        meshIds: opts.meshIds,
        unarmed: opts.unarmed,
      }).catch((e) => console.warn("[paperdoll] viewport", e));
    }

    el.onclick = (e) => {
      const btn = e.target.closest(".eq-slot");
      if (!btn || btn.dataset.readonly === "1") return;
      const slotId = btn.dataset.slot;
      const gear = btn.dataset.gear || null;
      opts.onSlotClick?.(slotId, gear);
      global.dispatchEvent(
        new CustomEvent("grudge:equip:slot", {
          detail: { slotId, gearKey: gear, mode, entityId: opts.entityId || null },
        }),
      );
    };

    return {
      el,
      setEquipped(next) {
        render(el, { ...opts, equipped: next });
      },
      setPortrait(url) {
        render(el, { ...opts, portraitUrl: url });
      },
      setMode(m) {
        render(el, { ...opts, mode: m });
      },
      setMesh(meshOpts) {
        render(el, { ...opts, ...meshOpts });
      },
      getEquipped() {
        return { ...equipped };
      },
    };
  }

  /** Mount helper for game-ui-runtime / pack comps. */
  function mountPaperdoll(parent, props) {
    const wrap = document.createElement("div");
    parent.appendChild(wrap);
    return render(wrap, props || {});
  }

  global.GrudgeEquipmentPaperdoll = {
    render,
    mount: mountPaperdoll,
    normalizeEquipped,
    unityEquipped,
    loadNamedSockets,
    loadClassCatalog,
    socketsFor,
    SLOTS_LEFT,
    SLOTS_RIGHT,
    SLOT_SECONDARY,
    SLOT_OFF2,
    SLOT_ADD,
    UNITY_CARDS,
    UNITY_DOLL_LEFT,
    UNITY_DOLL_RIGHT,
  };
})(typeof window !== "undefined" ? window : globalThis);
