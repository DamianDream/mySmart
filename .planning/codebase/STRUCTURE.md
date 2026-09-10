---
last_mapped_commit: f647bca82b403c7bf25b594160c5cd2f95f504c8
working_tree_dirty: true
---
# Codebase Structure

**Analysis Date:** 2026-09-10

## Directory Layout

```text
src/
  manifest.json          MV3 capabilities and entry declarations
  background.js          messaging, fetch proxy, popup queue, updates
  sidebar.css            shared CSS system
  icons/                 packaged PNG icons
  sidepanel/index.js     native panel bootstrap
  popup/index.js         detached contacts window
  content/
    core/                state, persistence, API, logs, updates, popup helper
    models/              project switching and SmartSender variable/tag APIs
    tabs/                imperative feature controllers
    ui/                  sidebar, settings, themes, reusable contact card
    utils/               URL context and DOM helpers
    icons.js             inline SVG fragments
sidepanel.html
contact-popup.html
doc/                     context, design, store-listing documents
scripts/test-browser.sh  manual Chrome testing helper
vite.config.js           first build pass
vite.config.sidepanel.js second build pass
eslint.config.js
package.json
package-lock.json
README.md
CLAUDE.md
```

## Directory Purposes

- `src/content/` is shared extension-page logic, not an injected content script.
- `src/content/tabs/info.js` currently includes contacts list UI as well as About/feedback.
- `src/content/tabs/contacts.js` combines API methods and legacy detail-panel rendering.
- `src/content/ui/contactCard.js` powers the detached popup presentation.
- `doc/CONTEXT.md` contains outdated overlay/interceptor descriptions.
- `CLAUDE.md` documents current entry/build distinctions; verify claims against src.

## Key File Locations

- Change capability declarations in `src/manifest.json`.
- Add/modify storage keys through `src/content/core/storage.js`.
- API transport boundary: `src/content/core/api.js`, `src/background.js`.
- Project identity/context: `src/content/models/project.js`, `src/content/utils/url.js`.
- Contact tab identity and queue drain: `src/popup/index.js`.
- Full build orchestrated by package.json scripts and both Vite configurations.

## Naming Conventions

- Lowercase directories, camelCase module names for compound concepts.
- Named ES module exports for helpers, state and rendering functions.
- UI element IDs and CSS classes mostly use ss-/ssp- prefixes.
- Persistence keys use ms_/ss_ prefixes; some keys are project-scoped functions.

## Where to Add New Code

- Keep transport/schema validation at API/background boundary.
- Put reusable card behavior in ui rather than duplicating in feature controllers.
- Establish regression-test location before adding broad refactors; none is canonical yet.
- GSD maps live in `.planning/codebase/`; human task ownership remains external.

## Special Directories

- `dist/`, `node_modules/` are generated/ignored; not implementation sources.
- `.gitignore` also excludes `extension-feedback-api.js` and `cloudflare/`.
- Ignored backend exists locally but is not a portable clean-clone dependency.
- `.mcp.json` has user changes; contents not required for this map and not copied.

## Evidence Scope

- Snapshot: HEAD above plus pre-existing working-tree changes; not a clean release commit.
- Source inspection and synthetic audit performed on 2026-09-10; live deployment not verified.
- Mapping mode: sequential in-context; no mapper subagents were launched.
