# Voice UI Module Status

## Summary
**Progress:** 40%
`[████████░░░░░░░░░░░░] 40%`

## Current State
The re-scope phase is complete. The voice module architecture, boundaries, browser constraints, SDK interfaces, and testing strategy are documented. The Python/Gradio/Poetry prototype has been fully retired from the roadmap. `task-voice-101` is in review; `task-voice-102` (implementation) is unblocked and planned.

## Immediate Focus
- Transition `task-voice-101` from `in_review` to `done` after peer acceptance.
- Begin `task-voice-102`: scaffold the `VoiceCaptureModule` in `apps/magnetar-ui` following the boundaries defined in `ARCHITECTURE.md`.
- Define SDK interface stubs in `packages/magnetar-sdk` before writing Angular component code.
- Set up the injection token and stub adapter so tests can run without real microphone hardware from the first commit.

## Risks

| Risk ID | Description | Probability | Impact | Mitigation |
| :--- | :--- | :--- | :--- | :--- |
| `risk-voice-001` | Browser microphone permissions, local-runtime constraints, and provider compatibility may complicate the first voice implementation. | High | Medium | Design for browser-safe capture first; keep adapters isolated; use mocked or file-based audio for staged validation. |
| `risk-voice-002` | The `SpeechRecognition` API is not universally supported (notably absent in Firefox as of early 2026), which may require fallback routing through `apps/magnetar-api` earlier than planned. | Medium | Medium | `BrowserSpeechTranscriptionAdapter.isSupported()` guard is defined from the start; the backend adapter interface is in the SDK contract so the upgrade path is non-breaking. |
| `risk-voice-003` | External STT providers (e.g., Whisper via OpenAI, AssemblyAI) require API keys and may have rate limits or regional restrictions that complicate first integration. | Medium | Low | The browser-native path delivers the first working feature without any external provider. Backend-routed STT remains an optional upgrade behind the `TranscriptionPort` interface. |
| `risk-voice-004` | Microphone capture inside CI/test environments will fail without hardware; unguarded test code may produce flaky or impossible-to-reproduce failures. | High | Low | All capture APIs are abstracted behind injectable interfaces with mock implementations; file-based upload covers the CI path. |

## Next Checkpoint
Complete the `VoiceCaptureModule` scaffold in `apps/magnetar-ui` (first commit of `task-voice-102`) with passing unit tests for the browser-native transcription adapter stub before any real microphone or backend wiring is attempted.
