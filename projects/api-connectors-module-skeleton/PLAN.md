# Canonical Plan of API Connectors Module Skeleton

## Introduction
This plan captures milestones, tasks, estimates, and status for API Connectors Module Skeleton. Its structure must be kept intact.

## Milestones Overview Table

| Milestone ID | Name | Target Date | Description | Completion Criteria |
| :--- | :--- | :--- | :--- | :--- |
| `ms-api-01` | API Connectors Skeleton Baseline | 2026-03-07 | Define a provider-agnostic API connector layer for remote and local models. | Milestone tasks transitioned to `done` with passing documentation and baseline tests. |


## Task Backlog Table

| Task ID | Milestone | Title | Owner | Effort (pts) | Weight (%) | State | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `task-api-101` | `ms-api-01` | Define HTTP client and auth abstraction | Integrations Team | 5 | 38 | in_review | Implemented `ApiHttpClient` with `AuthStrategy` support and normalized transport errors. |
| `task-api-102` | `ms-api-01` | Define local model API adapters (e.g., Ollama/OpenAI-compatible local servers) | Integrations Team | 3 | 23 | in_review | Added `OpenAICompatibleAdapter` and `OllamaAdapter` with canonical request/response conversion. |
| `task-api-103` | `ms-api-01` | Define unified response and error contract | Integrations Team | 3 | 23 | in_review | Added `GenerationRequest`, `GenerationResponse`, and `ConnectorError` contracts. |
| `task-api-104` | `ms-api-01` | Set up connector module test harness | Integrations Team | 2 | 15 | in_review | Added mocked connector tests in `tests/test_api_connectors.py`. |

## Effort Summary
- **Total effort:** 13 pts
- **Completed (`done`):** 0 pts
- **In review:** 13 pts
- **In progress:** 0 pts
- **Remaining to done:** 13 pts

## State Definitions
- **planned**: Task identified but not yet prioritized.
- **ready**: Prioritized and ready to start.
- **in_progress**: Work has started.
- **in_review**: Work completed and waiting review.
- **blocked**: Work halted by external dependency.
- **done**: Work finished and accepted.

## Change Management
Update this document whenever tasks change state or scope. Reflect the same changes in the project YAML and `BITACORA.md`.
