---
name: code-review
description: PR review checklist for the DataSync filesystem content store package — API, tests, terminology, security
---

# Code review (expanded)

Use for reviewing changes to **`@contentstack/datasync-content-store-filesystem`**.

## Terminology

- This is a **DataSync content store** that writes to disk. It is **not** the Contentstack **CDA** or **CMA** SDK. Use **DataSync**, **content store**, **asset connector**, **baseDir**, **locale**, **branch** (when configured) in review comments.

## Public API and docs

- Exports from **`src/index.ts`**: `start`, `setConfig`, `getConfig`, `setAssetConnector`, `getFilesystemClient`.
- **`FilesystemStore`** in **`src/fs.ts`** implements the store behavior (publish/unpublish/delete, etc.).
- Preserve or extend **JSDoc** on public exports when behavior changes.

## Backward compatibility

- Avoid breaking changes to export signatures or on-disk layout without a **semver** bump and maintainer agreement.
- Callers depend on predictable validation in **`src/util/validations.ts`** — do not weaken checks without explicit rationale.

## Errors

- Errors are thrown from validation and I/O paths; there is no separate error-code enum. Reviews should ensure messages remain actionable and that new throws are documented or covered by tests.

## Null safety

- Config and webhook payloads may omit fields; follow existing guards and optional chaining patterns in **`src/fs.ts`** and validations.

## Dependencies and SCA

- New **`package.json`** dependencies affect consumers and CI (Snyk, etc.). Flag unnecessary additions and version pins.

## Tests

- **`npm test`** must pass for `src/` and `test/` changes.
- Add or update tests under **`test/`** for new branches; use **`test/mock/`** for shared fixtures.

## Severity (optional)

- **Blocker**: contract break with DataSync Manager, data loss/corruption, security.
- **Major**: breaking API, wrong file layout, untested risky logic.
- **Minor**: style, comments, non-functional refactors.
