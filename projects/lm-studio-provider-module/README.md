# LM Studio Provider Module

## Purpose
This module defines the planning, architecture, and delivery path for integrating **LM Studio** as the first real AI provider in MagnetarEidolon.

## Why This Module Exists
- LM Studio is a practical first provider for local development.
- It gives the product a concrete end-to-end provider path instead of only abstract interfaces.
- It supports local testing without forcing cloud-provider setup first.

## Scope
- Provider contract and configuration model.
- LM Studio adapter behavior and healthcheck flow.
- Local developer setup and validation path.
- Integration with the shared SDK/runtime boundary.
- Initial SDK implementation and repeatable smoke coverage.

## Out of Scope
- Multi-provider settings UI.
- Cloud-provider rollout.
- Final provider marketplace or provider orchestration logic.

## Module Documents
| File | Role |
| :--- | :--- |
| `PLAN.md` | Milestones and tasks for LM Studio integration. |
| `STATUS.md` | Current state and immediate focus. |
| `ARCHITECTURE.md` | Module-level architecture and boundaries. |
| `REQUIREMENTS.md` | Functional and technical requirements. |
| `BITACORA.md` | Chronological module logbook. |

## Relationship to the Main Project
This module is subordinate to the root project plan. It exists to keep provider integration independently planned and documented without mixing its delivery details into unrelated UI or SDK milestones.
