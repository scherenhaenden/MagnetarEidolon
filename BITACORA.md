# Logbook of MagnetarEidolon

## Introduction
This document is a logbook that records decisions, state changes, discoveries, and key events in reverse chronological order (most recent first). It serves as an immutable audit trail for the project.

## Entry Format
- **Timestamp**: YYYY-MM-DD HH:MM Z
- **Author**: Name of the person or AI agent making the entry.
- **Entry**: A clear and concise description of the event.

## Entry Categories
- **State Change**: Task state transition.
- **Decision**: Key architectural or process decision.
- **Blocker**: Creation or resolution of a blocker.
- **Discovery**: Significant finding or new idea.
- **PR Merge**: Pull Request merged.
- **Exception**: Documented deviation from canonical rules.

## Log Entries

- **Timestamp:** 2026-03-09 21:45 UTC
  **Author:** Gemini CLI
  **Entry:** Decision: Fixed CI build failure ("tsc: command not found"). Hardened `packages/magnetar-sdk/package.json` by using `npx tsc` in build scripts and updated all Node CI workflows to use `npm ci --include=dev` to ensure `typescript` is available during the `prepare` lifecycle hook.

- **Timestamp:** 2026-03-09 21:30 UTC
  **Author:** Gemini CLI
  **Entry:** Decision: Hardened CI pipelines for deterministic builds. Switched all TypeScript/Node CI workflows (`ci-linux`, `ci-macos`, `ci-windows`, `ci-typescript-ui`) from `npm install` to `npm ci`. Verified that `package-lock.json` is present in `apps/magnetar-ui` and `packages/magnetar-sdk`.

- **Timestamp:** 2026-03-09 21:15 UTC
  **Author:** Gemini CLI
  **Entry:** State Change: Merged `origin/master` into `codex/create-new-branch-and-typescript-pipelines`. Resolved conflicts in `package.json` and `tsconfig.cli.json` resulting from the workspace rehoming to `apps/magnetar-ui`. Verified that CLI build and runtime scripts are preserved in the new structure.

- **Timestamp:** 2026-03-09 20:40 UTC
...
