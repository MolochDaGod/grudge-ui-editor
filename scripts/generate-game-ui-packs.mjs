/**
 * Generate saved, game-ready HYDRA UI packs for each fleet game.
 * Output: game-ui-packs/*.json + index.json
 *
 * Run: node scripts/generate-game-ui-packs.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "game-ui-packs");

function C(id, type, x, y, w, h, props = {}, groups = ["hud"]) {
  return {
    id,
    type,
    x,
    y,
    w,
    h,
    rot: 0,
    op: 1,
    br: 6,
    shd: true,
    props,
    groups,
  };
}

function pack(meta, comps, extra = {}) {
  const W = meta.resolution?.w || 1920;
  const H = meta.resolution?.h || 1080;
  return {
    id: meta.id,
    name: meta.name,
    gameId: meta.gameId,
    version: "1.0.0",
    gameReady: true,
    saved: true,
    exported: new Date().toISOString(),
    theme: meta.theme || "f",
    resolution: { w: W, h: H },
    comps,
    meta: {
      playUrl: meta.playUrl,
      genre: meta.genre,
      engine: meta.engine,
      description: meta.description,
      features: meta.features || [],
      usageStates: meta.usageStates || [],
      dataBindings: meta.dataBindings || {},
      inputProfile: meta.inputProfile || "default",
      tags: meta.tags || [],
    },
    states: meta.states || {},
    handoff: {
      tool: "HYDRA Game UI Studio",
      version: "2.0",
      fleetPack: true,
      gameId: meta.gameId,
    },
    ...extra,
  };
}

// ── Shared partial builders ───────────────────────────────────────────────

function warlordsCombatHud() {
  return [
    C("pf1", "player-frame", 24, 880, 320, 120, {
      name: "Hero",
      level: 42,
      hp: 780,
      hpMax: 1000,
      mp: 310,
      mpMax: 500,
    }, ["hud", "combat", "explore"]),
    C("tf1", "target-frame", 760, 24, 400, 72, {
      name: "Enemy",
      level: 40,
      hp: 620,
      hpMax: 900,
      hostile: true,
    }, ["hud", "combat"]),
    C("hb1", "hotbar-2row", 640, 920, 640, 120, { slots: 10, slotSize: 52 }, ["hud", "combat", "explore"]),
    C("mm1", "minimap", 1680, 24, 200, 200, { shape: "circle" }, ["hud", "explore", "combat"]),
    C("obj1", "objectives", 1680, 240, 200, 180, { label: "Quests" }, ["hud", "explore"]),
    C("cl1", "combat-log", 24, 640, 280, 200, { label: "Combat" }, ["hud", "combat"]),
    C("md1", "menu-dock", 1720, 960, 160, 72, {
      buttons: "Bag,Map,Skills,Menu",
    }, ["hud", "explore", "combat"]),
    C("ws1", "weapon-selector", 24, 820, 200, 40, { label: "Main / 2nd" }, ["hud", "combat"]),
    C("ip1", "interaction-prompt", 820, 700, 280, 48, { key: "F", action: "Interact" }, [
      "prompt",
      "explore",
    ]),
  ];
}

function inventoryCraftPanels() {
  return [
    C("inv1", "inventory-grid", 560, 180, 420, 520, {
      cols: 6,
      rows: 7,
      slotSize: 52,
      gap: 4,
      label: "Bag",
    }, ["inventory", "crafting"]),
    C("eq1", "equipment-slots", 200, 200, 300, 480, { label: "Equipment" }, ["inventory", "equipment"]),
    C("attr1", "attr-panel", 1020, 200, 280, 360, { label: "Attributes" }, ["inventory", "character"]),
    C("cur1", "currency-display", 1020, 580, 280, 56, { amount: "12,480", label: "Gold" }, [
      "inventory",
      "crafting",
      "shop",
    ]),
    C("shop1", "shop-panel", 1320, 200, 360, 520, { label: "Craft / Trade" }, ["crafting", "shop"]),
  ];
}

// ── Game definitions ──────────────────────────────────────────────────────

const GAMES = [
  {
    id: "warlords",
    gameId: "warlords",
    name: "Warlords — Combat + Bag + Craft",
    playUrl: "https://client.grudge-studio.com",
    genre: "fantasy-mmo",
    engine: "Three.js + Colyseus",
    theme: "f",
    description:
      "Full Warlords play HUD: vitals, target, hotbar, bag, equipment, craft/trade, quests. 8-attr SSOT.",
    features: ["inventory", "equipment", "crafting", "quests", "combat", "chat", "currency"],
    usageStates: ["explore", "combat", "inventory", "crafting", "dialogue", "dead", "menu"],
    tags: ["flagship", "mmo", "wcs"],
    inputProfile: "warlords-combat",
    dataBindings: {
      character: { path: "/api/characters/:id", fills: ["pf1", "attr1"] },
      inventory: { path: "/api/characters/:id/inventory", fills: ["inv1"] },
      equipment: { path: "/api/characters/:id/equipment", fills: ["eq1"] },
      crafting: { path: "https://objectstore.grudge-studio.com/api/v1/recipes.json", fills: ["shop1"] },
    },
    states: {
      explore: { show: ["hud", "explore"], hide: ["inventory", "crafting", "dialogue"] },
      combat: { show: ["hud", "combat"], hide: ["inventory", "crafting"] },
      inventory: { show: ["inventory", "equipment", "character"], hide: ["combat"] },
      crafting: { show: ["crafting", "inventory"], hide: ["combat"] },
      dialogue: { show: ["dialogue"], hide: ["inventory", "crafting"] },
      dead: { show: ["dead"], hide: ["combat", "inventory"] },
      menu: { show: ["menu"], hide: ["combat"] },
    },
    comps: [
      ...warlordsCombatHud(),
      ...inventoryCraftPanels(),
      C("chat1", "chat-window", 24, 420, 280, 200, { label: "Chat" }, ["hud", "explore", "menu"]),
      C("qt1", "quest-tracker", 1480, 450, 220, 160, {
        title: "Bloodfeud",
        objective: "Defeat 5 reavers",
        label: "Active",
      }, ["hud", "explore"]),
      C("dlg1", "dialogue-box", 480, 760, 960, 160, {
        speaker: "Harbor Master",
        text: "The island needs iron and courage. Will you help?",
      }, ["dialogue"]),
      C("alb1", "alert-banner", 560, 80, 800, 48, {
        text: "YOU DIED — Return to shrine",
        type: "danger",
      }, ["dead"]),
      C("sk1", "skill-tree", 400, 160, 1120, 640, { label: "Skills" }, ["menu", "character"]),
    ],
  },
  {
    id: "open",
    gameId: "open",
    name: "Open Launcher — Lobby UI",
    playUrl: "https://open.grudge-studio.com",
    genre: "launcher",
    engine: "React + Three.js",
    theme: "d",
    description: "Launcher / lobby: character strip, game tiles, account vitals, news.",
    features: ["character-select", "game-list", "account", "news"],
    usageStates: ["lobby", "character-select", "loading"],
    tags: ["launcher", "hub"],
    inputProfile: "menu",
    dataBindings: {
      characters: { path: "/api/characters", fills: ["inv1"] },
      account: { path: "/api/account", fills: ["pf1"] },
    },
    states: {
      lobby: { show: ["hud", "lobby"], hide: ["loading"] },
      "character-select": { show: ["character", "lobby"], hide: ["loading"] },
      loading: { show: ["loading"], hide: ["lobby"] },
    },
    comps: [
      C("pf1", "player-frame", 40, 40, 340, 100, {
        name: "Commander",
        level: 12,
        hp: 100,
        hpMax: 100,
        mp: 100,
        mpMax: 100,
      }, ["hud", "lobby"]),
      C("inv1", "inventory-grid", 40, 180, 520, 360, {
        cols: 4,
        rows: 4,
        slotSize: 64,
        gap: 8,
        label: "Heroes (4 slots)",
      }, ["character", "lobby"]),
      C("shop1", "shop-panel", 600, 180, 720, 520, { label: "Play · Games" }, ["lobby"]),
      C("obj1", "objectives", 1360, 180, 480, 320, { label: "News / Patch" }, ["lobby"]),
      C("md1", "menu-dock", 1360, 560, 480, 80, {
        buttons: "Account,Foundry,Forge,Settings",
      }, ["lobby", "hud"]),
      C("alb1", "alert-banner", 600, 40, 720, 48, {
        text: "Connecting to Grudge ID…",
        type: "info",
      }, ["loading"]),
      C("cur1", "currency-display", 40, 900, 280, 56, { amount: "—", label: "Wallet" }, ["lobby"]),
    ],
  },
  {
    id: "grudox",
    gameId: "grudox",
    name: "GRUDOX — Room Hub UI",
    playUrl: "https://grudox.grudge-studio.com",
    genre: "multiplayer-hub",
    engine: "Vite + Carrier WS",
    theme: "d",
    description: "Room list, party frames, chat, match ready states for GRUDOX / Carrier.",
    features: ["party", "rooms", "chat", "matchmaking"],
    usageStates: ["lobby", "in-room", "match", "spectate"],
    tags: ["pvp", "hub", "carrier"],
    inputProfile: "social",
    dataBindings: {
      rooms: { path: "/api/carrier/rooms", fills: ["shop1"] },
      party: { path: "/api/carrier/party", fills: ["af1", "af2"] },
    },
    states: {
      lobby: { show: ["lobby", "hud"], hide: ["match"] },
      "in-room": { show: ["lobby", "party", "hud"], hide: ["match"] },
      match: { show: ["match", "hud", "party"], hide: ["lobby"] },
      spectate: { show: ["match", "hud"], hide: ["lobby"] },
    },
    comps: [
      C("shop1", "shop-panel", 40, 80, 480, 640, { label: "Rooms" }, ["lobby"]),
      C("chat1", "chat-window", 40, 760, 480, 240, { label: "Lobby Chat" }, ["lobby", "hud"]),
      C("af1", "ally-frame", 560, 80, 280, 64, { name: "Ally 1", level: 20, hp: 90, hpMax: 100 }, [
        "party",
        "hud",
        "match",
      ]),
      C("af2", "ally-frame", 560, 160, 280, 64, { name: "Ally 2", level: 18, hp: 70, hpMax: 100 }, [
        "party",
        "hud",
        "match",
      ]),
      C("obj1", "objectives", 560, 260, 400, 200, { label: "Match Rules" }, ["lobby", "in-room"]),
      C("md1", "menu-dock", 560, 500, 400, 72, { buttons: "Ready,Leave,Invite,Settings" }, [
        "lobby",
        "in-room",
      ]),
      C("pf1", "player-frame", 1520, 880, 360, 120, {
        name: "You",
        level: 22,
        hp: 100,
        hpMax: 100,
        mp: 50,
        mpMax: 50,
      }, ["hud", "match"]),
      C("alb1", "alert-banner", 640, 40, 640, 48, { text: "MATCH STARTING", type: "warning" }, [
        "match",
      ]),
      C("cl1", "combat-log", 1520, 600, 360, 240, { label: "Feed" }, ["match"]),
    ],
  },
  {
    id: "player-grass",
    gameId: "player-grass",
    name: "Player & Grass — Stance HUD",
    playUrl: "https://threejs-player-and-grass.vercel.app/play?char=human&lobby=1",
    genre: "open-world-action",
    engine: "Three.js",
    theme: "f",
    description:
      "Combat / Harvest / Mount radial, dual weapon swap, bag, harvest tools. Matches Q radial + AA/DD/X dodge.",
    features: ["combat", "harvest", "mount", "inventory", "weapon-swap", "radial"],
    usageStates: ["combat", "harvest", "mount", "inventory", "radial"],
    tags: ["grass", "si-scale", "grudge6"],
    inputProfile: "grass-q-radial",
    dataBindings: {
      character: { path: "/api/characters/:id", fills: ["pf1"] },
      inventory: { path: "session:grudge_active_build", fills: ["inv1", "ws1"] },
    },
    states: {
      combat: { show: ["hud", "combat"], hide: ["inventory", "radial"] },
      harvest: { show: ["hud", "harvest"], hide: ["inventory", "radial"] },
      mount: { show: ["hud", "mount"], hide: ["inventory", "radial"] },
      inventory: { show: ["inventory"], hide: ["radial"] },
      radial: { show: ["radial", "hud"], hide: ["inventory"] },
    },
    comps: [
      C("pf1", "player-frame", 24, 900, 300, 110, {
        name: "Pirate",
        level: 8,
        hp: 180,
        hpMax: 200,
        mp: 40,
        mpMax: 50,
      }, ["hud", "combat", "harvest", "mount"]),
      C("hb1", "hotbar", 700, 980, 520, 64, { slots: 9, slotSize: 48, label: "Skills" }, [
        "hud",
        "combat",
      ]),
      C("ws1", "weapon-selector", 24, 840, 220, 40, { label: "Main ↔ 2nd (Q)" }, ["hud", "combat"]),
      C("orb1", "action-orb", 1760, 900, 96, 96, { value: 80, max: 100, color: "#4ade80", label: "SP" }, [
        "hud",
        "combat",
      ]),
      C("mm1", "minimap", 1680, 24, 200, 200, { shape: "square" }, ["hud", "explore", "harvest", "mount"]),
      C("ip1", "interaction-prompt", 820, 720, 280, 48, { key: "F", action: "Harvest" }, [
        "harvest",
        "prompt",
      ]),
      C("inv1", "inventory-grid", 620, 200, 360, 420, {
        cols: 5,
        rows: 6,
        slotSize: 48,
        gap: 4,
        label: "Bag",
      }, ["inventory"]),
      C("eq1", "equipment-slots", 280, 220, 280, 400, { label: "Gear" }, ["inventory"]),
      // Radial represented as three labeled panels (runtime can replace with true radial)
      C("rad-c", "alert-banner", 760, 280, 400, 56, { text: "COMBAT ↑", type: "danger" }, ["radial"]),
      C("rad-h", "alert-banner", 560, 480, 360, 56, { text: "HARVEST ↙", type: "success" }, ["radial"]),
      C("rad-m", "alert-banner", 1000, 480, 360, 56, { text: "MOUNT ↘", type: "info" }, ["radial"]),
      C("obj1", "objectives", 24, 24, 260, 140, { label: "Stance" }, ["hud", "combat", "harvest", "mount"]),
    ],
  },
  {
    id: "survival",
    gameId: "survival",
    name: "Survival — Craft + Needs",
    playUrl: "https://grudges.grudge-studio.com",
    genre: "survival",
    engine: "R3F + Rapier",
    theme: "f",
    description: "Hunger/thirst/stamina, harvest bag, workbench craft, build radial, shelter status.",
    features: ["inventory", "crafting", "building", "needs", "harvest"],
    usageStates: ["explore", "harvest", "craft", "build", "combat", "inventory"],
    tags: ["survival", "craft"],
    inputProfile: "survival",
    dataBindings: {
      vitals: { path: "/api/survival/vitals", fills: ["hb-hp", "hb-food", "hb-water"] },
      inventory: { path: "/api/survival/inventory", fills: ["inv1"] },
      recipes: { path: "/api/survival/recipes", fills: ["shop1"] },
    },
    states: {
      explore: { show: ["hud"], hide: ["inventory", "crafting", "build"] },
      harvest: { show: ["hud", "harvest"], hide: ["inventory"] },
      craft: { show: ["crafting", "inventory"], hide: ["combat"] },
      build: { show: ["build", "hud"], hide: ["inventory"] },
      combat: { show: ["hud", "combat"], hide: ["inventory", "crafting"] },
      inventory: { show: ["inventory"], hide: ["crafting"] },
    },
    comps: [
      C("hb-hp", "healthbar", 24, 24, 280, 28, { value: 80, max: 100, label: "Health", color: "#e11d48" }, [
        "hud",
      ]),
      C("hb-food", "manabar", 24, 60, 280, 24, { value: 55, max: 100, label: "Hunger", color: "#f59e0b" }, [
        "hud",
      ]),
      C("hb-water", "xp-bar", 24, 92, 280, 24, { value: 40, max: 100, label: "Thirst", color: "#38bdf8" }, [
        "hud",
      ]),
      C("orb1", "action-orb", 1760, 900, 100, 100, { value: 70, max: 100, color: "#a3e635", label: "Stamina" }, [
        "hud",
        "combat",
      ]),
      C("hb1", "hotbar", 700, 980, 520, 64, { slots: 8, slotSize: 48, label: "Tools" }, ["hud", "harvest"]),
      C("inv1", "inventory-grid", 560, 160, 400, 480, {
        cols: 6,
        rows: 6,
        slotSize: 48,
        gap: 4,
        label: "Resources",
      }, ["inventory", "crafting"]),
      C("shop1", "shop-panel", 1000, 160, 420, 520, { label: "Workbench" }, ["crafting"]),
      C("ip1", "interaction-prompt", 820, 700, 280, 48, { key: "E", action: "Gather" }, ["harvest"]),
      C("mm1", "minimap", 1680, 24, 200, 200, { shape: "square" }, ["hud"]),
      C("alb1", "alert-banner", 640, 40, 640, 48, { text: "Build mode — place blueprint", type: "info" }, [
        "build",
      ]),
      C("md1", "menu-dock", 40, 980, 280, 56, { buttons: "Craft,Build,Map,Sleep" }, ["hud"]),
    ],
  },
  {
    id: "arena",
    gameId: "arena",
    name: "Arena — PvP FPS UI",
    playUrl: "https://grudge-arena.grudge-studio.com",
    genre: "pvp-arena",
    engine: "Three.js + Socket.IO",
    theme: "q",
    description: "Crosshair, ammo, scoreboard, kill feed, match timer, death cam.",
    features: ["scoreboard", "killfeed", "loadout", "match-timer"],
    usageStates: ["match", "scoreboard", "dead", "victory", "loadout"],
    tags: ["pvp", "fps"],
    inputProfile: "fps",
    dataBindings: {
      match: { path: "/api/arena/match", fills: ["obj1", "cur1"] },
      loadout: { path: "/api/arena/loadout", fills: ["hb1"] },
    },
    states: {
      match: { show: ["hud", "match"], hide: ["scoreboard", "loadout"] },
      scoreboard: { show: ["scoreboard"], hide: [] },
      dead: { show: ["dead", "hud"], hide: ["loadout"] },
      victory: { show: ["victory"], hide: ["match"] },
      loadout: { show: ["loadout"], hide: ["match"] },
    },
    comps: [
      C("xh1", "crosshair", 940, 520, 40, 40, {}, ["hud", "match"]),
      C("hb-hp", "healthbar", 40, 980, 320, 32, { value: 100, max: 100, label: "HP", color: "#fff" }, [
        "hud",
        "match",
      ]),
      C("tx1", "text-label", 1600, 980, 280, 40, { text: "12 / 30 AMMO", size: 18, align: "right" }, [
        "hud",
        "match",
      ]),
      C("obj1", "objectives", 860, 24, 200, 64, { label: "2:45" }, ["hud", "match"]),
      C("cur1", "currency-display", 40, 24, 200, 48, { amount: "3 - 2", label: "Score" }, ["hud", "match"]),
      C("cl1", "combat-log", 1500, 120, 380, 280, { label: "Kill Feed" }, ["hud", "match"]),
      C("alb1", "alert-banner", 560, 400, 800, 64, { text: "ELIMINATED", type: "danger" }, ["dead"]),
      C("alb2", "alert-banner", 560, 400, 800, 64, { text: "VICTORY", type: "success" }, ["victory"]),
      C("shop1", "shop-panel", 480, 160, 960, 640, { label: "Scoreboard" }, ["scoreboard"]),
      C("hb1", "hotbar", 640, 900, 640, 72, { slots: 5, slotSize: 56, label: "Loadout" }, ["loadout"]),
      C("ws1", "weapon-selector", 40, 900, 240, 48, { label: "Primary / Sidearm" }, ["loadout", "match"]),
    ],
  },
  {
    id: "mech",
    gameId: "mech",
    name: "Mech Forge — Hardpoint UI",
    playUrl: "https://mech-playground.vercel.app",
    genre: "mech-sim",
    engine: "R3F + Rapier",
    theme: "c",
    description: "Heat, energy, hardpoints, garage inventory, arena loadout.",
    features: ["hardpoints", "inventory", "heat", "garage", "combat"],
    usageStates: ["garage", "combat", "inventory", "destroyed"],
    tags: ["mech", "cyber"],
    inputProfile: "mech",
    dataBindings: {
      mech: { path: "/api/mech/active", fills: ["pf1", "orb1", "orb2"] },
      garage: { path: "/api/mech/parts", fills: ["inv1", "eq1"] },
    },
    states: {
      garage: { show: ["garage", "inventory"], hide: ["combat"] },
      combat: { show: ["hud", "combat"], hide: ["garage", "inventory"] },
      inventory: { show: ["inventory", "garage"], hide: ["combat"] },
      destroyed: { show: ["dead"], hide: ["combat"] },
    },
    comps: [
      C("pf1", "player-frame", 24, 880, 340, 120, {
        name: "Frame MK-IV",
        level: 5,
        hp: 4200,
        hpMax: 5000,
        mp: 80,
        mpMax: 100,
      }, ["hud", "combat"]),
      C("orb1", "health-orb", 1600, 860, 120, 120, { value: 62, max: 100, color: "#f97316", label: "HEAT" }, [
        "hud",
        "combat",
      ]),
      C("orb2", "mana-orb", 1740, 860, 120, 120, { value: 88, max: 100, color: "#22d3ee", label: "EN" }, [
        "hud",
        "combat",
      ]),
      C("hb1", "hotbar", 640, 980, 640, 64, { slots: 6, slotSize: 52, label: "Weapons" }, ["hud", "combat"]),
      C("xh1", "crosshair", 940, 500, 40, 40, {}, ["hud", "combat"]),
      C("eq1", "equipment-slots", 200, 160, 320, 480, { label: "Hardpoints" }, ["garage", "inventory"]),
      C("inv1", "inventory-grid", 560, 160, 420, 520, {
        cols: 5,
        rows: 6,
        slotSize: 52,
        gap: 4,
        label: "Parts Bay",
      }, ["garage", "inventory"]),
      C("attr1", "attr-panel", 1020, 160, 320, 400, { label: "Frame Stats" }, ["garage"]),
      C("mm1", "minimap", 1680, 24, 200, 200, { shape: "square" }, ["hud", "combat"]),
      C("alb1", "alert-banner", 560, 400, 800, 56, { text: "CORE BREACH", type: "danger" }, ["dead"]),
    ],
  },
  {
    id: "grim-armada",
    gameId: "grim-armada",
    name: "Grim Armada — Fleet HUD",
    playUrl: "https://grim-armada-web.vercel.app",
    genre: "space-fleet",
    engine: "Three.js + React",
    theme: "c",
    description: "Ship vitals, fleet list, orders panel, sector map, cargo.",
    features: ["fleet", "cargo", "orders", "sector-map", "combat"],
    usageStates: ["bridge", "combat", "cargo", "fleet", "jump"],
    tags: ["space", "rts-lite"],
    inputProfile: "space",
    dataBindings: {
      ship: { path: "/api/armada/ship", fills: ["pf1"] },
      fleet: { path: "/api/armada/fleet", fills: ["af1", "af2", "af3"] },
      cargo: { path: "/api/armada/cargo", fills: ["inv1"] },
    },
    states: {
      bridge: { show: ["hud", "bridge"], hide: ["cargo"] },
      combat: { show: ["hud", "combat"], hide: ["cargo"] },
      cargo: { show: ["cargo"], hide: ["combat"] },
      fleet: { show: ["fleet", "hud"], hide: ["cargo"] },
      jump: { show: ["jump", "hud"], hide: ["cargo"] },
    },
    comps: [
      C("pf1", "player-frame", 24, 880, 360, 120, {
        name: "Flagship",
        level: 14,
        hp: 8200,
        hpMax: 10000,
        mp: 400,
        mpMax: 500,
      }, ["hud", "bridge", "combat"]),
      C("af1", "ally-frame", 24, 120, 260, 56, { name: "Frigate A", level: 10, hp: 60, hpMax: 100 }, [
        "fleet",
        "hud",
      ]),
      C("af2", "ally-frame", 24, 190, 260, 56, { name: "Frigate B", level: 9, hp: 80, hpMax: 100 }, [
        "fleet",
        "hud",
      ]),
      C("af3", "ally-frame", 24, 260, 260, 56, { name: "Scout", level: 6, hp: 40, hpMax: 100 }, [
        "fleet",
        "hud",
      ]),
      C("mm1", "minimap", 1680, 24, 200, 200, { shape: "circle" }, ["hud", "bridge", "combat"]),
      C("obj1", "objectives", 1680, 240, 200, 200, { label: "Orders" }, ["bridge", "combat"]),
      C("hb1", "hotbar", 700, 980, 520, 64, { slots: 8, slotSize: 48, label: "Systems" }, ["hud", "combat"]),
      C("inv1", "inventory-grid", 560, 180, 400, 480, {
        cols: 6,
        rows: 6,
        slotSize: 48,
        gap: 4,
        label: "Cargo Hold",
      }, ["cargo"]),
      C("cur1", "currency-display", 24, 40, 260, 48, { amount: "4,200", label: "Credits" }, ["bridge"]),
      C("alb1", "alert-banner", 640, 40, 640, 48, { text: "FTL JUMP CHARGING", type: "info" }, ["jump"]),
      C("cl1", "combat-log", 1400, 700, 480, 200, { label: "Tactical Log" }, ["combat"]),
    ],
  },
  {
    id: "dcq",
    gameId: "dcq",
    name: "Dungeon Crawler Quest — Loot UI",
    playUrl: "https://dcq.grudge-studio.com",
    genre: "dungeon-crawler",
    engine: "Three.js + Voxel + Rapier",
    theme: "f",
    description: "Party frames, loot grid, map fog, potions, rest/camp states.",
    features: ["party", "loot", "map", "potions", "rest"],
    usageStates: ["dungeon", "loot", "camp", "combat", "map"],
    tags: ["dungeon", "rpg"],
    inputProfile: "crpg",
    dataBindings: {
      party: { path: "/api/dcq/party", fills: ["pf1", "af1", "af2"] },
      loot: { path: "/api/dcq/loot", fills: ["inv1"] },
    },
    states: {
      dungeon: { show: ["hud"], hide: ["loot", "map"] },
      combat: { show: ["hud", "combat"], hide: ["loot"] },
      loot: { show: ["loot", "inventory"], hide: ["combat"] },
      camp: { show: ["camp", "hud"], hide: ["combat"] },
      map: { show: ["map", "hud"], hide: ["loot"] },
    },
    comps: [
      C("pf1", "player-frame", 24, 24, 280, 90, {
        name: "Leader",
        level: 7,
        hp: 90,
        hpMax: 100,
        mp: 40,
        mpMax: 50,
      }, ["hud", "combat", "dungeon"]),
      C("af1", "ally-frame", 24, 130, 240, 56, { name: "Mage", level: 6, hp: 50, hpMax: 70 }, ["hud"]),
      C("af2", "ally-frame", 24, 200, 240, 56, { name: "Rogue", level: 6, hp: 65, hpMax: 80 }, ["hud"]),
      C("hb1", "hotbar", 700, 980, 520, 64, { slots: 8, slotSize: 48, label: "Actions" }, ["hud", "combat"]),
      C("mm1", "minimap", 1680, 24, 200, 200, { shape: "square" }, ["hud", "map", "dungeon"]),
      C("inv1", "inventory-grid", 560, 160, 420, 520, {
        cols: 6,
        rows: 7,
        slotSize: 48,
        gap: 4,
        label: "Loot",
      }, ["loot", "inventory"]),
      C("eq1", "equipment-slots", 200, 280, 280, 400, { label: "Gear" }, ["loot", "inventory"]),
      C("qt1", "quest-tracker", 1500, 260, 280, 180, {
        title: "Deep Vault",
        objective: "Find the Gouldstone",
        label: "Quest",
      }, ["hud", "dungeon"]),
      C("alb1", "alert-banner", 640, 40, 640, 48, { text: "Camp — recover HP/MP", type: "success" }, [
        "camp",
      ]),
      C("dlg1", "dialogue-box", 480, 780, 960, 140, {
        speaker: "Dungeon Spirit",
        text: "Only the sworn may pass the iron door.",
      }, ["dialogue", "dungeon"]),
    ],
  },
  {
    id: "space-rts",
    gameId: "space-rts",
    name: "Space RTS — Command UI",
    playUrl: "https://grudge-space-rts.vercel.app",
    genre: "rts",
    engine: "Three.js",
    theme: "c",
    description: "Resources, selection panel, build queue, minimap, command card.",
    features: ["resources", "build-queue", "selection", "minimap", "tech"],
    usageStates: ["command", "build", "combat", "tech"],
    tags: ["rts", "space"],
    inputProfile: "rts",
    dataBindings: {
      resources: { path: "/api/rts/resources", fills: ["cur1", "cur2", "cur3"] },
      selection: { path: "/api/rts/selection", fills: ["attr1"] },
    },
    states: {
      command: { show: ["hud", "command"], hide: ["tech"] },
      build: { show: ["hud", "build"], hide: ["tech"] },
      combat: { show: ["hud", "combat"], hide: ["tech"] },
      tech: { show: ["tech", "hud"], hide: ["build"] },
    },
    comps: [
      C("cur1", "currency-display", 24, 16, 200, 44, { amount: "1,250", label: "Minerals" }, ["hud"]),
      C("cur2", "currency-display", 240, 16, 200, 44, { amount: "680", label: "Gas" }, ["hud"]),
      C("cur3", "currency-display", 456, 16, 200, 44, { amount: "12/20", label: "Supply" }, ["hud"]),
      C("mm1", "minimap", 1680, 820, 220, 220, { shape: "square" }, ["hud"]),
      C("attr1", "attr-panel", 24, 720, 360, 280, { label: "Selection" }, ["hud", "command"]),
      C("hb1", "hotbar-2row", 600, 900, 720, 140, { slots: 12, slotSize: 48 }, ["hud", "build", "command"]),
      C("obj1", "objectives", 1680, 24, 220, 200, { label: "Objectives" }, ["hud"]),
      C("cl1", "combat-log", 1400, 500, 260, 200, { label: "Alerts" }, ["combat", "hud"]),
      C("sk1", "skill-tree", 400, 120, 1120, 640, { label: "Tech Tree" }, ["tech"]),
      C("md1", "menu-dock", 24, 80, 200, 56, { buttons: "Build,Tech,Fleet,Menu" }, ["hud"]),
    ],
  },
  {
    id: "drive",
    gameId: "drive",
    name: "Grudge Drive — Race HUD",
    playUrl: "https://drive.grudge-studio.com",
    genre: "racing",
    engine: "Three.js",
    theme: "q",
    description: "Speed, lap timer, position, nitro, pause/menu.",
    features: ["speed", "laps", "nitro", "minimap"],
    usageStates: ["race", "pause", "finish", "garage"],
    tags: ["racing"],
    inputProfile: "driving",
    dataBindings: {
      race: { path: "/api/drive/race", fills: ["obj1", "cur1"] },
    },
    states: {
      race: { show: ["hud", "race"], hide: ["pause", "garage"] },
      pause: { show: ["pause"], hide: [] },
      finish: { show: ["finish"], hide: ["race"] },
      garage: { show: ["garage"], hide: ["race"] },
    },
    comps: [
      C("tx1", "text-label", 40, 40, 200, 48, { text: "248 KM/H", size: 28, align: "left" }, ["hud", "race"]),
      C("obj1", "objectives", 860, 24, 200, 72, { label: "LAP 2/3" }, ["hud", "race"]),
      C("cur1", "currency-display", 1680, 24, 200, 56, { amount: "P3", label: "POS" }, ["hud", "race"]),
      C("orb1", "action-orb", 1760, 900, 100, 100, { value: 40, max: 100, color: "#a78bfa", label: "NITRO" }, [
        "hud",
        "race",
      ]),
      C("mm1", "minimap", 1680, 720, 200, 200, { shape: "square" }, ["hud", "race"]),
      C("hb-hp", "healthbar", 40, 1000, 360, 28, { value: 70, max: 100, label: "Armor", color: "#38bdf8" }, [
        "hud",
        "race",
      ]),
      C("alb1", "alert-banner", 560, 400, 800, 64, { text: "PAUSED", type: "warning" }, ["pause"]),
      C("alb2", "alert-banner", 560, 400, 800, 64, { text: "FINISH — P2", type: "success" }, ["finish"]),
      C("eq1", "equipment-slots", 400, 200, 320, 400, { label: "Garage Parts" }, ["garage"]),
      C("inv1", "inventory-grid", 760, 200, 400, 400, {
        cols: 4,
        rows: 4,
        slotSize: 64,
        gap: 6,
        label: "Upgrades",
      }, ["garage"]),
    ],
  },
  {
    id: "foundry",
    gameId: "foundry",
    name: "Character Foundry — Create UI",
    playUrl: "https://character.grudge-studio.com",
    genre: "character-creator",
    engine: "React + Three",
    theme: "f",
    description: "4-slot hero camp, race/kit select, attributes, enter-play CTA.",
    features: ["slots", "race", "attributes", "equip-preview", "enter-play"],
    usageStates: ["slots", "create", "preview", "confirm"],
    tags: ["foundry", "create"],
    inputProfile: "menu",
    dataBindings: {
      slots: { path: "/api/characters", fills: ["inv1"] },
      races: { path: "https://objectstore.grudge-studio.com/api/v1/races.json", fills: ["shop1"] },
    },
    states: {
      slots: { show: ["slots", "hud"], hide: ["create"] },
      create: { show: ["create", "hud"], hide: ["slots"] },
      preview: { show: ["preview", "create"], hide: [] },
      confirm: { show: ["confirm", "create"], hide: [] },
    },
    comps: [
      C("inv1", "inventory-grid", 80, 160, 480, 480, {
        cols: 2,
        rows: 2,
        slotSize: 160,
        gap: 16,
        label: "Hero Slots (4)",
      }, ["slots"]),
      C("shop1", "shop-panel", 620, 160, 480, 520, { label: "Race · Kit" }, ["create", "slots"]),
      C("attr1", "attr-panel", 1140, 160, 320, 400, { label: "8 Attributes" }, ["create", "preview"]),
      C("eq1", "equipment-slots", 1500, 160, 300, 400, { label: "Starter Gear" }, ["create", "preview"]),
      C("pf1", "player-frame", 1140, 600, 320, 100, {
        name: "New Hero",
        level: 1,
        hp: 100,
        hpMax: 100,
        mp: 50,
        mpMax: 50,
      }, ["create", "preview", "hud"]),
      C("md1", "menu-dock", 1140, 740, 320, 72, { buttons: "Save,Enter Play,Back" }, [
        "create",
        "confirm",
        "slots",
      ]),
      C("alb1", "alert-banner", 620, 40, 680, 48, {
        text: "Create-only Foundry — play on client.grudge-studio.com",
        type: "info",
      }, ["hud", "slots"]),
      C("dlg1", "dialogue-box", 400, 820, 1120, 140, {
        speaker: "Foundry",
        text: "Confirm this hero and enter your home island.",
      }, ["confirm"]),
    ],
  },
  {
    id: "water-island",
    gameId: "water",
    name: "Water Island — Home Base UI",
    playUrl: "https://water.grudge-studio.com",
    genre: "home-island",
    engine: "Three.js + R3F",
    theme: "f",
    description: "Island bag, build, craft station, boat dock, zone travel.",
    features: ["inventory", "crafting", "building", "travel", "boat"],
    usageStates: ["island", "build", "craft", "travel", "boat"],
    tags: ["island", "warlords"],
    inputProfile: "island",
    dataBindings: {
      island: { path: "/api/island/:id", fills: ["obj1"] },
      inventory: { path: "/api/characters/:id/inventory", fills: ["inv1"] },
    },
    states: {
      island: { show: ["hud", "island"], hide: ["build", "craft"] },
      build: { show: ["build", "hud"], hide: ["craft"] },
      craft: { show: ["craft", "inventory"], hide: ["build"] },
      travel: { show: ["travel", "hud"], hide: ["build"] },
      boat: { show: ["boat", "hud"], hide: ["build"] },
    },
    comps: [
      C("pf1", "player-frame", 24, 900, 300, 110, {
        name: "Settler",
        level: 15,
        hp: 200,
        hpMax: 200,
        mp: 80,
        mpMax: 80,
      }, ["hud", "island"]),
      C("mm1", "minimap", 1680, 24, 200, 200, { shape: "circle" }, ["hud", "island", "boat"]),
      C("obj1", "objectives", 1680, 240, 200, 180, { label: "Island Tasks" }, ["hud", "island"]),
      C("inv1", "inventory-grid", 600, 180, 400, 480, {
        cols: 6,
        rows: 6,
        slotSize: 48,
        gap: 4,
        label: "Island Bag",
      }, ["inventory", "craft"]),
      C("shop1", "shop-panel", 1040, 180, 400, 520, { label: "Craft Station" }, ["craft"]),
      C("md1", "menu-dock", 40, 40, 320, 56, { buttons: "Build,Craft,Boat,Travel" }, ["hud", "island"]),
      C("ip1", "interaction-prompt", 820, 700, 280, 48, { key: "F", action: "Use Station" }, [
        "island",
        "prompt",
      ]),
      C("alb1", "alert-banner", 640, 40, 640, 48, { text: "Blueprint placement", type: "info" }, ["build"]),
      C("alb2", "alert-banner", 640, 40, 640, 48, { text: "Set sail — choose zone", type: "success" }, [
        "boat",
        "travel",
      ]),
      C("hb1", "hotbar", 700, 980, 520, 64, { slots: 8, slotSize: 48, label: "Tools" }, ["hud", "build"]),
    ],
  },
  {
    id: "wcs",
    gameId: "wcs",
    name: "WCS — Crafting Suite UI",
    playUrl: "https://wcs.grudge-studio.com",
    genre: "crafting",
    engine: "Web",
    theme: "f",
    description: "Recipe browser, materials, output preview, station queue, quality.",
    features: ["recipes", "materials", "stations", "quality", "inventory"],
    usageStates: ["browse", "craft", "queue", "result"],
    tags: ["crafting", "wcs"],
    inputProfile: "menu",
    dataBindings: {
      recipes: {
        path: "https://objectstore.grudge-studio.com/api/v1/recipes.json",
        fills: ["shop1"],
      },
      materials: { path: "/api/characters/:id/inventory", fills: ["inv1"] },
    },
    states: {
      browse: { show: ["browse", "hud"], hide: ["result"] },
      craft: { show: ["craft", "browse"], hide: ["result"] },
      queue: { show: ["queue", "craft"], hide: [] },
      result: { show: ["result"], hide: [] },
    },
    comps: [
      C("shop1", "shop-panel", 40, 80, 560, 720, { label: "Recipes" }, ["browse", "craft"]),
      C("inv1", "inventory-grid", 640, 80, 400, 480, {
        cols: 5,
        rows: 6,
        slotSize: 52,
        gap: 4,
        label: "Materials",
      }, ["browse", "craft"]),
      C("eq1", "equipment-slots", 1080, 80, 300, 360, { label: "Output Preview" }, ["craft", "result"]),
      C("attr1", "attr-panel", 1420, 80, 420, 320, { label: "Quality / Stats" }, ["craft", "result"]),
      C("obj1", "objectives", 1080, 480, 300, 200, { label: "Craft Queue" }, ["queue", "craft"]),
      C("md1", "menu-dock", 1420, 440, 420, 72, { buttons: "Craft,Queue,Salvage,Close" }, [
        "browse",
        "craft",
      ]),
      C("cur1", "currency-display", 40, 840, 280, 56, { amount: "2,100", label: "Gold" }, ["hud", "browse"]),
      C("alb1", "alert-banner", 640, 900, 640, 56, { text: "Craft complete — Legendary!", type: "success" }, [
        "result",
      ]),
      C("hb1", "hotbar", 640, 980, 520, 64, { slots: 6, slotSize: 48, label: "Stations" }, ["hud"]),
    ],
  },
  {
    id: "forge",
    gameId: "forge",
    name: "Studio Forge — Editor Shell UI",
    playUrl: "https://forge.grudge-studio.com",
    genre: "editor",
    engine: "R3F + ObjectStore",
    theme: "d",
    description: "Scene hierarchy, asset browser, transform tools, publish strip.",
    features: ["assets", "hierarchy", "publish", "inspect"],
    usageStates: ["edit", "preview", "publish"],
    tags: ["editor", "tools"],
    inputProfile: "editor",
    dataBindings: {
      assets: {
        path: "https://objectstore.grudge-studio.com/api/v1/docs-catalog.json",
        fills: ["shop1"],
      },
    },
    states: {
      edit: { show: ["edit", "hud"], hide: ["publish"] },
      preview: { show: ["preview", "hud"], hide: ["edit"] },
      publish: { show: ["publish", "hud"], hide: [] },
    },
    comps: [
      C("shop1", "shop-panel", 16, 60, 320, 720, { label: "Assets" }, ["edit", "hud"]),
      C("obj1", "objectives", 16, 800, 320, 200, { label: "Hierarchy" }, ["edit", "hud"]),
      C("attr1", "attr-panel", 1580, 60, 320, 480, { label: "Inspector" }, ["edit", "hud"]),
      C("md1", "menu-dock", 400, 16, 720, 48, {
        buttons: "Select,Move,Rotate,Scale,Play,Publish",
      }, ["edit", "hud", "preview"]),
      C("chat1", "chat-window", 1580, 580, 320, 240, { label: "Console" }, ["edit"]),
      C("alb1", "alert-banner", 560, 900, 800, 48, {
        text: "Publish to ObjectStore / R2?",
        type: "warning",
      }, ["publish"]),
      C("ip1", "interaction-prompt", 860, 500, 200, 40, { key: "G", action: "Grab" }, ["preview"]),
    ],
  },
];

// ── Write files ───────────────────────────────────────────────────────────

fs.mkdirSync(OUT, { recursive: true });

const index = {
  version: "1.0.0",
  generated: new Date().toISOString(),
  description:
    "Saved game-ready HYDRA UI packs for Grudge Studio fleet games. Load in Studio or via game-ui-runtime.js.",
  studioUrl: "https://ui.grudge-studio.com/studio",
  gamesUrl: "https://ui.grudge-studio.com/games",
  runtime: "./game-ui-runtime.js",
  packs: [],
};

for (const g of GAMES) {
  const scene = pack(g, g.comps);
  // Strip non-scene fields from top for studio compatibility
  const studioScene = {
    name: scene.name,
    resolution: scene.resolution,
    theme: scene.theme,
    comps: scene.comps,
    gameId: scene.gameId,
    gameReady: true,
    meta: scene.meta,
    states: scene.states,
    id: scene.id,
    version: scene.version,
  };
  const file = `${g.id}.json`;
  fs.writeFileSync(path.join(OUT, file), JSON.stringify(studioScene, null, 2));
  index.packs.push({
    id: g.id,
    gameId: g.gameId,
    name: g.name,
    file: `./${file}`,
    url: `/game-ui-packs/${file}`,
    playUrl: g.playUrl,
    theme: g.theme,
    genre: g.genre,
    features: g.features,
    usageStates: g.usageStates,
    tags: g.tags,
    componentCount: g.comps.length,
  });
  console.log("wrote", file, g.comps.length, "comps");
}

fs.writeFileSync(path.join(OUT, "index.json"), JSON.stringify(index, null, 2));
console.log("index.json packs:", index.packs.length);
