# Chat Runtime Stabilization Requirements

## Functional Requirements
- **FR-CS-01 (Must)**: The Angular UI must submit chat traffic only to the NestJS backend.
- **FR-CS-02 (Must)**: The backend must forward LM Studio chat requests using the correct API style and request schema.
- **FR-CS-03 (Must)**: The chat response must stream incrementally back to the UI.
- **FR-CS-04 (Must)**: The system must expose enough diagnostics to tell whether failure is in the UI, backend, or provider.
- **FR-CS-05 (Must)**: Root development commands must reliably start the services required for chat work.
- **FR-CS-06 (Should)**: The backend should expose a lightweight heartbeat endpoint that is cheap to call and clearly distinguishes process liveness from deeper provider-health checks.

## Non-Functional Requirements
- **NFR-CS-01 (Must)**: Provider-specific secrets and transport details must stay out of the browser.
- **NFR-CS-02 (Must)**: The backend stream contract should stay stable even if the provider event shape evolves.
- **NFR-CS-03 (Must)**: The stabilization path must preserve the SDK as the long-term shared runtime/core layer.
- **NFR-CS-04 (Must)**: Regression coverage must include real failure modes seen during manual testing.
- **NFR-CS-05 (Should)**: Heartbeat responses should remain stable, small, and dependency-light so they can be reused by local tooling, operators, and future uptime monitors.
