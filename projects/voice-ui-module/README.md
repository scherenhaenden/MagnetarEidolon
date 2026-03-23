# Voice UI Module

## Purpose
This module defines the planning, architecture, and delivery path for adding a first-class **voice interaction surface** to MagnetarEidolon using the TypeScript/Angular workspace. The original Python/Gradio/Poetry prototype has been retired; all voice work now targets the Angular product shell and the shared TypeScript SDK.

## Why This Module Exists
- MagnetarEidolon needs a hands-free input path that integrates naturally with the existing chat interaction model.
- Browser-native capture (Web Speech API / MediaDevices API) removes the need for a dedicated Python server and brings voice into the same runtime the product already uses.
- Defining clear module boundaries now prevents voice from accidentally coupling to provider internals or bypassing the `apps/magnetar-api` backend boundary.

## Scope
- Angular `VoiceCaptureModule` inside `apps/magnetar-ui` for microphone access, transcription, and UI state.
- TypeScript interfaces for microphone capture, transcription adapters, and voice session state in `packages/magnetar-sdk`.
- Backend boundary clarification: what stays browser-side versus what must be routed through `apps/magnetar-api`.
- Browser and runtime constraints: permissions, secure-context, sandbox limits, and fallback paths.
- Integration with the existing chat tab so voice becomes a first-class input mode rather than a separate screen.
- Testing strategy: mocked audio, permission denial, unsupported-browser stubs, and transcription-failure cases.

## Out of Scope
- Server-side speech processing (no separate Python service).
- Multi-user voice sessions.
- Speaker identification or diarization.
- Voice synthesis / text-to-speech.

## Module Documents
| File | Role |
| :--- | :--- |
| `PLAN.md` | Milestones and tasks for the voice UI module. |
| `STATUS.md` | Current state, immediate focus, and risks. |
| `ARCHITECTURE.md` | Module-level architecture, boundaries, and integration points. |
| `REQUIREMENTS.md` | Functional and technical requirements including browser constraints. |
| `TESTING.md` | Voice-specific validation strategy for capture, permissions, and transcription flows. |
| `BITACORA.md` | Chronological logbook for the voice module. |

## Relationship to the Main Project
This module gives `task-voice-102` a concrete, Python-free foundation to start implementation. It defines all boundaries, contracts, and constraints that the Angular voice implementation must respect. All design decisions in this module align with the `apps/magnetar-ui` + `apps/magnetar-api` + `packages/magnetar-sdk` workspace layout defined in the root `ARCHITECTURE.md`.

## Key Dependency
`task-voice-102` (Implement voice capture and interaction flow in the TypeScript UI) is **blocked** until the boundaries and constraints documented in this module are accepted. Once `task-voice-101` transitions to `done`, `task-voice-102` may begin without relying on any Python or Gradio assumptions.
