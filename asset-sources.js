/** Grudge Studio — unified asset sources (Prim packs, D1/R2 registry, icons). */

/** D1 asset registry — same-origin proxy on ui.grudge-studio.com avoids CORS drift. */
function resolveRegistryBase() {
  if (typeof location !== 'undefined') {
    const host = location.hostname || '';
    if (host === 'ui.grudge-studio.com' || host === 'localhost' || host.endsWith('.vercel.app')) {
      return '/api/registry';
    }
  }
  return 'https://api.grudge-studio.com/assets';
}

export const API_BASE = resolveRegistryBase();
export const ICON_INDEX_URL = 'https://assets.grudge-studio.com/game-assets/api/v1/icon-path-index.json';
export const SUPER_DIALOGUE_MANIFEST_URL = 'https://assets.grudge-studio.com/audio/dialogue/super-pack/manifest.json';

const AUDIO_EXTS = new Set(['wav', 'mp3', 'ogg', 'm4a', 'flac', 'aac']);

const IMAGE_EXTS = new Set(['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp', 'svg']);
const MODEL_EXTS = new Set(['fbx', 'glb', 'gltf', 'obj']);

/** D1 asset_registry categories (lazy-loaded from asset-api). */
export const D1_CATEGORIES = [
  { id: 'character', label: 'Characters', icon: '🧍', defaultGrid: [1, 1] },
  { id: 'animation', label: 'Animations', icon: '🎬', defaultGrid: [1, 1] },
  { id: 'weapon', label: 'Weapons & Gear', icon: '⚔️', defaultGrid: [1, 1] },
  { id: 'monster', label: 'Monsters', icon: '👹', defaultGrid: [2, 2] },
  { id: 'building', label: 'Buildings', icon: '🏛️', defaultGrid: [3, 3] },
  { id: 'environment', label: 'Environment', icon: '🌲', defaultGrid: [2, 2] },
  { id: 'terrain', label: 'Terrain', icon: '⛰️', defaultGrid: [4, 4] },
  { id: 'texture', label: 'Textures (R2)', icon: '🖼️', defaultGrid: [1, 1] },
  { id: 'audio', label: 'Audio (R2)', icon: '🔊', defaultGrid: [1, 1] },
  { id: 'font', label: 'Fonts (R2)', icon: '🔤', defaultGrid: [1, 1] },
  { id: 'item', label: 'Items', icon: '📦', defaultGrid: [1, 1] },
  { id: 'spell', label: 'Spells', icon: '✨', defaultGrid: [1, 1] },
];

export function packIdD1(category) {
  return `d1-${category}`;
}

export function packIdIcon(folder) {
  return `icon-${folder}`;
}

export function packIdDialogue() {
  return 'super-dialogue';
}

export function assetUrl(item, cdn) {
  if (item.url) return item.url;
  if (item.cdnUrl) return item.cdnUrl;
  if (item.path?.startsWith('http')) return item.path;
  return `${cdn}${item.path?.startsWith('/') ? '' : '/'}${item.path || ''}`;
}

export function isImageAsset(item) {
  if (item.viewer === 'image') return true;
  if (item.viewer === '3d') return false;
  if (item.source === 'icon') return true;
  const fmt = (item.format || '').toLowerCase();
  if (IMAGE_EXTS.has(fmt)) return true;
  if (item.mimeType?.startsWith('image/')) return true;
  if (item.category === 'texture') return true;
  const path = (item.path || item.r2Key || '').toLowerCase();
  return IMAGE_EXTS.has(path.split('.').pop() || '');
}

export function isModelAsset(item) {
  if (isImageAsset(item)) return false;
  if (isAudioAsset(item)) return false;
  const fmt = (item.format || '').toLowerCase();
  if (MODEL_EXTS.has(fmt)) return true;
  const path = (item.path || item.r2Key || '').toLowerCase();
  return MODEL_EXTS.has(path.split('.').pop() || '');
}

export function isAudioAsset(item) {
  if (item.viewer === 'audio') return true;
  if (item.source === 'dialogue') return true;
  const fmt = (item.format || '').toLowerCase();
  if (AUDIO_EXTS.has(fmt)) return true;
  if (item.mimeType?.startsWith('audio/')) return true;
  const path = (item.path || item.r2Key || item.url || '').toLowerCase();
  return AUDIO_EXTS.has(path.split('.').pop()?.split('?')[0] || '');
}

export function dialogueFileToItem(entry, fileName) {
  const { cdnUrl, r2Key, category, gender, actor, bytes } = entry;
  const variantMatch = fileName.match(/_(\d+)_/);
  const variant = variantMatch ? Number(variantMatch[1]) : 1;
  const packId = packIdDialogue();
  return {
    uid: `${packId}::${r2Key || fileName}`,
    name: fileName.replace(/\.wav$/i, ''),
    path: r2Key ? `/${r2Key}` : undefined,
    url: cdnUrl,
    r2Key,
    format: 'wav',
    size: bytes,
    packId,
    packLabel: 'Super Dialogue Pack',
    source: 'dialogue',
    category: 'audio',
    dialogueCategory: category,
    dialogueGender: gender,
    dialogueActor: actor,
    dialogueVariant: variant,
    viewer: 'audio',
    gridSize: [1, 1],
  };
}

/** Load Super Dialogue Audio Pack v1 manifest from R2 CDN. */
export async function fetchSuperDialoguePack() {
  const res = await fetch(SUPER_DIALOGUE_MANIFEST_URL);
  if (!res.ok) throw new Error(`Dialogue manifest: ${res.status}`);
  const data = await res.json();
  const items = [];
  const byCategory = new Map();

  for (const [fileName, entry] of Object.entries(data.files || {})) {
    const item = dialogueFileToItem(entry, fileName);
    items.push(item);
    const cat = entry.category || 'miscellaneous';
    if (!byCategory.has(cat)) byCategory.set(cat, []);
    byCategory.get(cat).push(item);
  }

  return {
    items,
    byCategory,
    total: items.length,
    categories: data.categories || [...byCategory.keys()],
  };
}

export function primFileToItem(f, def) {
  const name = f.name || f.path?.split('/').pop()?.replace(/\.[^.]+$/, '');
  const item = {
    uid: `${def.id}::${name}`,
    name,
    path: f.path || f.cdnPath,
    format: f.format || 'fbx',
    size: f.size,
    gridSize: f.gridSize,
    packId: def.id,
    packLabel: def.label,
    source: 'prim',
    viewer: '3d',
    textures: f.textures,
  };
  if (!isModelAsset(item) && isImageAsset(item)) item.viewer = 'image';
  return item;
}

export function d1AssetToItem(a, catDef) {
  const packId = packIdD1(catDef.id);
  const item = {
    uid: a.id || `${packId}::${a.name}`,
    id: a.id,
    name: a.name,
    path: a.r2Key ? `/${a.r2Key}` : undefined,
    url: a.cdnUrl,
    r2Key: a.r2Key,
    format: a.format,
    size: a.fileSize,
    packId,
    packLabel: `D1 · ${catDef.label}`,
    source: 'd1',
    category: a.category || catDef.id,
    grudgeUuid: a.grudgeUuid,
    mimeType: a.mimeType,
    gridSize: catDef.defaultGrid,
  };
  item.viewer = isImageAsset(item) ? 'image' : '3d';
  return item;
}

export function iconEntryToItem(relativePath, meta, packFolder) {
  const name = relativePath.split('/').pop()?.replace(/\.[^.]+$/, '') || 'icon';
  const packId = packIdIcon(packFolder);
  return {
    uid: `${packId}::${name}`,
    name,
    path: meta.cdnUrl?.replace(/^https?:\/\/[^/]+/, '') || relativePath,
    url: meta.cdnUrl,
    format: 'png',
    packId,
    packLabel: `Icons · ${packFolder}`,
    source: 'icon',
    category: meta.category || 'icon',
    grudgeUuid: meta.grudgeUuid,
    viewer: 'image',
    gridSize: [1, 1],
  };
}

/** Fetch first batch from D1 category route (max 500, no offset on API). */
export async function fetchD1Category(category, { limit = 500 } = {}) {
  const cap = Math.min(limit, 500);
  const res = await fetch(`${API_BASE}/category/${encodeURIComponent(category)}?limit=${cap}`);
  if (!res.ok) throw new Error(`D1 ${category}: ${res.status}`);
  const data = await res.json();
  const assets = data.assets || [];
  return { assets, hasMore: assets.length >= cap };
}

/** Scan paginated /assets list for more rows in a category (API has no category offset). */
export async function fetchD1CategoryMore(category, knownIds, { scanOffset = 0, limit = 200 } = {}) {
  const batch = [];
  let offset = scanOffset;
  let total = Infinity;

  while (batch.length < limit && offset < total) {
    const res = await fetch(`${API_BASE}?limit=500&offset=${offset}`);
    if (!res.ok) break;
    const data = await res.json();
    total = data.total ?? total;
    for (const a of data.assets || []) {
      if (a.category === category && !knownIds.has(a.id)) batch.push(a);
    }
    offset += 500;
    if (!(data.assets?.length)) break;
  }

  return { assets: batch, nextScanOffset: offset, hasMore: offset < total };
}

/** Fetch total registered assets from asset-api root listing. */
export async function fetchD1Total() {
  const res = await fetch(`${API_BASE}?limit=1&offset=0`);
  if (!res.ok) return 0;
  const data = await res.json();
  return data.total ?? 0;
}

/** Load icon-path-index.json and group by pack folder. */
export async function fetchIconRegistry() {
  const res = await fetch(ICON_INDEX_URL);
  if (!res.ok) throw new Error(`Icon index: ${res.status}`);
  const data = await res.json();
  const groups = new Map();

  for (const [relativePath, meta] of Object.entries(data.index || {})) {
    const parts = relativePath.replace(/^\//, '').split('/');
    const packFolder = parts[1] || parts[0] || 'misc';
    if (!groups.has(packFolder)) groups.set(packFolder, []);
    groups.get(packFolder).push({ relativePath, meta });
  }

  const packs = [...groups.entries()]
    .sort((a, b) => b[1].length - a[1].length)
    .map(([folder, entries]) => ({
      folder,
      packId: packIdIcon(folder),
      label: folder.replace(/_/g, ' '),
      count: entries.length,
      entries,
    }));

  return { packs, total: data.totalEntries ?? packs.reduce((n, p) => n + p.count, 0), cdnBase: data.cdnBase };
}

export function searchHaystack(item) {
  return [
    item.name,
    item.name?.replace(/_/g, ' '),
    item.path,
    item.r2Key,
    item.packId,
    item.packLabel,
    item.source,
    item.category,
    item.format,
    item.grudgeUuid,
    item.id,
    item.dialogueCategory,
    item.dialogueGender,
    item.dialogueActor,
    item.dialogueActor?.replace(/-/g, ' '),
  ].filter(Boolean).join(' ').toLowerCase();
}