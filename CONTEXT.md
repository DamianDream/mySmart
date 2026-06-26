# Project Context: mySender Tools

## Overview

`mySmart` (mySender Tools) is a premium Chrome extension (Manifest V3) designed to enhance the workflow on `smartsender.com`. It injects a resizable sidebar into the page, allowing users to manage variables, tags, and contacts, as well as providing quick presets and search functionality.

## Build & Layout

Source lives in `src/`; the loadable Manifest V3 extension is produced in `dist/` by Vite (`npm run build`). Never edit `dist/` directly — it is generated and git-ignored.

- **`src/manifest.json`**: Manifest V3 config. Declares permissions (`storage`, `activeTab`, `scripting`), the background service worker, and two content scripts: `interceptor.js` (MAIN world, `document_start`) and the bundled `content.js` (`document_end`). Copied verbatim into `dist/`.
- **`src/background.js`** → `dist/background.js`: Service worker. Toggles the sidebar on icon click and performs CORS-free API requests to the SmartSender API via message passing (`API_REQUEST`).
- **`src/content/`** → bundled into `dist/content.js`: The core frontend, split into modules:
  - `index.js` — entry point; builds the Shadow DOM host and boots the app.
  - `core/` — `state`, `storage`, `api` (`bgFetch`), `logger`, `updater`.
  - `tabs/` — `vars`, `tags`, `contacts`, `logs`, `info` panels.
  - `ui/` — `sidebar`, `settings`, `themes`.
  - `utils/` — `dom`, `url`; `models/` — `project`, `smartsender`; `icons.js` — inline SVGs.
- **`src/sidebar.css`** → `dist/sidebar.css`: Styling for the injected sidebar. Custom design system using CSS variables, dark/light themes, glassmorphism (`backdrop-filter`). Also inlined into the Shadow DOM at runtime.
- **`src/interceptor.js`** → `dist/interceptor.js`: Runs in the page's MAIN world at `document_start` to intercept XHR and `fetch`. Extracts internal Project IDs and CSRF/XSRF tokens from the SmartSender web app and passes them to the content script via `window.postMessage` (consumed in `index.js`). Plain IIFE — not bundled.

## Technology Stack

- **Core**: Vanilla JavaScript (ES6+ modules), HTML (injected via JS), Vanilla CSS.
- **Build**: Vite (`rollup-plugin-copy` for static assets). No frontend frameworks or CSS libraries.
- **Icons**: Inline SVG strings in `src/content/icons.js`.
- **Storage**: `chrome.storage.local` for persistent settings/history and `chrome.storage.session` for session-specific data.

## Development Guidelines for AI Agents

1. **Maintain Vanilla Stack**: Do not introduce frontend frameworks (React, Vue, etc.) or CSS libraries (Tailwind, Bootstrap) unless explicitly requested. Continue using Vanilla JS and CSS.
2. **UI/UX Consistency**:
   - Follow the existing design patterns in `sidebar.css`.
   - Use the defined CSS variables (`--bg`, `--text`, `--accent`, etc.) for any new styling to ensure dark/light mode compatibility.
   - Maintain the "premium" feel (smooth transitions, proper spacing, SVG icons).
3. **State Management**: State is managed in a central `state` object in `src/content/core/state.js`. Update this object and re-render components as needed.
4. **API Communication**: All requests to external APIs (e.g., `api.smartsender.com`) should be routed through the background worker using `bgFetch()` from `src/content/core/api.js` to avoid CORS issues.
5. **Security & Permissions**: When adding new features, ensure they comply with Manifest V3 restrictions. Avoid `eval()` or inline scripts that violate CSP.
6. **Icons**: Use inline SVGs similar to the existing ones in `src/content/icons.js`.
