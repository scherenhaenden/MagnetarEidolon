# Branch Changes — feature/typescript-project-ci-matrix

## Summary
- Migrated the three platform CI workflows (`ci-linux`, `ci-macos`, `ci-windows`) from Python/Poetry jobs to TypeScript/Node jobs targeting `typescript-angular-skeleton`.
- Added cross-platform build validation (`npm install`, `npm run build`) and CLI smoke testing (`node dist/cli/magnetar-cli.js about`) for Linux, macOS, and Windows.
- Kept workflow names and triggers stable to preserve existing badges and branch protections while changing runtime focus to TypeScript.

## Notes
- The workflows intentionally use `npm install` instead of `npm ci` because this repository currently does not include a committed `package-lock.json` for `typescript-angular-skeleton`.
