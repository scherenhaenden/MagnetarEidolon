# Config-Driven Provider Backend

## Purpose
This document defines the intended backend architecture for provider execution and secret handling in MagnetarEidolon.

The immediate trigger is OpenRouter, but the design is intentionally broader: adding a new provider should not require rewriting the backend transport path each time.

## Problem
The current backend/provider path is too close to a provider-specific implementation model:

- the backend knows too much about a specific provider request shape
- provider HTTP details are partially embedded in code paths instead of resolved from configuration
- API keys risk becoming ad hoc values passed around UI state or request payloads
- every new provider threatens to become another hardcoded transport branch

That model does not scale well to OpenRouter, future cloud providers, or mixed local/cloud routing.

## Architectural Direction
The backend should become a configuration-driven provider execution layer.

That means:

1. The UI selects provider identity and user-visible options.
2. The backend resolves the selected provider from a backend-owned registry.
3. The backend loads secrets from backend configuration, not from browser state.
4. The backend executes provider requests through a generic transport pipeline driven by provider definitions.
5. The backend normalizes provider responses back into the product's internal contract.

The goal is not to eliminate all provider-specific code. The goal is to make provider-specific code the exception, not the default.

## Design Principles

### 1. Backend Owns Secrets
Provider API keys and other sensitive configuration must stay on the backend side.

The browser must not become the authoritative holder of:

- API keys
- auth headers
- provider host routing rules
- provider-specific endpoint semantics

This is already aligned with:

- `FR-22`: browser-facing provider traffic must go through the backend/BFF
- `NFR-12`: secrets and provider-specific HTTP contracts must stay on the backend side

### 2. Config Drives Transport
The backend should know how to call a provider because the provider definition tells it how, not because every provider gets a handwritten transport path.

### 3. Provider Addition Should Be Cheap
Adding a provider should ideally mean:

- add a provider definition
- add secret/config entries
- add normalization only if the provider genuinely differs from the common contract

It should not mean building a new backend request stack from scratch.

### 4. UI State and Backend Execution Stay Separate
The provider configuration UI is about:

- role
- ordering
- selection
- visibility
- failover intent

The backend execution layer is about:

- credentials
- endpoints
- auth strategy
- request construction
- response normalization

These are related, but they are not the same concern.

## Target Model

### Provider Definition
The backend should resolve execution through a `ProviderDefinition`-style model.

Illustrative shape:

```ts
interface ProviderDefinition {
  id: string;
  kind: string;
  displayName: string;
  baseUrl: string;
  apiStyle: 'openai-compatible' | 'native' | 'custom';
  authStrategy: 'bearer' | 'header' | 'none';
  authHeaderName?: string;
  chatPath: string;
  modelsPath?: string;
  healthPath?: string;
  defaultModel?: string;
  supportsStreaming: boolean;
  requestFormat: 'chat-completions' | 'prompt-input' | 'custom';
  responseNormalizer: 'openai-sse' | 'lmstudio-native' | 'custom';
  enabled: boolean;
}
```

This is a conceptual contract, not a final TypeScript API.

The key point is that execution behavior is described by configuration.

### Provider Secret Binding
Secrets should be bound by backend configuration, not UI payloads.

Illustrative shape:

```ts
interface ProviderSecretBinding {
  providerId: string;
  apiKeyEnvVar?: string;
  baseUrlEnvVar?: string;
  defaultModelEnvVar?: string;
}
```

This allows the backend to resolve runtime secrets from environment variables or another local config layer without exposing them to the browser.

### Provider Runtime Resolution
At request time, the backend should:

1. receive the selected provider id from the UI/runtime request
2. load the provider definition
3. load backend-side secret/config overrides
4. construct the outbound request generically
5. execute it
6. normalize the response into the product's internal stream contract

## Recommended Configuration Layout

### Committed Template
Committed files may define:

- provider capability templates
- example provider definitions
- non-secret defaults

Examples:

- `.env.example`
- `config/providers.example.json`

### Local Runtime Configuration
Real secrets should live in ignored local config:

- `.env`
- `.env.local`
- `config/providers.local.json`

Environment variables remain the preferred default for secrets.

### Why Not Put API Keys in UI Config
If the UI becomes the primary source of real provider secrets, then:

- browser tooling can expose them too easily
- backend trust boundaries become weaker
- provider onboarding becomes harder to govern
- future auditing is more fragile

The UI may still hold non-secret provider selection state, but not the authoritative secret material.

## Execution Pipeline

### Stage 1: UI Selection
The UI chooses:

- active provider
- optional model override
- user-visible routing intent

### Stage 2: Backend Provider Resolution
The backend resolves:

- base URL
- auth mode
- endpoint path
- secret source
- request format
- response normalization strategy

### Stage 3: Generic Transport Execution
The backend executes through a shared transport path:

- build headers
- attach auth if needed
- build request body
- call provider
- stream or buffer response

### Stage 4: Response Normalization
The backend converts upstream responses into the app's stable contract:

- content deltas
- completion markers
- normalized errors
- future metadata if needed

## OpenRouter in This Model
OpenRouter is a strong first consumer of this architecture because it is not identical to LM Studio, but it still fits a largely config-driven model.

The likely OpenRouter requirements are:

- base URL configuration
- backend-owned API key
- OpenAI-compatible request format
- model selection support
- provider-specific headers if required
- normalized streaming response handling

OpenRouter should prove that the backend can onboard a new provider mostly through configuration and limited normalization hooks rather than a new handwritten execution path.

## What Should Still Be Custom Code
Not everything should be reduced to raw config.

Custom code is still appropriate for:

- providers with genuinely different streaming semantics
- providers with unusual auth or routing behavior
- model listing or healthcheck endpoints with incompatible response contracts
- advanced provider-specific transforms

The design goal is:

- shared executor by default
- custom adapter only where justified

## Concrete Work Breakdown

### Workstream A: Backend Provider Registry
Introduce backend-owned provider definitions and a registry service that resolves providers by id.

### Workstream B: Backend Secret Loading
Load provider secrets and runtime overrides from environment or local backend config.

### Workstream C: Generic Provider Transport
Refactor the backend execution path so request/response behavior is driven by provider definitions.

### Workstream D: OpenRouter Integration
Use OpenRouter as the first real external provider that exercises the new backend model.

### Workstream E: UI-to-Backend Handoff
Pass only the information the backend should receive from the UI, keeping secret ownership server-side.

## Risks

### Risk: Over-Generalizing Too Early
If the abstraction becomes too clever before the second provider lands, it may become harder to reason about.

Mitigation:

- keep the provider definition model small
- extract only what is clearly shared
- let OpenRouter validate the boundary

### Risk: UI and Backend Ownership Blur Together
If provider metadata, secrets, and transport details get mixed into a single state object, ownership becomes unclear.

Mitigation:

- split UI provider config from backend provider execution config
- explicitly document which fields are UI-owned vs backend-owned

### Risk: Browser Secret Leakage
If API keys remain pass-through values from the browser, the architecture will drift back toward an unsafe model.

Mitigation:

- backend-only secret loading
- UI sends provider id and non-secret options

## Acceptance Standard
This direction is implemented successfully when:

1. OpenRouter can be added without a new provider-specific backend rewrite.
2. The browser does not own the authoritative API key.
3. Provider execution behavior is mostly resolved from backend configuration.
4. The backend still returns a stable normalized chat contract to the UI.
5. Future providers can be added by extending the registry/config path first, not by duplicating transport code.
