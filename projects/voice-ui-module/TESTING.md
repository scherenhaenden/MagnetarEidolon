# Voice UI Module Testing

## Goals
- Verify that voice capture works across the supported browser surfaces without requiring real audio hardware in CI.
- Verify that permission denial, unsupported-browser, and non-secure-context failure modes surface clearly to the user.
- Verify that transcription results integrate correctly with the existing chat composer flow.
- Verify that the backend-routed transcription path works independently of the browser-native path.

## Test Layers

### 1. Unit Tests
- `VoiceCaptureService`: start capture, stop capture, and `AudioBlob` emission with a `getUserMedia` stub.
- `BrowserSpeechTranscriptionAdapter`: interim and final transcript events from a `SpeechRecognition` mock; empty-result handling; recognition error events.
- `BackendTranscriptionAdapter`: HTTP POST to `apps/magnetar-api /voice/transcribe` with a stubbed `HttpClient`; success, network-error, and non-200 response mapping.
- `VoiceSessionService`: state transitions for idle, capturing, transcribing, success, and error; transcript accumulation; error recovery.
- `TranscriptionResult` mapping: confidence score normalization; partial-result versus final-result differentiation.

### 2. Component Tests
- `VoiceComposerButtonComponent`: renders idle, listening, and error visual states; emits start/stop events on click.
- `VoiceStatusIndicatorComponent`: displays the correct label and aria attributes for each state.
- `ChatComposerComponent` integration: pre-fills the prompt control when `VoiceSessionService.transcript$` emits; does not auto-submit.

### 3. Permission and Constraint Tests
- `getUserMedia` returning a `NotAllowedError` → `VoiceCaptureService` emits a `PERMISSION_DENIED` error; `VoiceStatusIndicatorComponent` shows the correct message.
- `getUserMedia` returning a `NotFoundError` → `VoiceCaptureService` emits a `NO_DEVICE` error.
- `window.SpeechRecognition` absent → `BrowserSpeechTranscriptionAdapter.isSupported()` returns `false`; the session service routes to the backend adapter.
- Non-secure context (`window.isSecureContext === false`) → `VoiceCaptureService.startCapture()` rejects immediately with an `INSECURE_CONTEXT` error; the UI surfaces the error.
- Iframe sandbox without microphone permission → treated as a `NotAllowedError` scenario.

### 4. Backend Transcription Path Tests
- `POST /voice/transcribe` in `apps/magnetar-api` (see `ARCHITECTURE.md` Backend Boundary section for the full endpoint contract): returns a `TranscriptionResult` JSON body for a valid audio upload.
- Multer file parsing: rejects non-audio MIME types with HTTP 422.
- Upstream STT provider timeout → the controller returns HTTP 502 with a structured error body.
- `BackendTranscriptionAdapter` handles HTTP 502 by emitting a `BACKEND_UNAVAILABLE` error state in `VoiceSessionService`.

### 5. File-Based Fallback Tests
- Uploading a `.wav` fixture file through the file-input fallback path produces a `TranscriptionResult` via the backend adapter.
- CI pipelines can use this path to exercise the full voice-to-chat flow without real microphone hardware.

### 6. Manual QA
- Activate the voice button on Chrome/Edge desktop: verify the browser permission prompt appears, transcript updates in real time, and the final text fills the composer.
- Deny microphone permission: verify the UI shows an actionable error and the capture button returns to idle.
- Open the app on Firefox (no `SpeechRecognition`): verify the UI either routes to the backend adapter or displays an unsupported-browser message.
- Open the app over HTTP (non-localhost): verify the voice button is disabled or shows a secure-context warning.
- Send a voice-captured prompt through the full chat flow: verify the transcript becomes a chat message and LM Studio responds.

## Mocking Strategy
- Replace `navigator.mediaDevices.getUserMedia` with a Jest/Vitest spy that returns a controllable stream or rejects with a specific `DOMException`.
- Replace `window.SpeechRecognition` with a stub class that emits scripted `onresult` and `onerror` events.
- Use Angular's `HttpClientTestingModule` for backend-adapter tests.
- Provide a `VOICE_CAPTURE_PORT` injection token so Angular tests can swap in a fake implementation without touching real browser APIs.

## Acceptance Criteria
1. All unit tests pass without real microphone hardware in CI.
2. Permission-denial and non-secure-context scenarios are covered by deterministic tests.
3. The backend transcription path is tested independently of the browser-native path.
4. File-based audio upload is exercisable in a headless CI environment.
5. Manual QA checklist is completed on Chrome/Edge before `task-voice-102` is marked `in_review`.
