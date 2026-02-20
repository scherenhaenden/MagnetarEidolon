# Canonical Plan of MagnetarEidolon

This plan captures milestones, tasks, estimates, ownership, and status. Its structure must remain intact.

## Milestones Overview
| Milestone ID | Name | Target Date | Description | Completion Criteria |
| --- | --- | --- | --- | --- |
| `ms-01` | Canon Bootstrap | 2026-03-05 | Establish canonical governance and planning artifacts. | All required canonical docs created and reviewed. |
| `ms-02` | Magnetar Model Baseline | 2026-03-12 | Define MagnetarEidolon architecture and machine-readable project schema. | Architecture and project YAML align with requirements and rules. |
| `ms-03` | Operational Readiness | 2026-03-20 | Finalize testing, blocker flow, and contribution processes. | Governance processes validated and initial progress reporting active. |

## Task Backlog
| Task ID | Milestone | Title | Owner | Effort (pts) | Weight (%) | State | Notes |
| --- | --- | --- | --- | ---: | ---: | --- | --- |
| `task-101` | `ms-01` | Create canonical documentation baseline | Core Team | 5 | 23 | done | Initial canonical files created. |
| `task-102` | `ms-02` | Draft Magnetar architecture and stack mapping | Core Team | 4 | 18 | in_review | Validate against architecture and stack docs. |
| `task-103` | `ms-02` | Build project YAML schema template | Core Team | 3 | 14 | done | `_template.project.yml` completed. |
| `task-104` | `ms-03` | Define governance for branching and WIP | Core Team | 4 | 18 | ready | Pending team review kickoff. |
| `task-105` | `ms-03` | Establish testing and blocker controls | Core Team | 6 | 27 | in_progress | Drafting acceptance and escalation mechanics. |

## Effort Summary
- **Total effort:** 22 pts
- **Completed:** 8 pts
- **In progress:** 6 pts
- **Remaining:** 8 pts

## State Definitions
- **planned:** identified but not yet prioritized for execution.
- **ready:** prepared for execution with scope and owner clear.
- **in_progress:** currently being implemented.
- **blocked:** execution halted by an active impediment.
- **in_review:** implementation complete and awaiting validation.
- **done:** accepted and complete against criteria.

## Change Management
Update this file whenever tasks change state, scope, owner, or estimate. Reflect the same changes in the project YAML file and record them in `BITACORA.md`.
