# Changes for feature/chat-module-planning-and-issues

## Summary
- Expanded the in-app chat module into a concrete planning track with a dedicated Chat tab, structured message rendering, streaming behavior, and a future canvas/document side panel.
- Updated root roadmap, requirements, architecture, status, and testing documents so the chat module is aligned with the product plan.
- Implemented the first Angular chat baseline with a persistent chat tab, `ChatSessionService`, structured block parsing/rendering, copy actions, canvas extraction, and LM Studio-backed request flow for the local provider path.
- Prepared the module for one-issue-per-task tracking in GitHub.

## Affected Tasks
- `task-chat-101`: Define chat tab IA and UX acceptance criteria.
- `task-chat-102`: Implement Angular chat tab shell and layout regions.
- `task-chat-103`: Implement conversation state and provider session model.
- `task-chat-104`: Implement structured chat block rendering baseline.
- `task-chat-105`: Define canvas/document side panel mode.
- `task-chat-106`: Add streaming and provider-validation test plan.

## State Transitions
- `task-chat-101`: Moved into `in_review` through detailed module planning.
- `task-chat-102`: Moved into `in_progress` with the Angular chat tab shell now active in the product UI.
- `task-chat-103`: Moved into `in_progress` with `ChatSessionService` and provider-aware conversation state now implemented.
- `task-chat-104`: Moved into `in_progress` with structured block rendering, copy actions, and canvas extraction now implemented.
- `task-chat-106`: Moved into `in_progress` with deterministic parser and chat-session tests now enforcing 100% coverage for the new chat state layer.

## Log Entry (BITACORA.md candidate)
- **2026-03-11 12:35**: Expanded the in-app chat module planning and aligned root project docs in branch `feature/chat-module-planning-and-issues`.
- **2026-03-11 12:42**: Began implementation of the chat baseline in the Angular shell, including LM Studio-backed requests for the local provider path and full automated coverage for the new chat model/service layer.
- **2026-03-11 14:05**: Added reusable progress tables to `STATUS.md` and clarified legacy voice-planning records so the historical Python track is preserved while the active target is TypeScript/Angular.
