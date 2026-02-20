import pytest

from magnetar.ui import (
    PlatformName,
    WindowConfig,
    adapter_for_platform,
    build_default_shell,
    detect_platform_name,
)


@pytest.mark.parametrize(
    ("raw", "expected"),
    [
        ("Linux", PlatformName.LINUX),
        ("Darwin", PlatformName.MACOS),
        ("Windows", PlatformName.WINDOWS),
        ("AmigaOS", PlatformName.UNKNOWN),
    ],
)
def test_detect_platform_name(raw, expected):
    assert detect_platform_name(raw) == expected


@pytest.mark.parametrize(
    "platform_name",
    [PlatformName.LINUX, PlatformName.MACOS, PlatformName.WINDOWS],
)
def test_adapter_resolution(platform_name):
    adapter = adapter_for_platform(platform_name)
    assert adapter.name == platform_name
    assert "notifications" in adapter.capabilities()


def test_default_shell_bootstrap_and_navigation():
    shell = build_default_shell(
        platform_name=PlatformName.LINUX,
        window=WindowConfig(title="UI Test", width=1280, height=720),
    )

    startup = shell.start()
    assert startup["platform"] == "linux"
    assert startup["active_route"] == "home"

    new_route = shell.navigate("tools")
    assert new_route == "tools"

    shell.state.toggle_sidebar()
    assert shell.state.sidebar_open is False

    shell.state.navigation.back()
    assert shell.state.navigation.current_route == "home"


def test_unknown_platform_has_no_adapter():
    with pytest.raises(ValueError):
        adapter_for_platform(PlatformName.UNKNOWN)
