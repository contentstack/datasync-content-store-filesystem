---
description: Branches, lint/tests, PR expectations, and version bumps for this repo
alwaysApply: false
---

# Development workflow

## Branches

- Use **feature branches** for new work; open pull requests against **`development`** to integrate changes.
- For a **release**, open a pull request from **`development`** into **`master`**. Releases to npm are driven from **`master`**.


## Lint and tests

- **Tests**: `npm test` (runs `pretest`: `build-ts` and cleans `_contents` / `coverage`, then Jest with coverage).
- **Compile only**: `npm run compile` or `npm run build-ts` (full clean + `tsc`).
- **TSLint**: `npm run tslint` on `src/**/*.ts`.

## Pre-commit (local)

If Husky hooks are installed, `.husky/pre-commit` expects **Talisman** and **Snyk** on the PATH. Set `SKIP_HOOK=1` only when intentionally bypassing (e.g. local emergency), per team policy.

## Pull requests

- Keep changes focused; match existing TypeScript and TSLint conventions.
- CI includes SCA/policy/CodeQL workflows under `.github/workflows/` — ensure new dependencies are justified.
- **Version bumps**: Releases are versioned via `package.json`. When your change is release-affecting, bump the version as required by your release process. The workflow `.github/workflows/check-version-bump.yml` may use path filters from a shared template — confirm it matches this repo’s `src/` layout if version checks seem wrong.

## Releases

Package name: `@contentstack/datasync-content-store-filesystem`. Publishing and tagging follow org/npm practices; coordinate with maintainers for changelog and semver.
