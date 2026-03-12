# Branch Changes — feature/chat-session-rail

## 2026-03-12
- Started the first real chat-session rail implementation for the in-app chat, based on the user behavior observed in `Chateroo`: distinct conversations, automatic persistence, active-session switching, and most-recent-first ordering in the left rail.
- Kept the implementation behavior-inspired rather than code-copied: MagnetarEidolon now moves toward a session model where the current chat is separate from the session list and each session owns its own message history.
- Refactored the new session-persistence slice toward explicit OOP boundaries instead of piling up helper functions:
  - `ChatSessionStore` now owns local persistence concerns.
  - `ChatSessionCollection` now owns session ordering and session message-update policy.
- The goal of this branch is phase 1 only: save chats, show them in the side rail, allow switching between them, and preserve them across reloads before adding rename/delete/editing flows.
- Extended phase 1 to include direct session administration in the rail:
  - rename an existing chat
  - delete a non-last chat
  - restore the previously active chat on reload through persisted active-session state
- Recorded the next pending follow-up for this branch family: the `Providers` surface still needs an explicit OpenRouter key/config entry path and a way to display provider request/model templates with placeholders.
