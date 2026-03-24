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

Older entries were archived to GitHub Discussion [#288](https://github.com/scherenhaenden/MagnetarEidolon/discussions/288) after verification that the archived content was preserved there. The root file now keeps only the newest 20 entries.

- **Timestamp:** 2026-03-23 07:00 UTC
  **Author:** Copilot
  **Entry:** State Change: Completed `task-voice-101` (Re-scope voice UI foundations for the TypeScript workspace). Created the `projects/voice-ui-module/` planning module with all required documentation files: README, ARCHITECTURE, REQUIREMENTS, TESTING, PLAN, STATUS, and BITACORA. Defined module boundaries between the Angular `VoiceCaptureModule`, `packages/magnetar-sdk` interfaces (`VoiceCapturePort`, `TranscriptionPort`), and the `apps/magnetar-api` backend boundary. Documented browser/runtime constraints (secure context, permission model, `SpeechRecognition` support matrix, sandbox restrictions, local-first fallback). Documented four voice-specific risks with mitigations. Confirmed that no Python, Gradio, or Poetry assumptions remain in the voice roadmap. Transitioned `task-voice-101` to `in_review`; `task-voice-102` is now unblocked. Updated `projects/magnetar-voice-ui.project.yml`, root `PLAN.md`, `STATUS.md`, and this logbook.

- **Timestamp:** 2026-03-20 20:37 UTC
  **Author:** scherenhaenden
  **Entry:** PR Merge: Merged #241 (feat(governance): enforce required documentation baseline). The repository now has a parallelized validator for required docs, repo-relative test fixtures, and CI enforcement in the TypeScript workflow.

- **Timestamp:** 2026-03-20 20:15 UTC
  **Author:** scherenhaenden
  **Entry:** PR Merge: Merged #240 (feat(governance): add project schema validation pipeline). All `projects/*.project.yml` files are now validated against the required schema as part of the standard test path.

- **Timestamp:** 2026-03-20 20:00 UTC
  **Author:** Jules
  **Entry:** Discovery: Initialized the planning module for Observability and Replay. Decided on an Event-Sourced State Logging approach for the Proof of Concept (PoC) to fulfill the cognitive observability requirements. Created `ARCHITECTURE.md`, `REQUIREMENTS.md`, `PLAN.md`, `STATUS.md`, `TESTING.md`, and the project YAML file in `projects/observability-replay-module/`.

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
