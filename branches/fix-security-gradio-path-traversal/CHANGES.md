# Changes for fix/security-gradio-path-traversal

## Summary
Fixed a high-severity security vulnerability (Absolute Path Traversal) by upgrading `gradio` to version 6.9.0.

## Changes
- **magnetar_voice_ui/pyproject.toml**:
    - Updated `gradio` dependency from `(>=6.6.0,<7.0.0)` to `(>=6.6.1,<7.0.0)`.
- **.venv**:
    - Upgraded `gradio` to `6.9.0` via `pip`.
- **requirements.txt**:
    - Updated to reflect the new dependency tree.
- **branches/fix-security-gradio-path-traversal/CHANGES.md**:
    - Initialized branch changelog.
