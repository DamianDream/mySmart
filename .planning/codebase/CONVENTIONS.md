---
last_mapped_commit: f647bca82b403c7bf25b594160c5cd2f95f504c8
working_tree_dirty: true
---
# Coding Conventions

**Analysis Date:** 2026-09-10

## Naming Patterns

- camelCase functions/variables: bgFetch, switchProject, renderVarsTab.
- Uppercase storage constants: K_PRESETS, K_GLOBAL_SETTINGS (`core/storage.js`).
- Render/build prefix for DOM builders; load/save for persistence helpers.
- No TypeScript types or application class hierarchy.

## Code Style

- ES modules and ordinary JavaScript; semicolons, generally single-quoted imports.
- Template literals for markup and URLs; indentation is not fully consistent.
- Flat ESLint configuration enables no-undef only (`eslint.config.js`).
- No verified formatter contract; preserve adjacent style during targeted changes.

## Import Organization

- Relative .js imports, named imports, no configured module aliases.
- Core/state/storage helpers feed feature controllers and UI modules.
- Entry modules import CSS using Vite ?inline.
- Several unused or historically broad imports remain; no-unused-vars is not enabled.
- Circular dependencies between UI/controllers require care during module extraction.

## Error Handling

- API uses Promise rejection at bgFetch boundary.
- Background returns serialized status/data/error envelope.
- UI catches commonly call showNotice or update inline text.
- Some paths use alert/console; fetchDefinitionsByIds suppresses individual failures.
- storage save helpers fire and forget; callers cannot infer durable success.

## Logging

- Use logAction from `src/content/core/logger.js` for local activity.
- Current API logger persists body and response as truncated JSON.
- Truncation does not remove sensitive values; future callers must avoid expanding exposure.
- No structured external telemetry client detected.

## Comments

- Section divider comments organize large imperative modules.
- Several comments describe old content-script architecture; code/manifest takes precedence.
- Document actual invariants, especially project identity across awaits.

## Function Design

- Rendering functions find IDs inside shadowRootRef and bind handlers after innerHTML.
- Mutable module-level state coordinates view changes.
- Async callbacks may outlive the rendered view; capture identity and verify before updates.
- API helpers currently read project token implicitly; explicit client context is proposed, not implemented.

## Module Design

- state.js: state and hydration; storage.js: keys/cache and persistence.
- models/smartsender.js: tag/definition API operations.
- tabs/info.js has mixed responsibilities; avoid adding more contact logic there.
- Reuse contactCard.js for converging rendering only after behavior tests exist.
- Source changes, deployments and task acceptance are outside this mapping operation.

## Evidence Scope

- Snapshot: HEAD above plus pre-existing working-tree changes; not a clean release commit.
- Source inspection and synthetic audit performed on 2026-09-10; live deployment not verified.
- Mapping mode: sequential in-context; no mapper subagents were launched.
