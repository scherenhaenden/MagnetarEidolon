# Canvas Renderer Roadmap

## Purpose
This document defines the artifact classes that the MagnetarEidolon chat canvas should eventually render, starting with browser-native formats and expanding toward richer renderer runtimes.

## Current State
- Implemented renderer: `html`
- Current fallback mode: source-only code display

The first production renderer is HTML because it is already browser-native, easy to validate inside a sandboxed boundary, and highly useful for UI-oriented generations.

## Renderer Categories

### Browser-Native First
- `html`
- `svg`
- `markdown`
- `csv`
- `json`
- `xml`
- `yaml`
- image payloads such as `png`, `jpg`, `webp`, and `gif`
- media payloads such as `audio` and `video`

### Diagram and Structured Visuals
- `mermaid`
- `graphviz` / `dot`
- `plantuml`

### Document and Typesetting
- `typst`
- `tex` / `latex`
- `pdf`

### Advanced Interactive Renderers
- browser-safe JavaScript demos
- browser-safe TypeScript demos
- component-driven previews
- 3D formats such as `glb` / `gltf`

These advanced renderers require stricter isolation and should not be enabled until the execution boundary is explicit and test-backed.

## Recommended Delivery Order
1. `html`
2. `svg`
3. `markdown`
4. `mermaid`
5. `csv`
6. `json`
7. `typst`

## Runtime Guidance
- Prefer browser-native rendering first.
- Keep source visible even when a rendered preview exists.
- Treat renderers as explicit artifact handlers, not as a generic execute-anything path.
- Use sandboxed boundaries for HTML and any renderer that can execute browser behavior.
- Evaluate WASM-backed renderers only when browser-native handling is not sufficient.

## Typst Direction
Typst is a strong follow-up renderer because it serves the document-generation use case well, but it should be added only after the renderer pipeline is formalized. The likely implementation path is a dedicated client-side renderer boundary, potentially WASM-backed, with explicit performance and safety constraints.

## Related Tracking
- `#176` Canvas workspace rendering and handoff flow
- `#178` Extensible renderer pipeline for HTML, Typst, and renderable artifacts
- `#179` HTML artifact rendering in the chat canvas workspace
