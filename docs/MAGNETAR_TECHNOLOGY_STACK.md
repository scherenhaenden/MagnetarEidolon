# Magnetar Technology Stack

## Introduction

This document defines the concrete technology choices for implementing the Magnetar architecture. Magnetar is conceived as a cross-OS autonomous agent framework centered on a structured cognition state (MagnetarEidolon) and a reasoning engine (MagnetarAgent). The system must integrate local and remote language models, operating-system tools, persistent memory, and Markdown-defined behavioral rules while remaining portable across Linux, macOS, and Windows.

After evaluating multiple languages and ecosystems, Python has been selected as the core implementation language due to its dominant AI tooling ecosystem, native OS automation capabilities, mature packaging model, and rapid iteration characteristics. The following sections describe the full technology stack and its rationale.

---

## Core Language and Runtime

### Python as the Magnetar Core

Python provides the most complete environment for AI orchestration systems. It offers first-class support for local and remote LLM integration, filesystem and process control, networking, data serialization, and cross-platform execution. Because Magnetar's workload is dominated by model calls and I/O rather than CPU-bound computation, Python's performance characteristics are more than sufficient while offering far greater development velocity than compiled alternatives.

Python therefore hosts all primary Magnetar layers, including the cognition model, agent loop, tool system, memory integration, and rule loading pipeline. The architecture remains open to future hybrid extensions, but the authoritative logic resides in Python.

---

## Cognition Model Implementation

### MagnetarEidolon with Pydantic

MagnetarEidolon represents the structured cognition state of the agent. It must support typed fields, validation, serialization, schema evolution, and persistence. The Pydantic library provides these capabilities while remaining lightweight and widely adopted in modern AI systems.

Using Pydantic ensures that MagnetarEidolon instances can be serialized to JSON, validated on load, versioned across schema changes, and inspected during debugging or replay. This enables persistent agents and transferable cognition states across environments.

---

## Language Model Integration

### Unified LLM Provider via LiteLLM

Magnetar must remain model-agnostic and support both local and cloud models. The LiteLLM library offers a unified interface over multiple providers including OpenAI APIs and local engines such as Ollama. This abstraction allows MagnetarAgent to request generations without coupling to a specific backend.

Local inference is expected to occur primarily through Ollama, which provides a stable runtime for GGUF and other local models across operating systems. The combination of LiteLLM and Ollama ensures flexible deployment from offline machines to cloud-connected systems.

---

## Tool and OS Integration Layer

### Native OS Control with Python Standard Library

Magnetar tools interact with the operating system through Python's standard modules such as `pathlib` for filesystem paths, `os` and `shutil` for file operations, and `subprocess` for command execution. These modules are portable and stable across platforms, enabling a uniform abstraction layer above them.

Platform detection via the `platform` module allows Magnetar to select OS-specific adapters when necessary while exposing consistent capabilities to the agent. Optional utilities such as `psutil` provide process inspection and environment information where deeper introspection is required.

---

## Memory and Vector Storage

### Persistent Agent Memory with ChromaDB

Magnetar agents require long-term semantic memory for facts, observations, and learned knowledge. ChromaDB offers a lightweight local vector database that operates offline and integrates cleanly with Python embeddings workflows. It supports embedding storage, similarity search, and incremental updates without requiring external infrastructure.

ChromaDB therefore serves as the default long-term memory backend for Magnetar, while short-term memory remains embedded in the MagnetarEidolon state.

---

## Internet and Knowledge Acquisition

### HTTP and Content Extraction Stack

Agents frequently need to retrieve and interpret web content. Magnetar uses `httpx` or `requests` for HTTP communication, BeautifulSoup for structural parsing, and Trafilatura for high-quality text extraction from web pages. This combination enables robust acquisition of textual knowledge suitable for embedding and reasoning.

These libraries operate consistently across operating systems and require minimal configuration, aligning with Magnetar's portability goals.

---

## Markdown Rule and Knowledge System

### Rule Loading via File System and Markdown Text

Agent behavior, safety constraints, and domain knowledge are defined in Markdown files stored in agent configuration directories. Magnetar loads these files using `pathlib` and injects their contents into the reasoning context at runtime. Optional metadata extraction may be supported via frontmatter parsing if structured annotations are desired.

This design keeps agent policies editable, version-controlled, and separable from code while remaining fully compatible with Python's text handling capabilities.

---

## Agent Execution Interface

### Command-Line Interface with Typer

Magnetar requires a primary user interface for initiating tasks and observing progress. The Typer library provides a modern command-line framework built on Python type hints. It enables intuitive commands, argument parsing, and help generation while remaining lightweight.

The CLI serves as the primary interaction surface during early development and can later coexist with graphical or web interfaces without altering the core agent architecture.

---

## Logging, Tracing, and Evaluation

### Structured Logging with Loguru\n\nAgent transparency and debugging require persistent traces of prompts, decisions, tool calls, and state transitions. The Loguru library provides structured logging across platforms. Logs may be stored in text or JSON formats for replay and evaluation.

Because MagnetarEidolon is serializable, logs can reference exact cognition states, enabling deterministic replay of agent behavior for analysis and refinement.

---

## Packaging and Distribution

### Cross-Platform Packaging with Pyproject

Magnetar is distributed as a Python package defined in `pyproject.toml`. Entry points expose CLI commands, while dependencies specify optional components such as memory or web tools. This packaging model supports installation via `pip` across Linux, macOS, and Windows.

The package structure isolates platform adapters and ensures that Magnetar installs cleanly in virtual environments or system interpreters without OS-specific installers.

---

## Optional Interface Extensions

### Web or Desktop Interfaces

While not required for the core architecture, Magnetar may expose a monitoring or control interface. FastAPI provides a minimal Python web backend for state inspection and task submission, while terminal-based interfaces may be implemented using Textual. These layers remain optional and external to the agent core.

---

## Hybrid Extension Path

### Future Rust or Native Components

Although Python is the primary implementation language, the architecture allows future native extensions for performance-critical operations. Rust or C++ modules may implement specialized runtime services while exposing Python bindings. This hybrid approach preserves Python's orchestration advantages while enabling low-level optimization if required.

---

## Technology Summary

Magnetar's technology stack is intentionally minimal, portable, and aligned with modern AI agent systems. Python hosts cognition, reasoning, tools, memory integration, and rule loading. LiteLLM and Ollama provide model abstraction and local inference. Pydantic structures agent state. ChromaDB enables semantic memory. Standard Python modules provide OS control. Typer supplies the CLI interface, and logging ensures traceability.

Together these technologies form a coherent and extensible foundation for implementing the MagnetarEidolon architecture across operating systems.
