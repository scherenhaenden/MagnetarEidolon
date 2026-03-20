# Provider Configuration Module Logbook

## Entries

- **Timestamp:** 2026-03-16 08:20 UTC
  **Author:** Codex
  **Entry:** Implementation: changed provider configuration instances to use opaque ids and explicit `system` vs `user` origin so built-in preset-backed entries cannot be deleted. The Providers editor now shows add actions only during new-configuration flows and reserves delete/reset actions for existing configurations. Planning was updated with a follow-up JSON persistence slice for the preset catalog and configured-provider instances.

- **Timestamp:** 2026-03-12 12:40 UTC
  **Author:** Codex
  **Entry:** Planning: documented the next provider-configuration UI slice. The immediate user-facing gaps are an explicit OpenRouter configuration entry path in the Providers screen and a way to inspect provider model/request templates with placeholders so provider onboarding is understandable from the product itself.

- **Timestamp:** 2026-03-12 13:35 UTC
  **Author:** Codex
  **Entry:** Implementation: expanded the Providers screen with quick-add actions, a custom provider shell, list/card viewing, clearer runtime editing fields, suggested-model shortcuts, and editable request-template placeholders. This remains UI-local persistence until the backend-owned configuration path consumes the same data model.

- **Timestamp:** 2026-03-12 11:25 UTC
  **Author:** Codex
  **Entry:** Decision: Expanded the provider-configuration module to cover a config-driven backend provider registry, backend-owned secret loading, and OpenRouter as the first external provider that should validate the new execution model.

- **Timestamp:** 2026-03-11 10:05 UTC
  **Author:** Codex
  **Entry:** Project bootstrap: created the provider-configuration module planning set and introduced the first provider screen plus state service for primary/backup/disabled provider roles.
