# Chat Runtime Stabilization Architecture

## Goal
Stabilize the chat runtime boundary so the browser UI never needs to know provider-specific HTTP details.

## Runtime Boundary
```text
Angular Chat UI
      |
      v
NestJS BFF (`apps/magnetar-api`)
      |
      v
LM Studio (`127.0.0.1:1234/api/v1/chat`)
```

## Architectural Decisions
1. The browser talks only to the NestJS backend for chat transport.
2. The backend owns provider-specific request shapes, headers, host routing, and stream forwarding.
3. The UI consumes one backend contract and should not encode LM Studio request semantics directly.
4. The SDK remains the long-term shared runtime/core layer; the backend is a transport/security boundary, not a replacement for the SDK.
5. Diagnostics and health checks belong at the backend boundary so failures can be localized.

## Stabilization Targets
- One browser-safe chat endpoint.
- One backend-normalized streaming contract.
- One provider-routing path for LM Studio.
- Clear distinction between UI failure, backend failure, and provider failure.
