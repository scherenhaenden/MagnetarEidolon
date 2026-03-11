# MagnetarEidolon Architecture

## Guiding Principle
The architecture prioritizes three properties: **human control**, **full traceability**, and **multi-surface operation (UI + CLI)**.

## High-Level View
```text
+-----------------------------+
| UX Layer                    |
| Dashboard / Live / Builder  |
+-------------+---------------+
              |
              v
+-----------------------------+
| Orchestrator / Agent Core   |
| plan -> decide -> act       |
+------+------+---------------+
       |      |
       |      +-------------------+
       |                          |
       v                          v
+-------------+          +-------------------+
| Policy Gate |          | Observability Hub |
| risk/approve|          | logs/traces/replay|
+------+------+          +---------+---------+
       |                           |
       v                           v
+-----------------------------+
| SDK / Runtime Contract      |
| run/status/approve/deny/... |
+--------------+--------------+
               |
      +--------+--------+
      |                 |
      v                 v
+---------------+  +----------------+
| CLI Interface |  | UI Integrations|
+---------------+  +----------------+
```

## Key Components
- **UX Layer**: primary interface for onboarding, execution, and debugging.
- **Agent Core**: executes goals step by step and updates serializable cognitive state.
- **Policy Gate**: decides when approval is required and applies risk rules.
- **Observability Hub**: captures events, decisions, costs, and auditable evidence.
- **Tool Runtime**: cross-platform adapters for filesystem, shell, web, and connectors.
- **SDK / Runtime Contract**: reusable layer with execution operations such as `run`, `status`, `approve`, `deny`, `logs`, and `trace`.
- **Memory System**: immediate context plus persistent memory for reusable learning.
- **CLI Interface**: official console and automation channel, plus the no-UI fallback.

## Design Decisions
1. UI and CLI share the same execution contract and state semantics through the SDK.
2. The CLI is an SDK client, not a parallel implementation of the core.
3. Destructive actions never bypass the `Policy Gate`.
4. Every agent decision is reproducible through `Trace/Replay`.
5. Agent memory must always be inspectable by the user.

## Target Repository Structure
- `apps/magnetar-ui`: product shell for Dashboard, Live Execution, Builder, Memory, and Policy Center.
- `packages/magnetar-sdk`: shared contract/runtime for state, agent logic, tools, and operations consumed by UI and CLI.
- `src/magnetar`: legacy Python baseline while the TypeScript transition is being validated.
- `.github/workflows`: separate pipelines for legacy Python, TypeScript UI, and packaging/release.

## Active Transition Decision
- The temporary directory `typescript-angular-skeleton` no longer represents the desired architectural destination.
- The UI must live under an explicit product structure (`apps/magnetar-ui`) so a prototype name does not shape the long-term architecture.
- Shared runtime extraction into `packages/magnetar-sdk` is underway to clearly separate the product UI from the reusable runtime contract.
