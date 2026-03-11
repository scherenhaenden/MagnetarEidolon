# Changes for feature/chat-stabilization-plan-and-issues

## Summary
- Added a dedicated chat-runtime stabilization planning module.
- Integrated the new stabilization tasks into the root plan/status/testing docs.
- Prepared one-issue-per-task tracking for the work required to make the chat path reliable end to end.
- Began `task-chatfix-101` by making the backend-authoritative chat route emit a normalized SSE delta contract for the UI.
- Added backend transport tests and expanded chat-session coverage so root validation now covers both backend and UI chat transport behavior.
- Simplified backend development startup to `tsx src/main.ts` so the API process stays reachable on `3100` during root `npm run dev`.
- Switched the default LM Studio provider to the verified OpenAI-compatible `/v1` route with `local-model`.
