# Branch Changes — feature/provider-config-instance-management

## 2026-03-16
- Started the provider configuration management slice requested for the `Providers` route.
- Scoped the work around three explicit rules:
  - configured provider entries must use stable opaque instance ids instead of relying on preset-like ids
  - quick-add provider presets remain a reusable catalog and are not deletable from the UI
  - provider configuration values must be removable/resettable without deleting the underlying preset catalog entry
- Confirmed local dependencies with `npm run setup` before implementation.
- Added a follow-up planning item to persist the provider preset catalog and configured-provider instances as JSON artifacts instead of leaving the current UI state as the only durable representation.
