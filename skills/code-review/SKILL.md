---
name: code-review
description: PR review checklist for DataSync filesystem content store — API, compatibility, tests, terminology (not CDA/CMA HTTP SDK)
---

# Code review — `@contentstack/datasync-content-store-filesystem`

## When to use

- Reviewing a PR that touches `src/`, `test/`, or public-facing docs
- Self-checking before requesting review
- Assessing semver or regression risk for store behavior

## Instructions

### Scope and terminology

- This package is the **DataSync filesystem content store** — not the **CDA** or **CMA** HTTP client unless the change explicitly compares or documents integration.
- Prefer **DataSync**, **content store**, **asset connector**, **baseDir**, **locale**, **branch** (when configured).

### Public API and docs

- Exports from **`src/index.ts`**: `start`, `setConfig`, `getConfig`, `setAssetConnector`, `getFilesystemClient`.
- **`FilesystemStore`** in **`src/fs.ts`** — preserve or extend **JSDoc** on public exports when behavior changes.

### Compatibility

- Avoid breaking export signatures or on-disk layout without **semver** and changelog intent.
- Validation in **`src/util/validations.ts`** — do not silently change throw conditions for the same inputs.

### Errors

- No separate SDK error-code enum; ensure messages stay actionable and new throws are covered by tests where appropriate.

### Null safety

- Config and payloads may omit fields; match existing guards in **`src/fs.ts`** and validations.

### Dependencies and security

- New **`package.json`** dependencies need justification (SCA, maintenance). Align with org policy.

### Tests

- **`npm test`** should pass for `src/` / `test/` changes; extend **`test/`** and **`test/mock/`** for new behavior. No live stack API tests in this repo.

### Optional severity

| Level | Examples |
|-------|----------|
| **Blocker** | Breaks DataSync Manager contract, data loss/corruption, security |
| **Major** | Breaking API, wrong persistence layout, missing tests for risky logic |
| **Minor** | Style, non-user-facing refactors, doc nits |

## References

- [`../testing/SKILL.md`](../testing/SKILL.md)
- [`../datasync-content-store-filesystem/SKILL.md`](../datasync-content-store-filesystem/SKILL.md)
- [`../../AGENTS.md`](../../AGENTS.md)
