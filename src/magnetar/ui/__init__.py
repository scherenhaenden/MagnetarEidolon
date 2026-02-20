from magnetar.ui.platform import (
    LinuxAdapter,
    MacOSAdapter,
    PlatformName,
    WindowConfig,
    WindowsAdapter,
    adapter_for_platform,
    detect_platform_name,
)
from magnetar.ui.shell import UIShell, build_default_shell
from magnetar.ui.state import NavigationState, Route, UIStateContainer

__all__ = [
    "LinuxAdapter",
    "MacOSAdapter",
    "PlatformName",
    "WindowConfig",
    "WindowsAdapter",
    "adapter_for_platform",
    "detect_platform_name",
    "UIShell",
    "build_default_shell",
    "NavigationState",
    "Route",
    "UIStateContainer",
]
