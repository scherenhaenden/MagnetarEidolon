from __future__ import annotations

import platform
from dataclasses import dataclass
from enum import Enum
from typing import Protocol


class PlatformName(str, Enum):
    LINUX = "linux"
    MACOS = "macos"
    WINDOWS = "windows"
    UNKNOWN = "unknown"


@dataclass(frozen=True)
class WindowConfig:
    title: str = "Magnetar"
    width: int = 1024
    height: int = 768
    resizable: bool = True


class PlatformAdapter(Protocol):
    name: PlatformName

    def bootstrap(self, config: WindowConfig) -> str:
        """Initialize platform resources and return a human readable summary."""

    def capabilities(self) -> dict[str, bool]:
        """Return a capability map that callers can use for feature gates."""


class LinuxAdapter:
    name = PlatformName.LINUX

    def bootstrap(self, config: WindowConfig) -> str:
        return (
            f"linux bootstrap title={config.title!r} size={config.width}x{config.height} "
            f"resizable={config.resizable}"
        )

    def capabilities(self) -> dict[str, bool]:
        return {
            "notifications": True,
            "native_menu": True,
            "tray": True,
            "touchbar": False,
        }


class MacOSAdapter:
    name = PlatformName.MACOS

    def bootstrap(self, config: WindowConfig) -> str:
        return (
            f"macos bootstrap title={config.title!r} size={config.width}x{config.height} "
            f"resizable={config.resizable}"
        )

    def capabilities(self) -> dict[str, bool]:
        return {
            "notifications": True,
            "native_menu": True,
            "tray": True,
            "touchbar": True,
        }


class WindowsAdapter:
    name = PlatformName.WINDOWS

    def bootstrap(self, config: WindowConfig) -> str:
        return (
            f"windows bootstrap title={config.title!r} size={config.width}x{config.height} "
            f"resizable={config.resizable}"
        )

    def capabilities(self) -> dict[str, bool]:
        return {
            "notifications": True,
            "native_menu": False,
            "tray": True,
            "touchbar": False,
        }


def detect_platform_name(system_name: str | None = None) -> PlatformName:
    normalized = (system_name or platform.system()).strip().lower()
    if normalized == "linux":
        return PlatformName.LINUX
    if normalized == "darwin":
        return PlatformName.MACOS
    if normalized == "windows":
        return PlatformName.WINDOWS
    return PlatformName.UNKNOWN


def adapter_for_platform(name: PlatformName) -> PlatformAdapter:
    if name == PlatformName.LINUX:
        return LinuxAdapter()
    if name == PlatformName.MACOS:
        return MacOSAdapter()
    if name == PlatformName.WINDOWS:
        return WindowsAdapter()
    raise ValueError(f"No adapter available for platform: {name}")
