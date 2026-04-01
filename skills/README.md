# Agent skills — `@contentstack/datasync-content-store-filesystem`

Short index for project-local **`skills/`** (each topic is a folder with **`SKILL.md`**). Use these when the task matches the description; combine with [`.cursor/rules/`](../.cursor/rules/README.md) and [`AGENTS.md`](../AGENTS.md).

| Skill | When to use |
|-------|-------------|
| [`code-review/`](code-review/SKILL.md) | PR or diff review: compatibility, tests, terminology (DataSync vs CDA/CMA), security |
| [`testing/`](testing/SKILL.md) | Running Jest, mocks, `pretest`, coverage, no-credentials test runs |
| [`typescript-datasync-content-store/`](typescript-datasync-content-store/SKILL.md) | Mental model of this library: entrypoints, `FilesystemStore`, config, branch/locale paths |

There is no separate **framework** skill: this package has no standalone HTTP client or retry layer beyond filesystem I/O and DataSync integration.
