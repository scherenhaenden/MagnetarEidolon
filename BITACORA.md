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

- **Timestamp:** 2026-03-09 22:25 UTC
  **Author:** Gemini CLI
  **Entry:** Decision: Upgraded core project dependencies in `apps/magnetar-ui` to latest major versions. Updated `vitest` (v4), `tailwindcss` (v4), `@faker-js/faker` (v10), and `@types/node` (v25). Verified build and dependency resolution via `npm install`.

- **Timestamp:** 2026-03-09 22:15 UTC
  **Author:** Gemini CLI
  **Entry:** Decision: Stabilized CI pipelines by switching from `npm ci` to `npm install`. This resolves persistent lockfile mismatch errors (`EUSAGE`) encountered during local and remote execution. Verified pipeline health via `act`.

- **Timestamp:** 2026-03-09 22:05 UTC
...
