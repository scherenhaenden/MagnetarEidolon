# Branch Changes — feature/chat-canvas-web-rendering

## 2026-03-12
- Split web-oriented canvas rendering into a dedicated branch under the broader chat canvas workspace effort.
- Scoped the next implementation slice around rendered HTML artifacts first, with a follow-up renderer model for Typst and other renderable artifact classes.
- Linked the branch scope to GitHub issues `#178` and `#179`.
- Implemented explicit canvas render-kind detection so HTML artifacts are classified separately from source-only code artifacts.
- Updated the chat canvas panel to render HTML artifacts in a sandboxed iframe while still exposing the generated source beneath the preview.
- Added `docs/CANVAS_RENDERER_ROADMAP.md` to document the renderer classes, rollout order, and Typst/WASM follow-up direction.
- Extracted HTML document titles from canvas artifacts and exposed them in the canvas preview chrome so rendered pages are easier to identify.
