# MagnetarEidolon UI Workspace

This workspace contains the active TypeScript UI proof of concept for **MagnetarEidolon**.

## Design Intent
- The product is **MagnetarEidolon**.
- The shared runtime now begins to live in `packages/magnetar-sdk`.

## Included Pieces
- `src/app/core/models/application-descriptor.ts`: product metadata model classes.
- `src/app/core/services/project-context.service.ts`: service layer that centralizes product descriptor context.
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

## Run From Repository Root
If you prefer not to `cd` into the workspace, the repository root now exposes wrapper scripts:

```bash
cd /path/to/MagnetarEidolon
npm run setup
npm run dev
```

The UI now expects the NestJS backend in `apps/magnetar-api` for provider/chat traffic. Root `npm run dev` starts both services together, and `npm run cli:dev -- <command>` still runs the TypeScript CLI through the same shared SDK boundary.

## CLI Usage
```bash
cd apps/magnetar-ui
npm install
npm run cli:dev -- about
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
- Root-level wrappers exist for the same flows: `npm run dev`, `npm run dev:api`, `npm run cli:dev -- about`, `npm run build`.

> Note: This workspace is still transitional. The UI layout is product-aligned, the shared runtime extraction to `packages/magnetar-sdk` has started, and the web runtime is now being initialized around the existing UI rather than replacing it.
