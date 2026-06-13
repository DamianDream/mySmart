# Project Context: mySender Tools

## Overview

`mySmart` (mySender Tools) is a premium Chrome extension (Manifest V3) designed to enhance the workflow on `smartsender.com`. It injects a resizable sidebar into the page, allowing users to manage variables, tags, and contacts, as well as providing quick presets and search functionality.

## Architecture & Key Components

- **`manifest.json`**: Manifest V3 configuration. Declares permissions (`storage`, `activeTab`, `scripting`), background service worker, and content scripts.
- **`background.js`**: Service worker. Handles communication between the extension components and performs CORS-free API requests to the Smartsender API via message passing (`API_REQUEST`).
- **`content.js`**: The core frontend logic. Injects the sidebar UI into the DOM, manages application state, handles user interactions, renders components (Vars, Tags, Contacts), and manages local/session storage.
- **`sidebar.css`**: Styling for the injected sidebar. Implements a custom design system using CSS variables, supporting both dark and light themes. Uses a premium, glassmorphism-inspired aesthetic (`backdrop-filter`).
- **`interceptor.js`**: Injected into the page's MAIN world to intercept XHR and `fetch` requests. It extracts internal Project IDs and CSRF/XSRF tokens from the Smartsender web application and passes them to the content script via `window.postMessage`.

## Technology Stack

- **Core**: Vanilla JavaScript (ES6+), HTML (injected via JS), Vanilla CSS.
- **Frameworks/Libraries**: None. The project relies entirely on native browser APIs and DOM manipulation.
- **Icons**: Inline SVG strings defined in `content.js`.
- **Storage**: `chrome.storage.local` for persistent settings/history and `chrome.storage.session` for session-specific data.

## Development Guidelines for AI Agents

1. **Maintain Vanilla Stack**: Do not introduce frontend frameworks (React, Vue, etc.) or CSS libraries (Tailwind, Bootstrap) unless explicitly requested. Continue using Vanilla JS and CSS.
2. **UI/UX Consistency**:
   - Follow the existing design patterns in `sidebar.css`.
   - Use the defined CSS variables (`--bg`, `--text`, `--accent`, etc.) for any new styling to ensure dark/light mode compatibility.
   - Maintain the "premium" feel (smooth transitions, proper spacing, SVG icons).
3. **State Management**: State is managed in a central `state` object inside `content.js`. Update this object and re-render components as needed.
4. **API Communication**: All requests to external APIs (e.g., `api.smartsender.com`) should be routed through `background.js` using `bgFetch()` in `content.js` to avoid CORS issues.
5. **Security & Permissions**: When adding new features, ensure they comply with Manifest V3 restrictions. Avoid `eval()` or inline scripts that violate CSP.
6. **Icons**: Use inline SVGs similar to the existing ones defined at the top of `content.js`.
