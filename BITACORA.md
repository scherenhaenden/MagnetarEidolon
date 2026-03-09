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

- **Timestamp:** 2026-03-09 21:30 UTC
  **Author:** Gemini CLI
  **Entry:** Decision: Hardened CI pipelines for deterministic builds. Switched all TypeScript/Node CI workflows (`ci-linux`, `ci-macos`, `ci-windows`, `ci-typescript-ui`) from `npm install` to `npm ci`. Verified that `package-lock.json` is present in `apps/magnetar-ui` and `packages/magnetar-sdk`.

- **Timestamp:** 2026-03-09 21:15 UTC
  **Author:** Gemini CLI
  **Entry:** State Change: Merged `origin/master` into `codex/create-new-branch-and-typescript-pipelines`. Resolved conflicts in `package.json` and `tsconfig.cli.json` resulting from the workspace rehoming to `apps/magnetar-ui`. Verified that CLI build and runtime scripts are preserved in the new structure.

- **Timestamp:** 2026-03-09 20:40 UTC
  **Author:** Codex
  **Entry:** State Change: Iniciada la rama `feature/init-runnable-web-ui` para convertir la UI existente en `apps/magnetar-ui` en un workspace Angular realmente ejecutable. Se añadieron scripts y configuración de arranque web/CLI alrededor de la UI ya existente, sin crear una segunda UI, y se vinculó el trabajo al issue `#129`.

- **Timestamp:** 2026-03-09 20:20 UTC
  **Author:** Codex
  **Entry:** Decision: Documentado un plan detallado para convertir `apps/magnetar-ui` en una superficie realmente arrancable para web y CLI. Se añadió `docs/UI_RUNTIME_BOOTSTRAP_PLAN.md` y se registraron en la documentación raíz las ubicaciones canónicas del GitHub Issue Tracker y del project board `MagnetarEidolon`.

- **Timestamp:** 2026-03-09 20:05 UTC
...
