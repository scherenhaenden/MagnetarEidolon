# Voice UI Module Requirements

This document describes the required behavior and target artifacts for the planned `task-voice-102` implementation. Component, service, and interface names here are intended implementation targets; they are not a guarantee that those exact symbols already exist in the current codebase before the implementation task begins.

## Functional Requirements

### Voice Capture
- The module must request microphone access only after an explicit user gesture (button click).
- The module must support starting and stopping capture with clear visual feedback for each state.
- The module must expose captured audio as an `AudioBlob` interface-compatible value consumable by any registered `TranscriptionPort` adapter.
- The module must support file-based audio upload as an alternative input path for test and accessibility purposes.

### Transcription
- The module must support a browser-native transcription path using the `SpeechRecognition` / `webkitSpeechRecognition` API.
- The module must support a backend-routed transcription path through `apps/magnetar-api` for browsers that do not support the native API or when higher-accuracy mode is selected.
- The module must emit both interim (partial) and final transcript results so the UI can show real-time feedback during capture.
- The module must map all transcription outcomes through the `TranscriptionResult` interface defined in `packages/magnetar-sdk`.

### Chat Integration
- When a final transcript is produced, the module must pre-fill the `ChatComposerComponent` prompt field without submitting the message automatically.
- The user must be able to review and edit the transcribed text before sending.
- The voice capture button must be embedded in the existing chat composer bar as a non-disruptive affordance.

### Error Handling
- The module must display a clear, user-visible message for each of the following failure modes:
  - Microphone permission denied (`NotAllowedError`).
  - No microphone hardware found (`NotFoundError`).
  - Unsupported browser (no `SpeechRecognition` API and no backend adapter available).
  - Non-secure context (HTTP when not accessed via localhost).
  - Backend transcription service unreachable, including network failures and backend-unavailable responses.
  - Transcription returned empty or unusable text.
- The module must keep the user informed during backend transcription failures instead of failing silently or leaving the capture/transcription state ambiguous.

## Non-Functional Requirements

### Browser Compatibility
- The module must detect `SpeechRecognition` availability at runtime (feature detection, not user-agent sniffing).
- The module must compile and start successfully in all environments regardless of whether `SpeechRecognition` or `getUserMedia` is present.
- The module must not throw unhandled exceptions when voice APIs are absent; it must degrade gracefully.

### Security and Privacy
- Microphone access must only be requested in a secure context (HTTPS or localhost).
- Audio data must never be sent to an external provider directly from the browser; all external calls must be routed through `apps/magnetar-api`.
- No audio recording should persist to local storage or IndexedDB without an explicit user opt-in.

### Testability
- All capture and transcription dependencies must be injectable through `VoiceCapturePort` and `TranscriptionPort` interfaces so unit tests can use deterministic stubs without real microphone hardware.
- Permission denial and unavailable-API scenarios must be exercisable through mock implementations.
- File-based audio upload must be usable in CI and local test environments where no microphone is available.

### Runtime Constraints
- The module must operate correctly when the user's browser session is inside an iframe, subject to iframe permissions; if microphone access is blocked by iframe sandbox policy, the module must surface an explicit error.
- The module must not initiate any background audio capture; capture must start only on an explicit user action and stop on an explicit stop action or after a defined silence timeout.

### Architecture Alignment
- The module must not import from provider-specific adapters directly inside Angular components; all provider calls must go through the SDK interface layer.
- The module must follow the OOP-first design rule from the root `ARCHITECTURE.md`: state and orchestration belong in services, not in component methods.

## Acceptance Criteria
1. A contributor can open the app, click the voice input button in the chat tab, and have their spoken words transcribed into the prompt field.
2. The UI clearly communicates each state: idle, requesting permission, listening, transcribing, success, and error.
3. Permission denial and non-secure context produce visible, actionable error messages rather than silent failures.
4. Browsers without native `SpeechRecognition` support route to the backend adapter or display a clear unsupported-browser message.
5. All capture and transcription paths are exercised through deterministic unit and integration tests without requiring real audio hardware.
6. No Python, Gradio, or Poetry code or documentation is referenced anywhere in the voice feature path.
