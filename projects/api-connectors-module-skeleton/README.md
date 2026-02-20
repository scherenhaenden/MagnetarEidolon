# Canonical Project Model of API Connectors Module Skeleton

## Purpose
API Connectors Module Skeleton provides a reusable, provider-agnostic connector layer for remote/local LLM APIs, with unified request/response contracts and governance-aligned delivery.

## Implemented Module Scope
The following artifacts are now implemented in the codebase:

- `src/magnetar/api_connectors/contracts.py`
  - Canonical `GenerationRequest`, `GenerationResponse`, and `ConnectorError`.
- `src/magnetar/api_connectors/auth.py`
  - Pluggable auth strategies (`BearerTokenAuth`, `ApiKeyAuth`).
- `src/magnetar/api_connectors/http_client.py`
  - JSON HTTP client wrapper with timeout/status/network error normalization.
- `src/magnetar/api_connectors/adapters.py`
  - `OpenAICompatibleAdapter` and `OllamaAdapter`.
- `tests/test_api_connectors.py`
  - Mocked connector test harness for success/error scenarios.

## Quick Usage Example
```python
from magnetar.api_connectors import (
    ApiHttpClient,
    BearerTokenAuth,
    GenerationRequest,
    OpenAICompatibleAdapter,
)

client = ApiHttpClient(
    base_url="http://localhost:8000",
    auth=BearerTokenAuth("my-token"),
)
adapter = OpenAICompatibleAdapter(client)

response = adapter.generate(
    GenerationRequest(
        model="gpt-local",
        messages=[{"role": "user", "content": "Hello"}],
    )
)

if response.ok:
    print(response.content)
else:
    print(response.error)
```

## Progress Model Overview
Progress is tracked across milestones and task states using this lifecycle:
`planned` → `ready` → `in_progress` → `in_review` → `done`.
All state changes must be recorded in `BITACORA.md`.

## Guidance for AI Collaborators
AI collaborators must:
- Parse `projects/api-connectors-module-skeleton.project.yml`.
- Use `PLAN.md` and `STATUS.md` to determine focus.
- Respect `RULES.md`, `WIP_GUIDELINES.md`, and `BRANCHING_MODEL.md`.
- Update `BITACORA.md` when changing state, scope, or key implementation decisions.
