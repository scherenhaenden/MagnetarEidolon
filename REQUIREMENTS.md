# Requirements for MagnetarEidolon

## Introduction
This document defines the requirements for both the MagnetarEidolon project and the Canonical Project Model it follows. This ensures alignment with the Magnetar Canonical Architecture and Technology Stack, as well as the governance and documentation standards.

## Canonical Project Model Requirements

### Functional Requirements

#### Must-Have
- Define a canonical project governance and execution documentation set.
- Provide explicit milestone/task planning with allowed lifecycle states.
- Provide immutable operational logbook semantics via `BITACORA.md`.
- Provide blocker tracking and escalation workflow.
- Provide machine-readable project schema template under `projects/`.

#### Should-Have
- Include architecture guidance tied to Magnetar cognition/runtime separation.
- Include AI collaborator workflow guidance and compliance checks.
- Include test strategy with acceptance criteria and reporting cadence.

#### Could-Have
- Add CI validation for required file presence and YAML schema checks.
- Add optional dashboards to visualize status and blocker trends.

#### Won't-Have (for initial baseline)
- Full runtime implementation of Magnetar agent core in this phase.
- Provider-specific production deployment automation.

### Non-Functional Requirements

#### Must-Have
- Documentation must be version-controlled and human-readable.
- Task states and governance semantics must be deterministic and consistent.
- All required canonical files must exist at repository root (plus `projects/`).

#### Should-Have
- Content should be parseable by AI tools and automation scripts.
- Governance rules should be auditable through chronological logs.

#### Could-Have
- Add linting rules for Markdown table consistency.
- Add machine validation for task state transitions.

#### Won't-Have (for initial baseline)
- Complex enterprise workflow engines or external PM integrations.


## MagnetarEidolon Application Requirements

### Functional Requirements

#### Core Reasoning & State
- **FR-01: Cognition Separation (Must-Have)**: The system must strictly separate the agent's cognition state (`MagnetarModel`) from its execution logic (`Agent Core`).
- **FR-02: Serialization (Must-Have)**: The entire cognition state must be serializable to JSON to support persistence, pause/resume, and analysis.
- **FR-03: Rule Loading (Must-Have)**: The agent must load behavioral rules, constraints, and knowledge from Markdown files at runtime.

#### Tool System
- **FR-04: Tool Abstraction (Must-Have)**: The system must provide an abstract interface for tools that hides OS-specific implementation details.
- **FR-05: Cross-OS Support (Must-Have)**: The agent must operate uniformly on Linux, macOS, and Windows using platform-specific adapters for filesystem and shell operations.
- **FR-06: Knowledge Acquisition (Should-Have)**: The system must support tools for HTTP requests and web content extraction.

#### Memory & Learning
- **FR-07: Long-Term Memory (Must-Have)**: The agent must store and retrieve semantic information using vector embeddings.
- **FR-08: Short-Term Context (Must-Have)**: The agent must maintain a sliding window or summary of the immediate conversation history within the `MagnetarModel`.

#### Interface
- **FR-09: CLI (Must-Have)**: The system must provide a command-line interface for initiating tasks and observing progress.
- **FR-10: Logging (Must-Have)**: The system must log all prompts, tool calls, and state transitions in a structured format.

### Non-Functional Requirements

#### Technology Stack
- **NFR-01: Language (Must-Have)**: The implementation must use Python as the core language.
- **NFR-02: Data Validation (Must-Have)**: The `MagnetarModel` must be implemented using Pydantic for strict typing and validation.
- **NFR-03: Model Agnosticism (Must-Have)**: The system must use `LiteLLM` to support both local (Ollama) and cloud (OpenAI, Anthropic) models.
- **NFR-04: Vector Store (Must-Have)**: The system must use `ChromaDB` for local, offline-capable vector storage.

#### Quality & Performance
- **NFR-05: Portability (Must-Have)**: The codebase must not depend on OS-specific binaries or paths without fallback or abstraction.
- **NFR-06: Modularity (Should-Have)**: Components (memory, tools, models) should be loosely coupled to allow for easy replacement or extension.
- **NFR-07: Safety (Must-Have)**: The agent must respect safety constraints defined in Markdown rules (e.g., path restrictions, command validation).
