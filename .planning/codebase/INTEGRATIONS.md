---
last_mapped_commit: f647bca82b403c7bf25b594160c5cd2f95f504c8
working_tree_dirty: true
---
# External Integrations

**Analysis Date:** 2026-09-10

## APIs & External Services

- SmartSender REST v1 via `src/content/core/api.js` and `src/background.js`.
- `src/content/models/smartsender.js`: GET tags (paginated), GET definitions/search and IDs, PUT definition.
- `src/content/tabs/contacts.js`: GET contact, search, info; PUT contact values.
- Base API URL in code: https://api.smartsender.com/v1/.
- Bearer tokens supplied per project; actual provider quotas not verified.
- `src/content/tabs/info.js`: direct fetch POST to configured Cloudflare feedback endpoint.
- `src/sidepanel/index.js` and `src/popup/index.js`: Google Fonts stylesheet.
- No payment, license, outbound email or product-analytics SDK found.

## Data Storage

- chrome.storage.local: presets/tokens, settings, history, favorites and action logs.
- chrome.storage.session: popup queue/window state and session helpers.
- `src/content/core/storage.js`: local cache initialized from storage and updated onChanged.
- `src/content/core/api.js`: per-context Map cache, 5-minute TTL when enabled.
- Local feedback Worker uses Neon PostgreSQL through parameterized tagged SQL.
- `extension-feedback-api.js` is ignored, absent from clean tracked checkout; backend findings refer to local file inspected during audit, not production.
- No tracked database migration set found; live schema and retention not verified.

## Authentication & Identity

- Manual project API-token entry; tokens persist in ms_presets.
- `authHeaders()` resolves token using current mutable state.projectId.
- Profile JSON export includes tokens; it is not a safe secret-free sharing format.
- installId is generated locally; export strips installId from global settings.
- No OAuth flow or central user/team login implemented in client.
- Worker treats a public client header as permission to skip Turnstile; see CONCERNS.md.

## Monitoring & Observability

- Local action/API logs: `src/content/core/logger.js`, `src/content/tabs/logs.js`.
- API logging includes body and response; potential contact/variable data.
- Payload truncation: 5000 characters; maximum 1000 records.
- Worker console errors; no verified external error tracker or retention policy.

## CI/CD & Deployment

- Two-pass Vite produces dist; no tracked CI workflow found.
- Chrome runtime update APIs in `src/content/core/updater.js` and background.
- Store listing draft in `doc/CHROMEWEBSTORE.md` differs from current permissions/data flow.
- Backend deploy unit not reproducible from tracked files alone.

## Environment Configuration

- Extension uses saved project settings, not a server .env for SmartSender credentials.
- Worker environment variable names documented above; actual values never included.
- Staging/prod separation, backup and live environment settings not established.

## Webhooks & Callbacks

- No payment/provider webhook receiver found in extension.
- Feedback Worker local routes: POST /api/feedback, /health and OPTIONS.
- Chrome messages: API_REQUEST, OPEN_CONTACT_POPUP, SS_POPUP_DRAIN, CHECK_FOR_UPDATES.
- Runtime installation/update events are browser callbacks, not external webhooks.

## Evidence Scope

- Snapshot: HEAD above plus pre-existing working-tree changes; not a clean release commit.
- Source inspection and synthetic audit performed on 2026-09-10; live deployment not verified.
- Mapping mode: sequential in-context; no mapper subagents were launched.
