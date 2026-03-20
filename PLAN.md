# MagnetarEidolon Operational Plan

## Strategic Basis
This plan implements the direction defined in `NEW_PLAN.md`: simplicity, human control, and end-to-end observability.

## Roadmap by Phase

| Phase | Goal | Status |
| :--- | :--- | :--- |
| Phase 1 | Immediate individual value (simple setup, visible runs, core recipes). | in_progress |
| Phase 2 | Power for advanced users (multi-agent, manageable memory, finer-grained policies). | planned |
| Phase 3 | Team collaboration (workspaces, roles, approval queues). | planned |
| Phase 4 | Ecosystem and safe expansion (recipe exchange + external integrations with strict controls). | planned |

## Milestone Summary

| Milestone ID | Name | Target Date | Status | Description |
| :--- | :--- | :--- | :--- | :--- |
| `ms-01` | Canon Bootstrap | 2026-03-05 | done | Establish governance and planning artifacts. |
| `ms-02` | Magnetar Model Baseline | 2026-03-12 | done | Define architecture and project schema. |
| `ms-ts-01` | TypeScript Core & SDK Migration | 2026-03-20 | done | Migrate the reasoning engine to TypeScript. |
| `ms-ts-qa-01` | TypeScript Testing & QA | 2026-03-30 | planned | Testing pyramid and 100% coverage in the core. |
| `ms-11` | Experience Foundation | 2026-04-10 | in_progress | Base UI/UX and tool catalog. |
| `ms-16` | UI Workspace Rehome & TS Delivery Pipeline | 2026-04-15 | in_progress | Rehome the TypeScript UI under a product structure and activate its delivery pipeline. |
| `ms-12` | Trust & Policy Center | 2026-04-24 | ready | Policy and approval control center. |
| `ms-13` | Observability & Replay | 2026-05-08 | planned | Execution tracing and replay. |
| `ms-14` | Console CLI Operations | 2026-04-17 | ready | Unified command-line interface. |
| `ms-15` | SDK Contract Base | 2026-04-22 | ready | Shared contract between UI and CLI. |
| `ms-17` | LM Studio Provider Integration | 2026-04-29 | ready | First concrete local AI provider integration through LM Studio. |
| `ms-18` | In-App Chat Surface | 2026-05-02 | ready | Embedded chat UI for provider testing, debugging, and user-facing conversation flows. |
| `ms-19` | Provider Configuration & Failover | 2026-05-06 | in_progress | Configure multiple AI providers, assign primary and backup roles, and prepare failover behavior. |
| `ms-04` | Project Initialization | 2026-05-15 | done | Initial structure and governance files. |
| `ms-05` | Core Implementation | 2026-06-01 | done | Historical base implementation; legacy Python code retired from the primary path. |
| `ms-06` | Tool System | 2026-06-15 | done | Tool abstraction and OS tools. |
| `ms-07` | Memory & Knowledge | 2026-07-01 | done | LiteLLM and ChromaDB integration. |
| `ms-08` | Distribution | 2026-07-15 | done | Packaging and initial CLI distribution. |

## Prioritized Backlog

| Task ID | Milestone | Title | Owner | Status | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `task-101` | `ms-01` | Create the canonical documentation baseline | Core Team | done | Initial canonical files created. |
| `task-102` | `ms-02` | Draft Magnetar architecture | Core Team | in_review | Validate against architecture docs. |
| `task-103` | `ms-02` | YAML schema template | Core Team | done | `_template.project.yml` completed. |
| `task-ts-101` | `ms-ts-01` | Port MagnetarModel state to TypeScript | Gemini | done | Defined in `core/models.ts`. |
| `task-ts-102` | `ms-ts-01` | Port the reasoning loop to TypeScript | Gemini | done | Defined in `core/agent.ts`. |
| `task-ts-103` | `ms-ts-01` | Implement SDK interfaces | Gemini | done | Defined in `core/interfaces.ts`. |
| `task-ts-104` | `ms-ts-01` | Create Node.js adapters (CLI) | Gemini | done | `core/tools/node-filesystem.ts` created. |
| `task-ts-105` | `ms-ts-01` | Create browser adapters (Web) | Gemini | done | `core/tools/web-filesystem.ts` created. |
| `task-ts-106` | `ms-ts-01` | Integrate SDK into Angular shell | Gemini | done | Integrated in `app.component.ts`. |
| `task-ts-107` | `ms-ts-01` | Implement LLM provider service | Gemini | done | Interface and agent usage implemented. |
| `task-ts-qa-101` | `ms-ts-qa-01` | Configure Vitest (100% coverage) | Gemini | done | Mandatory threshold enabled in `vitest.config.ts`. |
| `task-ts-qa-102` | `ms-ts-qa-01` | Implement Bogus/Faker generator | Gemini | planned | For realistic test data. |
| `task-ts-qa-103` | `ms-ts-qa-01` | Unit tests for state models | Gemini | planned | |
| `task-ts-qa-104` | `ms-ts-qa-01` | Unit tests for the MagnetarAgent loop | Gemini | planned | |
| `task-ts-qa-105` | `ms-ts-qa-01` | Integration tests for tool-agent-memory | Gemini | planned | |
| `task-ts-qa-106` | `ms-ts-qa-01` | E2E acceptance tests (CLI/Web) | Gemini | planned | |
| `task-ts-qa-107` | `ms-16` | Activate CI pipeline for the TypeScript UI | Core Team | in_review | Dedicated workflow created for install, test, and typecheck in the UI workspace. |
| `task-ts-qa-108` | `ms-16` | Validate the test system itself | Core Team | in_progress | Initial smoke suite and coverage are active; meta-validation still needs expansion. |
| `task-1101` | `ms-11` | Define the onboarding IA/UX flow | Core Team | in_progress | Seven-step ideal flow. |
| `task-1102` | `ms-11` | Implement the tool catalog | Core Team | ready | Includes risk and scope visibility. |
| `task-1103` | `ms-16` | Rehome the TS UI to `apps/magnetar-ui` | Core Team | in_review | Workspace moved and active references updated from the previous temporary name. |
| `task-1104` | `ms-16` | Define future UI/SDK separation | Core Team | in_progress | Shared runtime extraction toward `packages/magnetar-sdk` is active. |
| `task-ui-109` | `ms-16` | Enable real web and CLI UI entrypoints | Core Team | in_progress | Branch `feature/init-runnable-web-ui` is active; real Angular startup plus web/CLI scripts and bootstrap pipeline are under implementation. |
| `task-1201` | `ms-12` | Design the Policy Center | Core Team | ready | Rules expressed in human language. |
| `task-1301` | `ms-13` | Enable Trace/Replay | Core Team | planned | Reproducible step-by-step view. |
| `task-1401` | `ms-14` | Formalize CLI commands | Core Team | ready | Contracts for run/approve/logs. |
| `task-1402` | `ms-14` | Verify cross-platform CLI behavior | Core Team | planned | Linux/macOS/Windows. |
| `task-1501` | `ms-15` | Define the unified SDK contract | Core Team | in_progress | `packages/magnetar-sdk` is becoming the shared contract package. |
| `task-1502` | `ms-15` | Publish the integration guide | Core Team | in_progress | Document consumption from the UI and future CLI clients. |
| `task-lm-101` | `ms-17` | Define LM Studio provider contract and configuration model | Core Team | in_review | Base URL, model identifier, timeout, healthcheck, and local-only defaults are documented in the SDK adapter and module docs. |
| `task-lm-102` | `ms-17` | Implement LM Studio adapter through the shared provider abstraction | Core Team | in_review | Initial SDK adapter added under `packages/magnetar-sdk/src/providers/lm-studio.ts`. |
| `task-lm-103` | `ms-17` | Add provider smoke tests and local setup docs for LM Studio | Core Team | in_review | Tests and integration notes now cover models, completions, healthcheck, and failure mapping. |
| `task-lm-104` | `ms-17` | Validate LM Studio path through repeatable smoke coverage | Core Team | in_progress | Vitest coverage now includes chat-consumed streaming cases, request shape, model listing, healthcheck, and error cases. |
| `task-chat-101` | `ms-18` | Define chat tab IA and UX acceptance criteria | Core Team | in_review | Chat must be a top-level tab with explicit provider visibility, conversation flow, and message actions. |
| `task-chat-102` | `ms-18` | Implement Angular chat tab shell and layout regions | Core Team | in_progress | Chat tab, conversation rail, stream column, canvas side panel, and backend-routed LM Studio streaming now exist in the Angular shell. GitHub issue `#173` is satisfied by the delivered conversation rail plus create/rename/delete administration flow. |
| `task-chat-103` | `ms-18` | Implement conversation state and provider session model | Core Team | in_progress | `ChatSessionService` now tracks prompt, response, backend-routed live LM Studio streaming, provider identity, and canvas state. GitHub issue `#174` is satisfied by local persistence, active-session restoration, and recency sorting for chat sessions. |
| `task-chat-104` | `ms-18` | Implement structured chat block rendering baseline | Core Team | in_progress | Headings, paragraphs, lists, quotes, code blocks, copy actions, and canvas extraction are now modeled and rendered. |
| `task-chat-105` | `ms-18` | Define canvas/document side panel mode | Core Team | planned | Specify how longer-form generated artifacts move from the chat stream into an editable side workspace. |
| `task-chat-106` | `ms-18` | Add streaming and provider-validation test plan | Core Team | in_progress | Deterministic parser and chat-session tests now cover backend-routed LM Studio SSE streaming; manual provider-connected UI validation still remains. |
| `task-chatfix-101` | `ms-18` | Stabilize browser -> backend -> LM Studio transport path | Core Team | done | The browser now reaches LM Studio only through the NestJS backend, and the working local default uses the verified LM Studio OpenAI-compatible path. |
| `task-chatfix-102` | `ms-18` | Prove the backend chat stream in isolation | Core Team | done | Backend transport tests now cover upstream normalization and error mapping independently from Angular. |
| `task-chatfix-103` | `ms-18` | Prove the UI -> backend chat path end to end | Core Team | done | The Angular chat flow was manually validated against the real LM Studio server and now streams responses successfully. |
| `task-chatfix-104` | `ms-18` | Normalize the backend streaming contract for the UI | Core Team | done | The browser consumes a normalized backend SSE delta contract instead of raw provider event variations. |
| `task-chatfix-105` | `ms-18` | Add runtime diagnostics and health endpoints | Core Team | planned | Distinguish UI, backend, provider, and model-level failures. |
| `task-chatfix-106` | `ms-19` | Make provider configuration backend-aware for chat transport | Core Team | planned | UI selects providers, backend owns transport execution details. |
| `task-chatfix-107` | `ms-16` | Lock the root development workflow for backend + UI | Core Team | in_progress | Root `npm run setup` and `npm run dev` now boot the backend plus UI together; the workflow still needs final hardening and health diagnostics. |
| `task-chatfix-108` | `ms-18` | Add regression coverage and manual acceptance checklist | Core Team | planned | Cover send semantics, routing, streaming, failures, and manual acceptance. |
| `task-provider-101` | `ms-19` | Define provider configuration model and failover semantics | Core Team | in_review | Primary, backup, disabled, and priority semantics are now modeled in the UI workspace state layer. |
| `task-provider-102` | `ms-19` | Implement provider configuration screen in Angular | Core Team | in_review | New Providers screen added to the shell with primary/backup/disable controls. GitHub issue `#190` is satisfied by the provider editor surface that exposes request templates, placeholders, API endpoints, and example payloads. |
| `task-provider-103` | `ms-19` | Add state tests for provider ordering and failover eligibility | Core Team | in_review | Vitest now covers provider sorting, promotion, disablement, and badge-state mapping. |
| `task-provider-104` | `ms-19` | Document runtime wiring path for multi-provider consumption | Core Team | planned | The SDK/runtime still needs to consume the UI-configured provider chain. |
| `task-provider-110` | `ms-19` | Refine configured-provider instance management in the Providers UI | Core Team | in_progress | Active slice: move configured providers onto opaque instance ids, keep quick-add presets non-deletable, and let users delete or reset configuration values without removing the preset catalog itself. |
| `task-provider-111` | `ms-19` | Persist provider presets and configuration instances as JSON artifacts | Core Team | planned | Next slice: define and store provider catalog data plus configured instance state in JSON so the Providers route can load, reset, and delete configurations from durable files instead of only local UI state. |
| `task-104` | `ms-03` | Define branching/WIP governance | Core Team | ready | Pending review. |
| `task-105` | `ms-03` | Establish test/blocker controls | Core Team | in_progress | Draft escalation mechanisms. |
| `task-201` | `ms-04` | Create canonical documentation files | Jules | done | RULES, PLAN, etc. |
| `task-202` | `ms-04` | Set up the Git repository structure | Jules | done | |
| `task-203` | `ms-04` | Define the project YAML template | Jules | done | |
| `task-301` | `ms-05` | Pydantic schema for MagnetarModel | Jules | done | |
| `task-302` | `ms-05` | Agent loop controller | Jules | done | |
| `task-401` | `ms-06` | Abstract tool interface | Jules | done | |
| `task-402` | `ms-06` | Filesystem tools | Jules | done | |
| `task-501` | `ms-07` | LiteLLM provider | Jules | done | |
| `task-502` | `ms-07` | ChromaDB memory setup | Jules | done | |
| `task-601` | `ms-08` | Build CLI with Typer | Jules | done | |
| `task-voice-101` | `ms-voice-01` | Re-scope voice UI foundations for the TypeScript workspace | Jules | in_progress | Legacy Python/Poetry/Gradio setup was superseded by the Angular workspace. Remaining work is to define the TS voice module structure, provider boundaries, browser/runtime constraints, and acceptance criteria. |
| `task-voice-102` | `ms-voice-01` | Implement voice capture and interaction flow in the TypeScript UI | Jules | planned | Depends on the TypeScript re-scope. No Angular voice capture, transcription, or interaction flow is implemented yet. |

## Success Criteria
- First useful automation in under 15 minutes.
- Risks understandable before approving sensitive actions.
- Ability to explain what the agent did after every run.
- Low-friction recipe reuse.
- **Operational console CLI as a verifiable fallback and automation channel.**
- **Stable SDK contract that guarantees functional parity between UI and CLI.**
- **At least one real AI provider integrated end-to-end, starting with LM Studio.**
- **A first-class in-app chat experience that validates provider behavior inside the product.**
- **Configurable multi-provider routing with a clear primary/backup chain.**

## Cumulative Effort
- **Total estimated effort**: 165 pts
- **Completed points**: 118 pts
- **In-progress points**: 17 pts
- **Remaining points**: 30 pts

## Change Control
Every task or status variation must be reflected in `STATUS.md` and recorded in `BITACORA.md`.
