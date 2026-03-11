# In-App Chat Module Architecture

## Goal
Add a first-class chat module to the Angular product shell that talks to the shared runtime contract and exposes provider state clearly to the user.

## Target Shape
```text
[Chat Input / Message List / Status Bar]
                 |
                 v
        [Chat State Module]
                 |
                 v
        [SDK Runtime Contract]
                 |
                 v
       [Provider Adapter Layer]
```

## Design Rules
1. The chat module must depend on shared runtime contracts, not directly on provider-specific APIs.
2. Chat state must capture prompt, response, loading, error, and provider-status information.
3. The module must support progressive enhancement such as streaming and traces later without needing a rewrite.
4. Testing hooks must exist for provider success, provider failure, and no-provider-configured states.

## Key Decisions
- Chat is a product module, not a debug-only widget.
- Provider visibility must be built into the UX from the first version.
- The first provider-validation workflow should use chat in the browser, not only CLI smoke commands.
