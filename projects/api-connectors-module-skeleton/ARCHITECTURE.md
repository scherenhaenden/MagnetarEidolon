# Architecture of API Connectors Module Skeleton

## High-Level Diagram
```text
[Clients / Integrations]
          |
          v
 [GenerationRequest / Response Contract]
          |
          v
      [Connector Adapters]
      /                 \
     v                   v
[OpenAI-Compatible]   [Ollama]
          \           /
           v         v
         [ApiHttpClient]
              |
              v
     [AuthStrategy + Error Mapping]
```

## Component Descriptions
- **Contract Layer (`contracts.py`)**: Defines portable request, response, and normalized error models used by all adapters.
- **HTTP Layer (`http_client.py`)**: Provides timeout-aware JSON POST behavior, provider-agnostic auth header injection, and status-to-error normalization.
- **Auth Layer (`auth.py`)**: Encapsulates auth header generation (`BearerTokenAuth`, `ApiKeyAuth`) behind a shared `AuthStrategy` contract.
- **Adapter Layer (`adapters.py`)**: Implements provider translations:
  - `OpenAICompatibleAdapter` → `/v1/chat/completions`
  - `OllamaAdapter` → `/api/generate`
- **Test Harness (`tests/test_api_connectors.py`)**: Uses `httpx.MockTransport` to validate contract compliance and error behavior without external network calls.

## Design Notes
- Provider-specific payloads are translated at the adapter boundary; clients only handle canonical models.
- Transport-level failures are wrapped as `ConnectorError` instances to keep failures deterministic and testable.
- The current implementation intentionally focuses on synchronous request/response flows for skeleton scope.
