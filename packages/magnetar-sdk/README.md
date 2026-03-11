# Magnetar SDK Package

This package contains the shared TypeScript runtime contract for MagnetarEidolon.

## Scope
- Agent loop runtime
- Shared state and interface models
- Provider adapters behind the shared runtime contract
- Environment-specific tool adapters that belong to the reusable runtime layer

## Non-scope
- Product UI composition
- Product-specific descriptors and presentation concerns

The current extraction keeps the package source-local and workspace-internal while the architecture settles.

## LM Studio Provider
The package now includes a first concrete local-provider adapter at `@magnetar/magnetar-sdk/providers/lm-studio`.

Current baseline:
- OpenAI-compatible LM Studio base URL support (`http://localhost:1234/v1` by default)
- `GET /models` discovery
- `POST /chat/completions` generation
- healthcheck helper for UI/CLI integration

This adapter is intentionally SDK-level and does not depend on Angular UI code.
