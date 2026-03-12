# Chat Runtime Stabilization Plan

## Milestones

| Milestone ID | Name | Target Date | Description | Completion Criteria |
| :--- | :--- | :--- | :--- | :--- |
| `ms-chatfix-01` | Transport and BFF Stabilization | 2026-03-18 | Make the chat path work reliably through the NestJS backend and LM Studio. | UI calls backend only, backend reaches LM Studio, streaming works, and failures are visible. |
| `ms-chatfix-02` | Diagnostics and Regression Coverage | 2026-03-22 | Add health endpoints, runtime diagnostics, and regression coverage for the stabilized chat path. | Service state is inspectable, regression cases are automated, and manual acceptance is repeatable. |

## Task Backlog

| Task ID | Milestone | Title | Owner | Effort (pts) | Weight (%) | State | Notes |
| :--- | :--- | :--- | :--- | ---: | ---: | :--- | :--- |
| `task-chatfix-101` | `ms-chatfix-01` | Stabilize browser -> backend -> LM Studio transport path | Core Team | 3 | 16 | done | The browser now uses the NestJS backend as the authoritative transport path, and the default LM Studio route is the verified OpenAI-compatible `/v1` path. |
| `task-chatfix-102` | `ms-chatfix-01` | Prove the backend chat stream in isolation | Core Team | 2 | 10 | done | Backend transport tests validate SSE normalization and provider error mapping independently from Angular. |
| `task-chatfix-103` | `ms-chatfix-01` | Prove the UI -> backend chat path end to end | Core Team | 3 | 16 | done | Chat was manually validated through `UI -> backend -> LM Studio` and now returns live responses successfully. |
| `task-chatfix-104` | `ms-chatfix-01` | Normalize the backend streaming contract for the UI | Core Team | 2 | 10 | done | The browser now consumes a normalized backend SSE delta contract instead of raw provider event shapes. |
| `task-chatfix-105` | `ms-chatfix-02` | Add runtime diagnostics and health endpoints | Core Team | 2 | 12 | planned | Distinguish backend down, LM Studio down, model errors, and broken streams. |
| `task-chatfix-106` | `ms-chatfix-02` | Make provider configuration backend-aware for chat transport | Core Team | 2 | 12 | planned | UI owns selection, backend owns transport execution details. |
| `task-chatfix-107` | `ms-chatfix-02` | Lock the root development workflow for backend + UI | Core Team | 2 | 10 | in_progress | Root `npm run setup` and `npm run dev` now bring up the backend plus UI together; final diagnostics and hardening still remain. |
| `task-chatfix-108` | `ms-chatfix-02` | Add regression coverage and manual acceptance checklist | Core Team | 3 | 14 | planned | Cover send semantics, backend routing, streaming, failures, and manual acceptance. |

## Effort Summary
- **Total effort:** 19 pts
- **Completed (`done`):** 10 pts
- **In progress:** 2 pts
- **Remaining to done:** 7 pts

## Change Management
Changes in this module must be synchronized with root `PLAN.md`, `STATUS.md`, `TESTING.md`, and `README.md`.
