# MagnetarEidolon UI Workspace

This workspace contains the active TypeScript UI proof of concept for **MagnetarEidolon**.

## Design Intent
- The product is **MagnetarEidolon**.
- The canonical project model is used as governance/context, not as the product identity.
- The shared runtime now begins to live in `packages/magnetar-sdk`.

## Included Pieces
- `src/app/core/models/canonical-model.ts`: OOP domain model classes.
- `src/app/core/services/project-context.service.ts`: service layer that centralizes canonical context.
- `src/app/app.component.*`: Angular UI shell component.
- `src/main.ts`: Angular bootstrap entrypoint.
- `src/cli/magnetar-cli.ts`: CLI entrypoint for non-UI usage.
- `tests/*.spec.ts`: initial TypeScript smoke tests for CI bootstrap.

## Quick Start
```bash
cd apps/magnetar-ui
npm install
npm run start
```

## CLI Usage
```bash
cd apps/magnetar-ui
npm install
npm run cli:dev -- about
npm run cli:dev -- canonical-model
npm run build:cli
npm run cli -- about
```

## Validation
```bash
cd apps/magnetar-ui
npm run typecheck
npm run test:ci
npm run build
```

## Startup Notes
- `npm run start` launches the current web UI locally on the Angular dev server.
- `npm run cli:dev` is the direct development CLI path.
- `npm run cli` runs the compiled CLI from `dist/`.
- Local startup still requires `npm install`; no-install delivery remains a later distribution concern.

> Note: This workspace is still transitional. The UI layout is product-aligned, the shared runtime extraction to `packages/magnetar-sdk` has started, and the web runtime is now being initialized around the existing UI rather than replacing it.
