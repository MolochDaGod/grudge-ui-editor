import * as THREE from 'three';

/** World units per grid cell (1 = 1m footprint). */
export const CELL_SIZE = 1;

/** Infer grid footprint [cols, rows] from pack defaults and asset name. */
export function inferGridCells(item, packDef) {
  const name = (item.name || '').toLowerCase();
  const fromMeta = item.gridSize || item.grid;
  if (fromMeta) {
    if (typeof fromMeta === 'string') {
      const [c, r] = fromMeta.split('x').map(Number);
      if (c && r) return [c, r];
    }
    if (Array.isArray(fromMeta) && fromMeta.length >= 2) return fromMeta;
  }
  if (name.includes('cloud') || name.includes('water')) return [4, 4];
  if (name.includes('temple') || name.includes('barn') || name.includes('warehouse')) return [3, 3];
  if (name.includes('tree') || name.includes('ship') || name.includes('sail')) return [2, 2];
  if (name.includes('humanoid') || name.includes('character') || name.includes('rig')) return [1, 1];
  return packDef?.defaultGrid || [1, 1];
}

/**
 * Normalize object3D: scale to fit grid footprint, bottom-center on origin (y=0 plane).
 */
export function normalizeToGrid(object, gridCols, gridRows, cellSize = CELL_SIZE) {
  object.updateMatrixWorld(true);

  const rawBox = new THREE.Box3().setFromObject(object);
  const rawSize = rawBox.getSize(new THREE.Vector3());
  const rawCenter = rawBox.getCenter(new THREE.Vector3());

  const targetW = gridCols * cellSize;
  const targetD = gridRows * cellSize;
  const footprint = Math.max(rawSize.x, rawSize.z, 0.0001);
  const targetFootprint = Math.max(targetW, targetD);
  const scaleFactor = targetFootprint / footprint;

  object.scale.setScalar(scaleFactor);
  object.updateMatrixWorld(true);

  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const min = box.min;
  const centerX = (box.min.x + box.max.x) * 0.5;
  const centerZ = (box.min.z + box.max.z) * 0.5;

  object.position.set(-centerX, -min.y, -centerZ);
  object.updateMatrixWorld(true);

  const normBox = new THREE.Box3().setFromObject(object);

  return {
    scaleFactor,
    raw: { size: rawSize, center: rawCenter },
    normalized: {
      size,
      position: object.position.clone(),
      box: normBox,
      cellsX: size.x / cellSize,
      cellsZ: size.z / cellSize,
      cellsY: size.y / cellSize,
    },
    grid: { cols: gridCols, rows: gridRows, cellSize },
  };
}