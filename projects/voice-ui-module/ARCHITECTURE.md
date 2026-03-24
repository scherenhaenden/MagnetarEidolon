# Voice UI Module Architecture

## Goal
Introduce a browser-native voice capture and transcription surface into the Angular product shell that integrates with the existing chat interaction model and respects the `apps/magnetar-ui` → `apps/magnetar-api` → provider backend boundary.

## Planned Artifact Note
The component names, service names, and SDK interfaces in this document describe the target implementation shape for `task-voice-102`. They are planned artifacts and design contracts for the upcoming implementation phase, not a claim that those exact symbols already exist in the current codebase today.

## Target Shape
```text
[Voice Composer Button] ──► [VoiceCaptureService]
                                    │
                      ┌─────────────┴─────────────┐
                      │                           │
                      ▼                           ▼
          [Browser MediaDevices API]   [Web Speech API / SpeechRecognition]
          (getUserMedia, microphone)   (browser-native transcription)
                      │                           │
                      └─────────────┬─────────────┘
                                    │
                                    ▼
                        [TranscriptionAdapterService]
                        (browser adapter or API-routed)
                                    │
                      ┌─────────────┴─────────────┐
                      │                           │
             [Browser-Side Path]       [Backend-Routed Path]
           (Web Speech API, local)    (apps/magnetar-api proxy
                      │                to external STT provider)
                      └─────────────┬─────────────┘
                                    │
                                    ▼
                        [VoiceSessionService]
                        (transcript text, state, errors)
                                    │
                                    ▼
                        [ChatComposerComponent]
                        (pre-fills prompt with transcript)
                                    │
                                    ▼
                        [ChatSessionService / SDK contract]
```

## Module Boundaries

### Angular Module — `VoiceCaptureModule` (`apps/magnetar-ui`, planned)
| Component / Service | Responsibility |
| :--- | :--- |
| `VoiceComposerButtonComponent` | Microphone toggle button inside the chat composer bar. |
| `VoiceStatusIndicatorComponent` | Visual feedback: idle, listening, transcribing, error. |
| `VoiceCaptureService` | Owns the `getUserMedia` lifecycle; emits `AudioBlob` or raw audio chunks. |
| `BrowserSpeechTranscriptionAdapter` | Wraps the `SpeechRecognition` / `webkitSpeechRecognition` API. |
| `BackendTranscriptionAdapter` | Sends audio blobs to `apps/magnetar-api` for server-side STT routing. |
| `VoiceSessionService` | Manages capture state, transcript accumulation, and error recovery. |

### SDK Interfaces — `packages/magnetar-sdk` (planned)
The SDK defines stable contracts so adapters and services can be swapped:

```typescript
export interface VoiceCapturePort {
  startCapture(): Promise<void>;
  stopCapture(): Promise<AudioBlob | null>;
  readonly isCapturing: boolean;
}

export interface TranscriptionPort {
  transcribe(audio: AudioBlob): Promise<TranscriptionResult>;
}

export interface TranscriptionResult {
  text: string;
  confidence?: number;
  isFinal: boolean;
  error?: string;
}

export interface AudioBlob {
  data: Blob;
  mimeType: string;
  durationMs: number;
}
```

### Backend Boundary — `apps/magnetar-api`

**Backend Voice Endpoint (single source of truth):**
- **Path**: `POST /voice/transcribe`
- **Content-Type**: `multipart/form-data` (Multer file upload; field name `audio`)
- **Response**: `{ text: string; confidence?: number; isFinal: boolean; error?: string }`
- **Error responses**: HTTP 422 for unsupported MIME type; HTTP 502 for upstream STT provider failure

| Concern | Browser-Side | Backend-Routed |
| :--- | :--- | :--- |
| Microphone capture | `getUserMedia` in Angular | — |
| Browser-native transcription | `SpeechRecognition` API | — |
| External STT provider calls | **Not allowed** (avoids CORS, secret exposure) | `POST /voice/transcribe` in NestJS |
| API keys for STT providers | Never in the browser | `apps/magnetar-api` environment variables |
| Audio streaming to provider | — | Multer upload or WebSocket gateway in NestJS |

The rule is: the browser initiates and captures audio, but any call to a paid or external transcription provider must be routed through `apps/magnetar-api` using the same pattern as the existing `ChatGatewayService`.

### Chat Integration
Voice input feeds directly into `ChatComposerComponent` as a pre-filled transcript string. The voice module does **not** bypass `ChatSessionService` or the provider contract — it is purely an input mechanism that produces text before the standard chat send flow takes over.

Integration point in the chat composer:
```typescript
// VoiceComposerButtonComponent emits transcript text;
// ChatComposerComponent subscribes and pre-fills the prompt field.
voiceSession.transcript$.subscribe(text => this.promptControl.setValue(text));
```

## Design Rules
1. Voice capture is an input mechanism only — it must not own or modify chat state directly.
2. The Angular module must compile and start successfully even in environments where `SpeechRecognition` or `getUserMedia` are absent (feature-detect, not assume).
3. All external provider calls must be routed through `apps/magnetar-api`, matching the existing chat transport pattern.
4. SDK interfaces define the boundary between the Angular module and the runtime adapters.
5. The backend adapter and the browser adapter must be interchangeable behind `TranscriptionPort` so testing can use stubs.
6. Microphone permission requests must be deferred until the user explicitly activates the voice input button.
7. Permission denial and unsupported-browser states must produce visible, actionable UI feedback rather than silent failures.
8. `VoiceCaptureService`, transcription adapters, and `VoiceSessionService` must expose explicit failure states so network, permission, browser-support, and backend errors map to deterministic UI feedback.

## Browser and Runtime Constraints

### Secure Context (HTTPS) Requirement
`getUserMedia` and `SpeechRecognition` are only available in **secure contexts** (HTTPS or localhost). Implications:
- Local development on `http://localhost` works because localhost is an allowed secure context.
- Deployment behind HTTP without TLS will cause both APIs to be unavailable.
- The module must detect the absence of a secure context and display a clear error rather than silently failing.

### Permission Model
The browser requires an explicit user gesture before the microphone permission prompt is shown. The module must:
- Never auto-start capture on page load.
- Request permission only when the user taps or clicks the voice activation button.
- Handle `NotAllowedError` (permission denied) and `NotFoundError` (no microphone hardware) explicitly with user-visible messages.
- Respect the browser's one-time or persistent permission decision; do not re-prompt after a permanent denial.

### SpeechRecognition API Availability
| Browser | Availability | Notes |
| :--- | :--- | :--- |
| Chrome / Edge (desktop + mobile) | Full | `window.SpeechRecognition` or `window.webkitSpeechRecognition` |
| Firefox | None (see MDN for current status) | Must fall back to backend-routed STT; check [MDN SpeechRecognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition#browser_compatibility) or [caniuse.com](https://caniuse.com/speech-recognition) for the latest support data |
| Safari (macOS 14+) | Partial | Works in secure context, some interim-result quirks |
| Electron / Tauri runtime | Varies | Depends on embedded Chromium version |

The `BrowserSpeechTranscriptionAdapter` must implement an `isSupported()` guard and the module must route to the backend adapter if unsupported.

### Sandbox Limitations
- Browsers running inside iframes with `allow-scripts` but without `allow-same-origin` will block microphone access.
- Progressive Web App (PWA) installations generally preserve the same permission model as the hosting browser.
- CI/test environments have no audio hardware; all capture must be mockable through the `VoiceCapturePort` interface.

### Local-First Fallback Path
1. Attempt browser-native `SpeechRecognition` for real-time transcription (zero latency, no network cost).
2. If unavailable or if the user opts into higher-accuracy mode, route audio to `apps/magnetar-api` via `POST /voice/transcribe`.
3. If the backend is unreachable, surface a clear error and disable the voice button rather than silently swallowing the failure.
4. A file-based audio input (upload a `.wav` or `.mp3`) must be supported as a fallback for mocked validation and CI scenarios.

## Component Model
- **VoiceComposerButtonComponent**: microphone icon toggle; transitions between idle, listening, and processing visual states.
- **VoiceStatusIndicatorComponent**: inline status pill showing the active capture/transcription state with accessible aria labels.
- **VoiceCaptureService**: manages `getUserMedia` stream lifecycle; emits raw audio chunks or a final `AudioBlob`.
- **BrowserSpeechTranscriptionAdapter**: wraps `SpeechRecognition`, emits interim and final transcript results.
- **BackendTranscriptionAdapter**: posts `AudioBlob` to `apps/magnetar-api /voice/transcribe`; maps the response to `TranscriptionResult`.
- **VoiceSessionService**: orchestrates capture and transcription adapters; maintains transcript accumulation and error state; exposes `transcript$` observable for the chat composer.

### Error Handling Expectations by Service
- **VoiceCaptureService**: must surface secure-context, permission-denied, missing-device, and stream-start failures as explicit error states.
- **BrowserSpeechTranscriptionAdapter**: must surface unsupported-browser and recognition failures without throwing uncaught runtime errors.
- **BackendTranscriptionAdapter**: must distinguish unreachable backend, unsupported-format, and upstream-provider failure cases where the response contract allows it.
- **VoiceSessionService**: must translate service-level failures into stable UI-facing states so the composer button and status indicator never leave the user in an ambiguous state.

## Key Decisions
1. The first implementation uses the browser-native `SpeechRecognition` API so no backend wiring is required for the happy path.
2. The backend adapter is defined from the start as an interface so the upgrade path to a higher-quality STT provider is non-breaking.
3. Voice input will feed into the existing `ChatComposerComponent` prompt field rather than introducing a separate entry point.
4. No Python, Gradio, or Poetry assumptions survive into this architecture; the entire voice surface is TypeScript and browser-native.
