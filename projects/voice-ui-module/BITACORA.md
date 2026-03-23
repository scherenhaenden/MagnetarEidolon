# Voice UI Module Logbook

## Entries

- **Timestamp:** 2026-03-23 07:00 UTC
  **Author:** Copilot
  **Entry:** State Change: Completed the `task-voice-101` architecture and documentation phase. Created the `projects/voice-ui-module/` planning module covering module boundaries, SDK interface contracts, browser/runtime constraints, risk mitigations, and a TypeScript-first testing strategy. Retired all Python/Gradio/Poetry references from the voice roadmap. Updated root `PLAN.md`, `BITACORA.md`, `STATUS.md`, and `projects/magnetar-voice-ui.project.yml` to reflect the transition. `task-voice-101` moved to `in_review`; `task-voice-102` is now unblocked.

- **Timestamp:** 2026-03-23 06:59 UTC
  **Author:** Copilot
  **Entry:** Decision: Defined `VoiceCapturePort` and `TranscriptionPort` as SDK-level interfaces in `packages/magnetar-sdk` so the Angular module can swap between the browser-native `SpeechRecognition` adapter and a backend-routed STT adapter without changing component code. This keeps the voice module isolated from provider specifics and from `apps/magnetar-api` transport details.

- **Timestamp:** 2026-03-23 06:59 UTC
  **Author:** Copilot
  **Entry:** Decision: Established the browser/runtime constraint set: (1) `getUserMedia` and `SpeechRecognition` require a secure context (HTTPS or localhost); (2) permission must be requested only on an explicit user gesture; (3) `SpeechRecognition` is absent in Firefox as of early 2026, requiring a feature-detection guard; (4) iframe sandbox restrictions may block microphone access; (5) CI environments have no audio hardware, so all capture must be mockable through the `VoiceCapturePort` injection token.

- **Timestamp:** 2026-03-23 06:59 UTC
  **Author:** Copilot
  **Entry:** Decision: Documented four voice-specific risks (`risk-voice-001` through `risk-voice-004`) covering browser permission complexity, `SpeechRecognition` browser support gaps, external STT provider constraints, and CI hardware absence. All risks are mitigated through interface isolation, feature detection, the browser-native-first implementation path, and the injectable stub strategy for tests.

- **Timestamp:** 2026-03-23 06:59 UTC
  **Author:** Copilot
  **Entry:** Project bootstrap: created the voice UI module planning set as the foundational documentation for `task-voice-101`. This module supersedes the legacy Python/Gradio voice prototype and establishes the TypeScript-first voice architecture aligned with `apps/magnetar-ui`, `apps/magnetar-api`, and `packages/magnetar-sdk`.
