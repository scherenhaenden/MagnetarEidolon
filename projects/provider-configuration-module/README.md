# Provider Configuration Module

## Purpose
This module defines the planning, architecture, and delivery path for configuring multiple AI providers inside MagnetarEidolon.

## Why This Module Exists
- The product needs more than one provider.
- Users need a clear way to define a primary provider and backups.
- Failover intent should be visible in the UI before it is enforced by the runtime.

## Scope
- Provider configuration state model.
- Primary/backup/disabled role semantics.
- Ordering and failover intent in the UI.
- Provider CRUD and preset onboarding in the UI.
- User-visible provider templates and placeholder semantics.
- Runtime wiring path for future provider consumption.
- Backend-owned provider registry and config-driven execution metadata.
- Backend-owned provider secret loading and runtime overrides.
- OpenRouter as the first concrete external provider to validate the backend model.

## Module Documents
| File | Role |
| :--- | :--- |
| `PLAN.md` | Milestones and tasks for provider configuration. |
| `STATUS.md` | Current state and immediate focus. |
| `ARCHITECTURE.md` | Module-level architecture and boundaries. |
| `REQUIREMENTS.md` | Functional and technical requirements. |
| `BITACORA.md` | Chronological module logbook. |
