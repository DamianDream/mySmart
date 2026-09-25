# CLAUDE.md

Behavioral guidelines

Four principles. When one applies, invoke the matching skill - don't just inline the
work.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:

Don't assume. Surface tradeoffs before writing code.

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

- New feature / "build X": superpowers:brainstorming
- Bug / error / test failure: superpowers:systematic-debugging
- Multi-step / 3+ files: superpowers:writing-plans

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- Minimum code that solves the problem. Nothing speculative.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

- Before commit, polish: simplify

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:

- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"
- Implementing a feature or bugfix use skill superpowers:test-driven-development
- Executing a written plan use skill superpowers:executing-plans
- About to claim "done" / "fixed" / "passing" use skill superpowers:verification-before-completion
- Extract anti-patterns from a bug fix learning

For multi-step tasks, state a brief plan:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

## Project-Specific Guidelines

**mySender Tools** — a vanilla-JS Chrome extension (Manifest V3) that enhances the `smartsender.com` workflow, plus a standalone Cloudflare Worker for a feedback form. No TypeScript, no test suite.

### Commands

- `npm install` — install deps
- `npm run build` — full build: `vite.config.js` (background.js + manifest + icons) then `vite.config.sidepanel.js` (sidepanel.html + contact-popup.html), both emitting into `dist/` (git-ignored, never hand-edit)
- `npm run dev` — `vite build --watch`; only rebuilds the background.js pass, **not** the sidepanel/popup pass — run `npm run build` after touching `src/sidepanel/` or `src/popup/`
- `npm run lint` — `eslint src/` (flat config, only `no-undef` enabled)
- No test script exists in this repo
- Manual testing: build, then load `dist/` unpacked at `chrome://extensions`, or use `scripts/test-browser.sh` + the `chrome-devtools-mcp` server (`.mcp.json`, port 9222) — see [[test-browser-setup]] memory

### Architecture

- **Two independent deploy units that share no code:**
  - The extension itself (`src/` → `dist/`, built by Vite)
  - `extension-feedback-api.js` (repo root) — a separate Cloudflare Worker (deployed via raw `wrangler deploy`, no config file) that validates Turnstile + writes feedback to a Neon Postgres `feedback` table; called from `src/content/tabs/info.js`. See [[feedback-pipeline]] memory.
- **No content scripts.** `src/manifest.json` declares no `content_scripts`; the UI lives in Chrome's native side panel (`sidepanel.html` → `src/sidepanel/index.js`) and a detached contact pop-up window (`contact-popup.html` → `src/popup/index.js`), not an injected overlay. `doc/CONTEXT.md`'s description of a `src/interceptor.js` content script is stale — that file doesn't exist; treat this file as the source of truth over that doc.
- **`src/background.js`** (service worker) is the central hub: proxies all outbound API calls via `API_REQUEST` messages (`handleApiRequest`, avoids CORS), manages the contact pop-up singleton + its `chrome.storage.session` queue, and tracks extension updates.
- **`src/content/`** is a shared UI/logic library imported by both the sidepanel and popup entry points (despite the name, it's not a content script):
  - `core/state.js` — single mutable `state` object, hydrated from storage
  - `core/storage.js` — all storage keys + typed load/save helpers, in-memory cache synced via `chrome.storage.onChanged`, plus preset export/import
  - `core/api.js` — `bgFetch()`, the only path UI code should use to call the SmartSender API (sends `API_REQUEST` to background, never `fetch()` directly)
  - `tabs/` — one module per sidebar tab (`vars.js`, `contacts.js`, `tags.js`, `logs.js`, `info.js`)
  - `ui/`, `models/`, `utils/`, `icons.js` — DOM rendering, project/SmartSender domain helpers, URL/DOM utils, inline SVG icons
- **Storage**: `chrome.storage.local` for durable settings/history/presets; `chrome.storage.session` for ephemeral per-session state (current project, popup queue). Per-project API tokens live in presets (`K_PRESETS`) and are sent as `Authorization: Bearer` headers by `authHeaders()`.
- **Styling**: hand-written CSS design system in `src/sidebar.css` (custom properties, glassmorphism), imported via `?inline` into both entry points. `doc/DESIGN.md` has the full palette/spacing/motion spec if changing visual design.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.
