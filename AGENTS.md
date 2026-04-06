# Agent guidance — `@contentstack/datasync-content-store-filesystem`

## Single source of truth

Use this file and **`skills/`** as the **canonical** place for project context, workflows, and review standards. That way every contributor gets the same guidance in **any IDE or agent** (Cursor, Copilot, CLI tools, etc.).

| Layer | Role |
|-------|------|
| **`AGENTS.md`** (this file) | Entry point: package identity, repo links, tech stack, commands, **skills index** |
| **`skills/<topic>/SKILL.md`** | Full detail: workflow, TypeScript, DataSync store behavior, testing, code review |
| **`.cursor/rules/README.md`** | **Cursor only** — single pointer file; canonical text stays in **`AGENTS.md`** and **`skills/`** |

**Flow:** **[`.cursor/rules/README.md`](.cursor/rules/README.md)** → **`AGENTS.md`** → **`skills/<name>/SKILL.md`**

---

## What this package is

**Contentstack DataSync content store (filesystem)** — a Node.js library used with [Contentstack DataSync](https://www.contentstack.com/docs/guide/synchronization/contentstack-datasync) to persist synced stack content to the **local filesystem** for use with DataSync Manager. It writes and updates files under your configured base directory; it does **not** perform normal “read from stack” behavior via Content Delivery (CDA) or Management (CMA) HTTP APIs.

### Out of scope (unless comparing or documenting integration)

- **CDA** / **CMA** REST SDKs as the primary API for this package’s core behavior
- General-purpose HTTP clients for stack reads/writes (this library has **no** runtime HTTP dependency)

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

## Contributor workflow notes

- Preferred flow is feature branch → PR to **`development`**, then **`development`** → **`master`** for release (align with team if different).
- Local hooks may run **Talisman** and **Snyk** from `.husky/pre-commit`; ensure both are available when using Husky (`SKIP_HOOK=1` only per team policy).
- For release-affecting changes, bump **`package.json`** version per team policy. **`.github/workflows/check-version-bump.yml`** may use path filters that do not list `src/` — verify with maintainers if version checks behave unexpectedly.

---

## Skills index

Detailed guidance lives in **`skills/`**. Start with [`skills/README.md`](skills/README.md).

| Topic | Skill |
|--------|--------|
| Branches, scripts, hooks, CI, version bumps | [`skills/dev-workflow/SKILL.md`](skills/dev-workflow/SKILL.md) |
| TypeScript / `tsconfig` / TSLint / `src/` layout | [`skills/typescript/SKILL.md`](skills/typescript/SKILL.md) |
| DataSync content store: config, `FilesystemStore`, validations | [`skills/datasync-content-store-filesystem/SKILL.md`](skills/datasync-content-store-filesystem/SKILL.md) |
| Jest, mocks, coverage | [`skills/testing/SKILL.md`](skills/testing/SKILL.md) |
| PR / code review checklist | [`skills/code-review/SKILL.md`](skills/code-review/SKILL.md) |

---

## Using Cursor (optional)

If you use **Cursor**, read **[`.cursor/rules/README.md`](.cursor/rules/README.md)** first — it points here and to **`skills/*/SKILL.md`**. This repo keeps **no other files** under `.cursor/rules/` (only this README). Edit policy in **`AGENTS.md`** / **`skills/`**.
