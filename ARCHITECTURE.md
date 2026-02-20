# Architecture of MagnetarEidolon

## High-Level Diagram
```text
+-------------------------+
| Markdown Governance     |
| (RULES/PLAN/STATUS/...) |
+-----------+-------------+
            |
            v
+-------------------------+
| MagnetarEidolon State   |
| (Pydantic cognition)    |
+-----------+-------------+
            |
            v
+-------------------------+
| MagnetarAgent Core      |
| (reasoning + loop)      |
+----+--------------+-----+
     |              |
     v              v
+---------+    +----------------+
| Tools   |    | Model Provider |
| (OS/Web)|    | LiteLLM/Ollama |
+----+----+    +--------+-------+
     |                  |
     v                  v
+-------------------------------+
| Environment + Memory (Chroma) |
+-------------------------------+
```

## Components
- **Markdown Governance Layer:** Canonical rules, planning, and operating constraints (`RULES.md`, `PLAN.md`, `WIP_GUIDELINES.md`, etc.).
- **MagnetarEidolon Cognition Model:** Structured, serializable state container (goal, memory, plans, tool history, metadata), implemented with Pydantic.
- **MagnetarAgent Core:** Stateless reasoning/execution loop that reads and updates MagnetarEidolon at each step.
- **Tool Layer:** Abstracted OS and internet capabilities (filesystem, subprocess, HTTP, parsing).
- **Model Provider Layer:** Unified LLM access through LiteLLM; local-first support via Ollama.
- **Memory Layer:** Short-term memory in state + long-term semantic memory in ChromaDB.
- **Persistence & Logging:** JSON-serializable state checkpoints and structured logs for replay/debugging.

## Key Design Decisions
- Keep cognition state externalized and portable.
- Keep execution logic model-agnostic and cross-platform.
- Keep behavior and policy editable in Markdown, independent from code.
- Keep governance artifacts aligned with machine-readable project YAML.

## Technologies
- Python 3.x
- Pydantic
- LiteLLM + Ollama
- pathlib/os/subprocess/platform (+ optional psutil)
- httpx/requests + BeautifulSoup + Trafilatura
- ChromaDB
- Typer
- logging or Loguru
