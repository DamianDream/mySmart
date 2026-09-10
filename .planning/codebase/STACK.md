---
last_mapped_commit: f647bca82b403c7bf25b594160c5cd2f95f504c8
working_tree_dirty: true
---
# Technology Stack

**Analysis Date:** 2026-09-10

## Languages

- JavaScript ES modules: all application code under `src/`; `package.json` declares type module.
- CSS: hand-maintained design system in `src/sidebar.css`.
- HTML: `sidepanel.html` and `contact-popup.html` entry pages.
- JSON: manifest, npm configuration and lockfile.

## Runtime

- Production client: Chrome Manifest V3 extension (`src/manifest.json`).
- Native side panel and detached popup; background service worker.
- No minimum Chrome version declared in manifest; compatibility floor not validated.
- Build host observed: Node v24.15.0 and npm 11.12.1; these are observations, not declared minimums.
- `package-lock.json` exists. No package.json engines requirement.
- Separate local feedback source targets Cloudflare Workers; deployment version not verified.

## Frameworks

- Core UI: vanilla DOM/Shadow DOM; no React/Vue application runtime.
- Testing: no registered automated test runner or npm test script.
- Build: Vite, configured in two passes.
- Lint: ESLint flat configuration, no-undef only (`eslint.config.js`).

## Key Dependencies

- `vite`: declared ^8.0.16; observed build 8.0.16.
- `rollup-plugin-copy`: ^3.5.0; manifest/icons copying in `vite.config.js`.
- `eslint`: ^10.5.0.
- `eslint-plugin-vue`: ^10.9.2 installed declaration, but not configured as a Vue app/lint preset.
- `@neondatabase/serverless`: ^1.1.0; used by ignored feedback Worker, not the extension client.

## Configuration

- `vite.config.js`: background output, empties dist, copies manifest/icons.
- `vite.config.sidepanel.js`: sidepanel and popup, preserves previous dist pass.
- `src/manifest.json`: storage, sidePanel, tabs permissions; SmartSender host permission.
- API tokens configured by user through `src/content/ui/settings.js`.
- Worker references DATABASE_URL, TURNSTILE_SECRET_KEY, TURNSTILE_DISABLED; values were not loaded.
- Source version is 0.3.0 in manifest vs 0.3 in package.json.

## Platform Requirements

- Development: npm dependencies and a Node release compatible with installed Vite.
- Full build: npm run build. Dev watch currently rebuilds only first pass.
- Client installation instructions: load dist as unpacked Chrome extension (`README.md`).
- Production Store publication, installed build and backend hosting configuration remain unverified.
- No paid API, billing SDK or license service implemented in inspected client code.

## Evidence Scope

- Snapshot: HEAD above plus pre-existing working-tree changes; not a clean release commit.
- Source inspection and synthetic audit performed on 2026-09-10; live deployment not verified.
- Mapping mode: sequential in-context; no mapper subagents were launched.
