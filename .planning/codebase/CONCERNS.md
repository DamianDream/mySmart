---
last_mapped_commit: f647bca82b403c7bf25b594160c5cd2f95f504c8
working_tree_dirty: true
---
# Codebase Concerns

**Analysis Date:** 2026-09-10

## Tech Debt

- `src/content/tabs/info.js` mixes contacts UI and feedback/About; `tabs/contacts.js` contains another card renderer besides `ui/contactCard.js`.
- `.gitignore` excludes the feedback Worker and cloudflare directory, preventing full backend restoration from tracked checkout.
- `doc/CONTEXT.md` and `doc/CHROMEWEBSTORE.md` describe obsolete injection/permissions.
- `package.json` dev watch only builds background pass; manifest/package versions differ.

## Known Bugs

- **Reproduced:** `core/storage.js` profile export includes plaintext apiToken; `ui/settings.js` downloads it without warning/removal. Default export should strip secrets.
- **Reproduced:** applyPresetImport accepts ms_presets as object; getPreset then throws .find is not a function. Validate schema before mutation.
- **Reproduced:** updateDefinition leaves search Map entries unchanged; enabled cache returns old value after successful PUT. Invalidate scoped keys.
- **Reproduced:** `utils/url.js` suffix check accepts notsmartsender.com. Match exact hostname or dot-delimited subdomain.
- **Reproduced:** `popup/index.js` keys tabs only by contactId; synthetic A/42 and B/42 reuse A. Use project/contact composite identity.
- **Static:** vars DOM detection uses extension document/location and cannot scan funnel page (`tabs/vars.js`).
- **Static:** definitions and contacts search only first page; variable verify searches by name in first page.

## Security Considerations

- **P1:** Token-bearing profile export risks accidental account access sharing; no actual compromise established.
- **P1, reproduced locally:** ignored Worker skips Turnstile based on a public client header. A caller can repeat it; CORS is not authentication. Deployed code not checked.
- **P1:** Feedback includes name/email, full active URL and identifiers; current listing/privacy statements do not describe that accurately (`tabs/info.js`, `doc/CHROMEWEBSTORE.md`).
- **P1:** `core/api.js` logs request/response payloads; contact data and variable values may persist (`core/logger.js`). Headers are not logged in inspected path.
- **P1 risk:** Global projectId is read across async operations (`models/project.js`, `tabs/vars.js`, `tabs/contacts.js`). Pin client identity and reject stale results before multi-project rollout. Wrong-account production write not reproduced.
- `background.js` proxy lacks explicit endpoint/method allowlist and request schema checks; narrow boundary without claiming arbitrary websites currently can message it.
- session access widened to TRUSTED_AND_UNTRUSTED_CONTEXTS despite no content scripts; hardening opportunity, not demonstrated exfiltration.
- Dynamic HTML attributes/error HTML require validation/escaping; no successful XSS exploit demonstrated.

## Performance Bottlenecks

- No production latency/load benchmark collected.
- Tag pagination and multi-variable lookups run serially; latency depends on page/count and provider.
- Logger rewrites up to 1000 records on each action; storage overhead unmeasured.
- 5-minute per-context cache improves repeated reads but lacks eviction on writes/token changes.

## Fragile Areas

- Project switching during pending requests and save/verify chains.
- Popup queue read-modify-write in background plus independent drain in popup; potential lost updates, not concurrency-tested.
- UI event rebinding after innerHTML, duplicate contact renderers and broad module dependencies.
- Storage setters ignore promise completion; UI may imply successful persistence too early.

## Scaling Limits

- Logs: 1000 entries, payload truncation at 5000 characters.
- Histories/favorites: generally capped at 100; variable old values at 5.
- Local Worker rate limit: 5 per IP/10 minutes per isolate, not global distributed control.
- Actual provider quotas, user capacity and billing costs not measured.

## Dependencies at Risk

- SmartSender API and Chrome lifecycle behavior are external compatibility boundaries.
- No finding of a specific vulnerable package version; vulnerability scan not run.
- Backend source/config/migrations need a tracked, secret-free deploy unit.

## Missing Critical Features

- Before external paid pilot: safer secrets handling, data disclosure, robust project isolation, durable feedback protection and regression coverage.
- Billing, team permissions and license service not implemented; monetization remains a hypothesis, not release scope.
- No verified reproducible clean-clone backend deployment or CI release pipeline.

## Test Coverage Gaps

- Highest: delayed responses across project switches; export/import; feedback challenge/rate controls.
- Next: API errors/timeouts, cache invalidation, popup queue, Chrome reload/update lifecycle.
- Six isolated defect reproductions are documented in TESTING.md; no actual fixes shipped.
- No confirmed P0 incident; prioritize P1 data/context protection before structural refactor.

## Evidence Scope

- Snapshot: HEAD above plus pre-existing working-tree changes; not a clean release commit.
- Source inspection and synthetic audit performed on 2026-09-10; live deployment not verified.
- Mapping mode: sequential in-context; no mapper subagents were launched.
