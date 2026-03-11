# Chat Runtime Stabilization Plan

## Milestones

| Milestone ID | Name | Target Date | Description | Completion Criteria |
| :--- | :--- | :--- | :--- | :--- |
| `ms-chatfix-01` | Transport and BFF Stabilization | 2026-03-18 | Make the chat path work reliably through the NestJS backend and LM Studio. | UI calls backend only, backend reaches LM Studio, streaming works, and failures are visible. |
| `ms-chatfix-02` | Diagnostics and Regression Coverage | 2026-03-22 | Add health endpoints, runtime diagnostics, and regression coverage for the stabilized chat path. | Service state is inspectable, regression cases are automated, and manual acceptance is repeatable. |

## Task Backlog

| Task ID | Milestone | Title | Owner | Effort (pts) | Weight (%) | State | Notes |
| :--- | :--- | :--- | :--- | ---: | ---: | :--- | :--- |
| `task-chatfix-101` | `ms-chatfix-01` | Stabilize browser -> backend -> LM Studio transport path | Core Team | 3 | 16 | planned | Remove remaining browser-direct assumptions and make backend routing authoritative. |
| `task-chatfix-102` | `ms-chatfix-01` | Prove the backend chat stream in isolation | Core Team | 2 | 10 | planned | Validate Nest endpoint behavior independently from Angular. |
| `task-chatfix-103` | `ms-chatfix-01` | Prove the UI -> backend chat path end to end | Core Team | 3 | 16 | planned | Verify send behavior, proxying, response streaming, and shell-level UX. |
| `task-chatfix-104` | `ms-chatfix-01` | Normalize the backend streaming contract for the UI | Core Team | 2 | 10 | planned | The UI should consume one stable backend event shape regardless of LM Studio event variations. |
| `task-chatfix-105` | `ms-chatfix-02` | Add runtime diagnostics and health endpoints | Core Team | 2 | 12 | planned | Distinguish backend down, LM Studio down, model errors, and broken streams. |
| `task-chatfix-106` | `ms-chatfix-02` | Make provider configuration backend-aware for chat transport | Core Team | 2 | 12 | planned | UI owns selection, backend owns transport execution details. |
| `task-chatfix-107` | `ms-chatfix-02` | Lock the root development workflow for backend + UI | Core Team | 2 | 10 | planned | `npm run setup` and `npm run dev` must be the reliable happy path. |
| `task-chatfix-108` | `ms-chatfix-02` | Add regression coverage and manual acceptance checklist | Core Team | 3 | 14 | planned | Cover send semantics, backend routing, streaming, failures, and manual acceptance. |

## Effort Summary
- **Total effort:** 19 pts
- **Completed (`done`):** 0 pts
- **In progress:** 0 pts
- **Remaining to done:** 19 pts

## Change Management
Changes in this module must be synchronized with root `PLAN.md`, `STATUS.md`, `TESTING.md`, and `README.md`.
