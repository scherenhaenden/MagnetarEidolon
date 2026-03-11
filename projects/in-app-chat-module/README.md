# In-App Chat Module

## Purpose
This module defines the planning, architecture, and delivery path for adding a real **in-app chat experience** to MagnetarEidolon.

## Why This Module Exists
- The product needs a real conversational surface, not only dashboard placeholders.
- Provider testing is much more realistic when done through the same UI users will actually use.
- Chat becomes the shortest path for validating prompt/response behavior, provider health, and regressions.

## Scope
- Chat UX workflow and interaction model.
- Conversation state, request/response rendering, and provider-state visibility.
- Testing strategy for provider validation through the chat UI.
- Integration with the shared SDK/runtime contract.

## Out of Scope
- Multi-user collaborative chat.
- Full memory editing UX.
- Final recipe-builder integration.

## Module Documents
| File | Role |
| :--- | :--- |
| `PLAN.md` | Milestones and tasks for the chat module. |
| `STATUS.md` | Current state and immediate focus. |
| `ARCHITECTURE.md` | Module-level architecture and boundaries. |
| `REQUIREMENTS.md` | Functional and technical requirements. |
| `BITACORA.md` | Chronological module logbook. |

## Relationship to the Main Project
This module gives the UI a concrete delivery track for the first real conversation surface without burying chat-specific planning inside the broader UI roadmap.
