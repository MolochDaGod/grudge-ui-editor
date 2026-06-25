import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const TEX_EXT = ['.webp', '.png', '.jpg', '.jpeg', '.tga'];

/** Renderer color management + shadows tuned for asset preview. */
export function configureRenderer(renderer) {
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
}

/**
 * Build CDN texture lookup candidates from a raw FBX/Unity path.
 * e.g. D:\...\Brick_Theme.psd → Brick_Theme
 */
export function textureBasename(raw) {
  if (!raw) return '';
  const leaf = raw.replace(/\\/g, '/').split('/').pop() || '';
  return leaf.replace(/\.(psd|tga|tif|tiff|bmp|dds|exr|png|jpe?g|webp)$/i, '');
}

/**
 * Resolve relative texture URLs to Grudge CDN paths.
 * Tries: asset dir, pack textures/, manifest map, .fbm folder.
 */
export function createTextureResolver({ cdn, packId, assetPath, manifestTextures = {} }) {
  const packBase = `${cdn}/asset-packs/${packId}/v1/`;
  const assetDir = assetPath
    ? `${cdn}${assetPath.replace(/[^/]+$/, '')}`
    : packBase;
  const fbmDir = assetPath
    ? `${cdn}${assetPath.replace(/\.[^.]+$/, '')}.fbm/`
    : null;
  const texDir = `${packBase}textures/`;

  const cache = new Map();
  const stats = { resolved: 0, missing: 0, mapped: 0 };

  function candidates(name) {
    const key = name.toLowerCase();
    if (cache.has(key)) return cache.get(key);

    const list = [];
    if (manifestTextures[name]) list.push(`${cdn}${manifestTextures[name]}`);
    if (manifestTextures[key]) list.push(`${cdn}${manifestTextures[key]}`);

    for (const ext of TEX_EXT) {
      list.push(`${assetDir}${name}${ext}`);
      list.push(`${texDir}${name}${ext}`);
      if (fbmDir) list.push(`${fbmDir}${name}${ext}`);
      list.push(`${packBase}${name}${ext}`);
    }
    cache.set(key, list);
    return list;
  }

  /** LoadingManager URL modifier — rewrite broken Unity paths to CDN guesses. */
  function urlModifier(url) {
    if (/^https?:\/\//i.test(url) || url.startsWith('data:') || url.startsWith('blob:')) {
      return url;
    }
    const base = textureBasename(url);
    if (!base) return url;
    const cands = candidates(base);
    if (cands.length) {
      stats.mapped++;
      return cands[0];
    }
    return url;
  }

  return { urlModifier, candidates, stats, packBase, assetDir, texDir };
}

export function createAssetLoadingManager(resolver) {
  const manager = new THREE.LoadingManager();
  manager.setURLModifier((url) => resolver.urlModifier(url));
  return manager;
}

function fixTexture(tex) {
  if (!tex) return;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
}

function toStandardMaterial(mat) {
  if (!mat) return new THREE.MeshStandardMaterial({ color: 0x9aa0b4, roughness: 0.72, metalness: 0.08 });
  if (mat.isMeshStandardMaterial) return mat;

  const color = mat.color?.clone?.() ?? new THREE.Color(0x9aa0b4);
  const std = new THREE.MeshStandardMaterial({
    color,
    map: mat.map || null,
    normalMap: mat.normalMap || null,
    roughnessMap: mat.roughnessMap || null,
    metalnessMap: mat.metalnessMap || null,
    aoMap: mat.aoMap || null,
    emissive: mat.emissive?.clone?.() ?? new THREE.Color(0x000000),
    emissiveMap: mat.emissiveMap || null,
    emissiveIntensity: mat.emissiveIntensity ?? 1,
    transparent: mat.transparent ?? false,
    opacity: mat.opacity ?? 1,
    side: mat.side ?? THREE.FrontSide,
    alphaTest: mat.alphaTest ?? 0,
    roughness: 0.65,
    metalness: 0.12,
  });

  if (mat.normalScale) std.normalScale.copy(mat.normalScale);
  if (std.map) fixTexture(std.map);
  if (std.normalMap) fixTexture(std.normalMap);
  if (std.roughnessMap) fixTexture(std.roughnessMap);
  if (std.metalnessMap) fixTexture(std.metalnessMap);
  if (std.aoMap) fixTexture(std.aoMap);
  if (std.emissiveMap) fixTexture(std.emissiveMap);

  mat.dispose?.();
  return std;
}

/**
 * Walk loaded model: PBR materials, shadows, optional async texture hydrate.
 */
export async function prepareModelMaterials(root, resolver, textureLoader) {
  const meshes = [];
  root.traverse((c) => {
    if (c.isMesh) meshes.push(c);
  });

  const texJobs = [];

  for (const mesh of meshes) {
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    if (Array.isArray(mesh.material)) {
      mesh.material = mesh.material.map(toStandardMaterial);
    } else {
      mesh.material = toStandardMaterial(mesh.material);
    }

    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const mat of mats) {
      if (mat.map) {
        fixTexture(mat.map);
        continue;
      }
      const hint = mesh.name || mat.name || '';
      const bases = [textureBasename(mat.name), textureBasename(hint)].filter(Boolean);
      for (const base of bases) {
        texJobs.push(hydrateMap(mat, base, resolver, textureLoader));
        break;
      }
    }
  }

  await Promise.all(texJobs);
  return resolver.stats;
}

async function hydrateMap(mat, baseName, resolver, textureLoader) {
  for (const url of resolver.candidates(baseName)) {
    try {
      const tex = await textureLoader.loadAsync(url);
      fixTexture(tex);
      mat.map = tex;
      mat.needsUpdate = true;
      resolver.stats.resolved++;
      return;
    } catch {
      /* try next candidate */
    }
  }
  resolver.stats.missing++;
}

/** Studio lighting rig: hemisphere + key/fill/rim + ground + IBL. */
export function createStudioRig(scene, renderer) {
  const rig = new THREE.Group();
  rig.name = 'studioRig';

  const hemi = new THREE.HemisphereLight(0xdde8ff, 0x2a2418, 0.55);
  rig.add(hemi);

  const ambient = new THREE.AmbientLight(0xffffff, 0.22);
  rig.add(ambient);

  const key = new THREE.DirectionalLight(0xfff4e0, 1.35);
  key.position.set(9, 14, 7);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.near = 0.5;
  key.shadow.camera.far = 60;
  key.shadow.camera.left = -14;
  key.shadow.camera.right = 14;
  key.shadow.camera.top = 14;
  key.shadow.camera.bottom = -14;
  key.shadow.bias = -0.00015;
  key.shadow.normalBias = 0.02;
  rig.add(key);
  rig.add(key.target);

  const fill = new THREE.DirectionalLight(0x9eb8ff, 0.45);
  fill.position.set(-8, 6, -6);
  rig.add(fill);

  const rim = new THREE.DirectionalLight(0x4ade80, 0.28);
  rim.position.set(-2, 5, 10);
  rig.add(rim);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(48, 48),
    new THREE.MeshStandardMaterial({
      color: 0x12141c,
      roughness: 0.92,
      metalness: 0.04,
    }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.001;
  ground.receiveShadow = true;
  ground.name = 'groundPlane';
  rig.add(ground);

  scene.add(rig);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new RoomEnvironment();
  const envRT = pmrem.fromScene(envScene, 0.04);
  scene.environment = envRT.texture;
  envScene.dispose();

  return {
    rig,
    lights: { hemi, ambient, key, fill, rim },
    ground,
    dispose() {
      pmrem.dispose();
      envRT.dispose();
      scene.environment = null;
    },
  };
}

/** Container for one or more staged assets in the world. */
export function createStage() {
  const group = new THREE.Group();
  group.name = 'assetStage';
  return group;
}

/**
 * Display a 2D image (icon, texture, sprite) as an upright plane in the scene.
 */
export async function createImageAsset(url, textureLoader, { maxSize = 1.5, upright = true } = {}) {
  const tex = await textureLoader.loadAsync(url);
  fixTexture(tex);

  const img = tex.image;
  const iw = img?.width || 1;
  const ih = img?.height || 1;
  const aspect = iw / ih;
  let w;
  let h;
  if (aspect >= 1) {
    w = maxSize;
    h = maxSize / aspect;
  } else {
    h = maxSize;
    w = maxSize * aspect;
  }

  const group = new THREE.Group();
  group.name = 'imageAsset';

  const mat = new THREE.MeshBasicMaterial({
    map: tex,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: true,
    toneMapped: false,
  });

  const plane = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
  plane.name = 'imagePlane';

  if (upright) {
    plane.position.y = h * 0.5;
  } else {
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = 0.02;
  }

  group.add(plane);

  const frame = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.PlaneGeometry(w + 0.06, h + 0.06)),
    new THREE.LineBasicMaterial({ color: 0xc8a84b, transparent: true, opacity: 0.4 }),
  );
  frame.position.copy(plane.position);
  if (!upright) frame.rotation.x = -Math.PI / 2;
  group.add(frame);

  return group;
}