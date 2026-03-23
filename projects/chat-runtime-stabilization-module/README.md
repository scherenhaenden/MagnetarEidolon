# Chat Runtime Stabilization Module

## Purpose
This module tracks the work required to move the chat experience from "implemented in principle" to "actually reliable end-to-end" in daily use.

## Why This Module Exists
- The chat UI now exists, but real user value depends on transport reliability, not only rendering or mock flows.
- LM Studio is the first concrete provider target, so it exposes the real browser/backend/provider boundary problems first.
- The project needs a tracked path from partial integration to a stable chat workflow that can be trusted for further provider work.

## Scope
- Browser -> backend -> provider routing for chat.
- NestJS backend-for-frontend behavior for chat streaming.
- LM Studio native request/response compatibility.
- Error handling, diagnostics, heartbeat/health checks, and restart/debug workflows.
- Root development commands that reliably start the required services.
- Regression coverage for real chat/runtime failures.

## Out of Scope
- Final rich markdown/AST renderer.
- Multi-provider orchestration beyond what is needed to stabilize the first path.
- Voice input.
- Collaborative or multi-user chat.

## Module Documents
| File | Role |
| :--- | :--- |
| `PLAN.md` | Milestones and backlog for the stabilization track. |
| `STATUS.md` | Current progress, blockers, and next checkpoint. |
| `ARCHITECTURE.md` | Backend/UI/provider runtime boundary for chat. |
| `REQUIREMENTS.md` | Functional and technical stabilization requirements. |
| `TESTING.md` | Validation strategy for transport, streaming, diagnostics, and acceptance. |
| `BITACORA.md` | Module-specific chronology. |
