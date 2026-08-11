/**
 * grudge6-viewport.js — main-panel Toon RTS GOLDEN kit (lab SSOT).
 *
 * Kit: asset-packs/toon-rts-characters/glb/characters/{raceId}.glb
 * (same default as info.grudge-studio.com/GRUDGE6_Characters.html)
 * Equip: mesh_ids visibility · bone SI 1.8 m · no forceAtlas
 */
(function (global) {
  "use strict";

  var CDN = "https://assets.grudge-studio.com";
  var HUMAN_H = 1.8;
  var THREE = null;
  var GLTFLoader = null;
  var SkeletonUtils = null;

  var RACES = {
    human: { prefix: "WK", folder: "western-kingdoms", tex: "WK_Standard_Units.webp", toonId: "human" },
    barbarian: { prefix: "BRB", folder: "barbarians", tex: "BRB_StandardUnits_texture.webp" },
    elf: { prefix: "ELF", folder: "elves", tex: "ELF_HighElves_Texture.webp" },
    dwarf: { prefix: "DWF", folder: "dwarves", tex: "DWF_Standard_Units.webp" },
    orc: { prefix: "ORC", folder: "orcs", tex: "ORC_StandardUnits.webp" },
    undead: { prefix: "UD", folder: "undead", tex: "UD_Standard_Units.webp" },
  };

  var state = {
    host: null,
    canvas: null,
    renderer: null,
    scene: null,
    camera: null,
    root: null,
    model: null,
    equip: null,
    animId: 0,
    raceKey: "",
    loading: false,
    statusEl: null,
  };

  function normRace(race) {
    if (global.WarlordsCharacter?.normalizeRace) return global.WarlordsCharacter.normalizeRace(race);
    var r = String(race || "human").toLowerCase().replace(/[^a-z]/g, "");
    if (r.includes("barb")) return "barbarian";
    if (r.includes("dwarf")) return "dwarf";
    if (r.includes("elf")) return "elf";
    if (r.includes("orc")) return "orc";
    if (r.includes("undead") || r === "ud") return "undead";
    return "human";
  }

  function kitUrl(raceKey) {
    if (global.WarlordsCharacter?.getRace) {
      var r = global.WarlordsCharacter.getRace(raceKey);
      if (r?.kitGlb && !global.WarlordsCharacter.isBlockedUrl?.(r.kitGlb)) return r.kitGlb;
    }
    var def = RACES[raceKey] || RACES.human;
    return CDN + "/asset-packs/toon-rts-characters/glb/characters/" + raceKey + ".glb";
  }

  function atlasUrl(raceKey) {
    var def = RACES[raceKey] || RACES.human;
    return CDN + "/textures/grudge6/" + def.folder + "/" + def.tex;
  }

  function meshKey(name) {
    return String(name || "")
      .toLowerCase()
      .replace(/^wk_|^brb_|^orc_|^elf_|^ud_|^dwf_/, "")
      .replace(/units_/g, "")
      .replace(/xtra_/g, "")
      .replace(/weapon_/g, "weapon")
      .replace(/shield_/g, "shield")
      .replace(/shoulderpads_/g, "shoulders")
      .replace(/[^a-z0-9]/g, "");
  }

  function meshMatchesId(meshName, meshId) {
    if (!meshName || !meshId) return false;
    if (meshName === meshId) return true;
    if (meshName.endsWith(meshId) || meshId.endsWith(meshName)) return true;
    var a = meshKey(meshName);
    var b = meshKey(meshId);
    return a === b || a.endsWith(b) || b.endsWith(a);
  }

  function findNamed(root, names) {
    for (var i = 0; i < names.length; i++) {
      var o = root.getObjectByName(names[i]);
      if (o) return o;
    }
    return null;
  }

  /** Bone-driven structural AABB — required for modular skinned kits. */
  function measureBoneBox(root) {
    root.updateMatrixWorld(true);
    root.traverse(function (o) {
      if (o.isSkinnedMesh && o.skeleton) o.skeleton.update();
    });
    var groups = [
      ["Bip001 Head", "Bip001_Head", "Head"],
      ["Bip001 HeadNub", "Bip001_HeadNub"],
      ["Bip001 Pelvis", "Bip001_Pelvis", "Pelvis"],
      ["Bip001 L Foot", "Bip001_L_Foot"],
      ["Bip001 R Foot", "Bip001_R_Foot"],
      ["Bip001 L Toe0", "Bip001_L_Toe0"],
      ["Bip001 R Toe0", "Bip001_R_Toe0"],
      ["Bip001 L Hand", "Bip001_L_Hand"],
      ["Bip001 R Hand", "Bip001_R_Hand"],
    ];
    var box = new THREE.Box3();
    var n = 0;
    var p = new THREE.Vector3();
    for (var g = 0; g < groups.length; g++) {
      var bone = findNamed(root, groups[g]);
      if (!bone) continue;
      bone.getWorldPosition(p);
      if (!Number.isFinite(p.x + p.y + p.z)) continue;
      if (n === 0) {
        box.min.copy(p);
        box.max.copy(p);
      } else box.expandByPoint(p);
      n++;
    }
    if (n < 2) return null;
    var h = Math.max(box.max.y - box.min.y, 1e-4);
    var pad = Math.max(h * 0.1, 0.05);
    box.min.y -= pad * 0.55;
    box.max.y += pad * 0.45;
    return box;
  }

  function fitAndGround(model) {
    model.position.set(0, 0, 0);
    model.scale.set(1, 1, 1);
    model.rotation.set(0, 0, 0);
    model.updateMatrixWorld(true);

    var box = measureBoneBox(model);
    if (!box) {
      box = new THREE.Box3().setFromObject(model, true);
    }
    var size = new THREE.Vector3();
    box.getSize(size);
    var h = size.y;
    if (h > 50) {
      model.scale.multiplyScalar(0.01);
      model.updateMatrixWorld(true);
      box = measureBoneBox(model) || new THREE.Box3().setFromObject(model, true);
      box.getSize(size);
      h = size.y;
    }
    if (h > 1e-4 && (h < 1.55 || h > 2.15)) {
      model.scale.multiplyScalar(HUMAN_H / h);
      model.updateMatrixWorld(true);
      box = measureBoneBox(model) || new THREE.Box3().setFromObject(model, true);
    }

    // Face the user/camera (camera sits on +Z looking at origin).
    // Toon play default yaw is 0 (+Z); main-panel preview uses π so the kit
    // faces the portrait lens (matches GRUDGE6_Characters lab). Do not use
    // π/2 here — that is FBX +X authoring only and shows a side/back view.
    model.rotation.y = Math.PI;
    model.userData.faceUserYaw = Math.PI;
    model.userData.artForwardSet = true;
    model.updateMatrixWorld(true);
    box = measureBoneBox(model) || new THREE.Box3().setFromObject(model, true);
    model.position.y += 0 - box.min.y;

    // Center XZ on pelvis
    var pelvis =
      findNamed(model, ["Bip001 Pelvis", "Bip001_Pelvis", "Bip001"]) || null;
    if (pelvis) {
      var wp = new THREE.Vector3();
      pelvis.getWorldPosition(wp);
      model.position.x -= wp.x;
      model.position.z -= wp.z;
      model.updateMatrixWorld(true);
      box = measureBoneBox(model) || new THREE.Box3().setFromObject(model, true);
      model.position.y += 0 - box.min.y;
    }
  }

  function applyMeshIds(root, meshIds) {
    if (global.WarlordsCharacter?.applyMeshIds) {
      return global.WarlordsCharacter.applyMeshIds(root, meshIds);
    }
    var wanted = (meshIds || []).map(String).filter(Boolean);
    var all = [];
    root.traverse(function (o) {
      if (o.isMesh || o.isSkinnedMesh) all.push(o);
    });
    for (var i = 0; i < all.length; i++) all[i].visible = false;
    var matched = [];
    for (var w = 0; w < wanted.length; w++) {
      for (var m = 0; m < all.length; m++) {
        if (meshMatchesId(all[m].name, wanted[w])) {
          all[m].visible = true;
          matched.push(all[m].name);
          break;
        }
      }
    }
    return { matched: matched, missing: [] };
  }

  function normalizeMaps(root) {
    root.traverse(function (obj) {
      if (!obj.isMesh && !obj.isSkinnedMesh) return;
      var mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      for (var i = 0; i < mats.length; i++) {
        var m = mats[i];
        if (!m) continue;
        if (m.map) {
          m.map.colorSpace = THREE.SRGBColorSpace;
          m.map.flipY = false;
          m.map.needsUpdate = true;
        }
        if (m.color) m.color.setHex(0xffffff);
        m.needsUpdate = true;
      }
    });
  }

  async function ensureThree() {
    if (THREE && GLTFLoader) return;
    // three r0.185 ESM
    THREE = await import("https://cdn.jsdelivr.net/npm/three@0.185.0/build/three.module.js");
    var addons = await import(
      "https://cdn.jsdelivr.net/npm/three@0.185.0/examples/jsm/loaders/GLTFLoader.js"
    );
    GLTFLoader = addons.GLTFLoader;
    try {
      SkeletonUtils = await import(
        "https://cdn.jsdelivr.net/npm/three@0.185.0/examples/jsm/utils/SkeletonUtils.js"
      );
    } catch (_) {
      SkeletonUtils = null;
    }
  }

  function setStatus(msg) {
    if (state.statusEl) state.statusEl.textContent = msg || "";
  }

  function ensureHost(hostEl) {
    if (!hostEl) return null;
    var wrap = hostEl.querySelector(".g6-viewport");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.className = "g6-viewport";
      wrap.innerHTML =
        '<canvas class="g6-canvas"></canvas><div class="g6-status">Loading grudge6…</div>';
      // Prefer insert into paperdoll portrait area
      var portrait =
        hostEl.querySelector(".eq-portrait-wrap") ||
        hostEl.querySelector(".eq-center") ||
        hostEl;
      portrait.appendChild(wrap);
    }
    state.host = wrap;
    state.canvas = wrap.querySelector(".g6-canvas");
    state.statusEl = wrap.querySelector(".g6-status");
    return wrap;
  }

  function setupRenderer(w, h) {
    if (!state.renderer) {
      state.renderer = new THREE.WebGLRenderer({
        canvas: state.canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      state.renderer.outputColorSpace = THREE.SRGBColorSpace;
      state.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      state.scene = new THREE.Scene();
      state.camera = new THREE.PerspectiveCamera(32, w / h, 0.05, 50);
      state.camera.position.set(0, 1.1, 3.2);
      state.camera.lookAt(0, 0.9, 0);
      var hemi = new THREE.HemisphereLight(0xfff0d0, 0x203040, 1.1);
      var key = new THREE.DirectionalLight(0xffe6c0, 1.4);
      key.position.set(2.5, 4, 2);
      state.scene.add(hemi, key);
      // soft ground ring
      var ring = new THREE.Mesh(
        new THREE.CircleGeometry(0.55, 48),
        new THREE.MeshBasicMaterial({ color: 0x1a120c, transparent: true, opacity: 0.55 }),
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.001;
      state.scene.add(ring);
    }
    state.renderer.setSize(w, h, false);
    state.camera.aspect = w / h;
    state.camera.updateProjectionMatrix();
  }

  function loop() {
    state.animId = requestAnimationFrame(loop);
    // Keep hero facing the user — no continuous spin (that turned backs to camera).
    // Optional gentle idle sway around face-user yaw.
    if (state.model) {
      var base = state.model.userData.faceUserYaw;
      if (typeof base !== "number") base = Math.PI;
      var t = performance.now() * 0.001;
      state.model.rotation.y = base + Math.sin(t * 0.55) * 0.06;
    }
    if (state.renderer && state.scene && state.camera) {
      state.renderer.render(state.scene, state.camera);
    }
  }

  async function loadKit(raceKey, meshIds) {
    await ensureThree();
    var url = kitUrl(raceKey);
    setStatus("Loading " + url.split("/").pop() + "…");
    var loader = new GLTFLoader();
    try {
      var dracoMod = await import(
        "https://cdn.jsdelivr.net/npm/three@0.185.0/examples/jsm/loaders/DRACOLoader.js"
      );
      var draco = new dracoMod.DRACOLoader();
      draco.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/");
      loader.setDRACOLoader(draco);
    } catch (_) {
      /* optional */
    }

    var gltf = await loader.loadAsync(url);
    var template = gltf.scene;
    var model =
      SkeletonUtils && SkeletonUtils.clone
        ? SkeletonUtils.clone(template)
        : template.clone(true);

    model.traverse(function (o) {
      if (o.isSkinnedMesh && o.skeleton) {
        o.skeleton.pose();
        o.skeleton.update();
      }
    });

    normalizeMaps(model);
    var result = applyMeshIds(model, meshIds);
    fitAndGround(model);

    if (state.model && state.scene) {
      state.scene.remove(state.model);
      // dispose lightly
      state.model.traverse(function (o) {
        if (o.geometry) o.geometry.dispose?.();
      });
    }
    state.model = model;
    state.scene.add(model);
    state.raceKey = raceKey;
    state.equip = result;

    var miss = result.missing.length ? " · miss " + result.missing.length : "";
    setStatus(
      RACES[raceKey].prefix +
        " · " +
        result.matched.length +
        " meshes" +
        miss +
        " · SI 1.8 m",
    );
    return result;
  }

  /**
   * Mount or refresh viewport inside paperdoll host.
   * @param {HTMLElement} paperdollHost
   * @param {{ race?: string, classId?: string, meshIds?: string[] }} opts
   */
  async function mount(paperdollHost, opts) {
    opts = opts || {};
    if (!paperdollHost) return null;
    ensureHost(paperdollHost);
    var rect = state.host.getBoundingClientRect();
    var w = Math.max(180, Math.floor(rect.width || 220));
    var h = Math.max(220, Math.floor(rect.height || 280));
    if (w < 40) w = 220;
    if (h < 40) h = 280;

    try {
      await ensureThree();
      setupRenderer(w, h);
      if (!state.animId) loop();

      var raceKey = normRace(opts.race);
      var meshIds = opts.meshIds || [];
      if (!meshIds.length) {
        var built =
          (global.WarlordsCharacter &&
            global.WarlordsCharacter.meshIdsFor(raceKey, opts.classId || "warrior", !!opts.unarmed)) ||
          (global.MainPanelContent &&
            global.MainPanelContent.meshIdsFor(raceKey, opts.classId || "warrior", !!opts.unarmed));
        meshIds = (built && built.meshIds) || [];
      }

      // Avoid reload same race if only mesh ids change
      if (state.model && state.raceKey === raceKey) {
        var r = applyMeshIds(state.model, meshIds);
        fitAndGround(state.model);
        setStatus(
          RACES[raceKey].prefix + " · " + r.matched.length + " meshes · SI 1.8 m",
        );
        return r;
      }

      if (state.loading) return null;
      state.loading = true;
      var out = await loadKit(raceKey, meshIds);
      state.loading = false;
      return out;
    } catch (e) {
      state.loading = false;
      console.error("[grudge6-viewport]", e);
      setStatus("Kit load failed: " + (e.message || e));
      return null;
    }
  }

  function dispose() {
    if (state.animId) cancelAnimationFrame(state.animId);
    state.animId = 0;
    if (state.model && state.scene) state.scene.remove(state.model);
    state.model = null;
    if (state.renderer) {
      state.renderer.dispose();
      state.renderer = null;
    }
  }

  global.Grudge6Viewport = {
    mount: mount,
    dispose: dispose,
    kitUrl: kitUrl,
    atlasUrl: atlasUrl,
    applyMeshIds: applyMeshIds,
    RACES: RACES,
    CDN: CDN,
  };
})(typeof window !== "undefined" ? window : globalThis);
