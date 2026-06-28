/**
 * Copy Craftpix UI textures into assets/craftpix/ and emit craftpix-manifest.json.
 * Source: D:\craftpix-ui4\Textures (override with CRAFTPIX_SRC env)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SRC = process.env.CRAFTPIX_SRC || 'D:\\craftpix-ui4\\Textures';
const DEST = path.join(ROOT, 'assets', 'craftpix');
const MANIFEST = path.join(ROOT, 'craftpix-manifest.json');

function walk(dir, base = '') {
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const rel = base ? `${base}/${name}` : name;
    if (fs.statSync(full).isDirectory()) out.push(...walk(full, rel));
    else if (/\.(png|jpg|jpeg|webp)$/i.test(name)) out.push(rel.replace(/\\/g, '/'));
  }
  return out;
}

if (!fs.existsSync(SRC)) {
  console.error('Craftpix source not found:', SRC);
  process.exit(1);
}

fs.mkdirSync(DEST, { recursive: true });
const files = walk(SRC);
let copied = 0;
for (const rel of files) {
  const srcFile = path.join(SRC, rel);
  const destFile = path.join(DEST, rel);
  fs.mkdirSync(path.dirname(destFile), { recursive: true });
  if (!fs.existsSync(destFile) || fs.statSync(srcFile).mtimeMs > fs.statSync(destFile).mtimeMs) {
    fs.copyFileSync(srcFile, destFile);
    copied++;
  }
}

const categories = {};
for (const rel of files) {
  const parts = rel.split('/');
  const cat = parts.length > 1 ? parts[0] : 'Root';
  if (!categories[cat]) categories[cat] = [];
  const label = path.basename(rel, path.extname(rel)).replace(/_/g, ' ');
  categories[cat].push({
    id: rel.replace(/\.[^.]+$/, '').replace(/[/\\]/g, '--'),
    path: rel,
    url: `./assets/craftpix/${rel}`,
    label,
    name: path.basename(rel),
  });
}

const manifest = {
  pack: 'craftpix-ui4',
  version: 1,
  generated: new Date().toISOString(),
  baseUrl: './assets/craftpix/',
  total: files.length,
  categories: Object.entries(categories)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, items]) => ({ name, count: items.length, items })),
};

fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));
console.log(`Craftpix: ${files.length} textures, ${copied} copied, manifest → craftpix-manifest.json`);