# Agent guidance — `@contentstack/datasync-content-store-filesystem`

## Single source of truth

Use this file and **`skills/`** as the **canonical** place for project context, workflows, and review standards. That way every contributor gets the same guidance in **any IDE or agent** (Cursor, Copilot, CLI tools, etc.).

| Layer | Role |
|-------|------|
| **`AGENTS.md`** (this file) | Entry point: what the package is, repo links, tech stack, commands, and **index of skills** |
| **`skills/<topic>/SKILL.md`** | Full detail: DataSync domain, testing, and code review (plus contributor workflow notes) |
| **`.cursor/rules/`** | **Cursor only** — short rules with `description` / `globs` / `alwaysApply` that **point here** and into **`skills/`**; they do not replace this document |

**Flow:** Cursor rules → **`AGENTS.md`** → **`skills/*.md`**

---

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

## Contributor workflow notes

- Preferred flow is feature branch -> `development` PR, then `development` -> `master` for release.
- Local hooks may run Talisman and Snyk from `.husky/pre-commit`; ensure both are available when using Husky.
- For release-affecting changes, bump `package.json` version per team release policy.

---

## Skills index

Detailed guidance lives in **`skills/`**. Start with [`skills/README.md`](skills/README.md).

| Topic | Skill |
|--------|--------|
| DataSync store API, config, terminology | [`skills/typescript-datasync-content-store/SKILL.md`](skills/typescript-datasync-content-store/SKILL.md) |
| Jest, mocks, coverage | [`skills/testing/SKILL.md`](skills/testing/SKILL.md) |
| PR / code review checklist | [`skills/code-review/SKILL.md`](skills/code-review/SKILL.md) |

---

## Cursor rules 

If you use **Cursor**, scoped rules under [`.cursor/rules/`](.cursor/rules/README.md) attach context by file pattern. They **reference this file and the skills above** — edit policy in **`AGENTS.md`** / **`skills/`**, not only in `.cursor/rules/`.
