# Today Plan — 2026-03-20

## Goal
Start the transition from UI-local provider configuration toward a JSON-backed provider runtime, with LM Studio as the first provider to harden today.

## Decisions For Today
- Use a new branch because the existing `feature/provider-config-json-inspector` branch is too narrow for backend/runtime work.
- Treat JSON files as the long-term source of truth for provider runtime metadata.
- Keep provider secrets backend-only through environment-variable bindings.
- Start with the backend registry/config path first, then follow with UI/backend configured-instance handoff.

## Execution Steps
1. Add committed provider catalog JSON with backend execution metadata for LM Studio and OpenRouter.
2. Add a local provider override JSON example plus ignored local runtime config path.
3. Refactor the NestJS provider registry to load provider definitions from JSON instead of a hardcoded array.
4. Keep env-based overrides for secrets and runtime defaults working on top of the JSON layer.
5. Validate the backend provider/chat tests.

## Expected Outcome
- Provider execution metadata is no longer hardcoded only in TypeScript.
- The backend has the first real file-backed provider runtime path.
- The next slice can focus on configured provider instances and custom-provider execution using the same JSON model.
