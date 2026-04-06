# Skills — `@contentstack/datasync-content-store-filesystem`

**This directory is the source of truth** for detailed conventions (workflow, TypeScript, DataSync store behavior, tests, code review). The repo root **[`AGENTS.md`](../AGENTS.md)** is the universal index and quick reference; each skill is a folder with **`SKILL.md`** (YAML frontmatter: `name`, `description`).

## When to use which skill

| Skill folder | Use when |
|--------------|----------|
| [`dev-workflow/`](dev-workflow/SKILL.md) | Branching, `npm` scripts, Husky, CI workflows, version bumps |
| [`typescript/`](typescript/SKILL.md) | `tsconfig`, TSLint, `src/` / `typings/` layout, logging |
| [`datasync-content-store-filesystem/`](datasync-content-store-filesystem/SKILL.md) | `FilesystemStore`, config merge, asset connector, branch/locale paths — **not** CDA/CMA as primary API |
| [`testing/`](testing/SKILL.md) | Jest, `pretest`, `test/mock`, coverage |
| [`code-review/`](code-review/SKILL.md) | PR review: API, compatibility, terminology, tests |

There is no separate **framework** skill: this package has no standalone HTTP client layer.

## How to use these docs

- **Humans / any AI tool:** Start at **`AGENTS.md`**, then open the relevant **`skills/<name>/SKILL.md`**.
- **Cursor users:** **[`.cursor/rules/README.md`](../.cursor/rules/README.md)** points to **`AGENTS.md`** and these skills. The **`.cursor/rules/`** folder contains **only** that README (no separate rule files).
