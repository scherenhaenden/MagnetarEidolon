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

- **Timestamp:** 2026-03-09 21:55 UTC
  **Author:** Gemini CLI
  **Entry:** Decision: Enforced 100% test coverage in Vitest configuration for `apps/magnetar-ui`. Updated `vitest.config.ts` with mandatory thresholds for lines, branches, functions, and statements. Marked `task-ts-qa-101` as done.

- **Timestamp:** 2026-03-09 21:45 UTC
  **Author:** Gemini CLI
  **Entry:** Decision: Fixed CI build failure ("tsc: command not found"). Hardened `packages/magnetar-sdk/package.json` by using `npx tsc` in build scripts and updated all Node CI workflows to use `npm ci --include=dev` to ensure `typescript` is available during the `prepare` lifecycle hook.

- **Timestamp:** 2026-03-09 21:30 UTC
  **Author:** Gemini CLI
...
