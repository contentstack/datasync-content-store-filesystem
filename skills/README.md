# Skills – `@contentstack/datasync-content-store-filesystem`

Source of truth for detailed guidance. Read [`AGENTS.md`](../AGENTS.md) first, then open the skill that matches your task.

## When to use which skill

| Skill folder | Use when |
|--------------|----------|
| [`dev-workflow/`](dev-workflow/SKILL.md) | Branching, CI, build/test/lint, Husky, PRs, version bumps |
| [`typescript/`](typescript/SKILL.md) | `tsconfig`, TSLint, `src/` layout, typings, logging |
| [`datasync-content-store-filesystem/`](datasync-content-store-filesystem/SKILL.md) | Store API, `FilesystemStore`, config, DataSync vs CDA/CMA |
| [`testing/`](testing/SKILL.md) | Jest layout, mocks, coverage, credentials policy |
| [`code-review/`](code-review/SKILL.md) | PR checklist, Blocker/Major/Minor, terminology |

Each folder contains `SKILL.md` with YAML frontmatter (`name`, `description`).

There is no separate **framework** skill: this package has no standalone HTTP client layer.
