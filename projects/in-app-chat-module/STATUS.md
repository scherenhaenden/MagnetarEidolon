# In-App Chat Module Status

## Summary
**Progress:** 55%

## Current State
The module is in active implementation. The product shell now contains a first chat tab baseline with a conversation rail, structured message rendering, real LM Studio streaming behavior, copyable code blocks, and a canvas side panel. The chat path is now runtime-backed for LM Studio, while broader provider orchestration is still pending.

## Immediate Focus
- Expand the real provider/runtime path beyond the first LM Studio streaming integration.
- Expand structured rendering from the baseline parser to a richer markdown/AST pipeline.
- Turn the canvas side panel into an editable document surface.
- Use chat as the main path for LM Studio verification and then generalize that runtime path across providers.

## Risks
1. Chat could become tightly coupled to a single provider if introduced too early without a stable provider contract.
2. A placeholder-only chat view would create false confidence about product readiness.
3. Test coverage may remain superficial if chat is treated as visual chrome instead of an interaction surface.
4. Streaming and rich rendering could become unstable if raw text is rendered directly instead of going through semantic blocks.
5. The first real provider path now exists only for LM Studio; other providers still fall back to local deterministic responses.

## Next Checkpoint
Complete multi-provider runtime wiring and richer rendering before the chat tab is treated as a production-facing feature.
