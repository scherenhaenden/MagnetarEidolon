# Architecture of Cross-Platform UI Skeleton

## High-Level Diagram
```text
[Clients / Integrations]
          |
          v
      [UIShell]
          |
          v
[Navigation + UI State Container]
          |
          v
[Platform Adapter Interface]
     /         |         \
[Linux]     [macOS]    [Windows]
```

## Component Descriptions
- **UIShell (`magnetar.ui.shell`)**: Shared orchestration entry point that boots an adapter, owns the default route map, and exposes deterministic startup metadata for callers.
- **State Container (`magnetar.ui.state`)**: Holds navigation route map, active route, back-stack behavior, and sidebar UI flag.
- **Platform Layer (`magnetar.ui.platform`)**: Provides a strict adapter protocol plus OS-specific baseline implementations and runtime platform detection.

## Contracts
- `PlatformAdapter.bootstrap(WindowConfig) -> str`: returns a startup summary that can be logged or surfaced in diagnostics.
- `PlatformAdapter.capabilities() -> dict[str, bool]`: exports capability flags for feature gating.
- `UIShell.start() -> dict[str, object]`: canonical shell startup payload consumed by higher-level modules.
- `NavigationState.navigate(route_name)` and `NavigationState.back()`: deterministic route transitions with guard rails.
