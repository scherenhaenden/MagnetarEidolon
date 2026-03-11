# Chat Runtime Stabilization Logbook

## Log Entries

- **Timestamp:** 2026-03-11 16:13 UTC
  **Author:** Codex
  **Entry:** State Change: Made controller-side injection explicit with `@Inject(ChatGatewayService)` so the dev runtime no longer depends on inferred constructor metadata for chat transport wiring.

- **Timestamp:** 2026-03-11 16:11 UTC
  **Author:** Codex
  **Entry:** State Change: Removed the Nest provider-constructor ambiguity in `ChatGatewayService` so the backend controller now resolves a real service instance at runtime while tests still override fetch behavior through a subclass hook.

- **Timestamp:** 2026-03-11 16:08 UTC
  **Author:** Codex
  **Entry:** State Change: Simplified backend startup from `tsx watch` to plain `tsx` so the stabilization branch can bring up a reliable API process on `3100` during root development runs.

- **Timestamp:** 2026-03-11 16:00 UTC
  **Author:** Codex
  **Entry:** State Change: Started `task-chatfix-101`. The browser chat route now goes only through the NestJS backend, and the backend emits a normalized SSE delta contract instead of forwarding raw provider event shapes directly to the UI.

- **Timestamp:** 2026-03-11 15:40 UTC
  **Author:** Codex
  **Entry:** Decision: Created a dedicated stabilization module to track the work required to make the chat runtime actually reliable through the new NestJS backend and LM Studio path.
