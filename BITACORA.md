# Logbook of MagnetarEidolon

## Introduction
This document is a logbook that records decisions, state changes, discoveries, and key events in reverse chronological order (most recent first). It serves as an immutable audit trail for the project.

## Entry Format
- **Timestamp**: YYYY-MM-DD HH:MM Z
- **Author**: Name of the person or AI agent making the entry.
- **Entry**: A clear and concise description of the event.

## Entry Categories
- **State Change**: Task state transition.
- **Decision**: Key architectural or process decision.
- **Blocker**: Creation or resolution of a blocker.
- **Discovery**: Significant finding or new idea.
- **PR Merge**: Pull Request merged.
- **Exception**: Documented deviation from canonical rules.

## Log Entries

- **Timestamp:** 2026-03-11 16:18 UTC
  **Author:** Codex
  **Entry:** State Change: Switched the default LM Studio provider configuration to the OpenAI-compatible `/v1/chat/completions` path with `model: "local-model"`, matching the verified local LM Studio behavior where the server resolves the loaded model automatically.

- **Timestamp:** 2026-03-11 16:13 UTC
  **Author:** Codex
  **Entry:** State Change: Made `ChatController` inject `ChatGatewayService` explicitly with `@Inject(ChatGatewayService)` so the Nest dev runtime does not depend on decorator-metadata inference for controller wiring.

- **Timestamp:** 2026-03-11 16:11 UTC
  **Author:** Codex
  **Entry:** State Change: Removed the NestJS dependency-injection ambiguity in `ChatGatewayService` by taking the fetch override out of the provider constructor. The service now exposes an internal fetch hook for tests while remaining a clean Nest provider at runtime.

- **Timestamp:** 2026-03-11 16:08 UTC
  **Author:** Codex
  **Entry:** State Change: Switched the NestJS backend development command from `tsx watch src/main.ts` to `tsx src/main.ts` so root `npm run dev` starts a stable API process on port `3100` without relying on the watch-mode IPC path.

- **Timestamp:** 2026-03-11 16:00 UTC
  **Author:** Codex
  **Entry:** State Change: Began `task-chatfix-101` by making the NestJS backend authoritative for chat transport and normalizing upstream LM Studio/OpenAI-compatible SSE frames into a stable browser-facing delta stream. Added backend transport tests, updated chat-session tests to consume the backend contract, and kept root `npm run test` aligned with both backend and UI validation.

- **Timestamp:** 2026-03-11 15:35 UTC
  **Author:** Codex
  **Entry:** Decision: Introduced a dedicated NestJS backend-for-frontend in `apps/magnetar-api` so the Angular chat UI no longer needs to call LM Studio directly. The backend now owns the LM Studio request boundary and stream forwarding path, and root `npm run dev` was updated to boot backend plus UI together.

- **Timestamp:** 2026-03-11 15:40 UTC
  **Author:** Codex
  **Entry:** Decision: Added a dedicated chat-runtime stabilization planning module so the remaining work from partial integration to reliable end-to-end chat behavior is tracked explicitly in milestones, tasks, and acceptance steps.

- **Timestamp:** 2026-03-11 15:15 UTC
  **Author:** Codex
  **Entry:** State Change: Replaced the chat tab's fake LM Studio post-completion chunking with real SSE-based streaming in `ChatSessionService`. The Angular chat UI now updates assistant messages incrementally from LM Studio responses, and the automated test suite was expanded to cover stream success, partial updates, malformed events, missing bodies, fallback message-content frames, and stream-finalization edge cases at 100% coverage.

- **Timestamp:** 2026-03-11 12:42 UTC
  **Author:** Codex
  **Entry:** State Change: Began implementation of the in-app chat module in the Angular shell. Added a dedicated Chat tab, `ChatSessionService`, structured message parsing/rendering, deterministic streaming behavior, a canvas side panel baseline, and 100% test coverage for the new chat state/model layer.

- **Timestamp:** 2026-03-11 12:35 UTC
  **Author:** Codex
  **Entry:** Decision: Expanded the in-app chat planning module into a concrete delivery plan with a dedicated Chat tab, structured message rendering, streaming-validation requirements, and a future canvas/document side panel. Root roadmap, requirements, architecture, testing, and status docs were synchronized accordingly.

- **Timestamp:** 2026-03-11 11:18 UTC
  **Author:** Codex
  **Entry:** Decision: Documented an explicit OOP-first engineering rule in the root project standards. Runtime and domain logic should prefer classes/services, while standalone functions are reserved for pure stateless helpers and side effects must remain isolated at boundary layers.

- **Timestamp:** 2026-03-11 10:05 UTC
  **Author:** Codex
  **Entry:** State Change: Added the first provider-configuration UI slice on `feature/provider-config-ui`, including multi-provider state modeling, primary/backup/disabled roles, ordering tests, and a new standalone planning module for provider configuration and failover.

- **Timestamp:** 2026-03-11 09:50 UTC
  **Author:** Codex
  **Entry:** State Change: Began the LM Studio delivery slice by adding a concrete SDK provider adapter, local integration notes, and repeatable smoke tests. The provider path is now documented and test-backed, but not yet wired into the UI runtime.

- **Timestamp:** 2026-03-11 09:20 UTC
  **Author:** Codex
  **Entry:** Decision: Added two independent planning modules under `projects/`: `lm-studio-provider-module` for the first concrete AI-provider integration and `in-app-chat-module` for the first real embedded chat experience and provider-validation surface.

- **Timestamp:** 2026-03-11 09:05 UTC
  **Author:** Codex
  **Entry:** State Change: Removed product-facing canonical-model references from the active UI/CLI surface, documentation, and governance wording. Preserved only a root-level note that the canonical model was historically used as a documentation administration framework.

- **Timestamp:** 2026-03-11 08:45 UTC
  **Author:** Codex
  **Entry:** Decision: Split the documentation cleanup into two branches. `feature/docs-english-translation` is dedicated to translating the active repository documentation into English, while a follow-up branch will remove product-facing canonical-model references and leave only a root-level governance note about the historical documentation framework.

- **Timestamp:** 2026-03-11 08:27 UTC
  **Author:** Codex
  **Entry:** State Change: Fixed the Angular/Tailwind PostCSS startup pipeline for `apps/magnetar-ui`, added root-level workspace scripts in `package.json` (`setup`, `dev`, `cli:dev`, `build`, `typecheck`, `test`), and documented that the repository currently exposes a UI + CLI surface without a separate backend service.

- **Timestamp:** 2026-03-09 22:35 UTC
  **Author:** Gemini CLI
  **Entry:** State Change: Marked milestone `ms-ts-01` (TypeScript Core & SDK Migration) as completed in `PLAN.md` and `STATUS.md`. Unified project status documentation by aligning the "Current Direction" section with the completed core migration status. Verified all subtasks (task-ts-101 to task-ts-107) are done.

- **Timestamp:** 2026-03-09 22:25 UTC
  **Author:** Gemini CLI
  **Entry:** Decision: Upgraded core project dependencies in `apps/magnetar-ui` to latest major versions. Updated `vitest` (v4), `tailwindcss` (v4), `@faker-js/faker` (v10), and `@types/node` (v25). Verified build and dependency resolution via `npm install`.

- **Timestamp:** 2026-03-09 22:15 UTC
  **Author:** Gemini CLI
...
