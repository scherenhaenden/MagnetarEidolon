# In-App Chat Module Testing

## Goals
- Verify that chat works as the primary in-product validation surface for providers.
- Verify that structured message rendering is stable, deterministic, and copy-safe.
- Verify that streaming updates do not corrupt layout or lose semantic structure.

## Test Layers

### 1. Unit Tests
- Conversation state transitions for idle, sending, streaming, success, and error.
- Message-node mapping from parsed structures to UI block view models.
- Copy extraction for code blocks and copy-box components.

### 2. Component Tests
- Chat tab shell and message list rendering.
- Code block rendering with language labels and copy actions.
- Expandable reasoning or tool-output blocks.
- Canvas/document panel open-close behavior.

### 3. Integration Tests
- Chat request flow through the shared runtime contract.
- Provider-visible status during send, stream, success, and failure paths.
- LM Studio reachable and unreachable scenarios.

### 4. Manual QA
- Send a prompt from the chat tab and observe progressive response rendering.
- Confirm code blocks copy exact content without labels or UI artifacts.
- Confirm scroll stability during long streaming responses.
- Confirm canvas mode opens as a secondary workspace without corrupting the message thread.

## Candidate Test Utilities
- `rxjs` test scheduling for deterministic stream behavior.
- Angular component tests around `ngx-markdown`, `ngx-highlightjs`, and `ngx-clipboard` integration.
- Fixture-driven parsing tests for `markdown-it` or `remark` pipelines once the renderer moves beyond plain markdown.

## Acceptance Criteria
1. Structured chat blocks render predictably from deterministic input fixtures.
2. Streaming responses remain readable while content is still incomplete.
3. Provider failures are visible in the chat UI without requiring CLI-only validation.
4. Copy actions preserve exact source content for code and prompt snippets.
