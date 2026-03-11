# Provider Configuration Module Plan

## Milestones

| Milestone ID | Name | Target Date | Description | Completion Criteria |
| :--- | :--- | :--- | :--- | :--- |
| `ms-provider-01` | Provider Configuration Baseline | 2026-05-06 | Introduce multi-provider configuration with primary and backup semantics. | UI state model, provider screen, tests, and runtime handoff plan are documented and implemented to baseline level. |

## Task Backlog

| Task ID | Milestone | Title | Owner | Effort (pts) | Weight (%) | State | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `task-provider-101` | `ms-provider-01` | Define provider configuration model | Core Team | 3 | 23 | in_review | Includes role, health, priority, and API-style metadata. |
| `task-provider-102` | `ms-provider-01` | Implement Angular provider configuration screen | Core Team | 4 | 31 | in_review | Added shell tab and card-based provider controls. |
| `task-provider-103` | `ms-provider-01` | Add ordering and failover state tests | Core Team | 3 | 23 | in_review | Covers sorting, primary promotion, and disablement behavior. |
| `task-provider-104` | `ms-provider-01` | Define runtime handoff for provider chain consumption | Core Team | 3 | 23 | planned | SDK/runtime still needs to consume configured provider order. |

## Effort Summary
- **Total effort:** 13 pts
- **Completed (`done`):** 0 pts
- **In review:** 10 pts
- **In progress:** 0 pts
- **Remaining to do:** 13 pts
