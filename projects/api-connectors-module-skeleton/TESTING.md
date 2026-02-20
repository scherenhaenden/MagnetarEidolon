# Testing Strategy for API Connectors Module Skeleton

## Types of Tests
- **Unit tests** for connector contracts, HTTP abstraction behavior, and adapter translation logic.
- **Integration-style mocked tests** for adapter + HTTP interactions using `httpx.MockTransport`.
- **End-to-end smoke tests (future)** against running local providers (Ollama/OpenAI-compatible server).

## Current Automated Coverage Focus
- OpenAI-compatible successful generation path.
- Ollama successful generation path.
- Authentication/status error normalization path.

## Code Coverage
Target at least **80%** automated coverage for module logic and critical contracts.

## Local Commands
- `pytest tests/test_api_connectors.py`

## Bug Reporting Process
1. Create a bug entry with reproduction steps and expected/actual results.
2. Link affected task IDs and milestone.
3. Track remediation progress in `PLAN.md` and `BITACORA.md`.
4. Close only after tests validate the fix.
