---
name: testing
description: Jest tests for datasync-content-store-filesystem — pretest, test/mock ignores, coverage, no live API
---

# Testing — `@contentstack/datasync-content-store-filesystem`

## When to use

- Adding or changing tests under `test/`
- Debugging failures after `src/` changes
- Understanding Jest ignores or `pretest` behavior

## Instructions

### Commands

- **`npm test`**: runs **`pretest`** (`npm run build-ts` and `rimraf _contents coverage`), then **`jest --coverage`**.
- **`npm run build-ts`**: clean + full TypeScript build (needed before tests if you skip `pretest`).
- **`npm run compile`**: `tsc` only.

### Runner and config

- **Jest** + **ts-jest** (`jest.config.js`), **`testEnvironment: node`**, verbose output.
- **`testMatch`**: `**/test/**/*.ts` (and `.js`); **`testPathIgnorePatterns`**: **`/test/mock/*`**, **`/test/mongo.setup.ts`** (legacy path in config — file may or may not exist).
- **`collectCoverage`**: true; reports under **`coverage/`** (json, html). No **`coverageThreshold`** in the checked-in config unless the team adds it.

### Layout

- Tests: **`test/*.ts`** (e.g. `index.ts`, `publishing.ts`, `deletion.ts`, `validations.ts`, `unpublishing.ts`).
- Mocks: **`test/mock/`** (`config.ts`, `assetStore.ts`, `data/**`) — excluded from test file discovery.

### Credentials / env

- **No** Contentstack API keys or stack credentials for default tests — local filesystem and mocks only.
- Optional: **`DEBUG`** including **`core-fs`** for store logging (`src/fs.ts`).

### Notifications

- Jest has **`notify: true`** — optional peer **`node-notifier`**; missing notifier can cause local failures until installed or `notify` is disabled in config.

## References

- [`../datasync-content-store-filesystem/SKILL.md`](../datasync-content-store-filesystem/SKILL.md)
- [`../../AGENTS.md`](../../AGENTS.md)
