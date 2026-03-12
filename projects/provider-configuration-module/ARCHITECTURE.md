# Provider Configuration Module Architecture

## Goal
Maintain a dedicated provider-configuration architecture that separates:

- UI-owned provider selection and failover intent
- backend-owned provider execution metadata
- backend-owned provider secrets and runtime overrides

The module must define how provider identity moves from the UI into the backend without forcing a backend rewrite every time a new provider is added.

## Target Shape
```text
[Provider Configuration UI]
            |
            v
[Provider Config State/Store]
            |
            v
[Runtime Handoff Contract]
            |
            v
[Backend Provider Registry]
            |
            v
[Generic Provider Transport]
            |
            v
[SDK Provider Adapters / Normalizers]
```

## Design Rules
1. Provider configuration must remain separate from provider transport implementations.
2. The configuration layer must allow multiple providers at once.
3. There must always be either one primary provider or a clearly invalid state surfaced to the UI.
4. Backup providers must preserve ordering for failover.
5. The browser must not be the authoritative owner of provider API keys.
6. The backend must resolve provider execution behavior from definitions/configuration wherever possible.
7. New providers should default to registry/config onboarding instead of handwritten backend rewrites.
8. Provider-specific custom code is allowed only when a provider cannot fit the shared execution contract.

## Ownership Boundaries

### UI-Owned
- provider identity
- provider role (`primary`, `backup`, `disabled`)
- failover ordering
- user-visible labels and health summaries
- optional non-secret user routing choices
- editable provider entries created from known presets
- provider template and placeholder inspection state
- local draft values for configuration forms until backend sync is fully implemented

### Backend-Owned
- provider base URLs used for real execution
- API keys and secret headers
- endpoint paths
- auth strategy
- request format
- response normalizer selection
- runtime overrides from env/local config

## Target Execution Path
1. The UI selects a provider id and optional non-secret overrides.
2. The backend resolves that provider through a registry.
3. The backend loads secret/runtime configuration for that provider.
4. A shared transport layer constructs the real provider request.
5. The backend normalizes provider output into the Magnetar chat/runtime contract.

## First Validation Target
OpenRouter should be used as the first proof that:

- the backend can onboard a new provider mostly through configuration
- the browser does not need to own the real API key
- the provider path can stay aligned with the existing BFF boundary
