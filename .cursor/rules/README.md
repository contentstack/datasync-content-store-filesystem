# Cursor rules for this repository

Rules live in this directory. They give the AI persistent context for edits, reviews, and tests.

## How to use

- In Cursor chat, reference a rule with **`@`** and the rule file name (e.g. `@typescript`, `@code-review`) so the model loads that rule explicitly.
- Rules with **`alwaysApply: true`** are intended to apply broadly; scoped rules apply when matching files are in context (per Cursor behavior).

## Rule index

| File | `alwaysApply` | Globs / scope | When it applies |
|------|---------------|---------------|-----------------|
| [`dev-workflow.md`](dev-workflow.md) | No (set in frontmatter) | Repo-wide workflow | Branching, scripts, PR/version expectations, hooks |
| [`typescript.mdc`](typescript.mdc) | No | `src/**/*.ts`, `typings/**/*.ts` | TypeScript style, layout, logging (`debug`), TSLint alignment |
| [`contentstack-datasync-content-store.mdc`](contentstack-datasync-content-store.mdc) | No | `src/**/*.ts` (DataSync store only) | DataSync content store patterns: config, `FilesystemStore`, asset connector, branch/locale paths — not CDA/CMA SDKs |
| [`testing.mdc`](testing.mdc) | No | `test/**/*.ts`, `jest.config.js` | Jest layout, mocks, pretest build |
| [`code-review.mdc`](code-review.mdc) | Yes | — | PR/review checklist for this package |

## Maintenance

When adding or renaming rules, update this table and the links in [`AGENTS.md`](../../AGENTS.md) / [`skills/README.md`](../../skills/README.md) if the index paths change.
