# LM Studio Provider Module Architecture

## Goal
Integrate LM Studio through a provider adapter that plugs into the shared runtime contract instead of coupling provider logic to Angular components or CLI command handlers.

## Target Shape
```text
[UI Chat / CLI]
      |
      v
[SDK Provider Interface]
      |
      v
[LM Studio Adapter]
      |
      v
[LM Studio Local API]
```

## Design Rules
1. The adapter must consume the shared provider interface from the SDK/runtime layer.
2. LM Studio-specific configuration must be isolated from generic generation contracts.
3. The adapter must expose healthcheck and failure details suitable for UI display.
4. The in-app chat module should be able to call the provider without knowing provider-specific transport details.

## Key Decisions
- Start with one provider, but do not design one-off abstractions.
- Prefer explicit configuration over hidden environment assumptions.
- Treat connectivity and model-availability feedback as first-class outputs.
