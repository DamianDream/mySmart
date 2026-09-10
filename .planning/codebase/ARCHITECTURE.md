---
last_mapped_commit: f647bca82b403c7bf25b594160c5cd2f95f504c8
working_tree_dirty: true
---
# Architecture

**Analysis Date:** 2026-09-10

## Pattern Overview

- Event-driven MV3 browser extension with imperative DOM UI and shared ES modules.
- Two extension UI contexts and a background service worker.
- A separate feedback backend shares no application state/code with the extension.
- Historical src/content directory is a library: no content_scripts in manifest.

## Layers

- Entry/mount: `src/sidepanel/index.js`, `src/popup/index.js`; Shadow DOM and styling.
- UI composition: `src/content/ui/sidebar.js`, settings.js, themes.js, contactCard.js.
- Feature controllers: `src/content/tabs/vars.js`, tags.js, contacts.js, info.js, logs.js.
- Domain/API: `src/content/models/smartsender.js`; contact methods remain in tabs/contacts.js.
- State/persistence: `src/content/core/state.js`, storage.js.
- Transport: `src/content/core/api.js` -> messages -> `src/background.js` -> fetch.
- Feedback bypasses that transport and directly calls its endpoint from tabs/info.js.

## Data Flow

1. Entry initializes chrome storage cache and state, mounts shared sidebar/card UI.
2. Sidepanel tracks active URL using chrome.tabs and refreshes AUTO context.
3. UI lookup resolves project token; background returns status/data to bgFetch.
4. Feature controller mutates state and explicitly re-renders DOM.
5. Variable save performs PUT followed by verification and local history update.
6. Contact popup request is queued in session storage; background opens/focuses window.
7. Popup drains queue and loads contact info; multiple tabs keep in-memory data.
8. Feedback collects user form fields/context and posts to independent Worker/Neon.

## Key Abstractions

- `state` is an ordinary mutable object, not reactive framework state.
- Each UI JS context gets its own module instances; storage communicates durable changes.
- `getPreset(projectId)` selects a per-project token.
- `bgFetch` converts callback transport to Promise and logs outcomes.
- `esc` escapes common HTML characters but does not validate URLs.
- `mountContactCard` provides reusable popup card; sidepanel contains another implementation.
- `switchProject` changes global state and renders; it is not a request isolation boundary.

## Entry Points

- `src/manifest.json`: background.js and sidepanel.html.
- `sidepanel.html` imports `src/sidepanel/index.js`.
- `contact-popup.html` imports `src/popup/index.js`.
- `extension-feedback-api.js`: ignored local Cloudflare Worker source, separately deployed.

## Error Handling

- Background responds with ok/status/data or an error string.
- bgFetch rejects unsuccessful responses and handles extension-context invalidation.
- UI uses notices, console logging and some alerts; patterns are inconsistent.
- Several catches suppress errors; storage setters do not await durable completion.
- There is no central timeout, request cancellation or stale-project response guard.

## Cross-Cutting Concerns

- Authentication depends on mutable current project: pin request context before refactoring.
- Sensitive data appears in profile export and diagnostic payloads.
- Project/contact identity must be composite in popup and asynchronous workflows.
- Native sidepanel cannot inspect webpage DOM through its own document.
- Build output is generated; modify src/config, not dist.

## Evidence Scope

- Snapshot: HEAD above plus pre-existing working-tree changes; not a clean release commit.
- Source inspection and synthetic audit performed on 2026-09-10; live deployment not verified.
- Mapping mode: sequential in-context; no mapper subagents were launched.
