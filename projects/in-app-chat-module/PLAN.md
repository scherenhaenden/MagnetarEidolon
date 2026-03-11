# In-App Chat Module Plan

## Milestones

| Milestone ID | Name | Target Date | Description | Completion Criteria |
| :--- | :--- | :--- | :--- | :--- |
| `ms-chat-01` | In-App Chat Baseline | 2026-05-02 | Introduce a real embedded chat surface in the Angular product shell. | Chat tab, conversation state, provider visibility, structured block rendering, and test scenarios are documented and implemented to baseline level. |
| `ms-chat-02` | Canvas and Rich Rendering Follow-Up | 2026-05-16 | Extend the chat surface into a richer document-style interface. | Canvas side panel, action widgets, and richer rendering mechanics are specified and scheduled for implementation. |

## Task Backlog

| Task ID | Milestone | Title | Owner | Effort (pts) | Weight (%) | State | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `task-chat-101` | `ms-chat-01` | Define chat tab IA and UX acceptance criteria | Core Team | 2 | 15 | in_review | Cover chat tab placement, message actions, provider visibility, and conversation workflow. |
| `task-chat-102` | `ms-chat-01` | Implement Angular chat tab shell and layout regions | Core Team | 3 | 23 | in_progress | Chat tab, conversation rail, stream column, and canvas side panel baseline now exist in the Angular shell. |
| `task-chat-103` | `ms-chat-01` | Implement conversation state and provider session model | Core Team | 3 | 23 | in_progress | `ChatSessionService` now tracks prompt, response, streaming state, provider identity, and canvas state. |
| `task-chat-104` | `ms-chat-01` | Implement structured block rendering baseline | Core Team | 2 | 15 | in_progress | Headings, paragraphs, lists, quotes, code blocks, copy actions, and canvas extraction are now modeled and rendered. |
| `task-chat-105` | `ms-chat-02` | Define canvas/document side panel mode | Core Team | 1 | 8 | planned | Document how non-linear document editing diverges from the main conversation stream. |
| `task-chat-106` | `ms-chat-02` | Add streaming, rendering, and provider-validation test plan | Core Team | 2 | 16 | in_progress | Deterministic parser and chat-session tests now exist; provider-connected UI validation still remains. |

## Effort Summary
- **Total effort:** 13 pts
- **Completed (`done`):** 0 pts
- **In review:** 2 pts
- **In progress:** 10 pts
- **Remaining to done:** 13 pts

## Change Management
If this module changes the product roadmap or test strategy, the root `PLAN.md`, `STATUS.md`, and `TESTING.md` must be updated in the same change set.
