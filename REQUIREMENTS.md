# Requirements for MagnetarEidolon

## Introduction
This document defines the functional and non-functional requirements for the MagnetarEidolon project, ensuring alignment with the Magnetar Canonical Architecture and Technology Stack.

## Functional Requirements

### Core Reasoning & State
- **FR-01: Cognition Separation (Must-Have)**: The system must strictly separate the agent's cognition state (`MagnetarModel`) from its execution logic (`Agent Core`).
- **FR-02: Serialization (Must-Have)**: The entire cognition state must be serializable to JSON to support persistence, pause/resume, and analysis.
- **FR-03: Rule Loading (Must-Have)**: The agent must load behavioral rules, constraints, and knowledge from Markdown files at runtime.

### Tool System
- **FR-04: Tool Abstraction (Must-Have)**: The system must provide an abstract interface for tools that hides OS-specific implementation details.
- **FR-05: Cross-OS Support (Must-Have)**: The agent must operate uniformly on Linux, macOS, and Windows using platform-specific adapters for filesystem and shell operations.
- **FR-06: Knowledge Acquisition (Should-Have)**: The system must support tools for HTTP requests and web content extraction.

### Memory & Learning
- **FR-07: Long-Term Memory (Must-Have)**: The agent must store and retrieve semantic information using vector embeddings.
- **FR-08: Short-Term Context (Must-Have)**: The agent must maintain a sliding window or summary of the immediate conversation history within the `MagnetarModel`.

### Interface
- **FR-09: CLI (Must-Have)**: The system must provide a command-line interface for initiating tasks and observing progress.
- **FR-10: Logging (Must-Have)**: The system must log all prompts, tool calls, and state transitions in a structured format.

## Non-Functional Requirements

### Technology Stack
- **NFR-01: Language (Must-Have)**: The implementation must use Python as the core language.
- **NFR-02: Data Validation (Must-Have)**: The `MagnetarModel` must be implemented using Pydantic for strict typing and validation.
- **NFR-03: Model Agnosticism (Must-Have)**: The system must use `LiteLLM` to support both local (Ollama) and cloud (OpenAI, Anthropic) models.
- **NFR-04: Vector Store (Must-Have)**: The system must use `ChromaDB` for local, offline-capable vector storage.

### Quality & Performance
- **NFR-05: Portability (Must-Have)**: The codebase must not depend on OS-specific binaries or paths without fallback or abstraction.
- **NFR-06: Modularity (Should-Have)**: Components (memory, tools, models) should be loosely coupled to allow for easy replacement or extension.
- **NFR-07: Safety (Must-Have)**: The agent must respect safety constraints defined in Markdown rules (e.g., path restrictions, command validation).
