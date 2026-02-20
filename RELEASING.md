# Releasing MagnetarEidolon

This repository uses a single automated GitHub Actions release workflow (`.github/workflows/release.yml`).

## One-time setup
1. Configure PyPI Trusted Publishing for this repository (recommended).
2. Ensure `GITHUB_TOKEN` has `contents: write` for workflow runs.

## Cut a release
1. Open **Actions → Release → Run workflow**.
2. Provide:
   - `version`: semantic version without `v` (example: `0.2.0`)
   - `publish_to_pypi`: `true` or `false`
   - `release_notes`: complete markdown using `RELEASE_NOTES_TEMPLATE.md`
3. Run the workflow.

## What the workflow does
1. Validates release notes are extremely detailed and include all required sections.
2. Creates/pushes tag `vX.Y.Z` if missing.
3. Builds artifacts on Linux, macOS, and Windows.
4. Creates a GitHub Release and uploads all OS artifacts plus Python distributions.
5. Publishes to PyPI (optional input) via OIDC trusted publishing.

## Produced artifacts
- `magnetar-linux` (standalone CLI binary)
- `magnetar-macos` (standalone CLI binary)
- `magnetar-windows.exe` (standalone CLI binary)
- Python source distribution (`.tar.gz`)
- Python wheel (`.whl`)

## Failure handling
- Release notes validation failures stop the release before tagging.
- A GitHub release is still published when at least one platform build succeeds; only successful platform artifacts are attached.
- If all platform builds fail, the release job fails and nothing is published.
- PyPI publish still requires the Linux build artifacts and can be disabled during dry runs (`publish_to_pypi: false`).
