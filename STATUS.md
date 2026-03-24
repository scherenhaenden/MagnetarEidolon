# Current Status — MagnetarEidolon

## Summary
**Estimated overall progress:** 74%
`[███████████████░░░░░] 74%`

## Progress Tables

Update rule:
- `Done % = done_points / total_points`
- `In Progress % = in_progress_points / total_points`
- `Remaining % = remaining_points / total_points`

### Overall

| Scope | Done % | In Progress % | Remaining % | Notes |
| :--- | ---: | ---: | ---: | :--- |
| Project overall | 73.9% | 10.9% | 15.2% | Based on `122 done / 18 in progress / 25 remaining` out of `165 pts` |

### By Feature

| Feature | Done % | In Progress % | Remaining % | Notes |
| :--- | ---: | ---: | ---: | :--- |
| Documentation and governance | 95% | 5% | 0% | Very mature |
| TypeScript core and SDK | 90% | 5% | 5% | Core exists and works |
| TypeScript QA baseline | 70% | 10% | 20% | Strong UI-side coverage, broader runtime QA pending |
| Web and CLI startup | 92% | 5% | 3% | Root startup path now includes env loading plus the Nest backend and Angular UI with one-command shutdown |
| LM Studio provider | 65% | 20% | 15% | Matches the LM Studio module status: adapter, docs, and smoke coverage exist, with broader runtime integration still pending |
| Provider configuration and failover | 68% | 17% | 15% | UI state exists, the backend registry foundation is active, and OpenRouter is now testable through the backend; persistence and broader failover consumption still remain |
| In-app chat | 55% | 25% | 20% | Matches the chat module status: baseline chat exists with LM Studio runtime wiring, but richer rendering and broader provider flow still remain |
| Chat runtime stabilization | 68% | 12% | 20% | Backend-routed chat transport now resolves providers through the backend registry, works against LM Studio, and exposes an OpenRouter test path; diagnostics and workflow hardening still remain |
| Memory inspector | 45% | 10% | 45% | Basic surface exists, real workflow not done |
| Trust / Policy Center | 35% | 10% | 55% | Mostly planned |
| Observability / Replay | 20% | 15% | 65% | PoC planning active and tracer implementation underway. |
| UX / Experience Foundation | 65% | 15% | 20% | Shell is real, not fully integrated |
| Distribution / packaged operations | 60% | 10% | 30% | Usable, not polished |
| Voice UI | 40% | 0% | 60% | Re-scope complete. Module boundaries, SDK interfaces, browser constraints, and testing strategy are documented. Implementation has not started yet. |

### Chat Breakdown

| Chat feature | Done % | In Progress % | Remaining % | Notes |
| :--- | ---: | ---: | ---: | :--- |
| Chat tab IA / UX definition | 85% | 15% | 0% | Well documented |
| Chat tab shell and layout | 75% | 15% | 10% | Implemented baseline |
| Conversation state model | 80% | 15% | 5% | `ChatSessionService` exists |
| Structured rendering baseline | 70% | 20% | 10% | Headings, paragraphs, lists, quotes, and code blocks work |
| Copy actions | 75% | 10% | 15% | Message and code copy exist |
| Canvas side panel baseline | 45% | 20% | 35% | Extraction exists, no real editor yet |
| LM Studio calls from chat | 75% | 15% | 10% | Real SSE streaming path is wired for LM Studio |
| Real provider streaming | 72% | 13% | 15% | LM Studio streaming is real and OpenRouter now has a backend-routed test path; broader orchestration and diagnostics still remain |
| Backend/BFF chat transport | 62% | 13% | 25% | NestJS BFF now owns provider resolution for chat transport; diagnostics, acceptance, and richer provider templates still remain |
| Rich markdown / AST rendering | 20% | 10% | 70% | Planned, not fully implemented |
| Chat validation plan and tests | 65% | 20% | 15% | Deterministic tests done, runtime QA pending |

### Traffic Light

| Feature | Status | Rule |
| :--- | :--- | :--- |
| Documentation and governance | Green | 80%+ |
| TypeScript core and SDK | Green | 80%+ |
| Web and CLI startup | Green | 80%+ |
| Provider configuration and failover | Yellow | 40%-79% |
| LM Studio provider | Yellow | 40%-79% |
| In-app chat | Yellow | 40%-79% |
| Chat runtime stabilization | Yellow | 40%-79% |
| UX / Experience Foundation | Yellow | 40%-79% |
| Memory inspector | Yellow | 40%-79% |
| Trust / Policy Center | Red | under 40% |
| Observability / Replay | Red | under 40% |

## Current Direction
The repository is in a controlled TypeScript-first transition state. The core migration to TypeScript has been completed and the shared SDK is operational. The legacy Python implementation remains in the repository only as historical reference and limited cross-check context, not as the active product direction. The strategic focus is now the consolidation of the UI in `apps/magnetar-ui`, the NestJS backend boundary in `apps/magnetar-api`, and the final extraction of the shared runtime into `packages/magnetar-sdk`.

## Immediate Focus
- Consolidate the rehomed TypeScript UI in `apps/magnetar-ui`.
- Turn `apps/magnetar-ui` into a genuinely runnable web and CLI surface, not only something that builds and tests.
- Activate and stabilize a dedicated TypeScript validation pipeline as the primary validation path for the active product architecture.
- Execute the shared runtime extraction into `packages/magnetar-sdk` and lock down its initial contract.
- Continue the first real provider integration path through LM Studio.
- Define an embedded chat surface so provider testing happens inside the product UI.
- Define the chat tab, structured rendering baseline, and future canvas/document side panel.
- Add a provider configuration layer so multiple providers can be assigned to primary and backup roles.
- Validate the first backend-owned cloud-provider path through OpenRouter without moving secrets into the browser.

## Milestones

| Milestone ID | Name | Status | Target Date |
| :--- | :--- | :--- | :--- |
| `ms-01` | Canon Bootstrap | Completed | 2026-03-05 |
| `ms-02` | Magnetar Model Baseline | Completed | 2026-03-12 |
| `ms-ts-01` | TypeScript Core & SDK Migration | Completed | 2026-03-20 |
| `ms-11` | Experience Foundation | In Progress | 2026-04-10 |
| `ms-16` | UI Workspace Rehome & TS Delivery Pipeline | In Progress | 2026-04-15 |
| `ms-14` | Console CLI Operations | Ready | 2026-04-17 |
| `ms-15` | SDK Contract Base | Ready | 2026-04-22 |
| `ms-17` | LM Studio Provider Integration | Ready | 2026-04-29 |
| `ms-18` | In-App Chat Surface | Ready | 2026-05-02 |
| `ms-19` | Provider Configuration & Failover | In Progress | 2026-05-06 |
| `ms-voice-01` | Voice Interaction Re-scope | In Progress | 2026-03-31 |
| `ms-04` | Project Initialization & Governance | Completed | 2026-05-15 |
| `ms-05` | Core Architecture Implementation | Completed | 2026-06-01 |
| `ms-06` | Tool System & OS Integration | Completed | 2026-06-15 |
| `ms-07` | Memory & Knowledge Systems | Completed | 2026-07-01 |
| `ms-08` | Interface & Distribution | Completed | 2026-07-15 |

## Status by Area

| Area | Status | Note |
| :--- | :--- | :--- |
| Product vision | aligned | Principles and roadmap are defined. |
| UX MVP | in_progress | Onboarding and core screens are in detailed definition. |
| TS migration | done | Core ported, initial SDK implemented, adapters under validation. |
| UI workspace rehome | in_review | Workspace moved to `apps/magnetar-ui`; post-move consolidation still pending. |
| Runtime startup UX | in_progress | Real web workspace initialization is active in `feature/init-runnable-web-ui`; the web build is already part of local validation. |
| TS test pipeline | in_review | Dedicated workflow exists and has been validated locally with tests and typecheck. |
| Trust/Policy model | ready | Approval rules are ready for implementation. |
| **Console CLI** | **ready** | Included as a formal deliverable with cross-platform validation goals. |
| **SDK contract** | **in_progress** | Physical extraction of the shared runtime is underway in `packages/magnetar-sdk`. |
| **LM Studio provider** | **in_progress** | SDK adapter, integration notes, smoke tests, and chat-consumed streaming are now in place; broader orchestration and runtime settings still remain. |
| **In-app chat** | **in_progress** | Chat tab, state service, real LM Studio streaming, and a NestJS BFF path now exist; richer rendering and production validation still remain. |
| **Chat runtime stabilization** | **in_progress** | The browser chat path now works through the NestJS backend with provider-id handoff and backend-owned provider resolution; LM Studio is working and OpenRouter is now testable, while diagnostics and workflow hardening still remain. |
| **Provider configuration** | **in_progress** | UI state model, first configuration screen, and a backend-owned provider registry foundation now exist; runtime persistence, richer failover behavior, and template-driven provider onboarding still remain. |
| **Observability / Replay** | **in_progress** | The observability planning module was created and the Execution Tracer PoC implementation is underway. |
| **Voice UI** | **in_review** | Re-scope complete; `projects/voice-ui-module/` documents module boundaries, SDK interfaces, browser/runtime constraints, risks, and testing strategy; implementation (`task-voice-102`) is planned. |

## Risks and Mitigations

1. **Risk**: Drift between Markdown docs and the project's structured state.
   Mitigation: Mandatory synchronization in every PR and logging in `BITACORA.md`.
2. **Risk**: Parity gaps between UI and CLI.
   Mitigation: Shared SDK contract and cross-platform validation.
3. **Risk**: OS differences in paths and shell behavior inside the Tool System.
   Mitigation: Standard path abstractions and cross-platform checks.
4. **Risk**: Local LLM performance with Ollama.
   Mitigation: Provider-agnostic design that allows switching to stronger models when needed.
5. **Risk**: API consistency between Node.js and Browser environments for the shared SDK.
   Mitigation: Strict interfaces and environment-specific adapters.
6. **Risk** (`risk-voice-001`): Browser microphone permissions, local-runtime constraints, and provider compatibility may complicate the first voice implementation.
   Mitigation: Design for browser-safe capture first; keep adapters isolated behind `VoiceCapturePort` and `TranscriptionPort`; use mocked or file-based audio for staged validation.
7. **Risk** (`risk-voice-002`): `SpeechRecognition` API is absent in Firefox as of early 2026, requiring a feature-detection guard and a backend-routed fallback path.
   Mitigation: `BrowserSpeechTranscriptionAdapter.isSupported()` guard is defined from the start; backend adapter interface is in the SDK contract.

## Reporting Cadence
Update at least once per day and immediately after each merged PR.
