---
last_mapped_commit: f647bca82b403c7bf25b594160c5cd2f95f504c8
working_tree_dirty: true
---
# Testing Patterns

**Analysis Date:** 2026-09-10

## Test Framework

- No npm test script, test runner configuration or tracked unit/integration suite found.
- `scripts/test-browser.sh` is a manual browser helper, not automated coverage.
- `eslint.config.js` runs only no-undef; passing lint does not verify behavior.

## Run Commands

- `npm run lint`: observed exit 0 during the 2026-09-10 audit.
- `npm run build`: observed exit 0 for both passes in an isolated source/dependency copy.
- Build used existing installed dependencies, not fresh npm ci verification.
- `npm run dev`: first-pass watch only; UI changes need full build.
- Manual installation described in `README.md`: load unpacked dist in Chrome.

## Test File Organization

- No canonical tests directory/naming convention established in tracked project.
- Mapping creates documentation only; it does not install a runner or create product tests.
- Earlier audit used a temporary Node vm/assert harness, preserved in external task evidence.

## Test Structure

- Audit harness loads selected actual functions with fake Chrome/storage/fetch boundaries.
- Assertions reproduce present defects; success means defect observed, not fixed.
- No real tokens, contacts, API writes or deployed database used.

## Mocking

- Fake chrome.storage.local returns synthetic project/token data.
- Fake chrome.runtime.sendMessage supplies a successful PUT response.
- Worker fetch stub counts challenge calls; database connection deliberately absent.
- Popup DOM handlers replaced with stubs for contact-tab identity check.
- This does not model complete Chrome lifecycle, Shadow DOM or concurrent windows.

## Fixtures and Factories

- Synthetic token marker and project identifiers only.
- Two projects with the same synthetic contact ID test missing project key.
- Invalid ms_presets object tests import schema acceptance.
- No production data fixtures copied into repository.

## Coverage

- No coverage percentage measured or enforced.
- Six reproduced audit cases: plaintext token export; malformed import failure; false-positive hostname; stale cache after PUT; public-header challenge bypass; popup cross-project ID collision.
- Matching IDs across real SmartSender projects not verified; test is a client invariant check.

## Test Types

- Static inspection plus isolated function-level checks: performed.
- Full browser E2E, live feedback delivery and deployment verification: not performed.
- npm clean install and dependency vulnerability scan: not performed.
- Build and lint passed before mapping; source is unchanged by this operation.

## Common Patterns / Next Verification

- Add controlled delayed responses to test project switch during search/save/verify.
- Test safe export defaults and invalid import rejection without partial mutation.
- Test 401/403/429/timeout handling, bounded safe retries and storage quota errors.
- Test popup queue concurrency and worker termination/restart.
- Browser smoke must include AUTO/MANUAL switching and test-contact edits in both surfaces.

## Evidence Scope

- Snapshot: HEAD above plus pre-existing working-tree changes; not a clean release commit.
- Source inspection and synthetic audit performed on 2026-09-10; live deployment not verified.
- Mapping mode: sequential in-context; no mapper subagents were launched.
