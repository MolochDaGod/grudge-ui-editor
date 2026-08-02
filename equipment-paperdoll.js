/**
 * Grudge Equipment Paperdoll ΓÇö Tactical Infinity layout (portrait + 12 slots).
 *
 * Canonical Warlords-era equipment UI for:
 *   - ui.grudge-studio.com/main-panel (equipment tab)
 *   - game-ui-runtime.js equipment-slots / paperdoll-equipment
 *   - Embeds in client.grudge-studio.com and other era games
 *
 * Modes:
 *   self   ΓÇö player equip (click slots emit grudge:equip:slot)
 *   inspect ΓÇö read-only view of another unit/player
 *
 * SSOT portraits: race-portraits.js ΓåÆ client.grudge-studio.com
 */
(function (global) {
  "use strict";

  const SLOTS_LEFT = [
    { id: "helmet", gear: "head", label: "Helmet", emoji: "Γ¢æ" },
    { id: "chest", gear: "chest", label: "Chest", emoji: "≡ƒÑï" },
    { id: "gloves", gear: "hands", label: "Gloves", emoji: "≡ƒºñ" },
    { id: "legs", gear: "legs", label: "Legs", emoji: "≡ƒæû" },
    { id: "boots", gear: "feet", label: "Boots", emoji: "≡ƒÑ╛" },
  ];
  const SLOTS_RIGHT = [
    { id: "weapon", gear: "weapon", label: "Main Hand", emoji: "ΓÜö" },
    { id: "offhand", gear: "offhand", label: "Off Hand", emoji: "≡ƒ¢í" },
    { id: "amulet", gear: "accessory", label: "Amulet", emoji: "≡ƒô┐" },
    { id: "belt", gear: "belt", label: "Belt", emoji: "≡ƒöù" },
    { id: "cloak", gear: "cape", label: "Cloak", emoji: "≡ƒºÑ" },
  ];
  const SLOT_RING = { id: "ring", gear: "ring", label: "Ring", emoji: "≡ƒÆì" };
  const SLOT_ADD = { id: "add", gear: null, label: "Add", emoji: "∩╝ï" };

  const RARITY_CLASS = {
    common: "eq-r-common",
    uncommon: "eq-r-uncommon",
    rare: "eq-r-rare",
    epic: "eq-r-epic",
    legendary: "eq-r-legendary",
  };

  /** Map fleet/model3d equipment bag ΓåÆ paperdoll slot items. */
  function normalizeEquipped(raw) {
    if (!raw || typeof raw !== "object") return {};
    const out = {};
    const alias = {
      head: "helmet",
      helmet: "helmet",
      helm: "helmet",
      chest: "chest",
      body: "chest",
      armor: "chest",
      torso: "chest",
      hands: "gloves",
      hand: "gloves",
      gloves: "gloves",
      legs: "legs",
      pants: "legs",
      feet: "boots",
      boot: "boots",
      boots: "boots",
      weapon: "weapon",
      mainhand: "weapon",
      main_hand: "weapon",
      primary: "weapon",
      secondaryweapon: "weapon", // reserve still paints main if only one hand shown
      secondary: "weapon",
      offhand: "offhand",
      off_hand: "offhand",
      shield: "offhand",
      accessory: "amulet",
      accessory1: "ring",
      accessory2: "amulet",
      amulet: "amulet",
      neck: "amulet",
      necklace: "amulet",
      relic: "belt",
      belt: "belt",
      waist: "belt",
      cape: "cloak",
      cloak: "cloak",
      back: "cloak",
      shoulders: "cloak",
      shoulder: "cloak",
      ring: "ring",
      ring1: "ring",
    };
    const cat = global.InfoCatalog;
    for (const [k, v] of Object.entries(raw)) {
      if (v == null || v === "") continue;
      let slot = alias[k] || alias[String(k).toLowerCase()];
      // Resolve from catalog when key is unknown but item has slotType
      if (!slot && typeof v === "object" && cat?.paperdollSlot) {
        slot = cat.paperdollSlot(v);
      }
      if (!slot) continue;
      if (typeof v === "string") {
        const looked = cat?.lookup?.({ id: v, name: v });
        out[slot] = {
          id: v,
          name: looked?.name || v,
          iconUrl: cat?.resolveIcon?.({ itemId: v, name: looked?.name || v }) || null,
          rarity: cat?.rarityFromTier?.(looked?.tier, looked?.tierLabel) || "common",
          description: looked?.description || "",
          stats: looked?.stats || null,
          type: looked?.type || "",
          tierLabel: looked?.tierLabel || "",
        };
      } else if (typeof v === "object") {
        const id = v.id || v.itemId || v.meshId || "";
        const name = v.name || v.label || id || "Item";
        const looked = cat?.lookup?.({ id, name, uuid: v.uuid }) || null;
        const iconUrl =
          v.iconUrl ||
          v.icon ||
          v.image ||
          cat?.resolveIcon?.({ itemId: id, name, iconUrl: v.iconUrl, category: v.category, type: v.type }) ||
          null;
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
          type: v.type || looked?.type || "",
          tierLabel: v.tierLabel || looked?.tierLabel || "",
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
    const rarKey = item?.rarity && RARITY_CLASS[item.rarity] ? item.rarity : "common";
    const rar = equipped ? RARITY_CLASS[rarKey] || "" : "";
    const title = item?.name || def.label;
    let iconUrl = item?.iconUrl || null;
    if (item && !iconUrl && global.InfoCatalog?.resolveIcon) {
      iconUrl = global.InfoCatalog.resolveIcon({
        itemId: item.id,
        name: item.name,
        type: item.type,
      });
    }
    const icon = iconUrl
      ? `<img class="eq-slot-icon" src="${esc(iconUrl)}" alt="" draggable="false" referrerpolicy="no-referrer" onerror="this.style.opacity=.2" />`
      : `<span class="eq-slot-ph">${def.emoji}</span>`;
    const ro = opts.readOnly ? ' data-readonly="1"' : "";
    const tipPlain = item
      ? global.InfoCatalog?.plainTooltip?.({
          itemId: item.id,
          name: item.name,
          description: item.description,
          stats: item.stats,
        }) || title
      : def.label;
    const tipHtml = item
      ? global.InfoCatalog?.tooltipHtml?.({
          itemId: item.id,
          name: item.name,
          iconUrl,
          description: item.description,
          stats: item.stats,
          type: item.type,
          tier: item.tier,
          tierLabel: item.tierLabel,
        }) || ""
      : "";
    return `<button type="button" class="eq-slot ${equipped ? "equipped" : ""} ${rar}" data-slot="${def.id}" data-gear="${def.gear || ""}" title="${esc(tipPlain)}" data-tip="${esc(tipHtml)}"${ro}>
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
   * @param {object} [opts.equipped] ΓÇö slot bag or EquippedMap
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
            <img class="eq-portrait" src="${esc(portrait)}" alt="Portrait" draggable="false"
              onerror="this.onerror=null;this.src='https://client.grudge-studio.com/images/portraits/human.png'" />
          </div>
          <div class="eq-col right">${right}</div>
          <div class="eq-bottom">
            ${slotHtml(SLOT_RING, equipped.ring, { readOnly })}
            <div class="eq-bottom-rule"></div>
            ${slotHtml(SLOT_ADD, null, { readOnly })}
          </div>
        </div>
        ${mode === "inspect" ? `<div class="eq-inspect-badge">Inspecting</div>` : ""}
        ${opts.showMeshHint !== false ? `<p class="eq-mesh-hint">Click armor/weapon slots to cycle grudge6 mesh variants ┬╖ texture atlas by race</p>` : ""}
      </div>
    `;

    // Mesh-level overlay (Unity kit visibility state)
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
          detail: {
            slotId,
            gearKey: gear,
            mode,
            entityId: opts.entityId || null,
            race: opts.race,
            classId: opts.classId,
          },
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
