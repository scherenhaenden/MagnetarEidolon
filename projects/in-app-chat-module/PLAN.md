# In-App Chat Module Plan

## Milestones

| Milestone ID | Name | Target Date | Description | Completion Criteria |
| :--- | :--- | :--- | :--- | :--- |
| `ms-chat-01` | In-App Chat Baseline | 2026-05-02 | Introduce a real embedded chat surface in the Angular product shell. | Chat UI, conversation state, provider visibility, and test scenarios are documented and implemented to baseline level. |

## Task Backlog

| Task ID | Milestone | Title | Owner | Effort (pts) | Weight (%) | State | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `task-chat-101` | `ms-chat-01` | Define chat workflow and UX acceptance criteria | Core Team | 3 | 23 | ready | Cover prompt entry, response rendering, loading, errors, and provider-state visibility. |
| `task-chat-102` | `ms-chat-01` | Implement Angular chat module and shell integration | Core Team | 5 | 39 | planned | Must be a real module, not a one-off placeholder screen. |
| `task-chat-103` | `ms-chat-01` | Add provider-validation and regression test scenarios | Core Team | 3 | 23 | planned | Use chat as the primary interactive validation surface. |
| `task-chat-104` | `ms-chat-01` | Document manual QA flow for chat + LM Studio | Core Team | 2 | 15 | planned | Include expected startup, provider state, and failure cases. |

## Effort Summary
- **Total effort:** 13 pts
- **Completed (`done`):** 0 pts
- **In review:** 0 pts
- **In progress:** 0 pts
- **Remaining to done:** 13 pts

## Change Management
If this module changes the product roadmap or test strategy, the root `PLAN.md`, `STATUS.md`, and `TESTING.md` must be updated in the same change set.
