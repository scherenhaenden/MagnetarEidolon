# Branch Changes — feature/provider-config-driven-backend

## 2026-03-12
- Added detailed provider-backend architecture documentation for a config-driven registry, backend-owned secrets, and OpenRouter onboarding.
- Expanded the provider-configuration module docs to reflect the backend execution boundary instead of only UI ordering semantics.
- Introduced the first backend provider-registry foundation in `apps/magnetar-api` so provider definitions and backend runtime overrides can be resolved centrally.
- Added OpenRouter to the UI provider model and default provider list so the application state can represent the new backend integration target explicitly.
