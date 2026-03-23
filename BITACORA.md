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

- **Timestamp:** 2026-03-20 20:37 UTC
  **Author:** scherenhaenden
  **Entry:** PR Merge: Merged #241 (feat(governance): enforce required documentation baseline). The repository now has a parallelized validator for required docs, repo-relative test fixtures, and CI enforcement in the TypeScript workflow.

- **Timestamp:** 2026-03-20 20:15 UTC
  **Author:** scherenhaenden
  **Entry:** PR Merge: Merged #240 (feat(governance): add project schema validation pipeline). All `projects/*.project.yml` files are now validated against the required schema as part of the standard test path.

- **Timestamp:** 2026-03-20 19:27 UTC
  **Author:** Copilot
  **Entry:** State Change: Verified and closed `task-ui-117` (Remove duplicated preset rendering in ProvidersScreen). PR #211 had introduced the preset list in two places — the left-rail Quick Add accordion and a middle-column Preset Catalog. The subsequent `feature/provider-config-quick-add-editor-flow` slice removed the middle-column duplicate. The current `app.component.ts` contains a single `*ngFor let preset of presets()` loop inside the Quick Add accordion; no duplicate preset-item markup remains. Planning documents were updated to record this task as done.

- **Timestamp:** 2026-03-20 19:22 UTC
  **Author:** Codex
  **Entry:** Blocker: Resolved `blocker-002` / issue `#80` by adding a repository-level validator for the required documentation baseline defined in `RULES.md`, adding validator regression tests, wiring the validator into root `npm test`, and enforcing the same path in the `CI TypeScript` workflow. Verified closure evidence with successful runs of `npm run validate:required-docs`, `npm run test:required-docs`, root `npm test`, and root `npm run typecheck`.

- **Timestamp:** 2026-03-20 19:11 UTC
  **Author:** scherenhaenden
  **Entry:** PR Merge: Merged #235 (feature/provider-config-json-runtime). Completed the runtime provider handoff by resolving configured provider instances through a JSON-backed backend registry.

- **Timestamp:** 2026-03-20 19:04 UTC
  **Author:** scherenhaenden
  **Entry:** PR Merge: Merged #236 (feature/provider-config-json-inspector). Added a raw JSON inspector to the Providers UI for inspecting resolved configuration shapes.

- **Timestamp:** 2026-03-20 19:03 UTC
  **Author:** scherenhaenden
  **Entry:** PR Merge: Merged #233 (feature/provider-config-instance-management). Refined provider instance management with opaque IDs and separated the preset catalog from user-created config instances.

- **Timestamp:** 2026-03-20 18:22 UTC
  **Author:** Codex
  **Entry:** Blocker: Resolved `blocker-001` / issue `#79` by adding a repository-level validator for `projects/*.project.yml`, adding validator regression tests, wiring the validator into root `npm test`, and enforcing the same path in the `CI TypeScript` workflow. Verified closure evidence with successful runs of `npm run validate:project-schema`, `npm run test:project-schema`, root `npm test`, and root `npm run typecheck`.

- **Timestamp:** 2026-03-16 14:00 UTC
  **Author:** Codex
  **Entry:** State Change: Began a follow-up Providers UX slice on `feature/provider-config-json-inspector`. Added a configured-provider JSON inspector path so existing provider instances can expose their final resolved stored shape directly from the editor, and updated planning to track that UI inspection separately from the later JSON file-persistence task.

- **Timestamp:** 2026-03-16 08:20 UTC
  **Author:** Codex
  **Entry:** State Change: Refined the Providers configuration model so configured-provider entries use opaque instance ids, built-in preset-backed entries are resettable but not removable, and delete actions now apply only to user-created configuration instances. The Providers editor UX was adjusted so add actions appear in the creation flow while delete/reset actions remain scoped to existing configurations. Planning was also extended to cover JSON persistence for the preset catalog and configured-provider instances.

- **Timestamp:** 2026-03-13 16:05 UTC
  **Author:** Codex
  **Entry:** State Change: Verified that GitHub issues `#173`, `#174`, and `#190` are implemented in the current `master` branch. The Angular chat surface now exposes a conversation rail with new/rename/delete administration, chat sessions persist and restore through local storage with recency ordering, and the Providers editor now shows request templates, placeholders, API-surface endpoint definitions, and example JSON payloads. `PLAN.md` was updated to reference these delivered issue outcomes explicitly.

- **Timestamp:** 2026-03-11 17:05 UTC
  **Author:** Codex
  **Entry:** State Change: Manually validated the end-to-end LM Studio chat path through the Angular UI and NestJS backend. The working default route now uses the OpenAI-compatible LM Studio endpoint with `local-model`, and copyable code blocks were confirmed in the live UI.

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
