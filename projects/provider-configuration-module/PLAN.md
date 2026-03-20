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
| `task-provider-108` | `ms-provider-01` | Add provider configuration UI for backend-owned OpenRouter settings | Core Team | 3 | 18 | planned | Explain OpenRouter setup from the product surface and distinguish backend-owned secrets from UI-owned routing data. |
| `task-provider-109` | `ms-provider-01` | Show provider model templates and placeholders in the Providers UI | Core Team | 3 | 18 | planned | Surface request-template and placeholder behavior without forcing users to read backend code. |
| `task-provider-110` | `ms-provider-01` | Add CRUD and preset onboarding to the Providers UI | Core Team | 4 | 24 | in_progress | Introduce preset-based provider creation, editable provider runtime fields, local persistence, and removal flows in the Providers screen. Current focus: opaque instance ids for configured entries plus reset/delete semantics that preserve the quick-add preset catalog. |
| `task-provider-111` | `ms-provider-01` | Persist provider presets and configuration instances as JSON artifacts | Core Team | 4 | 24 | planned | Define the JSON shape for preset catalog data, configured-provider instances, and resettable runtime values so the UI can stop treating local signal state as the only source of truth. |

## Effort Summary
- **Total effort:** 23 pts
- **Completed (`done`):** 0 pts
- **In review:** 10 pts
- **In progress:** 4 pts
- **Remaining to do:** 13 pts
