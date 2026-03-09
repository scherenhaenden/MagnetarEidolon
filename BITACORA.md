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

- **Timestamp:** 2026-03-09 16:45 UTC
  **Author:** Codex
  **Entry:** Decision: Reconciled branch changelogs with canonical root documentation. Added missing records for the TypeScript migration documentation and testing-strategy updates, and clarified in root docs that Python remains active while the TypeScript proof of concept is evaluated as the likely successor architecture.

- **Timestamp:** 2026-03-09 16:40 UTC
  **Author:** Gemini CLI
  **Entry:** Decision: Formalized the TypeScript-first migration track in canonical planning and status artifacts. Added milestone `ms-ts-01`, tasks `task-ts-101` through `task-ts-107`, and related status/risk updates to document the shift toward a shared CLI/Web TypeScript architecture while implementation remains in progress.

- **Timestamp:** 2026-03-09 16:35 UTC
  **Author:** Gemini CLI
  **Entry:** Decision: Defined a comprehensive TypeScript testing strategy in canonical documentation. Added milestone `ms-ts-qa-01`, tasks `task-ts-qa-101` through `task-ts-qa-106`, and acceptance criteria covering unit, integration, and end-to-end validation for the shared SDK.

- **Timestamp:** 2026-03-09 16:30 UTC
  **Author:** Gemini CLI
  **Entry:** State Change: Ported core Agent Loop, State Models, and Service Interfaces from Python to TypeScript (Angular Skeleton). This enables the 'Think-Act-Observe' cycle to run within the TypeScript/Web environment. Work tracked in branches/feature-port-core-logic-to-typescript/.

- **Timestamp:** 2026-03-09 15:50 UTC
  **Author:** Gemini CLI
  **Entry:** State Change: Implemented UI type safety and naming consistency across the TypeScript skeleton. Created union types for statuses, verified 'Infrastructure Auto-Scaler' naming, and centralized interface usage in app.component.ts. Work tracked in branches/feature-ui-consistency-and-centralized-types/.

- **Timestamp:** 2026-03-09 15:30 UTC
  **Author:** Gemini CLI
  **Entry:** Security: Fixed High-severity vulnerability in 'gradio' (Absolute Path Traversal) by upgrading to version 6.9.0 in magnetar_voice_ui. Updated pyproject.toml and requirements.txt. Work tracked in branches/fix-security-gradio-path-traversal/.

- **Timestamp:** 2026-02-20 15:34 UTC
  **Author:** Codex
  **Entry:** Decision: Split the monolithic CI workflow into three OS-specific workflows (`ci-linux.yml`, `ci-macos.yml`, `ci-windows.yml`) while preserving the Python version matrix and artifact-on-failure behavior.

- **Timestamp:** 2026-02-20 12:05 UTC
  **Author:** Codex
  **Entry:** Decision: Implemented cross-OS CI/CD automation with GitHub Actions, including Linux/macOS/Windows test matrix, release matrix artifacts, enforced detailed release notes validation, and release runbook/template documentation.

- **Timestamp:** 2026-02-20 11:20 UTC
  **Author:** Codex
  **Entry:** State Change: `task-101` moved from `in_progress` to `done` after creating canonical Magnetar project documentation baseline.

- **Timestamp:** 2026-02-20 11:10 UTC
  **Author:** Codex
  **Entry:** Decision: Adopted Magnetar canonical file set and initialized governance documents (`RULES.md`, `BRANCHING_MODEL.md`, `WIP_GUIDELINES.md`, `CONTRIBUTING.md`).

- **Timestamp:** 2026-02-20 11:00 UTC
  **Author:** Codex
  **Entry:** Discovery: Repository only contained `README.md`; canonical structure had to be bootstrapped from scratch.

- **Timestamp:** 2026-02-20 10:55 UTC
  **Author:** Codex
  **Entry:** Exception: No prior project YAML existed; initialized `projects/_template.project.yml` as canonical seed.

### 2026-02-20 08:43 UTC
- **Author**: Codex (AI Agent)
- **Entry**: **Discovery/Decision**: Performed a repository-wide consistency review and corrected schedule/documentation mismatches. Updated `projects/_template.project.yml` so `start_date` now precedes milestone `ms-01`, and synchronized the YAML task list with `PLAN.md` (including `task-103`, `task-202`, `task-301`, `task-302`, `task-401`, `task-402`, and `task-501`). Also normalized `task-302` title casing in `PLAN.md`.

### 2024-05-22 14:00 UTC
- **Author**: Jules (AI Agent)
- **Entry**: **State Change**: Completed full implementation of Magnetar Core (Tasks task-201 to task-501). Implemented MagnetarModel, Agent Core, Tools (File/Shell), Memory (Chroma), LLM (LiteLLM), and CLI. All tests passing.

### 2024-05-22 10:30 UTC
- **Author**: Jules (AI Agent)
- **Entry**: **Project Creation**: Created sub-project `magnetar-voice-ui` defined in `projects/magnetar-voice-ui.project.yml`. Added `ms-voice-01` milestone and `task-voice-101`, `task-voice-102` to `PLAN.md`. Started `task-voice-101`.


### 2024-05-22 10:00 UTC
- **Author**: Jules (AI Agent)
- **Entry**: **Project Initialization**: Initialized the `MagnetarEidolon` repository following the Magnetar Canonical Project Model. Created `RULES.md`, `PLAN.md`, and `BITACORA.md`. Task `task-101` set to `in_progress`.

### 2024-05-22 09:55 UTC
- **Author**: Jules (AI Agent)
- **Entry**: **Decision**: Adopted the Magnetar Canonical Project Model for documentation and governance. This standard ensures consistency and AI-readiness.

### 2024-05-22 09:50 UTC
- **Author**: Jules (AI Agent)
- **Entry**: **Discovery**: Identified the need for a strict separation between Agent Core (stateless logic) and MagnetarModel (cognition state) to enable cross-platform portability.

## Immutability
Do not alter historical entries. Corrections must be appended as new entries that clarify prior records.
