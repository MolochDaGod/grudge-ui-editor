# Grudge UI Editor

> Game UI Kit & Showcase — visual editor for Grudge Warlords game interfaces
>
> **Created by Racalvin The Pirate King**

Live at:
- **[ui.grudge-studio.com](https://ui.grudge-studio.com)** (Vercel + Cloudflare DNS)
- **[grudge-ui-editor.puter.site](https://grudge-ui-editor.puter.site)** (Puter mirror)

## What is this?

A visual UI editor and showcase for building game interfaces used across Grudge Warlords. Includes pre-built kits for:
- **Fantasy** — medieval RPG menus, inventory, skill trees
- **Cyberpunk** — sci-fi HUDs, neon panels, terminal UI
- **RPG** — stat bars, item tooltips, character sheets

## Deployment

### Vercel (primary)
Push to `main` → Vercel auto-deploys. Static site — no build step.

### Puter (mirror)
```bash
puter site deploy . grudge-ui-editor
```

### DNS
`ui.grudge-studio.com` → CNAME → Vercel project domain (configured in Cloudflare)

## Part of Grudge Studio

This is a tool in the [Grudge Studio](https://grudge-studio.com) ecosystem. See [The-ENGINE](https://github.com/MolochDaGod/The-ENGINE) for the main game backend.
