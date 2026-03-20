# Branch Changes — feature/provider-config-json-runtime

## 2026-03-20
- Branched from `feature/provider-config-json-inspector` because the next slice expands from a narrow Providers UI inspection change into JSON-backed provider runtime work.
- Scoped this branch to the first config-file-backed execution slice for provider runtime resolution, starting with LM Studio and OpenRouter.
- Declared the immediate direction: move backend-known provider execution metadata into JSON files, keep secrets on the backend, and prepare the system for both preset-backed and custom provider instances.
- Captured a concrete today plan in `branches/feature-provider-config-json-runtime/TODAY_PLAN.md` before starting code changes.
- Added committed provider catalog scaffolding in `config/providers.catalog.json` and a local override example in `config/providers.local.example.json`.
- Ignored `config/providers.local.json` so machine-local runtime provider overrides can exist without being committed.
- Refactored `apps/magnetar-api/src/provider-registry.service.ts` so the backend provider registry now reads provider execution metadata from JSON, then layers local JSON overrides and environment-variable bindings on top.
- Extended backend registry tests with coverage for catalog-backed loading and local JSON override behavior.
- Revalidated the backend slice with `npm test` and `npm run typecheck` in `apps/magnetar-api`.
- Added a `runtimeProviderId` handoff field to preset-backed provider configs in the Angular UI model so UI-local config ids no longer have to match backend-executable provider ids.
- Updated the chat request builder so LM Studio and OpenRouter send stable backend runtime ids while preserving the existing UI config-instance ids for editing and persistence.
- Expanded UI tests to cover runtime-id hydration, legacy-origin inference, reset fallbacks, UUID fallback id generation, and provider-id handoff behavior.
- Revalidated the completed slice with focused UI tests, root `npm test`, and root `npm run typecheck`.
