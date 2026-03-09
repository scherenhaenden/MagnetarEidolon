# Magnetar SDK Package

This package contains the shared TypeScript runtime contract for MagnetarEidolon.

## Scope
- Agent loop runtime
- Shared state and interface models
- Environment-specific tool adapters that belong to the reusable runtime layer

## Non-scope
- Product UI composition
- Product-specific descriptors and presentation concerns

The current extraction keeps the package source-local and workspace-internal while the architecture settles.
