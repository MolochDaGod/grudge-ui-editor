/**
 * Mesh equipment showcase — all races × all modular kit meshes.
 * defUuid = catalog UUID v5 (not ledger instance). Hero UUID from Railway when signed in.
 */
(function (global) {
  "use strict";

  const GROUP_SLOT = {
    head: "head",
    body: "body",
    arms: "arms",
    legs: "legs",
    shoulders: "shoulders",
    weapons: "weapon",
    shields: "offhand",
    utility: "utility",
  };

  let index = null;
  let race = "human";
  let groupFilter = "all";
  let selected = null;

  function esc(s) {
    return String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function heroUuid() {
    return (
      new URLSearchParams(location.search).get("characterId") ||
      global.GrudgeEngine?.getActiveCharacter?.()?.id ||
      ""
    );
  }

  function accountId() {
    return global.GrudgeCloud?.getGrudgeId?.() || "";
  }

  function renderHeader() {
    const tot = index?.totals || {};
    const rec = index?.races?.[race];
    const hero = heroUuid();
    const acc = accountId();
    const el = document.getElementById("ms-idbar");
    if (!el) return;
    el.innerHTML = `
      <div><span class="k">Races</span> ${tot.races || 0}</div>
      <div><span class="k">Modular items</span> ${tot.items || 0}</div>
      <div><span class="k">This kit</span> ${rec?.counts?.total || 0} meshes</div>
      <div><span class="k">Hero UUID</span> <code title="${esc(hero)}">${esc(hero || "sign in")}</code></div>
      <div><span class="k">Grudge ID</span> <code>${esc(acc || "—")}</code></div>
      <div><span class="k">Kind</span> definition UUID v5 · mesh_id visibility</div>
    `;
  }

  function renderRaces() {
    const host = document.getElementById("ms-races");
    if (!host || !index) return;
    host.innerHTML = Object.values(index.races)
      .map(
        (r) =>
          `<button type="button" class="ms-race${r.id === race ? " on" : ""}" data-race="${esc(r.id)}">${esc(r.label)} <small>${r.counts.total}</small></button>`,
      )
      .join("");
  }

  function renderGroups() {
    const rec = index?.races?.[race];
    const host = document.getElementById("ms-groups");
    if (!host || !rec) return;
    const keys = ["all", ...Object.keys(rec.counts).filter((k) => k !== "total")];
    host.innerHTML = keys
      .map((g) => {
        const n = g === "all" ? rec.counts.total : rec.counts[g];
        return `<button type="button" class="ms-grp${g === groupFilter ? " on" : ""}" data-group="${esc(g)}">${esc(g)} <small>${n}</small></button>`;
      })
      .join("");
  }

  function renderGrid() {
    const rec = index?.races?.[race];
    const host = document.getElementById("ms-grid");
    if (!host || !rec) return;
    const items = rec.items.filter((it) => groupFilter === "all" || it.group === groupFilter);
    host.innerHTML = items
      .map((it) => {
        const on = selected?.meshId === it.meshId ? " on" : "";
        const base = it.unarmedBase ? " base" : "";
        return `<button type="button" class="ms-card${on}${base}" data-mesh="${esc(it.meshId)}" title="${esc(it.meshId)}">
          <span class="ms-g">${esc(it.group)}</span>
          <span class="ms-n">${esc(it.name)}${it.unarmedBase ? " · BASE" : ""}</span>
          <code class="ms-mid">${esc(it.meshId)}</code>
          <code class="ms-uid">${esc(it.defUuid)}</code>
        </button>`;
      })
      .join("");
    const meta = document.getElementById("ms-grid-meta");
    if (meta) meta.textContent = `${items.length} items · ${rec.label} · unarmed base locked`;
  }

  function slotsForPreview(item) {
    const rec = index.races[race];
    const slots = {};
    if (!item) return slots;
    const g = item.group;
    const slot = GROUP_SLOT[g];
    if (item.core) {
      slots[slot] = item.meshId;
    } else if (g === "weapons") {
      slots.weapon = item.meshId;
    } else if (g === "shields") {
      slots.offhand = item.meshId;
    } else if (g === "shoulders") {
      slots.shoulders = item.meshId;
    } else if (g === "utility") {
      slots.utility = item.meshId;
    }
    return slots;
  }

  async function preview(item) {
    selected = item;
    renderGrid();
    const rec = index.races[race];
    const WC = global.WarlordsCharacter;
    const slots = slotsForPreview(item);
    const built = WC?.paperdollToMeshIds
      ? WC.paperdollToMeshIds(race, slots)
      : { meshIds: (rec.unarmed || []).concat(item && !item.core ? [item.meshId] : []) };
    const meshIds = built.meshIds || rec.unarmed;
    const detail = document.getElementById("ms-detail");
    if (detail) {
      detail.innerHTML = item
        ? `<h3>${esc(item.name)}</h3>
           <p><span class="k">mesh_id</span> <code>${esc(item.meshId)}</code></p>
           <p><span class="k">def UUID</span> <code>${esc(item.defUuid)}</code></p>
           <p><span class="k">group</span> ${esc(item.group)} ${item.unarmedBase ? "· unarmed base" : ""}</p>
           <p><span class="k">kit</span> ${esc(rec.kitGlb.split("/").pop())}</p>
           <p><span class="k">visible</span> ${meshIds.length} mesh_ids</p>
           <pre class="ms-ids">${meshIds.map(esc).join("\n")}</pre>`
        : `<p class="muted">Pick a modular item. Unarmed body stays as the floor.</p>`;
    }
    const vp = document.getElementById("ms-viewport");
    if (vp && global.Grudge6Viewport?.mount) {
      await global.Grudge6Viewport.mount(vp, {
        race,
        classId: "unarmed",
        meshIds,
        unarmed: !item || item.core,
      });
    }
  }

  async function setRace(id) {
    race = id;
    groupFilter = "all";
    selected = null;
    renderHeader();
    renderRaces();
    renderGroups();
    renderGrid();
    const rec = index.races[race];
    const first = rec.items.find((it) => it.unarmedBase && it.group === "body") || rec.items[0];
    await preview(first);
  }

  async function boot() {
    const res = await fetch("./data/mesh-showcase-index.json", { cache: "no-cache" });
    index = await res.json();
    const q = new URLSearchParams(location.search);
    if (q.get("race") && index.races[q.get("race")]) race = q.get("race");
    renderHeader();
    renderRaces();
    renderGroups();
    renderGrid();

    document.getElementById("ms-races")?.addEventListener("click", (e) => {
      const b = e.target.closest("[data-race]");
      if (b) setRace(b.dataset.race);
    });
    document.getElementById("ms-groups")?.addEventListener("click", (e) => {
      const b = e.target.closest("[data-group]");
      if (!b) return;
      groupFilter = b.dataset.group;
      renderGroups();
      renderGrid();
    });
    document.getElementById("ms-grid")?.addEventListener("click", (e) => {
      const b = e.target.closest("[data-mesh]");
      if (!b) return;
      const rec = index.races[race];
      const item = rec.items.find((it) => it.meshId === b.dataset.mesh);
      if (item) preview(item);
    });

    if (global.WarlordsCharacter?.loadMeshCatalog) {
      await global.WarlordsCharacter.loadMeshCatalog();
    }
    await setRace(race);
  }

  global.MeshShowcase = { boot, setRace };
})(typeof window !== "undefined" ? window : globalThis);
