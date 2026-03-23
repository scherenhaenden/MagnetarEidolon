# Observability and Replay Requirements

## Context

The system must satisfy "Full observability across plans, steps, and outcomes" as defined in `NEW_PLAN.md` and `REQUIREMENTS.md`.

## User Stories

*   **As a user,** I want to see a step-by-step history of what the agent did during an execution so I can understand its reasoning and actions.
*   **As a developer,** I need to be able to inspect the agent's internal state and the specific inputs/outputs of tools and the LLM at each step for debugging purposes.

## Functional Requirements

*   **FR-OBS-01:** The system must record a discrete event for every significant state change or action taken by the `MagnetarAgent` during a `step()`.
*   **FR-OBS-02:** Events must be categorized (e.g., Observation, Thought, Action, Reflection).
*   **FR-OBS-03:** Each event must contain a timestamp, the type of event, and the relevant data (e.g., the prompt sent to the LLM, the parsed action, the tool arguments, the tool result/error).
*   **FR-OBS-04:** The system must provide a mechanism (e.g., a `TraceStore` interface) to collect and store these events during an execution.
*   **FR-OBS-05:** The collected trace must be accessible to the UI and CLI for display.

## Non-Functional Requirements

*   **NFR-OBS-01 (Performance):** Recording trace events must have minimal overhead on the agent's execution speed.
*   **NFR-OBS-02 (Storage):** The trace store should be efficient and avoid storing redundant or unnecessarily large data (e.g., full state snapshots at every micro-step if not needed).
