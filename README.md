# MagnetarEidolon

[![CI (Linux)](https://github.com/scherenhaenden/MagnetarEidolon/actions/workflows/ci-linux.yml/badge.svg)](https://github.com/scherenhaenden/MagnetarEidolon/actions/workflows/ci-linux.yml)
[![CI (macOS)](https://github.com/scherenhaenden/MagnetarEidolon/actions/workflows/ci-macos.yml/badge.svg)](https://github.com/scherenhaenden/MagnetarEidolon/actions/workflows/ci-macos.yml)
[![CI (Windows)](https://github.com/scherenhaenden/MagnetarEidolon/actions/workflows/ci-windows.yml/badge.svg)](https://github.com/scherenhaenden/MagnetarEidolon/actions/workflows/ci-windows.yml)
[![Release](https://github.com/scherenhaenden/MagnetarEidolon/actions/workflows/release.yml/badge.svg)](https://github.com/scherenhaenden/MagnetarEidolon/actions/workflows/release.yml)
[![License](https://img.shields.io/github/license/scherenhaenden/MagnetarEidolon)](https://github.com/scherenhaenden/MagnetarEidolon/blob/master/LICENSE)

## Purpose
MagnetarEidolon is evolving into an agent platform centered on **simplicity, trust, and full observability**.

Product promise:

> **"Build, run, observe, and trust AI agents without technical chaos."**

This repository holds the documentation and technical baseline needed to turn that vision into verifiable deliverables.

## Guiding Principles
1. Radical simplicity so users can get started in minutes.
2. Trust by design, with risky actions always visible and approvable.
3. Full observability across plans, steps, and outcomes.
4. Permanent human control.
5. Explicit, editable, governable memory.
6. A premium command-center style experience.
7. OOP-first implementation discipline, with pure methods and pure helper functions preferred whenever behavior does not require side effects.

## Engineering Rules
- Runtime and domain behavior should default to classes and explicit object boundaries instead of ad hoc procedural sprawl.
- Methods should stay pure whenever they can operate only on inputs and controlled state transitions.
- Standalone functions should be introduced only when they are stateless, pure helpers with no hidden side effects.
- Side effects such as filesystem access, network calls, UI bridges, and process execution must stay isolated at clear boundary layers.
- Pull requests that add avoidable side effects or procedural duplication should be treated as architecture regressions.

## Product Modes
- **Execution Mode**: complete goals quickly.
- **Build Mode**: create reusable recipes and flows.
- **Debug Mode**: inspect decisions, cost, and failures.

## Does This Imply an SDK?
Yes. If the product has an operational CLI and a UI that share semantics, it must also have a reusable **SDK-style core** (internal or external library) that exposes stable contracts for:
- running executions,
- querying status,
- approving or denying actions,
- retrieving traces and logs.

The CLI must not duplicate business logic; it should consume the shared SDK/runtime contract.

## Core Documentation
| File | Role |
| :--- | :--- |
| `NEW_PLAN.md` | Base product vision and strategic direction. |
| `PLAN.md` | Operational roadmap by phase, milestone, and task. |
| `REQUIREMENTS.md` | Functional and non-functional requirements aligned with the current vision. |
| `ARCHITECTURE.md` | Target architecture for the UI, agent engine, policies, and memory system. |
| `STATUS.md` | Current status, risks, and immediate commitments. |
| `TESTING.md` | Technical and product validation strategy. |
| `docs/UI_RUNTIME_BOOTSTRAP_PLAN.md` | Detailed plan for turning the TypeScript UI into a real runnable web and CLI surface. |
| `projects/lm-studio-provider-module/` | Standalone planning module for the first local AI provider integration via LM Studio. |
| `projects/in-app-chat-module/` | Standalone planning module for the embedded chat surface and testing workflows. |
| `projects/chat-runtime-stabilization-module/` | Standalone planning module for getting the chat runtime from partial integration to reliable end-to-end behavior. |
| `projects/provider-configuration-module/` | Standalone planning module for multi-provider configuration, primary/backup routing, and failover policy. |

## Transition Status
The repository is in an active transition phase:
- The Python implementation remains available while the TypeScript prototype is being evaluated.
- The TypeScript UI now lives in `apps/magnetar-ui` rather than being treated as a permanent skeleton.
- The target CLI/Web architecture is `apps/magnetar-ui` + `packages/magnetar-sdk`; extraction of the shared runtime is ongoing.
- The real web runtime bootstrap is underway: `apps/magnetar-ui` is moving past a placeholder startup and into a runnable Angular workspace around the existing UI.
- Current planning and testing priorities focus on the TypeScript migration.
- Once the TypeScript prototype is proven stable, the legacy Python code will be retired.

## Current UI Workspace Startup
- Local web UI: `cd apps/magnetar-ui && npm install && npm run start`
- Development CLI: `cd apps/magnetar-ui && npm install && npm run cli:dev -- about`
- Built CLI: `cd apps/magnetar-ui && npm run build:cli && npm run cli -- about`

## Startup From the Project Root
The repository now includes a dedicated backend-for-frontend service in `apps/magnetar-api`. In development, the Angular UI talks to that backend, and the backend talks to LM Studio.

```bash
# install SDK + backend + UI dependencies
npm run setup

# start backend + web UI together from the project root
npm run dev

# equivalent direct launcher from the project root
./dev.sh

# start only the backend
npm run dev:api

# run the CLI in development from the project root
npm run cli:dev -- about

# validate and build from the project root
npm run test
npm run typecheck
npm run build
```

To test OpenRouter through the backend:

```bash
cp .env.example .env
```

Then set `OPENROUTER_API_KEY` in `.env`, optionally adjust `OPENROUTER_DEFAULT_MODEL`, start the app with `./dev.sh`, switch `OpenRouter` to `Primary` in the `Providers` tab, and send a prompt from `Chat`.

Optional containerized development flow:

```bash
docker compose up dev
```

## Current Operational Commands
```bash
cd apps/magnetar-api
npm install
npm run start:dev

cd ../magnetar-ui
npm install

# Local web UI (expects backend on port 3100)
npm run start

# Development CLI
npm run cli:dev -- about

# Built CLI
npm run build:cli
npm run cli -- about

# Validation
npm run typecheck
npm run test:ci
npm run build
```

Equivalent commands from the project root:

```bash
npm run setup
npm run dev
npm run cli:dev -- about
npm run build
```

## Immediate Workstreams
1. Consolidate the MVP experience with Dashboard + Live Execution + Policy Center.
2. Guarantee traceability for sensitive actions with human approval.
3. Keep the **console CLI** as the official operations and diagnostics interface.
4. Formalize the **SDK contract** shared by the UI and CLI.
5. Add **LM Studio** as the first concrete AI provider integration for local development and testing.
6. Add an **in-app chat surface** so provider testing and real usage happen inside the product instead of only through placeholder views.
7. Add **provider configuration UI** so multiple providers can be configured with primary and backup roles.
8. Land a dedicated **Chat** tab with structured rendering, streaming, and a future canvas/document side panel.
9. Keep browser-to-provider traffic behind the NestJS backend/BFF instead of calling LM Studio directly from Angular.
10. Stabilize the chat runtime end to end before expanding more provider or chat-surface complexity.

## Additional Information
- `docs/MAGNETAR_TECHNOLOGY_STACK.md`: technology choices and cross-platform rationale for Linux, macOS, and Windows.

## GitHub Tracking
- Issue tracker: `https://github.com/scherenhaenden/MagnetarEidolon/issues`
- Main project board: `https://github.com/users/scherenhaenden/projects/7` (`MagnetarEidolon`)
- The GitHub board should reflect active operational issues; the root documentation remains the source of truth for scope, architecture, and status.

## Governance Note
The project previously used a canonical project model as a documentation/governance framework. That model is administrative context only, not the product identity.

Any scope change must update `NEW_PLAN.md`, `PLAN.md`, `REQUIREMENTS.md`, and `STATUS.md` in the same PR to prevent documentation drift.
