from magnetar.tools.filesystem import FileReadTool, FileWriteTool, ListDirectoryTool
from magnetar.tools.shell import ShellCommandTool
from magnetar.tools.system_interaction import AuditLogger, PermissionPolicy, StubDesktopConnector, SystemInteractionModule


def test_file_tools(tmp_path):
    file_path = tmp_path / "test.txt"
    content = "Hello Magnetar"

    write_tool = FileWriteTool()
    result = write_tool.run(filepath=str(file_path), content=content)
    assert result.success is True
    assert file_path.read_text() == content

    read_tool = FileReadTool()
    result = read_tool.run(filepath=str(file_path))
    assert result.success is True
    assert result.output == content

    list_tool = ListDirectoryTool()
    result = list_tool.run(path=str(tmp_path))
    assert result.success is True
    assert "test.txt" in result.output


def test_shell_tool():
    shell_tool = ShellCommandTool()

    result = shell_tool.run(command="echo 'Hello Shell'")
    assert result.success is True
    assert "Hello Shell" in result.output

    result = shell_tool.run(command="ls /nonexistent_directory_12345")
    assert result.success is False
    assert result.error is not None


def test_system_interaction_policy_and_audit():
    logger = AuditLogger()
    module = SystemInteractionModule(
        policy=PermissionPolicy(allowed_commands=["echo"], denied_commands=["rm"]),
        audit_logger=logger,
    )

    allowed = module.run_command("echo hello")
    assert allowed is not None
    assert allowed.returncode == 0

    denied = module.run_command("rm -rf /tmp/not-used")
    assert denied is None

    events = logger.events()
    assert len(events) == 2
    assert events[0].allowed is True
    assert events[1].allowed is False


def test_system_interaction_desktop_connector():
    logger = AuditLogger()
    connector = StubDesktopConnector(app_name="slack")
    module = SystemInteractionModule(
        policy=PermissionPolicy(allowed_desktop_apps=["slack"]),
        audit_logger=logger,
        desktop_connectors=[connector],
    )

    ack = module.send_desktop_message(app_name="slack", channel="#alerts", message="hello")
    assert ack == "queued:slack:#alerts"
    assert connector.sent_messages[0]["message"] == "hello"

    denied_ack = module.send_desktop_message(app_name="teams", channel="#alerts", message="blocked")
    assert denied_ack is None
