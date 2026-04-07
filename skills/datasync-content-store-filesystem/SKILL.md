---
name: datasync-content-store-filesystem
description: DataSync filesystem content store — FilesystemStore, config, asset connector, branch/locale; not CDA/CMA HTTP SDKs
---

# DataSync content store (filesystem) — `@contentstack/datasync-content-store-filesystem`

## When to use

- Implementing or changing publish/unpublish/delete or file layout in **`src/fs.ts`**
- Adjusting defaults, patterns, or locale/branch handling (`src/config.ts`, `src/util/`)
- Adding exports or validation (`src/index.ts`, `src/util/validations.ts`)

## Instructions

### Product model

- This package is the **DataSync content store** that **persists** synced content types, entries, and asset references to the **filesystem** for **DataSync Manager**. It is **not** the Contentstack **CDA** or **CMA** HTTP SDK; core behavior is **local file I/O** and validation, not stack REST calls for normal writes.

### Entry flow

1. **`start(connector, config?)`** in **`src/index.ts`** merges config with internal defaults and constructs **`FilesystemStore`**.
2. Use **`setAssetConnector`**, **`setConfig`**, **`getConfig`**, **`getFilesystemClient`** as documented in **`src/index.ts`**.
3. **`FilesystemStore`** exposes **`publish`**, **`unpublish`**, **`delete`**, and related methods expected by DataSync Manager.

### Configuration

- **`contentStore.baseDir`**: root for stored files (default **`./_contents`** in **`src/config.ts`**).
- **`patterns`** vs **`patternsWithBranch`**: when **`config.contentstack.branch`** is set, branch-aware path patterns apply (see **`src/fs.ts`** constructor).
- **`unwanted`**: strips keys from persisted JSON per asset, content type, or entry.
- **`preserveAssetInReferencedEntries`**: optional flag in internal defaults (`src/config.ts`).
- User config merges with internal config via **`lodash`** **`merge`** in **`start`**.

### Where to change code

| Concern | Location |
|---------|----------|
| Bootstrap, exports | **`src/index.ts`** |
| Defaults, patterns | **`src/config.ts`** |
| Store behavior | **`src/fs.ts`** — **`FilesystemStore`** |
| Validation | **`src/util/validations.ts`** |
| Helpers | **`src/util/index.ts`**, **`get-file-fields.ts`**, **`fs.ts`**, **`messages.ts`** |

### Async and errors

- Store methods return **Promises**. **`debug`** (`core-fs`) logs key steps when enabled.
- Invalid inputs throw from **`src/util/validations.ts`** — preserve clear messages and backward-compatible behavior for the same inputs.

### Scope

- **`src/`** is the SDK core; **`example/`** is illustrative only.

## References

- [Contentstack DataSync](https://www.contentstack.com/docs/guide/synchronization/contentstack-datasync)
- [`../typescript/SKILL.md`](../typescript/SKILL.md)
- [`../testing/SKILL.md`](../testing/SKILL.md)
- [`../../AGENTS.md`](../../AGENTS.md)
