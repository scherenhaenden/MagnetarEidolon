# Magnetar Technology Stack

## Introduction

This document defines the concrete technology choices for implementing the Magnetar architecture. Magnetar is conceived as a cross-OS autonomous agent framework centered on a structured cognition state (MagnetarEidolon) and a reasoning engine (MagnetarAgent). The system must integrate local and remote language models, operating-system tools, persistent memory, and Markdown-defined behavioral rules while remaining portable across Linux, macOS, and Windows.

The active product architecture is now TypeScript-first. The user-facing shell lives in Angular under `apps/magnetar-ui`, browser-safe provider and integration traffic lives behind a NestJS backend-for-frontend in `apps/magnetar-api`, and shared runtime contracts are extracted into `packages/magnetar-sdk`. Legacy Python material remains in the repository only as historical context and is no longer the primary implementation direction.

---

## Core Language and Runtime

### TypeScript as the Active Product Core

TypeScript is the active implementation language for MagnetarEidolon. It supports a single shared model across the Angular UI, the NestJS backend-for-frontend, and the reusable SDK/runtime package. This reduces duplication between browser, server, and CLI surfaces while keeping contracts explicit and testable.

The current runtime split is:
- Angular in `apps/magnetar-ui` for the product shell and browser-facing interaction flows
- NestJS in `apps/magnetar-api` for browser-safe transport, provider routing, and future backend-owned integrations
- TypeScript SDK code in `packages/magnetar-sdk` for shared contracts, provider adapters, and runtime logic

---

## Cognition Model Implementation

### Typed Domain Models in the SDK

MagnetarEidolon state and related contracts are implemented as typed TypeScript models and interfaces inside `packages/magnetar-sdk`. The project favors explicit state shapes, serializable contracts, and environment-specific adapters over duplicated UI-only or backend-only logic.

The target is not a browser-only frontend model. The same runtime contracts should be consumable by the Angular UI, backend-owned services where appropriate, and the CLI surface.

---

## Language Model Integration

### Provider Adapters Behind a Shared TypeScript Contract

Magnetar must remain provider-agnostic. The active path uses provider adapters behind shared TypeScript contracts in `packages/magnetar-sdk`, with browser-facing traffic routed through `apps/magnetar-api` when secrets, local-provider transport, or backend-owned request shaping are required.

Current active integrations and paths:
- LM Studio as the first local-provider baseline
- OpenRouter as the first backend-routed cloud-provider validation path
- NestJS backend ownership of provider transport for browser-driven chat flows

---

## Tool and OS Integration Layer

### Environment-Specific Adapters Under Shared Contracts

Tool and filesystem behavior should sit behind explicit TypeScript interfaces with environment-specific adapters. Node-facing adapters belong in the SDK/runtime layer, while browser-safe behavior remains constrained by the web runtime and the backend boundary.

This architecture keeps side effects isolated:
- browser UI code should not own privileged provider or secret-bearing traffic
- backend code should normalize transport and policy boundaries
- shared runtime code should remain portable across CLI and UI clients

---

## Memory and Vector Storage

### Current State and Direction

Memory remains a product capability, but the active repository work is currently focused more on UI/runtime integration, provider routing, chat stabilization, and contract extraction than on expanding memory infrastructure. Short-term memory is modeled directly in runtime state, while longer-term memory integration remains subject to future backend and SDK decisions.

---

## Network and Integration Boundaries

### HTTP via Backend-Owned or Environment-Appropriate Clients

HTTP access should be owned by the right runtime boundary:
- Angular should use backend-owned routes for privileged provider traffic
- NestJS should own external-provider contracts, secret usage, and normalized API responses where the browser must stay provider-agnostic
- SDK and Node-side tooling should use environment-appropriate fetch or HTTP clients through clear abstractions

---

## Markdown Rule and Knowledge System

### Markdown as the Governance and Planning Source of Truth

Markdown remains the canonical governance medium for project planning, module design, risks, and operational history. The repository’s root canon and module-level planning sets are intentionally version-controlled and human-editable so architectural intent stays reviewable alongside code.

---

## Agent Execution Interface

### Angular UI, Console CLI, and Shared SDK

The current interface model is multi-surface:
- Angular web UI in `apps/magnetar-ui`
- console CLI paths built from the TypeScript workspace
- shared runtime and contract logic in `packages/magnetar-sdk`

The CLI is not intended to be a parallel reimplementation. It should consume the same shared contracts and semantics as the UI wherever possible.

---

## Logging, Tracing, and Evaluation

### Observability Through Shared Runtime Events and Backend Diagnostics

Agent transparency and debugging require structured traces, logs, and replay-oriented contracts. The active direction is TypeScript-level observability through shared runtime events plus backend diagnostics, not a Python-specific logging stack.

Current direction includes:
- trace-event modeling in the SDK
- backend health and transport diagnostics
- future replay and observability consumers above those shared contracts

---

## Packaging and Distribution

### TypeScript Workspace Builds and Cross-Platform Release Hardening

Packaging and release work now centers on Node/TypeScript build artifacts, web builds, CLI packaging, and cross-platform release hardening. The active release questions are no longer about a Python `pyproject` path; they are about how the CLI and web surfaces are packaged, validated, and distributed across Linux, macOS, and Windows.

---

## Optional Interface Extensions

### Future Runtime Expansion

The architecture remains open to future desktop packaging, richer replay surfaces, voice interaction, and deeper backend-owned integrations, but those should extend the TypeScript-first product architecture rather than reintroduce a Python-primary runtime split.

---

## Hybrid Extension Path

### Future Native or Specialized Components

If performance-critical native components become necessary later, they should integrate behind stable product contracts and explicit boundaries. The key architectural rule is not the language itself but preserving clean runtime contracts and preventing product logic from fragmenting across ad hoc implementations.

---

## Technology Summary

MagnetarEidolon’s active technology stack is Angular plus NestJS plus a shared TypeScript SDK/runtime. Provider integration, backend boundaries, CLI/Web parity, and observability should all evolve around that architecture. Legacy Python material may still exist in the repository as historical context, but it is no longer the primary implementation model for the product.
