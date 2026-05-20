---
name: typescript
description: TypeScript, tsconfig, TSLint, and src/typings conventions for datasync-content-store-filesystem
---

# TypeScript — `@contentstack/datasync-content-store-filesystem`

## When to use

- Editing or adding files under `src/` or generated `typings/`
- Aligning with compiler and TSLint settings

## Instructions

### Tooling

- **Compiler:** `tsconfig.json` — CommonJS modules, ES6 target, declarations to **`typings/`**, strict unused locals/parameters, `noImplicitReturns`, `include`: `src/**/*`.
- **Lint:** `npm run tslint` — config in **`tslint.json`** (e.g. single quotes, no semicolons, 2-space indent, max line length 120, `I`-prefixed interfaces, `no-default-export`).
- **No ESLint** in this repo’s `package.json` — use TSLint only unless the team migrates.

### Layout

- Source: **`src/`** only; do not hand-edit emitted **`typings/*.d.ts`** — change `src/` and rebuild.
- Prefer **named exports** from **`src/index.ts`**; avoid default exports (TSLint).

### Logging

- Debug namespace **`core-fs`** via **`debug`** in **`src/fs.ts`**. Enable with `DEBUG=*` or include `core-fs` in `DEBUG`.

### Dependencies

- Use only dependencies declared in **`package.json`**; new deps need maintainer/SCA alignment.

## References

- [`../datasync-content-store-filesystem/SKILL.md`](../datasync-content-store-filesystem/SKILL.md)
- [`../../AGENTS.md`](../../AGENTS.md)
