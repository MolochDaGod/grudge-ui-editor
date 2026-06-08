# Deploy to Puter

This `dist/` folder is a fully self-contained, static build of the **Game UI Kit & Showcase**.
`index.html` is at the root, every asset path is relative (`./assets/...`), and there is no
backend requirement — it runs entirely in the browser.

## What's in here

- `index.html` — app entry point (must stay at the root)
- `assets/` — hashed, minified JS + CSS bundles **and** all pixel-art image assets
  (`cyberpunk/`, `fantasy/`, `fps/`, `rpg/`)
- `favicon.svg`, `opengraph.jpg`, `robots.txt`

## Option A — Upload the folder (recommended)

1. Sign in at https://puter.com
2. Open the **Files** app and create a new folder, e.g. `game-ui-kit`.
3. Drag the **contents** of this `dist/` folder into it (so `index.html` sits at the
   top level of that folder — not nested inside another `dist/`).
4. Open **Dev Center** (or right-click the folder → **Publish / Host Website**).
5. Choose the folder and set the entry page to `index.html`.
6. Puter gives you a live `*.puter.site` URL. Done.

## Option B — Upload the zip

A ready-to-upload archive is provided next to this folder:
`game-ui-kit-puter-dist.zip` (its root contains `index.html` directly).

1. In Puter **Files**, upload the zip.
2. Right-click it → **Extract** (the contents already have `index.html` at the root).
3. Publish/host the extracted folder as in Option A.

## Notes

- **Single page app, no routing** — no server rewrite rules are needed.
- **No API/server** — the optional "AI Director" panel calls a backend that isn't part
  of a static deploy; it fails silently and the rest of the kit works fully.
- **Fonts** load from Google Fonts over the network.
- To preview locally before uploading, run `./serve-local.sh` (or any static file
  server) from inside this folder and open the printed URL.
