# In-App Chat Module Status

## Summary
**Progress:** 42%

## Current State
The module is in active implementation. The product shell now contains a first chat tab baseline with a conversation rail, structured message rendering, deterministic streaming behavior, copyable code blocks, and a canvas side panel. The provider path is still mocked through the local UI state rather than a real runtime-backed request flow.

## Immediate Focus
- Wire the chat state to real provider/runtime requests instead of deterministic mock responses.
- Expand structured rendering from the baseline parser to a richer markdown/AST pipeline.
- Turn the canvas side panel into an editable document surface.
- Use chat as the main path for LM Studio verification once the provider module is wired end-to-end.

## Risks
1. Chat could become tightly coupled to a single provider if introduced too early without a stable provider contract.
2. A placeholder-only chat view would create false confidence about product readiness.
3. Test coverage may remain superficial if chat is treated as visual chrome instead of an interaction surface.
4. Streaming and rich rendering could become unstable if raw text is rendered directly instead of going through semantic blocks.
5. The current baseline still uses deterministic local response generation; without runtime wiring it is not yet a real provider interaction path.

## Next Checkpoint
Complete runtime wiring and richer rendering before the chat tab is treated as a production-facing feature.
