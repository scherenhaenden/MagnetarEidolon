from __future__ import annotations

from dataclasses import dataclass, field


@dataclass(frozen=True)
class Route:
    name: str
    title: str


@dataclass
class NavigationState:
    routes: dict[str, Route]
    current_route: str
    back_stack: list[str] = field(default_factory=list)

    def navigate(self, route_name: str) -> None:
        if route_name not in self.routes:
            raise KeyError(f"Unknown route: {route_name}")
        self.back_stack.append(self.current_route)
        self.current_route = route_name

    def back(self) -> bool:
        if not self.back_stack:
            return False
        self.current_route = self.back_stack.pop()
        return True


@dataclass
class UIStateContainer:
    navigation: NavigationState
    sidebar_open: bool = True

    def toggle_sidebar(self) -> None:
        self.sidebar_open = not self.sidebar_open
