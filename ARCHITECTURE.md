# Architecture of MagnetarEidolon

## Introduction
This document describes the high-level structure of the MagnetarEidolon system, its components, and key design decisions. The architecture emphasizes a clear separation between cognition state and execution logic to enable portability and persistence.

## Architecture Overview

The system is composed of the following key layers:

1.  **Agent Core (Reasoning Engine)**: The stateless execution logic.
2.  **MagnetarModel (Cognition State)**: The serializable data structure holding the agent's state.
3.  **Tool System (Action Layer)**: The interface for interacting with the environment.
4.  **Memory System**: The storage for short-term and long-term knowledge.
5.  **Model Provider Layer**: The abstraction for LLM backends.

## Component Descriptions

### 1. Agent Core (Reasoning Engine)
- **Responsibility**: Interprets the goal, consults rules, decides actions, invokes tools, and updates the `MagnetarModel`.
- **Implementation**: A Python loop that takes the current `MagnetarModel` and advances it to the next state. It is stateless between steps.

### 2. MagnetarModel (Cognition State)
- **Responsibility**: structured container for:
    - Goal and Plan
    - Message History
    - Memory Items
    - Tool Usage History
    - Environment Snapshot
- **Implementation**: A Pydantic model (`MagnetarEidolon`) that can be serialized to JSON.

### 3. Tool System (Action Layer)
- **Responsibility**: Provides capabilities like filesystem access, shell execution, and web requests.
- **Implementation**: Abstract base classes with concrete implementations for Linux, macOS, and Windows. Uses Python standard library (`pathlib`, `shutil`, `subprocess`).

### 4. Memory System
- **Responsibility**:
    - **Short-Term**: Maintains immediate context within `MagnetarModel`.
    - **Long-Term**: Stores learned facts and historical outcomes using embeddings.
- **Implementation**: `ChromaDB` for local vector storage.

### 5. Model Provider Layer
- **Responsibility**: Abstracts LLM backends to allow switching between local and cloud models.
- **Implementation**: Uses `LiteLLM` to interface with OpenAI, Anthropic, Ollama, etc.

### 6. Markdown Rule System
- **Responsibility**: Defines agent behavior, constraints, and domain knowledge in human-readable files.
- **Implementation**: Files loaded at runtime and injected into the reasoning context.

## Design Decisions

- **Python-First**: Chosen for its rich AI ecosystem and cross-platform capabilities.
- **Pydantic for State**: Ensures strict typing and validation for the complex agent state.
- **Local-First Memory**: `ChromaDB` allows offline operation and privacy.
- **Model Agnosticism**: `LiteLLM` prevents vendor lock-in.
