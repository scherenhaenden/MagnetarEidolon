from __future__ import annotations

from dataclasses import dataclass

from magnetar.ui.platform import (
    PlatformAdapter,
    PlatformName,
    WindowConfig,
    adapter_for_platform,
    detect_platform_name,
)
from magnetar.ui.state import NavigationState, Route, UIStateContainer


DEFAULT_ROUTES = {
    "home": Route(name="home", title="Home"),
    "memory": Route(name="memory", title="Memory"),
    "tools": Route(name="tools", title="Tools"),
    "settings": Route(name="settings", title="Settings"),
}


@dataclass
class UIShell:
    adapter: PlatformAdapter
    state: UIStateContainer
    window: WindowConfig

    def start(self) -> dict[str, object]:
        """Initialize and return the application state summary."""
        bootstrap_summary = self.adapter.bootstrap(self.window)
        return {
            "platform": self.adapter.name.value,
            "bootstrap": bootstrap_summary,
            "capabilities": self.adapter.capabilities(),
            "active_route": self.state.navigation.current_route,
        }

    def navigate(self, route_name: str) -> str:
        """Navigate to the specified route and return the current route."""
        self.state.navigation.navigate(route_name)
        return self.state.navigation.current_route


def build_default_shell(
    platform_name: PlatformName | None = None,
    window: WindowConfig | None = None,
) -> UIShell:
    """Builds a default UIShell instance."""
    selected_platform = platform_name or detect_platform_name()
    adapter = adapter_for_platform(selected_platform)
    navigation = NavigationState(routes=DEFAULT_ROUTES, current_route="home")
    state = UIStateContainer(navigation=navigation)
    return UIShell(adapter=adapter, state=state, window=window or WindowConfig())
