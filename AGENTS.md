# Contentstack DataSync Content Store (Filesystem) – Agent guide

*Universal entry point* for contributors and AI agents. Detailed conventions live in **skills/*/SKILL.md**.

## What this repo is

| Field | Detail |
|-------|--------|
| *Name:* | `@contentstack/datasync-content-store-filesystem` — [GitHub](https://github.com/contentstack/datasync-content-store-filesystem) |
| *Purpose:* | Node.js **DataSync content store** that persists synced stack content to the **local filesystem** for DataSync Manager (publish/unpublish/delete, file layout, optional branch-aware paths). Main exports: `start`, `setConfig`, `getConfig`, `setAssetConnector`, `getFilesystemClient`; implementation: `FilesystemStore` in `src/fs.ts`. |
| *Out of scope (if any):* | Not the Content **Delivery (CDA)** or **Management (CMA)** HTTP SDKs as this package’s primary API. **No** runtime HTTP client dependency; core behavior is filesystem I/O and validation, not live stack REST calls for normal store operations. |

Product docs: [Contentstack DataSync](https://www.contentstack.com/docs/guide/synchronization/contentstack-datasync).

## Tech stack (at a glance)

| Area | Details |
|------|---------|
| Language | TypeScript (`typescript` in `package.json`; `tsconfig.json` → CommonJS, `dist/`, declarations in `typings/`) |
| Build | `tsc` via `npm run build-ts` (runs `clean` then `tsc`) or `npm run compile` (`tsc` only) |
| Tests | Jest + ts-jest (`jest.config.js`), Node; tests under `test/**/*.ts`; `test/mock/*` ignored as test files |
| Lint / coverage | TSLint: `npm run tslint`, `tslint.json`, `src/**/*.ts`; Jest `collectCoverage`, output `coverage/` (json, html reporters) |
| Runtime | `debug`, `lodash`, `mkdirp`, `rimraf`, `write-file-atomic` |

## Commands (quick reference)

| Command type | Command |
|--------------|---------|
| Build | `npm run build-ts` (clean `dist`/`coverage` + compile) or `npm run compile` |
| Test | `npm test` (`pretest` runs `build-ts` and `rimraf _contents coverage`, then `jest --coverage`) |
| Lint | `npm run tslint` |

**CI:** workflows under [`.github/workflows/`](.github/workflows/) (e.g. `check-version-bump.yml`, `release.yml`, CodeQL, SCA, policy scans — see each file for triggers).

**Debug:** optional `DEBUG=*` or include `core-fs` (see `src/fs.ts`).

## Where the documentation lives: skills

| Skill | Path | What it covers |
|-------|------|----------------|
| Dev workflow | [skills/dev-workflow/SKILL.md](skills/dev-workflow/SKILL.md) | Branches, npm scripts, Husky (Talisman/Snyk), CI, version bumps |
| TypeScript | [skills/typescript/SKILL.md](skills/typescript/SKILL.md) | `tsconfig`, TSLint, `src/` / `typings/` layout, `core-fs` logging |
| DataSync content store | [skills/datasync-content-store-filesystem/SKILL.md](skills/datasync-content-store-filesystem/SKILL.md) | `FilesystemStore`, config, asset connector, branch/locale — not CDA/CMA as primary API |
| Testing | [skills/testing/SKILL.md](skills/testing/SKILL.md) | Jest, `pretest`, `test/mock`, coverage, env |
| Code review | [skills/code-review/SKILL.md](skills/code-review/SKILL.md) | PR checklist, terminology, semver, tests |

An index with “when to use” hints is in [skills/README.md](skills/README.md).

## Using Cursor (optional)

If you use *Cursor*, [`.cursor/rules/README.md`](.cursor/rules/README.md) only points to *AGENTS.md*—same docs as everyone else. This repo keeps no other files under `.cursor/rules/`.
