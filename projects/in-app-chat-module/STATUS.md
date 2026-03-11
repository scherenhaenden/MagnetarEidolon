# In-App Chat Module Status

## Summary
**Progress:** 10%

## Current State
The module is in planning. The product has dashboard-style UI scaffolding, but it does not yet have a real in-app conversation surface for testing providers or interacting with the runtime.

## Immediate Focus
- Define the first shipping chat workflow.
- Make provider visibility part of the chat state.
- Use chat as the main path for LM Studio verification once the provider module is implemented.

## Risks
1. Chat could become tightly coupled to a single provider if introduced too early without a stable provider contract.
2. A placeholder-only chat view would create false confidence about product readiness.
3. Test coverage may remain superficial if chat is treated as visual chrome instead of an interaction surface.

## Next Checkpoint
Complete the workflow and architecture pass before implementation starts.
