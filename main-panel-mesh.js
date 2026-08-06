/**
 * Hero mesh / texture preview for main-panel paperdoll.
 * Layers race portrait + mesh kit badges; emits mesh_ids for fleet equip.
 * Full Three.js kits live in character-viewer Prefab Lab / client engine —
 * this host shows correct mesh-level state for UI swap & handoff.
 */
(function (global) {
  "use strict";

  const VARIANT_COLORS = {
    A: "#94a3b8",
    B: "#38bdf8",
    C: "#f59e0b",
    D: "#ef4444",
    E: "#a78bfa",
    F: "#22c55e",
    G: "#e11d48",
    _default: "#cbd5e1",
  };

  const SLOT_LAYER = [
    { key: "body", label: "Body", y: 48 },
    { key: "arms", label: "Arms", y: 72 },
    { key: "legs", label: "Legs", y: 96 },
    { key: "head", label: "Head", y: 24 },
    { key: "shoulders", label: "Pads", y: 40 },
    { key: "weapon", label: "MH", y: 120 },
    { key: "offhand", label: "OH", y: 140 },
  ];

  function esc(s) {
    return String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /**
   * Paint mesh kit overlay into paperdoll portrait wrap.
   * @param {HTMLElement} portraitWrap - .eq-portrait-wrap
   * @param {object} opts
   */
  function renderMeshOverlay(portraitWrap, opts) {
    if (!portraitWrap) return;
    opts = opts || {};
    let overlay = portraitWrap.querySelector(".eq-mesh-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "eq-mesh-overlay";
      portraitWrap.appendChild(overlay);
    }

    const race = opts.race || "human";
    const classId = opts.classId || "warrior";
    const unarmed = !!opts.unarmed;
    const MPC = global.MainPanelContent;
    const built = MPC
      ? MPC.meshIdsFor(race, classId, unarmed)
      : { meshIds: [], kit: {}, prefix: "WK_", weaponType: "unarmed" };

    // Prefer explicit meshIds from model3d / equipment
    let meshIds = opts.meshIds || built.meshIds;
    if (opts.equipment && MPC) {
      const fromEq = meshIdsFromEquipment(opts.equipment, race);
      if (fromEq.length) meshIds = fromEq;
    }

    const kit = built.kit || {};
    const chips = [];
    for (const layer of SLOT_LAYER) {
      let letter = null;
      if (layer.key === "weapon") letter = kit.weapon ? (kit.weaponVar || kit.weapon) : null;
      else if (layer.key === "offhand") letter = kit.offhand ? (kit.offhandVar || kit.offhand) : null;
      else letter = kit[layer.key];
      // Override from meshIds parse
      const hit = meshIds.find((id) => new RegExp(layer.key === "weapon" ? "weapon|sword|bow|staff|axe|hammer" : layer.key, "i").test(id));
      if (hit) {
        const m = hit.match(/_([A-Z]|default)$/i) || hit.match(/([A-Z])$/);
        if (m) letter = m[1].toUpperCase() === "DEFAULT" ? "_default" : m[1].toUpperCase();
      }
      if (!letter) continue;
      const col = VARIANT_COLORS[letter] || VARIANT_COLORS._default;
      chips.push(
        `<span class="eq-mesh-chip" style="--mc:${col}" title="${esc(hit || layer.key + " " + letter)}">${esc(layer.label)} <b>${esc(letter)}</b></span>`,
      );
    }

    const idPreview = meshIds
      .slice(0, 8)
      .map((id) => `<code>${esc(id)}</code>`)
      .join(" ");

    overlay.innerHTML = `
      <div class="eq-mesh-chips">${chips.join("") || '<span class="eq-mesh-chip">Unarmed</span>'}</div>
      <div class="eq-mesh-meta">
        <span>${esc(built.prefix || "")} · ${esc(built.weaponType || "unarmed")}</span>
        <span class="eq-mesh-count">${meshIds.length} meshes</span>
      </div>
      <div class="eq-mesh-ids">${idPreview}${meshIds.length > 8 ? "…" : ""}</div>
    `;

    return { meshIds, weaponType: built.weaponType, prefix: built.prefix };
  }

  function meshIdsFromEquipment(equipment, race) {
    const MPC = global.MainPanelContent;
    if (!MPC) return [];
    const raceN = MPC.normalizeRace(race);
    const prefix = MPC.RACE_PREFIX[raceN] || "WK_";
    const ids = [];
    const map = {
      helmet: "head",
      head: "head",
      chest: "body",
      body: "body",
      gloves: "arms",
      arms: "arms",
      legs: "legs",
      boots: "legs",
      cloak: "shoulders",
      shoulders: "shoulders",
    };
    for (const [slot, item] of Object.entries(equipment || {})) {
      if (!item) continue;
      if (item.meshSlot && item.meshVar) {
        if (item.meshSlot === "shield") ids.push(`${prefix}Shield_${item.meshVar}`);
        else if (["sword", "axe", "hammer", "staff", "bow", "spear", "dagger"].includes(item.meshSlot)) {
          if (item.meshSlot === "bow") ids.push(`${prefix}weapon_Bow`);
          else if (item.meshVar === "_default") ids.push(`${prefix}weapon_${item.meshSlot}`);
          else ids.push(`${prefix}weapon_${item.meshSlot}_${item.meshVar}`);
        } else {
          const body = item.meshSlot === "body" ? "Units_Body" : item.meshSlot === "head" ? "Units_head" : `Units_${item.meshSlot[0].toUpperCase()}${item.meshSlot.slice(1)}`;
          ids.push(`${prefix}${body}_${item.meshVar}`);
        }
        continue;
      }
      const armor = map[slot];
      if (armor && item.id) {
        const letter = String(item.id).match(/_([A-Z])$/i)?.[1] || "A";
        ids.push(`${prefix}Units_${armor === "body" ? "Body" : armor}_${letter.toUpperCase()}`);
      }
    }
    return ids;
  }

  /**
   * Apply equipment slot click → swap mesh variant on entity.
   */
  function cycleMeshVariant(equipment, slotId, gearKey) {
    const next = { ...(equipment || {}) };
    const armorSlots = {
      helmet: "head",
      chest: "body",
      gloves: "arms",
      legs: "legs",
      boots: "legs",
      cloak: "shoulders",
    };
    const letters = ["A", "B", "C", "D", "E", "F"];
    if (armorSlots[slotId] || armorSlots[gearKey]) {
      const meshSlot = armorSlots[slotId] || armorSlots[gearKey];
      const cur = next[slotId] || next[gearKey] || {};
      const idx = Math.max(0, letters.indexOf((cur.meshVar || "A").toUpperCase()));
      const letter = letters[(idx + 1) % letters.length];
      next[slotId] = {
        id: `${meshSlot}_${letter}`,
        name: `${meshSlot.toUpperCase()} kit ${letter}`,
        rarity: letter <= "B" ? "common" : letter <= "D" ? "uncommon" : "rare",
        meshSlot,
        meshVar: letter,
      };
      return next;
    }
    if (slotId === "weapon" || gearKey === "weapon") {
      const cycle = [
        { meshSlot: "sword", meshVar: "A", weaponType: "sword", name: "Sword A" },
        { meshSlot: "sword", meshVar: "B", weaponType: "sword", name: "Sword B" },
        { meshSlot: "axe", meshVar: "B", weaponType: "axe", name: "Axe B" },
        { meshSlot: "bow", meshVar: "_default", weaponType: "bow", name: "Longbow" },
        { meshSlot: "staff", meshVar: "C", weaponType: "staff", name: "Staff C" },
      ];
      const cur = next.weapon?.meshSlot || "sword";
      const curV = next.weapon?.meshVar || "A";
      let i = cycle.findIndex((c) => c.meshSlot === cur && c.meshVar === curV);
      i = (i + 1) % cycle.length;
      const c = cycle[i];
      next.weapon = {
        id: `${c.meshSlot}_${c.meshVar}`,
        name: c.name,
        rarity: "uncommon",
        meshSlot: c.meshSlot,
        meshVar: c.meshVar,
        weaponType: c.weaponType,
      };
      return next;
    }
    if (slotId === "offhand") {
      const cycle = [
        null,
        { meshSlot: "shield", meshVar: "A", name: "Shield A" },
        { meshSlot: "shield", meshVar: "B", name: "Shield B" },
      ];
      const cur = next.offhand?.meshVar || null;
      let i = cur == null ? 0 : cur === "A" ? 1 : 2;
      i = (i + 1) % cycle.length;
      next.offhand = cycle[i]
        ? {
            id: `shield_${cycle[i].meshVar}`,
            name: cycle[i].name,
            rarity: "uncommon",
            meshSlot: "shield",
            meshVar: cycle[i].meshVar,
          }
        : null;
      if (!next.offhand) delete next.offhand;
      return next;
    }
    return next;
  }

  /** Build model3d patch for Railway / client handoff. */
  function equipmentToModel3dPatch(equipment, race, classId) {
    const MPC = global.MainPanelContent;
    const raceN = MPC ? MPC.normalizeRace(race) : "human";
    const prefix = MPC ? MPC.RACE_PREFIX[raceN] : "WK_";
    const equippedMeshes = {};
    const weaponSlots = {};
    for (const item of Object.values(equipment || {})) {
      if (!item?.meshSlot) continue;
      if (["body", "arms", "legs", "head", "shoulders"].includes(item.meshSlot)) {
        equippedMeshes[item.meshSlot] = item.meshVar || "A";
      } else if (item.meshSlot === "shield") {
        weaponSlots.shield = item.meshVar || "A";
      } else {
        weaponSlots[item.meshSlot] = item.meshVar || "A";
      }
    }
    const built = MPC ? MPC.meshIdsFor(race, classId, !Object.keys(weaponSlots).length) : null;
    const raceDef = global.WarlordsCharacter?.getRace?.(race);
    const kitGlb =
      built?.kitGlb ||
      raceDef?.kitGlb ||
      `https://assets.grudge-studio.com/models/grudge6/races/${String(prefix).replace(/_$/, "")}_Characters.glb`;
    return {
      baseModelId: kitGlb,
      kitGlb,
      atlasUrl: built?.atlasUrl || raceDef?.atlasUrl || null,
      grudge6: true,
      renderPipeline: "grudge6",
      era: "warlords",
      equippedMeshes,
      weaponSlots,
      meshIds: built?.meshIds || [],
      sourceUrl: "https://ui.grudge-studio.com/main-panel",
    };
  }

  global.MainPanelMesh = {
    renderMeshOverlay,
    meshIdsFromEquipment,
    cycleMeshVariant,
    equipmentToModel3dPatch,
    VARIANT_COLORS,
  };
})(typeof window !== "undefined" ? window : globalThis);
