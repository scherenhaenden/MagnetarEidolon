# Provider Configuration Module Status

## Summary
**Progress:** 55%

## Current State
The provider-configuration UI is now beyond role ordering. The Providers screen supports preset onboarding, custom provider shells, visible endpoint/model editing, template inspection, and local persistence for the current slice.

## Immediate Focus
- Keep provider configuration independent from provider transport code.
- Decide how the runtime will consume the configured provider chain.
- Add persistence/config loading once the contract is stable.
- Move provider execution metadata and secrets behind a backend-owned registry/configuration path.
- Use OpenRouter as the first real validation target for the config-driven backend provider model.
- Add a provider-configuration UI flow for backend-owned secrets and editable non-secret runtime fields, starting with OpenRouter.
- Surface provider model and request-template placeholders in the UI so adding providers does not require hidden backend knowledge.
- Push the current local-only provider editor toward backend-backed persistence and execution so the UI stops being the only source of truth.
- Define JSON persistence for the provider preset catalog and configured-provider instances so reset/delete flows can operate on durable artifacts instead of only transient UI state.

## Risks
1. UI-only configuration can drift from runtime behavior if the handoff contract is not defined quickly.
2. Primary/backup semantics may become confusing if the app allows invalid states.
3. Provider configuration could get coupled to LM Studio-specific fields too early.
4. New providers will remain too expensive to add if the backend keeps hardcoding request behavior instead of resolving it from configuration.
