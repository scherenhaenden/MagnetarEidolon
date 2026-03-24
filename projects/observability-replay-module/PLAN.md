# PLAN — Observability and Replay

## Objective
Establish the technical foundation for execution tracing and replay functionality, as requested in `ms-13` (Observability & Replay) and the user task.

## Approach
Implement an Event-Sourced State Logging PoC within the `magnetar-sdk`.

## Milestone `ms-obs-01`: Observability PoC

### Tasks

| ID | Title | Status |
| :--- | :--- | :--- |
| `task-obs-101` | Define Trace Event Models | done |
| `task-obs-102` | Instrument MagnetarAgent | done |
| `task-obs-103` | Implement In-Memory Trace Store | done |

## Completion Note
- 2026-03-24: `task-obs-101`, `task-obs-102`, and `task-obs-103` are implemented in the current PoC branch via the SDK trace-event types, `MagnetarAgent` tracing hooks, and `InMemoryTraceStore`.

## Detailed Implementation Steps

1.  **Define Models (`packages/magnetar-sdk/src/interfaces.ts`):**
    *   Create interfaces representing an `Event` or `TraceLog`.
    *   Include properties like `timestamp`, `phase` ('observe', 'think', 'act', 'reflect'), and `data` (payload containing the relevant information).

2.  **Instrument Agent (`packages/magnetar-sdk/src/agent.ts`):**
    *   Inject an `EventStore` or similar mechanism into `MagnetarAgent`.
    *   In the `step()` function (or its sub-methods), dispatch an event with the relevant context data before and/or after each key action.

3.  **Implement Store (`packages/magnetar-sdk/src/services` or similar):**
    *   Create a simple in-memory implementation of the `EventStore` that holds an array of events for a given run session.
    *   Expose methods to retrieve the trace (e.g., `getTrace()`).
