# Branch Changes — feature/typescript-project-ci-matrix

## Summary
- Migrated the three platform CI workflows (`ci-linux`, `ci-macos`, `ci-windows`) from Python/Poetry jobs to TypeScript/Node jobs targeting `apps/magnetar-ui` (formerly `typescript-angular-skeleton`).
- Added cross-platform build validation (`npm ci`, `npm run build`) and CLI smoke testing (`node dist/cli/magnetar-cli.js about`) for Linux, macOS, and Windows.
- Kept workflow names and triggers stable to preserve existing badges and branch protections while changing runtime focus to TypeScript.
- Merged `master` to synchronize with the workspace rehome into `apps/magnetar-ui` and resolved related configuration conflicts.
- **CI Hardening**: Switched all TypeScript/Node CI workflows to use `npm ci --include=dev` instead of `npm install` to ensure deterministic builds and availability of development tools like `tsc`.
- **SDK Build Fix**: Updated `packages/magnetar-sdk/package.json` to use `npx tsc`, ensuring the `prepare` script can find the TypeScript compiler even if not in the global path.
- **Test Quality Gate**: Updated `apps/magnetar-ui/vitest.config.ts` to enforce a 100% coverage threshold across all metrics (lines, branches, functions, statements).

## Notes
- All workflows now correctly utilize the committed `package-lock.json` files in `apps/magnetar-ui` and `packages/magnetar-sdk`.
- Re-scoped CI compile step to `npm run build:cli` with a dedicated `tsconfig.cli.json` so workflows validate the operational CLI path while the Angular shell dependencies are still incomplete.
- All paths in CI workflows and `tsconfig.cli.json` have been updated to target the new workspace location.
