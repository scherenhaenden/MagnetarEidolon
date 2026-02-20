# Canonical Plan of Cross-Platform UI Skeleton

## Introduction
This plan captures milestones, tasks, estimates, and status for Cross-Platform UI Skeleton. Its structure must be kept intact.

## Milestones Overview Table

| Milestone ID | Name | Target Date | Description | Completion Criteria |
| :--- | :--- | :--- | :--- | :--- |
| `ms-ui-01` | UI Skeleton Baseline | 2026-03-01 | Define the cross-platform UI module structure and interfaces. | Milestone tasks transitioned to `done` with passing documentation and baseline tests. |


## Task Backlog Table

| Task ID | Milestone | Title | Owner | Effort (pts) | Weight (%) | State | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `task-ui-101` | `ms-ui-01` | Define shared UI shell for Linux/macOS/Windows | UI Team | 5 | 38 | in_review | Added `UIShell` with default routes and startup contract. |
| `task-ui-102` | `ms-ui-01` | Define platform-specific adapter interfaces | UI Team | 3 | 23 | in_review | Added platform detection and adapter contracts for Linux/macOS/Windows. |
| `task-ui-103` | `ms-ui-01` | Define navigation and state container skeleton | UI Team | 3 | 23 | in_review | Added navigation state/back-stack and UI state container. |
| `task-ui-104` | `ms-ui-01` | Create baseline UI testing scaffolding | UI Team | 2 | 15 | in_review | Added platform + shell bootstrap smoke tests and navigation tests. |

## Effort Summary
- **Total effort:** 13 pts
- **Completed:** 0 pts
- **In progress:** 0 pts
- **In review:** 13 pts
- **Remaining:** 0 pts

## State Definitions
- **planned**: Task identified but not yet prioritized.
- **ready**: Prioritized and ready to start.
- **in_progress**: Work has started.
- **in_review**: Work completed and waiting review.
- **blocked**: Work halted by external dependency.
- **done**: Work finished and accepted.

## Change Management
Update this document whenever tasks change state or scope. Reflect the same changes in the project YAML and `BITACORA.md`.
