---
name: dev-workflow
description: Branches, npm scripts, Husky hooks, CI, and version bumps for datasync-content-store-filesystem
---

# Dev workflow — `@contentstack/datasync-content-store-filesystem`

## When to use

- Setting up locally or onboarding
- Before opening or updating a PR
- Planning a release or changing `package.json` version

## Instructions

### Branches

- Use **feature branches** for new work; open pull requests against **`development`** to integrate changes.
- For a **release**, open a pull request from **`development`** into **`master`**. Releases to npm are driven from **`master`** (confirm with your team if policy differs).

### Install and build

```bash
npm install
npm run build-ts
```

`npm run build-ts` runs `clean` (rimraf `dist`, `coverage`) and `tsc` (`package.json`).

### Quality gates

```bash
npm run tslint   # TSLint on src/**/*.ts
npm test         # pretest: build-ts + rimraf _contents + coverage, then Jest with coverage
```

### Hooks (`.husky/`)

- **`.husky/pre-commit`** runs **Talisman** and **Snyk** when those tools are installed; use **`SKIP_HOOK=1`** only when your team allows bypassing checks.

### Pull requests and version bumps

- Keep changes focused; match existing TypeScript and TSLint conventions.
- CI includes workflows under **`.github/workflows/`** (e.g. CodeQL, SCA, policy scans, **`check-version-bump.yml`**, **`release.yml`**). New dependencies should be justified for SCA and consumers.
- **Release-affecting** changes: bump **`package.json`** version per team policy. If **`check-version-bump.yml`** path filters omit `src/`, version checks may not run for library-only edits — **maintainers: align workflow paths with this repo.**

### Docs

- There is no `build-doc` script in **`package.json`** for this repo; API docs are JSDoc on sources and published **`typings/`** after build.

## References

- [`../testing/SKILL.md`](../testing/SKILL.md)
- [`../../AGENTS.md`](../../AGENTS.md)
