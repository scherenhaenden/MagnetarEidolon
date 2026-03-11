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
There is currently no separate backend service in this repository. The runnable surface is the Angular UI in `apps/magnetar-ui` plus the TypeScript CLI in the same workspace.

```bash
# install SDK + UI dependencies
npm run setup

# start the web UI in development from the project root
npm run dev

# run the CLI in development from the project root
npm run cli:dev -- about

# validate and build from the project root
npm run test
npm run typecheck
npm run build
```

Optional containerized development flow:

```bash
docker compose up dev
```

## Current Operational Commands
```bash
cd apps/magnetar-ui
npm install

# Local web UI
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

## Additional Information
- `docs/MAGNETAR_TECHNOLOGY_STACK.md`: technology choices and cross-platform rationale for Linux, macOS, and Windows.

## GitHub Tracking
- Issue tracker: `https://github.com/scherenhaenden/MagnetarEidolon/issues`
- Main project board: `https://github.com/users/scherenhaenden/projects/7` (`MagnetarEidolon`)
- The GitHub board should reflect active operational issues; the root documentation remains the source of truth for scope, architecture, and status.

## Governance Note
The project previously used a canonical project model as a documentation/governance framework. That model is administrative context only, not the product identity.

Any scope change must update `NEW_PLAN.md`, `PLAN.md`, `REQUIREMENTS.md`, and `STATUS.md` in the same PR to prevent documentation drift.
