# TypeScript OOP + Angular UI Skeleton

This folder provides a starter skeleton that pivots the app toward **TypeScript OOP** with an **Angular UI shell** and a companion **CLI**.

## Design Intent
- The **MagnetarEidolon canonical model** is a main dependency and reference point.
- The product itself is **not only about the model**; it is focused on user workflows and operations.

## Included Skeleton Pieces
- `src/app/core/models/canonical-model.ts`: OOP domain model classes.
- `src/app/core/services/project-context.service.ts`: service layer that centralizes canonical context.
- `src/app/app.component.*`: Angular UI shell component.
- `src/main.ts`: Angular bootstrap entrypoint.
- `src/cli/magnetar-cli.ts`: CLI entrypoint for non-UI usage.

## Quick Start (skeleton mode)
```bash
cd typescript-angular-skeleton
npm install
npm run build
npm run cli -- about
npm run cli -- canonical-model
```

> Note: This is intentionally a skeleton. Add full Angular dependencies and generated workspace wiring (`@angular/core`, `@angular/platform-browser`, Angular CLI config targets) when moving to production.
