import pytest
import os
from pathlib import Path
from magnetar.tools.filesystem import FileReadTool, FileWriteTool, ListDirectoryTool
from magnetar.tools.shell import ShellCommandTool

@pytest.fixture
def temp_dir(tmp_path):
    return tmp_path

def test_file_tools(temp_dir):
    file_path = temp_dir / "test.txt"
    content = "Hello Magnetar"

    # Test Write
    write_tool = FileWriteTool()
    result = write_tool.run(filepath=str(file_path), content=content)
    assert result.success is True
    assert file_path.read_text() == content

    # Test Read
    read_tool = FileReadTool()
    result = read_tool.run(filepath=str(file_path))
    assert result.success is True
    assert result.output == content

    # Test List
    list_tool = ListDirectoryTool()
    result = list_tool.run(path=str(temp_dir))
    assert result.success is True
    assert "test.txt" in result.output

def test_shell_tool():
    shell_tool = ShellCommandTool()

    # Test echo
    result = shell_tool.run(command="echo 'Hello Shell'")
    assert result.success is True
    assert "Hello Shell" in result.output

    # Test error
    result = shell_tool.run(command="ls /nonexistent_directory_12345")
    assert result.success is False
    assert result.error is not None
