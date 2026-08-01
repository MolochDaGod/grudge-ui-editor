/**
 * Grudge Equipment Paperdoll — Tactical Infinity layout (portrait + 12 slots).
 *
 * Canonical Warlords-era equipment UI for:
 *   - ui.grudge-studio.com/main-panel (equipment tab)
 *   - game-ui-runtime.js equipment-slots / paperdoll-equipment
 *   - Embeds in client.grudge-studio.com and other era games
 *
 * Modes:
 *   self   — player equip (click slots emit grudge:equip:slot)
 *   inspect — read-only view of another unit/player
 *
 * SSOT portraits: race-portraits.js → client.grudge-studio.com
 */
(function (global) {
  "use strict";

  const SLOTS_LEFT = [
    { id: "helmet", gear: "Head", label: "Helmet", emoji: "⛑" },
    { id: "chest", gear: "Chest", label: "Chest", emoji: "🥋" },
    { id: "gloves", gear: "Hands", label: "Gloves", emoji: "🧤" },
    { id: "legs", gear: "Legs", label: "Legs", emoji: "👖" },
    { id: "boots", gear: "Feet", label: "Boots", emoji: "🥾" },
  ];
  const SLOTS_RIGHT = [
    { id: "weapon", gear: "MainHand", label: "Main Hand", emoji: "⚔" },
    { id: "offhand", gear: "OffHand", label: "Off Hand", emoji: "🛡" },
    { id: "amulet", gear: "Accessory2", label: "Amulet", emoji: "📿" },
    { id: "belt", gear: "belt", label: "Belt", emoji: "🔗" },
    { id: "cloak", gear: "Back", label: "Cloak / Bag", emoji: "🧥" },
  ];
  /** Non-drop Q-swap reserve — not a corpse drop slot */
  const SLOT_SECONDARY = {
    id: "secondary",
    gear: "SecondaryWeapon",
    label: "2nd Weapon (Q)",
    emoji: "⚔",
  };
  const SLOT_RING = { id: "ring", gear: "Accessory1", label: "Ring", emoji: "💍" };
  const SLOT_ADD = { id: "add", gear: null, label: "Bag", emoji: "＋" };

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
      accessory: "amulet",
      Accessory2: "amulet",
      amulet: "amulet",
      neck: "amulet",
      necklace: "amulet",
      belt: "belt",
      waist: "belt",
      cape: "cloak",
      cloak: "cloak",
      back: "cloak",
      Back: "cloak",
      shoulders: "cloak",
      Shoulder: "cloak",
      ring: "ring",
      Accessory1: "ring",
      ring1: "ring",
    };
    const resolveIcon = global.GrudgeItemIcons?.resolve;
    for (const [k, v] of Object.entries(raw)) {
      if (v == null || v === "") continue;
      const slot = alias[k] || alias[String(k).toLowerCase()];
      if (!slot) continue;
      if (typeof v === "string") {
        const iconUrl = resolveIcon
          ? resolveIcon({ itemId: v, name: v })
          : null;
        out[slot] = { id: v, name: v, iconUrl };
      } else if (typeof v === "object") {
        const id = v.id || v.itemId || v.meshId || "";
        const name = v.name || v.label || id || "Item";
        const iconUrl =
          v.iconUrl ||
          v.icon ||
          v.image ||
          (resolveIcon ? resolveIcon({ itemId: id, name }) : null);
        out[slot] = {
          id,
          name,
          iconUrl,
          rarity: v.rarity || v.tier || "common",
        };
      }
    }
    return out;
  }

  function slotHtml(def, item, opts) {
    const equipped = !!item;
    const rar = item?.rarity ? RARITY_CLASS[item.rarity] || "" : "";
    const title = item?.name || def.label;
    const fb = global.GrudgeItemIcons?.fallback?.() || "";
    const icon = item?.iconUrl
      ? `<img class="eq-slot-icon" src="${esc(item.iconUrl)}" alt="" draggable="false" onerror="if(!this.dataset.fb&&'${fb}'){this.dataset.fb=1;this.src='${fb}'}" />`
      : `<span class="eq-slot-ph">${def.emoji}</span>`;
    const ro = opts.readOnly ? " data-readonly=\"1\"" : "";
    const nonDrop = def.id === "secondary" ? " data-nondrop=\"1\"" : "";
    return `<button type="button" class="eq-slot ${equipped ? "equipped" : ""} ${rar}${def.id === "secondary" ? " eq-secondary" : ""}" data-slot="${def.id}" data-gear="${def.gear || ""}" title="${esc(title)}"${ro}${nonDrop}>
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
            ${slotHtml(SLOT_RING, equipped.ring, { readOnly })}
            <div class="eq-bottom-rule"></div>
            ${slotHtml(SLOT_SECONDARY, equipped.secondary, { readOnly })}
            <div class="eq-bottom-rule"></div>
            ${slotHtml(SLOT_ADD, null, { readOnly })}
          </div>
        </div>
        <p class="eq-secondary-hint">2nd Weapon is a non-drop Q-swap reserve (not looted off your corpse).</p>
        ${mode === "inspect" ? `<div class="eq-inspect-badge">Inspecting</div>` : ""}
      </div>
    `;

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
