---
name: typescript-datasync-content-store
description: TypeScript mental model for the DataSync filesystem content store — where to change config, store logic, and validations
---

# TypeScript — DataSync filesystem content store

## What this package is

**`@contentstack/datasync-content-store-filesystem`** is a **DataSync content store** that persists synced stack data to the **filesystem** for use with **DataSync Manager** and related modules. It does **not** call the **CDA** or **CMA** HTTP APIs directly; it consumes structures produced by the sync pipeline and writes files under **`contentStore.baseDir`**.

## Where to change things

| Concern | Location |
|---------|----------|
| Bootstrap, exports | **`src/index.ts`** — `start`, `setConfig`, `getConfig`, `setAssetConnector`, `getFilesystemClient` |
| Default paths and keys | **`src/config.ts`** — `patterns`, `patternsWithBranch`, `unwanted`, `preserveAssetInReferencedEntries` |
| Publish/unpublish/delete, file I/O | **`src/fs.ts`** — class **`FilesystemStore`** |
| Input validation | **`src/util/validations.ts`** |
| Path/helpers | **`src/util/index.ts`**, **`src/util/get-file-fields.ts`**, **`src/util/fs.ts`**, **`src/util/messages.ts`** |
| Public types (generated) | **`typings/`** after build |

## Configuration mental model

- User config is merged with internal defaults (`lodash` **`merge`** in `start`).
- **Branch-aware** layouts use **`patternsWithBranch`** when **`config.contentstack.branch`** is present (`src/fs.ts`).
- **`unwanted`** removes keys from stored JSON per content type, entry, or asset.

## Async patterns

- Store methods return **Promises**; **`debug`** (`core-fs`) logs key steps when enabled.

## Docs

- Product overview: [Contentstack DataSync](https://www.contentstack.com/docs/guide/synchronization/contentstack-datasync). Repo **`README.md`** describes usage with asset store and sync manager.
