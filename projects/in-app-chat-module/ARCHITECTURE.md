# In-App Chat Module Architecture

## Goal
Add a first-class chat module to the Angular product shell that talks to the shared runtime contract and exposes provider state clearly to the user.

## Target Shape
```text
[Left History Rail] [Chat Stream + Input] [Canvas / Side Panel]
            |                  |                     |
            +------------------+---------------------+
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
3. The chat module should enter the UI as a dedicated top-level tab rather than being buried inside another screen.
4. Structured message output should render through explicit block components rather than raw HTML injection.
5. The module must support progressive enhancement such as streaming, traces, and canvas mode later without needing a rewrite.
6. Testing hooks must exist for provider success, provider failure, and no-provider-configured states.

## Key Decisions
- Chat is a product module, not a debug-only widget.
- Provider visibility must be built into the UX from the first version.
- The first provider-validation workflow should use chat in the browser, not only CLI smoke commands.
- Message rendering should follow a document-style block pipeline so code, tables, tool output, and copy widgets can evolve independently.

## Component Model
- **ChatShellComponent**: owns top-level layout and tab integration.
- **ConversationRailComponent**: conversation list, history, and future branching affordances.
- **MessageStreamComponent**: ordered rendering of user and assistant messages.
- **MessageBlockComponent**: role-aware container with header, body, and actions.
- **BlockRendererComponent**: maps parsed nodes to paragraph, heading, list, table, quote, code, image, or tool-output blocks.
- **ChatComposerComponent**: prompt input, submit, stop, and future attachment entry point.
- **CanvasPanelComponent**: optional side panel for document-style editing flows.

## Rendering Pipeline
1. Acquire raw or streamed model output from the shared runtime contract.
2. Parse markdown-like or structured response text into semantic nodes.
3. Convert nodes into a UI-safe intermediate tree for Angular block rendering.
4. Bind actions such as copy, regenerate, and open-in-canvas from the semantic nodes.
5. Stabilize layout during streaming so the scroll position remains predictable.

## Candidate Libraries
- `ngx-markdown`: native Angular markdown rendering for the first baseline.
- `markdown-it` or `remark`: future AST/parser layer when rendering needs to move beyond direct markdown templates.
- `ngx-highlightjs`: code block syntax highlighting.
- `ngx-clipboard`: exact-copy actions.
- `eventsource-parser` plus `rxjs`: SSE and token-stream handling.
- `@tiptap/core` or `prosemirror`: canvas/document editor foundation.
- `monaco-editor`: code-oriented artifact editing in canvas mode.
