/** Grudge Studio — Prim asset pack registry (R2 CDN) */
window.GRUDGE_PRIM_PACKS = {
  cdn: 'https://assets.grudge-studio.com',
  /** World units per grid cell (1 = 1m footprint) */
  cellSize: 1,
  packs: [
    {
      id: 'prim-vehicles',
      label: 'Vehicles',
      icon: '🚢',
      manifest: '/asset-packs/prim-vehicles/manifest.json',
      description: 'Boat, sail ship, car, spaceship, cloud sky mesh',
      defaultGrid: [2, 2],
    },
    {
      id: 'prim-islands',
      label: 'Islands & Environment',
      icon: '🏝️',
      manifest: '/asset-packs/prim-islands/manifest.json',
      description: 'Cabins, barns, bridges, water plane, brick houses',
      defaultGrid: [3, 3],
    },
    {
      id: 'prim-structures',
      label: 'Structures & Props',
      icon: '🏗️',
      manifest: '/asset-packs/prim-structures/manifest.json',
      description: 'Modular bricks, cargo, cliffs, boulders, props',
      defaultGrid: [2, 2],
    },
    {
      id: 'prim-animations',
      label: 'Characters & Animations',
      icon: '🧍',
      manifest: '/asset-packs/prim-animations/manifest.json',
      description: 'Humanoid combat, climb, idle, berserker rigs',
      defaultGrid: [1, 1],
    },
    {
      id: 'super-dialogue',
      label: 'Super Dialogue (NPC Voice)',
      icon: '🎙️',
      manifest: '/audio/dialogue/super-pack/manifest.json',
      description: '545 voice barks — greeting, damage, death, combat grunts (5 actors)',
      defaultGrid: [1, 1],
      viewer: 'audio',
    },
  ],
};