# Releasing MagnetarEidolon

This repository now uses dedicated packaging workflows so each distribution channel can be shipped independently.

## Pipelines
- `.github/workflows/release-npm-global.yml`: Build, pack, test global install, and optionally publish `apps/magnetar-ui` to npm.
- `.github/workflows/release-deb.yml`: Build and package a Linux `.deb` bundle for `magnetar-cli`.
- `.github/workflows/release-exe.yml`: Build and package a Windows `.exe` with `pkg`.
- `.github/workflows/release-appimage.yml`: Build and package a Linux AppImage.

## Recommended first path (npm)
1. Open **Actions → Release NPM Global Package → Run workflow**.
2. Provide:
   - `version`: semantic version (example: `0.2.0`)
   - `publish`: `false` for dry run, `true` to publish
3. Ensure `NPM_TOKEN` is configured in repository secrets before `publish=true`.

### What npm workflow validates
1. Installs and builds `packages/magnetar-sdk`.
2. Installs and builds CLI output in `apps/magnetar-ui`.
3. Packs npm tarball with `npm pack`.
4. Installs tarball globally and runs `magnetar-cli about` as a real smoke test.
5. Uploads the package artifact and publishes only when requested.

## Other package workflows
- Run each workflow manually from the Actions tab.
- Every workflow builds and executes a smoke test command before uploading artifacts.
- Start with npm first, then roll out DEB/EXE/AppImage artifacts as needed for your target users.
