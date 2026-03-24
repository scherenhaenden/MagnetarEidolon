# Observability and Replay Module

## Core Concepts
This document outlines the Proof of Concept (PoC) for the Observability and Replay module. The goal of this module is to achieve "Full observability across plans, steps, and outcomes," as outlined in `NEW_PLAN.md` and `REQUIREMENTS.md` (FR-07, NFR-02). It is crucial for debugging, auditing, and building trust.

### Options Considered
1. **Event-Sourced State Logging (Chosen Approach):**
   - **How it works:** Record every significant state change (observation, thought, action, reflection) as an immutable event. The `MagnetarEidolon` state is the central source of truth. At each step, a snapshot or a diff of the state (or specific parts like `toolHistory`, `shortTermMemory`) is stored.
   - **Pros:** Directly maps to the agent's cognitive loop (Observe -> Think -> Act -> Reflect). Allows for perfect reconstruction of the agent's state at any point in time. Easier to implement a "replay" feature by sequentially applying events to an initial state.
   - **Cons:** Can generate a large volume of data if not carefully managed (e.g., storing full state snapshots every step).

2. **Standard Application Logging (e.g., Winston, Pino):**
   - **How it works:** Use a traditional logging library to output structured logs (JSON) for key events.
   - **Pros:** Very easy to integrate. Good for general debugging.
   - **Cons:** Harder to use for a robust "replay" feature in the UI. Logs are disjointed from the structured state model (`MagnetarEidolon`), requiring parsing to reconstruct the execution flow visually.

3. **External Tracing Systems (e.g., OpenTelemetry, Jaeger):**
   - **How it works:** Instrument the code to emit spans and traces to an external observability backend.
   - **Pros:** Excellent for performance monitoring and distributed tracing across microservices (Backend -> Provider).
   - **Cons:** Overkill for the core requirement of "what did the agent think and do" in a local/UI context. Too complex for a simple MVP setup.

### The Chosen Path: Event-Sourced State Logging (PoC)
The most valuable observability for an autonomous agent is **cognitive observability**: understanding *why* it made a decision and *what* it saw when it made that decision.

Therefore, we will implement an **Execution Tracer** within `packages/magnetar-sdk`.

#### Implementation Details (PoC):
1.  **Define Trace Models:** Create interfaces for `TraceEvent` (Observation, Thought, Action, Reflection) and `ExecutionTrace` (a collection of events for a specific run).
2.  **Instrument `MagnetarAgent`:** Modify `agent.ts` to emit `TraceEvent`s at each phase of the `step()` loop.
3.  **In-Memory Storage (for PoC):** Create a simple `TraceStore` to hold the events during an execution.
4.  **Integration:** The UI/CLI can query this `TraceStore` to display a step-by-step replay of the execution.

This approach directly satisfies the requirements for auditing, debugging, and the foundation for a visual Replay UI.
