# In-App Chat Module

## Purpose
This module defines the planning, architecture, and delivery path for adding a real **in-app chat experience** to MagnetarEidolon.

## Why This Module Exists
- The product needs a real conversational surface, not only dashboard placeholders.
- Provider testing is much more realistic when done through the same UI users will actually use.
- Chat becomes the shortest path for validating prompt/response behavior, provider health, and regressions.

## Scope
- Chat tab and shell-level navigation inside the Angular product UI.
- Conversation state, request/response rendering, provider-state visibility, and streaming behavior.
- Structured message rendering for paragraphs, headings, lists, tables, quotes, code blocks, and action controls.
- Optional canvas/document side panel for non-linear document editing flows.
- Testing strategy for provider validation through the chat UI.
- Integration with the shared SDK/runtime contract.

## Out of Scope
- Multi-user collaborative chat.
- Full memory editing UX.
- Final recipe-builder integration.

## Module Documents
| File | Role |
| :--- | :--- |
| `PLAN.md` | Milestones and tasks for the chat module. |
| `STATUS.md` | Current state and immediate focus. |
| `ARCHITECTURE.md` | Module-level architecture and boundaries. |
| `REQUIREMENTS.md` | Functional and technical requirements. |
| `TESTING.md` | Chat-specific validation strategy for rendering, streaming, and provider flows. |
| `BITACORA.md` | Chronological module logbook. |

## Relationship to the Main Project
This module gives the UI a concrete delivery track for the first real conversation surface without burying chat-specific planning inside the broader UI roadmap.

## Candidate Library Stack
- `ngx-markdown`: native Angular markdown rendering for baseline message blocks.
- `highlight.js` with `ngx-highlightjs`: syntax highlighting for code blocks.
- `ngx-clipboard`: exact-copy actions for prompts, commands, and code snippets.
- `eventsource-parser` plus `rxjs`: SSE token streaming and incremental UI updates.
- `Angular Material` or `PrimeNG`: shell layout primitives such as sidebars, tabs, cards, and expansion panels.
- `markdown-it` or `remark`: parser layer for future AST-driven structured rendering.
- `@tiptap/core` or `prosemirror`: candidate foundation for canvas/document mode.
- `monaco-editor`: code-oriented document editing in future canvas flows.
- `mermaid` and `katex`: optional post-processing for diagrams and math.
