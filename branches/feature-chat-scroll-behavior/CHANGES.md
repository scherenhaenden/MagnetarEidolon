# Branch Changes — feature/chat-scroll-behavior

## 2026-03-12
- Added a root `dev.sh` launcher so the backend and UI can be started from one command, bootstrap missing workspace dependencies, and shut down together on `Ctrl+C`.
- Replaced the root inline `npm run dev` shell orchestration with the dedicated launcher script for clearer startup behavior.
- Constrained the chat viewport so the conversation stream scrolls inside the panel instead of expanding the page indefinitely.
- Manually validated that root startup now works from `/home/edward/Development/MagnetarEidolon` and that the chat viewport no longer stretches the page during long conversations.
