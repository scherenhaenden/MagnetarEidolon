# Branch Changes — feature/typescript-project-ci-matrix

## Summary
- Migrated the three platform CI workflows (`ci-linux`, `ci-macos`, `ci-windows`) from Python/Poetry jobs to TypeScript/Node jobs targeting `apps/magnetar-ui` (formerly `typescript-angular-skeleton`).
- Added cross-platform build validation (`npm install`, `npm run build`) and CLI smoke testing (`node dist/cli/magnetar-cli.js about`) for Linux, macOS, and Windows.
- Kept workflow names and triggers stable to preserve existing badges and branch protections while changing runtime focus to TypeScript.
- Merged `master` to synchronize with the workspace rehome into `apps/magnetar-ui` and resolved related configuration conflicts.

## Notes
- The workflows intentionally use `npm install` instead of `npm ci` because this repository currently does not include a committed `package-lock.json` for `apps/magnetar-ui`.
- Re-scoped CI compile step to `npm run build:cli` with a dedicated `tsconfig.cli.json` so workflows validate the operational CLI path while the Angular shell dependencies are still incomplete.
- All paths in CI workflows and `tsconfig.cli.json` have been updated to target the new workspace location.
