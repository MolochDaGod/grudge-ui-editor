# Deploy fleet consistency — packages & dependencies

Snapshot after 2026-07-25 push of Warlords main-panel, rapier combat/airship, mech TPS aim.

## Live production targets

| Product | Domain | Vercel project | Repo |
|---------|--------|----------------|------|
| Mech battle | mech-playground.vercel.app | `mech-playground` | grudge-mech-forge |
| UI host / main-panel | ui.grudge-studio.com | `grudge-ui-editor` | grudge-ui-editor |
| Animator / Danger | threejs-rapier-react-three-controll.vercel.app | `threejs-rapier-react-three-controll` | threejs-rapier-react-three-controller |
| Warlords client | client.grudge-studio.com / grudgewarlords.com | grudge-builder | GrudgeBuilder |

## Package manager pattern (required)

| Repo | Manager | Lockfile | Node | Install on Vercel |
|------|---------|----------|------|-------------------|
| grudge-mech-forge | **npm** | package-lock.json | ≥20.18 | `npm install --no-audit --no-fund` |
| grudge-ui-editor | **npm** (static) | none (no deps) | ≥20.18 | none (output `.`) |
| GrudgeBuilder | **npm** | package-lock.json | 22.x | `npm install --legacy-peer-deps --include=dev` |
| threejs-rapier monorepo | **pnpm** | pnpm-lock.yaml + catalog: | ≥20 | monorepo root: `pnpm install --frozen-lockfile` then filter animator |

### Rules

1. **Never mix lockfiles** in one deploy root (no package-lock + pnpm-lock together).
2. **pnpm catalog:** only works from monorepo root (`threejs-rapier-react-three-controller`). Satellite Vercel rootDirectory must run install from `../..`.
3. **Static UI host** must not invent a fake Node build — `buildCommand: null`, `outputDirectory: "."`.
4. **Token keys / Railway** for fleet apps: same-origin `/api/*` rewrites to Railway + id.grudge-studio.com (see grudge-production-wiring).

## Systems shipped this cycle

| System | Repo / commit | Deploy status |
|--------|---------------|---------------|
| Mech right-shoulder TPS + chest aim | grudge-mech-forge `d1869c8` | Live mech-playground |
| Main-panel + paperdoll + eras | grudge-ui-editor `70ac430`+ | Live ui.grudge-studio.com |
| Landing + airship + Puter bridge | rapier `a5f62c8`/`60433dd` | Live static ship |
| Racalvin parrot pet | rapier `389f3c1` | In git; redeploy animator for full asset |
| Combat stacks SSOT | rapier `bcdb173` | In git; redeploy animator |
| Client MainPanelHost | GrudgeBuilder `39833e56` on `feat/ethereal-destruction-cold` | PR #26 — not on main until merge |

## Do not commit

- `workers/cdn/NUL`, ingest multipacks, `tmp-glb-*.json`, untracked sector-assets dumps  
- Mixed WIP on `agent/ingest-recent-downloads` unless intentional asset ship  
- Local mech nexus/cursors WIP until product-ready  

## Smoke

```bash
curl -sI https://mech-playground.vercel.app/
curl -sI https://ui.grudge-studio.com/main-panel.html
curl -s  https://ui.grudge-studio.com/eras/index.json
curl -sI https://threejs-rapier-react-three-controll.vercel.app/
```
