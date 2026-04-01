# Agent guidance — `@contentstack/datasync-content-store-filesystem`

## What this package is

**Contentstack DataSync content store (filesystem)** — a Node.js library used with [Contentstack DataSync](https://www.contentstack.com/docs/guide/synchronization/contentstack-datasync) to persist synced stack content to the **local filesystem**. It is **not** the Content Delivery API (CDA) client, **not** the Content Management API (CMA) SDK, and **not** a general HTTP API wrapper. It implements the content-store role for DataSync Manager (publish/unpublish/delete flows, file layout, optional branch-aware paths).

## Repository

- **Homepage / docs**: [Contentstack DataSync guide](https://www.contentstack.com/docs/guide/synchronization/contentstack-datasync)
- **Git**: `https://github.com/contentstack/datasync-content-store-filesystem`

## Tech stack

| Area | Choice |
|------|--------|
| Language | TypeScript (see `package.json` / `typescript`) |
| Module output | CommonJS (`dist/`), declarations in `typings/` |
| Build | `tsc` → `dist/` (`npm run build-ts`, `compile`) |
| Lint | TSLint (`tslint.json`, script `tslint` on `src/**/*.ts`) |
| Tests | Jest + `ts-jest` (`jest.config.js`), Node environment |
| Runtime deps | `debug`, `lodash`, `mkdirp`, `rimraf`, `write-file-atomic` (no HTTP client) |

## Source layout and public API

| Role | Path |
|------|------|
| Implementation | `src/` (`index.ts`, `fs.ts`, `config.ts`, `util/`) |
| Published types | `typings/` (generated alongside build) |
| Example usage | `example/` |

Main exports from `src/index.ts`: `start`, `setConfig`, `getConfig`, `setAssetConnector`, `getFilesystemClient`. The store implementation is `FilesystemStore` in `src/fs.ts`.

## Commands

| Command | Purpose |
|---------|---------|
| `npm run build-ts` | Clean `dist`/`coverage`, compile TypeScript |
| `npm run compile` | `tsc` only |
| `npm test` | `pretest` runs `build-ts` and cleans `_contents`/`coverage`, then Jest with coverage |
| `npm run tslint` | TSLint on `src/**/*.ts` |

Tests are **unit-style** under `test/` with mocks in `test/mock/`; Jest ignores `test/mock/*`. There are **no** live Contentstack API or integration tests in this repo — nothing requires stack credentials to run `npm test`.

Optional **debug** logging: set `DEBUG` to `*` or include `core-fs` (see `src/fs.ts`).

## AI guidance index

- **Cursor rules**: [`.cursor/rules/README.md`](.cursor/rules/README.md)
- **Agent skills**: [`skills/README.md`](skills/README.md)
