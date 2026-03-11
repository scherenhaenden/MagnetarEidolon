# MagnetarEidolon Requirements

## Product Goal
Build an agent platform that combines operational power with explicit human control, grounded in simplicity of use, trust, and full observability.

## Functional Requirements (FR)

### Experience and Flow
- **FR-01 (Must)**: The ideal onboarding flow must cover trust mode, tool enablement, context loading, goal definition, planning, and approvals.
- **FR-02 (Must)**: The UI must expose Dashboard, Live Execution, Tool Catalog, Memory Inspector, Trace/Replay, and Policy Center.
- **FR-03 (Should)**: A Recipe Builder should exist for reusable flows.
- **FR-03a (Must)**: The product must expose an in-app chat surface for testing providers and for direct task-oriented user interaction.

### Trust and Policies
- **FR-04 (Must)**: Every impactful action must be classified by risk level.
- **FR-05 (Must)**: Write and modification operations require approval by default.
- **FR-06 (Must)**: Destructive actions require double confirmation or prior simulation.
- **FR-07 (Must)**: Every sensitive action must leave auditable evidence.
- **FR-08 (Must)**: Every imported recipe starts disabled and must pass a permission review.

### Agent Engine and Memory
- **FR-09 (Must)**: Maintain strict separation between serializable cognitive state and the execution loop.
- **FR-10 (Must)**: Short-term and long-term memory must be visible and manageable (view, pin, delete).
- **FR-11 (Should)**: Rules and policies should be editable from Markdown and version control.

### Interfaces
- **FR-12 (Must)**: There must be a **console CLI** for executing goals, observing progress, approving or denying actions, and consulting traces.
- **FR-13 (Must)**: CLI and UI must share the same state and event semantics.
- **FR-14 (Must)**: There must be an **SDK/runtime contract** consumable by both CLI and UI to avoid logic duplication.
- **FR-15 (Should)**: The SDK should expose high-level commands and operations such as `run`, `status`, `approve`, `deny`, `logs`, and `trace`.
- **FR-16 (Must)**: The provider layer must support at least one concrete local AI provider, with LM Studio as the first planned integration target.
- **FR-17 (Must)**: Provider configuration and health status must be visible to the UI and testable through the in-app chat surface.

## Non-Functional Requirements (NFR)
- **NFR-01 (Must)**: Linux/macOS/Windows portability.
- **NFR-02 (Must)**: Structured observability (logs/events/replay) for auditing and debugging.
- **NFR-03 (Must)**: Secure-by-default behavior centered on trust by design.
- **NFR-04 (Must)**: Latency and perceived complexity must allow first value in under 15 minutes.
- **NFR-05 (Should)**: Modular architecture that allows changing model providers and tool adapters without rewriting the system.
- **NFR-06 (Must)**: Reasonable backward compatibility of the SDK contract across minor versions.
- **NFR-07 (Must)**: Provider integrations must remain modular so LM Studio and future providers can be added or removed without coupling them to the chat UI module.

## Acceptance Criteria
1. The user understands what the agent will do before executing risky actions.
2. The user can reconstruct both the "what" and the "why" of a full execution.
3. The system can be operated from the UI or the **CLI** without losing governance.
4. The same flow is executable through the SDK without changing policy or event semantics.
