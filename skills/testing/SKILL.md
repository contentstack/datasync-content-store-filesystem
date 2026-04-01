---
name: testing
description: How to run Jest tests, pretest steps, mocks, and environment for datasync-content-store-filesystem
---

# Testing

## Commands

- **`npm test`**: runs **`pretest`** (`npm run build-ts` and `rimraf _contents coverage`), then **`jest --coverage`**.
- **`npm run build-ts`**: clean + full TypeScript build (needed before tests if you skip `pretest`).
- **`npm run compile`**: `tsc` only.

## Framework

- **Jest** + **ts-jest** (`jest.config.js`), Node environment, verbose output.
- Test discovery: `**/test/**/*.ts` (see `testMatch`); **`test/mock/**`** is excluded from runs.

## Layout

- Tests: **`test/*.ts`** (e.g. `index.ts`, `publishing.ts`, `deletion.ts`, `validations.ts`, `unpublishing.ts`).
- Mocks and fixtures: **`test/mock/`** (`config.ts`, `assetStore.ts`, `data/**`).

## Credentials / env

- **No API keys or stack credentials** are required. All tests are local/unit.
- Optional debug: set **`DEBUG`** to include **`core-fs`** (see `src/fs.ts`).

## Mocks

- Import mock config and asset connector from **`test/mock/`** rather than hitting real services.

## Coverage

- Output under **`coverage/`** (json + html reporters). No `coverageThreshold` is set in the checked-in `jest.config.js` unless the team adds it later.
