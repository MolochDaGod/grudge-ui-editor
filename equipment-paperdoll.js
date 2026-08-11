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

  /**
   * Render paperdoll into a container.
   * @param {HTMLElement} el
   * @param {object} opts
   * @param {string} [opts.portraitUrl]
   * @param {string} [opts.title]
   * @param {string} [opts.subtitle]
   * @param {object} [opts.equipped] — slot bag or EquippedMap
   * @param {'self'|'inspect'} [opts.mode]
   * @param {(slotId:string, gearKey:string|null)=>void} [opts.onSlotClick]
   * @param {number} [opts.width]
   */
  function render(el, opts) {
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

    const left = SLOTS_LEFT.map((s) => slotHtml(s, equipped[s.id], { readOnly })).join("");
    const right = SLOTS_RIGHT.map((s) => slotHtml(s, equipped[s.id], { readOnly })).join("");

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
          <div class="eq-bottom">
            ${slotHtml(SLOT_SECONDARY, equipped.secondary, { readOnly })}
            <div class="eq-bottom-rule"></div>
            ${slotHtml(SLOT_OFF2, equipped.offhand2, { readOnly })}
            <div class="eq-bottom-rule"></div>
            ${slotHtml(SLOT_ADD, null, { readOnly })}
          </div>
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
    SLOTS_LEFT,
    SLOTS_RIGHT,
  };
})(typeof window !== "undefined" ? window : globalThis);
