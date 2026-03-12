# Branch Changes — feature/provider-config-driven-backend

## 2026-03-12
- Added detailed provider-backend architecture documentation for a config-driven registry, backend-owned secrets, and OpenRouter onboarding.
- Expanded the provider-configuration module docs to reflect the backend execution boundary instead of only UI ordering semantics.
- Introduced the first backend provider-registry foundation in `apps/magnetar-api` so provider definitions and backend runtime overrides can be resolved centrally.
- Added OpenRouter to the UI provider model and default provider list so the application state can represent the new backend integration target explicitly.
- Switched the browser-to-backend chat contract from raw transport details to provider identity plus model override, so upstream execution details are resolved by the backend registry instead of the UI.
- Reworked the provider transport tests to assert app-level request behavior and normalized payloads without pinning the suite to a single upstream URL literal.
