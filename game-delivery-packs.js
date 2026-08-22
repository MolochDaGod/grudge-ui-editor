/** Game delivery + D1 category SSOT for ui.grudge-studio.com/assets?pack= */

export const CDN = 'https://assets.grudge-studio.com';
export const INFO_API = 'https://info.grudge-studio.com/api/v1';
export const OBJECTSTORE_API = 'https://objectstore.grudge-studio.com/api/v1';
export const D1_API = 'https://api.grudge-studio.com/assets';
export const ASSET_BROWSER = 'https://ui.grudge-studio.com/assets';

export function canonicalizeCdnUrl(url) {
  if (!url) return '';
  return String(url)
    .replace(/^https?:\/\/molochdagod\.github\.io\/ObjectStore\//i, `${CDN}/`)
    .replace(/^https?:\/\/grudge-objectstore\.pages\.dev\//i, `${CDN}/`);
}

export function packUrl(packId, assetName) {
  const q = new URLSearchParams({ pack: packId });
  if (assetName) q.set('asset', assetName);
  return `${ASSET_BROWSER}?${q}`;
}

/** Live D1 asset_registry categories (exact API ids). */
export const D1_CATEGORIES = [
  { id: 'character', label: 'Characters', icon: '🧍', defaultGrid: [1, 1] },
  { id: 'characters', label: 'Characters (alias)', icon: '🧍', defaultGrid: [1, 1] },
  { id: 'character_kit', label: 'Character kits', icon: '🧍', defaultGrid: [1, 1] },
  { id: 'animation', label: 'Animations', icon: '🎬', defaultGrid: [1, 1] },
  { id: 'mixamo_not_play', label: 'Mixamo (source)', icon: '🎬', defaultGrid: [1, 1] },
  { id: 'weapon', label: 'Weapons', icon: '⚔️', defaultGrid: [1, 1] },
  { id: 'weapons', label: 'Weapons (alias)', icon: '⚔️', defaultGrid: [1, 1] },
  { id: 'projectile', label: 'Projectiles', icon: '🎯', defaultGrid: [1, 1] },
  { id: 'armor', label: 'Armor', icon: '🛡️', defaultGrid: [1, 1] },
  { id: 'monster', label: 'Monsters', icon: '👹', defaultGrid: [2, 2] },
  { id: 'creature', label: 'Creatures', icon: '🐉', defaultGrid: [2, 2] },
  { id: 'enemy', label: 'Enemies', icon: '💀', defaultGrid: [2, 2] },
  { id: 'animal', label: 'Animals', icon: '🐾', defaultGrid: [1, 1] },
  { id: 'voxel_animal', label: 'Voxel animals', icon: '🧊', defaultGrid: [1, 1] },
  { id: 'building', label: 'Buildings', icon: '🏛️', defaultGrid: [3, 3] },
  { id: 'house', label: 'Houses', icon: '🏠', defaultGrid: [3, 3] },
  { id: 'build', label: 'Build pieces', icon: '🧱', defaultGrid: [2, 2] },
  { id: 'environment', label: 'Environment', icon: '🌲', defaultGrid: [2, 2] },
  { id: 'nature', label: 'Nature', icon: '🌿', defaultGrid: [2, 2] },
  { id: 'bushes', label: 'Bushes', icon: '🌿', defaultGrid: [1, 1] },
  { id: 'trunks', label: 'Trunks', icon: '🪵', defaultGrid: [1, 1] },
  { id: 'stones', label: 'Stones', icon: '🪨', defaultGrid: [1, 1] },
  { id: 'terrain', label: 'Terrain', icon: '⛰️', defaultGrid: [4, 4] },
  { id: 'world_terrain', label: 'World terrain', icon: '🗺️', defaultGrid: [4, 4] },
  { id: 'world', label: 'Worlds', icon: '🌍', defaultGrid: [4, 4] },
  { id: 'world_pack', label: 'World packs', icon: '🌍', defaultGrid: [4, 4] },
  { id: 'map', label: 'Maps', icon: '🗺️', defaultGrid: [4, 4] },
  { id: 'voxel_map', label: 'Voxel maps', icon: '🧊', defaultGrid: [4, 4] },
  { id: 'road_tile', label: 'Road tiles', icon: '🛣️', defaultGrid: [2, 2] },
  { id: 'vehicle', label: 'Vehicles', icon: '🚢', defaultGrid: [2, 2] },
  { id: 'boat', label: 'Boats', icon: '⛵', defaultGrid: [2, 2] },
  { id: 'icycles', label: 'Cycles', icon: '🚲', defaultGrid: [2, 2] },
  { id: 'texture', label: 'Textures', icon: '🖼️', defaultGrid: [1, 1] },
  { id: 'audio', label: 'Audio', icon: '🔊', defaultGrid: [1, 1] },
  { id: 'font', label: 'Fonts', icon: '🔤', defaultGrid: [1, 1] },
  { id: 'item', label: 'Items', icon: '📦', defaultGrid: [1, 1] },
  { id: 'spell', label: 'Spells', icon: '✨', defaultGrid: [1, 1] },
  { id: 'vfx', label: 'VFX', icon: '💫', defaultGrid: [1, 1] },
  { id: 'voxel_vfx', label: 'Voxel VFX', icon: '💫', defaultGrid: [1, 1] },
  { id: 'ui_icon', label: 'UI icons (D1)', icon: '🎨', defaultGrid: [1, 1] },
  { id: 'accessories', label: 'Accessories', icon: '🪑', defaultGrid: [1, 1] },
  { id: 'prop', label: 'Props', icon: '📦', defaultGrid: [1, 1] },
  { id: 'props', label: 'Props (alias)', icon: '📦', defaultGrid: [1, 1] },
  { id: 'asset', label: 'Assets (misc)', icon: '📁', defaultGrid: [1, 1] },
  { id: 'model', label: 'Models', icon: '📐', defaultGrid: [1, 1] },
  { id: 'mesh', label: 'Meshes', icon: '📐', defaultGrid: [1, 1] },
  { id: 'blocks', label: 'Blocks', icon: '🧱', defaultGrid: [1, 1] },
  { id: 'voxel_content', label: 'Voxel content', icon: '🧊', defaultGrid: [1, 1] },
  { id: 'play_kit', label: 'Play kits', icon: '🎮', defaultGrid: [1, 1] },
  { id: 'crowns', label: 'Crowns', icon: '👑', defaultGrid: [1, 1] },
  { id: 'viking', label: 'Viking', icon: '🪓', defaultGrid: [2, 2] },
  { id: 'snowman', label: 'Snowman', icon: '⛄', defaultGrid: [1, 1] },
  { id: 'data', label: 'Data', icon: '📄', defaultGrid: [1, 1] },
  { id: 'media', label: 'Media', icon: '🎞️', defaultGrid: [1, 1] },
  { id: 'misc', label: 'Misc', icon: '•', defaultGrid: [1, 1] },
  { id: 'other', label: 'Other', icon: '•', defaultGrid: [1, 1] },
];

/** Major D1 packs that get sidebar tabs (rest stay in the All list). */
export const D1_TAB_IDS = [
  'character', 'weapon', 'animation', 'building', 'environment',
  'monster', 'creature', 'vehicle', 'item', 'audio', 'texture',
  'terrain', 'vfx', 'ui_icon', 'map',
];

/**
 * Game delivery catalogs (R2 binaries + info definitions).
 * `?pack=<id>` deep-links on https://ui.grudge-studio.com/assets
 */
export const DELIVERY_PACKS = [
  {
    id: 'toon-soldiers',
    label: 'Toon Soldiers',
    icon: '🪖',
    source: 'r2',
    parser: 'toonSoldiers',
    url: `${CDN}/models/toon-soldiers/catalog.json`,
    description: 'Nexus Era chicken-gun classes — scout/engineer/gunner/infantry/medic/sniper',
    defaultGrid: [1, 1],
    tab: true,
  },
  {
    id: 'vehicles',
    label: 'Toon RTS Vehicles',
    icon: '🐴',
    source: 'r2',
    parser: 'vehicles',
    url: `${CDN}/models/ummorpg-vehicles-catalog.json`,
    description: 'Race mounts, siege, and vehicle animation clips',
    defaultGrid: [2, 2],
    tab: true,
  },
  {
    id: 'ninja-equipment',
    label: 'Ninja Throwables',
    icon: '🥷',
    source: 'r2',
    parser: 'ninja',
    url: `${CDN}/models/weapons/ninja-equipment/catalog.json`,
    description: 'Shuriken/kunai throwables + flight projectiles',
    defaultGrid: [1, 1],
    tab: true,
  },
  {
    id: 'grudge6',
    label: 'Grudge6 Race Kits',
    icon: '🏰',
    source: 'info',
    parser: 'grudge6',
    url: `${INFO_API}/grudge6-characters.json`,
    description: 'Golden Toon RTS race kits + compare bakes + atlases',
    defaultGrid: [1, 1],
    tab: true,
  },
  {
    id: 'game-models',
    label: 'Game-ready Models',
    icon: '🎮',
    source: 'info',
    parser: 'models3dGame',
    url: `${INFO_API}/models3d-game.json`,
    description: 'Runtime GLBs with R2 URLs — weapons, buildings, characters',
    defaultGrid: [1, 1],
    tab: true,
  },
  {
    id: 'weapon-models',
    label: 'Weapon Meshes',
    icon: '🗡️',
    source: 'info',
    parser: 'weaponModels',
    url: `${INFO_API}/weapon-models.json`,
    description: 'Fantasy weapon GLBs on R2 by type (axe, sword, staff…)',
    defaultGrid: [1, 1],
    tab: true,
  },
  {
    id: 'def-weapons',
    label: 'Weapon Definitions',
    icon: '📜',
    source: 'info',
    parser: 'weaponDefs',
    url: `${INFO_API}/weapons.json`,
    description: 'Named weapon stats/lore — sprite preview from CDN icons',
    defaultGrid: [1, 1],
    tab: true,
  },
  {
    id: 'def-armor',
    label: 'Armor Definitions',
    icon: '🛡️',
    source: 'info',
    parser: 'armorDefs',
    url: `${INFO_API}/armor.json`,
    description: 'Named armor sets — sprite preview from CDN icons',
    defaultGrid: [1, 1],
    tab: true,
  },
  {
    id: 'harvest-nodes',
    label: 'Harvest Nodes',
    icon: '🌾',
    source: 'info',
    parser: 'harvest',
    url: `${INFO_API}/master-harvest-nodes.json`,
    description: 'Gathering nodes used by Open/Agama/Warlords',
    defaultGrid: [1, 1],
    tab: true,
  },
  {
    id: 'benches',
    label: 'Crafting Benches',
    icon: '🔨',
    source: 'info',
    parser: 'benches',
    url: `${INFO_API}/bench-mesh-catalog.json`,
    description: 'uMMORPG station meshes on R2',
    defaultGrid: [2, 2],
    tab: true,
  },
  {
    id: 'maps',
    label: 'Maps & Sectors',
    icon: '🗺️',
    source: 'info',
    parser: 'maps',
    url: `${INFO_API}/map-registry.json`,
    description: 'Warlords sectors, pirate lobby, home island, arenas',
    defaultGrid: [4, 4],
    tab: true,
  },
  {
    id: 'gltf-optimized',
    label: 'Optimized GLTF',
    icon: '📦',
    source: 'info',
    parser: 'gltfManifest',
    url: `${INFO_API}/gltf-manifest.json`,
    description: '1053 optimized GLBs (animations, weapons, characters)',
    defaultGrid: [1, 1],
    tab: true,
    lazy: true,
    renderCap: 80,
  },
];

export function deliveryPackById(id) {
  return DELIVERY_PACKS.find((p) => p.id === id) || null;
}

function baseItem(pack, name, extra = {}) {
  const url = canonicalizeCdnUrl(extra.url);
  const r2Key = extra.r2Key || (url.startsWith(CDN + '/') ? url.slice(CDN.length + 1) : extra.r2Key);
  const path = extra.path || (r2Key ? `/${r2Key}` : extra.path);
  const format = extra.format || (path || url || '').split('.').pop()?.split('?')[0]?.toLowerCase() || '';
  return {
    uid: extra.uid || `${pack.id}::${name}`,
    name,
    url: url || undefined,
    path,
    r2Key,
    format,
    size: extra.size,
    packId: pack.id,
    packLabel: pack.label,
    source: pack.source || 'delivery',
    category: extra.category || pack.id,
    grudgeUuid: extra.grudgeUuid,
    gridSize: extra.gridSize || pack.defaultGrid || [1, 1],
    viewer: extra.viewer,
    ...extra.rest,
  };
}

function guessViewer(item) {
  const fmt = (item.format || '').toLowerCase();
  const path = (item.path || item.url || '').toLowerCase();
  if (item.viewer) return item.viewer;
  if (['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'].includes(fmt) || /\.(png|jpe?g|webp|gif|svg)(\?|$)/.test(path)) {
    return 'image';
  }
  if (['wav', 'mp3', 'ogg', 'm4a'].includes(fmt) || /\.(wav|mp3|ogg|m4a)(\?|$)/.test(path)) return 'audio';
  return '3d';
}

function finish(item) {
  if (!item.viewer) item.viewer = guessViewer(item);
  return item;
}

function iconUrl(spritePath) {
  if (!spritePath) return '';
  if (spritePath.startsWith('http')) return canonicalizeCdnUrl(spritePath);
  return `${CDN}${spritePath.startsWith('/') ? '' : '/'}${spritePath}`;
}

export function parseDeliveryCatalog(pack, data) {
  const items = [];
  const parser = pack.parser;
  if (parser === 'toonSoldiers') {
    for (const ch of data.characters || []) {
      const mesh = ch.mesh || {};
      items.push(finish(baseItem(pack, ch.label || ch.id, {
        uid: `${pack.id}::${ch.id}`,
        url: mesh.cdnUrl,
        r2Key: mesh.r2Key,
        format: 'glb',
        category: ch.classId || 'character',
        rest: { classId: ch.classId, role: ch.role },
      })));
    }
  } else if (parser === 'vehicles') {
    for (const [race, entry] of Object.entries(data.races || {})) {
      const mounts = entry.mounts;
      if (mounts?.cdnUrl || mounts?.cdnKey) {
        items.push(finish(baseItem(pack, `${race} ${mounts.kind || 'mount'}`, {
          url: mounts.cdnUrl,
          r2Key: mounts.cdnKey,
          format: 'glb',
          category: 'mount',
        })));
      }
      const siege = entry.siege;
      if (siege?.cdnUrl || siege?.cdnKey) {
        items.push(finish(baseItem(pack, `${race} ${siege.kind || 'siege'}`, {
          url: siege.cdnUrl,
          r2Key: siege.cdnKey,
          format: 'glb',
          category: 'siege',
        })));
      }
      const animGroups = [mounts?.anims, siege?.anims, entry.anims];
      for (const group of animGroups) {
        if (!group || typeof group !== 'object') continue;
        for (const [clip, anim] of Object.entries(group)) {
          if (!anim?.cdnUrl && !anim?.cdnKey) continue;
          items.push(finish(baseItem(pack, `${race} ${clip}`, {
            url: anim.cdnUrl,
            r2Key: anim.cdnKey,
            format: 'glb',
            category: 'vehicle-anim',
          })));
        }
      }
    }
  } else if (parser === 'ninja') {
    for (const w of data.weapons || []) {
      for (const role of ['throwable', 'projectile']) {
        const mesh = w.mesh?.[role];
        if (!mesh) continue;
        items.push(finish(baseItem(pack, `${w.label || w.meshId} ${role}`, {
          uid: `${pack.id}::${w.id || w.meshId}::${role}`,
          url: mesh.cdnUrl,
          r2Key: mesh.r2Key,
          format: 'glb',
          category: role,
        })));
      }
    }
  } else if (parser === 'grudge6') {
    for (const race of data.races || []) {
      const models = race.models || {};
      if (models.kitGlb) {
        items.push(finish(baseItem(pack, `${race.name || race.id} kit`, {
          uid: `${pack.id}::${race.id}::kit`,
          url: models.kitGlb,
          format: 'glb',
          category: 'race-kit',
        })));
      }
      if (models.prodCompare && models.prodCompare !== models.kitGlb) {
        items.push(finish(baseItem(pack, `${race.name || race.id} compare`, {
          uid: `${pack.id}::${race.id}::compare`,
          url: models.prodCompare,
          format: 'glb',
          category: 'race-compare',
        })));
      }
      if (race.texture) {
        items.push(finish(baseItem(pack, `${race.name || race.id} atlas`, {
          uid: `${pack.id}::${race.id}::atlas`,
          url: race.texture,
          format: 'webp',
          viewer: 'image',
          category: 'texture',
        })));
      }
    }
  } else if (parser === 'models3dGame') {
    for (const m of data.models || []) {
      const url = m._r2Url || m._gameReadyUrl || m._cdnUrl;
      items.push(finish(baseItem(pack, String(m.name || '').replace(/\.gltf\.glb$/i, '').replace(/\.(glb|gltf|fbx)$/i, ''), {
        uid: m.grudgeUUID || `${pack.id}::${m.name}`,
        url,
        format: 'glb',
        size: m.sizeKB ? m.sizeKB * 1024 : undefined,
        category: m.category || m.kind,
        grudgeUuid: m.grudgeUUID,
      })));
    }
  } else if (parser === 'weaponModels') {
    for (const [type, group] of Object.entries(data.weaponTypes || {})) {
      for (const m of group.models || []) {
        items.push(finish(baseItem(pack, m.name, {
          url: m.r2Key ? `${CDN}/${m.r2Key}` : undefined,
          r2Key: m.r2Key,
          format: 'glb',
          size: m.sizeKB ? m.sizeKB * 1024 : undefined,
          category: type,
        })));
      }
    }
  } else if (parser === 'weaponDefs') {
    for (const [cat, group] of Object.entries(data.categories || {})) {
      for (const it of group.items || []) {
        const sprite = it.spritePath || (group.iconBase ? `/icons/weapons/${cat}/${it.id}.png` : '');
        items.push(finish(baseItem(pack, it.name || it.id, {
          uid: `${pack.id}::${it.id}`,
          url: iconUrl(sprite),
          format: 'png',
          viewer: 'image',
          category: cat,
          rest: { definitionId: it.id },
        })));
      }
    }
  } else if (parser === 'armorDefs') {
    const materials = data.materials || {};
    for (const [mat, group] of Object.entries(materials)) {
      for (const it of group.items || []) {
        items.push(finish(baseItem(pack, it.name || it.id, {
          uid: `${pack.id}::${it.id || it.name}`,
          url: iconUrl(it.spritePath || it.icon),
          format: 'png',
          viewer: 'image',
          category: mat,
        })));
      }
    }
    for (const it of data.sets ? [] : []) { /* sets are names only */ }
  } else if (parser === 'harvest') {
    for (const n of data.nodes || []) {
      items.push(finish(baseItem(pack, n.name || n.id, {
        uid: `${pack.id}::${n.id}`,
        url: iconUrl(n.spritePath || n.icon),
        format: (n.spritePath || '').split('.').pop() || 'png',
        viewer: 'image',
        category: n.type || n.profession,
      })));
    }
  } else if (parser === 'benches') {
    for (const b of data.componentMeshes || []) {
      items.push(finish(baseItem(pack, b.id || b.station, {
        url: b.cdn,
        r2Key: b.r2Key,
        format: 'glb',
        category: b.station,
      })));
    }
    for (const b of data.ummorpgBenches || []) {
      if (!b.icon) continue;
      items.push(finish(baseItem(pack, `${b.name} icon`, {
        uid: `${pack.id}::${b.id}::icon`,
        url: iconUrl(b.icon.startsWith('http') ? b.icon : `/${b.icon}`),
        format: 'png',
        viewer: 'image',
        category: b.profession,
      })));
    }
  } else if (parser === 'maps') {
    items.push(finish(baseItem(pack, 'Pirate lobby', {
      url: `${CDN}/models/lobby/pirate-islands/scene.glb`,
      r2Key: 'models/lobby/pirate-islands/scene.glb',
      format: 'glb',
    })));
    for (const f of data.families || []) {
      const asset = f.asset || '';
      if (!/\.(glb|gltf|fbx)$/i.test(asset)) continue;
      const url = asset.startsWith('http') ? asset : `https://${asset.replace(/^\/\//, '')}`;
      items.push(finish(baseItem(pack, f.shortName || f.id, {
        uid: `${pack.id}::${f.id}`,
        url,
        format: asset.split('.').pop(),
        rest: { playEntry: f.entry },
      })));
    }
  } else if (parser === 'gltfManifest') {
    for (const a of data.assets || []) {
      const name = (a.path || '').split('/').pop()?.replace(/\.[^.]+$/, '') || a.path;
      items.push(finish(baseItem(pack, name, {
        uid: `${pack.id}::${a.path}`,
        url: `${CDN}/${a.path}`,
        r2Key: a.path,
        format: 'glb',
        size: a.sizeKB ? a.sizeKB * 1024 : undefined,
        category: a.category,
      })));
    }
  }
  return items.filter((it) => it.url || it.path || it.r2Key);
}

if (typeof window !== 'undefined') {
  window.GRUDGE_DELIVERY_PACKS = {
    cdn: CDN,
    info: INFO_API,
    objectStore: OBJECTSTORE_API,
    d1: D1_API,
    browser: ASSET_BROWSER,
    packs: DELIVERY_PACKS,
    d1Categories: D1_CATEGORIES,
  };
}
