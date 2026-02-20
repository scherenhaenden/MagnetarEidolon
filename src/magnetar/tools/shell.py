import subprocess
import shlex
import sys
import shutil
from pydantic import BaseModel, Field
from magnetar.tools.base import BaseTool, ToolResult

class ShellCommandArgs(BaseModel):
    command: str = Field(..., description="The shell command to execute.")

class ShellCommandTool(BaseTool):
    name: str = "run_shell"
    description: str = "Executes a shell command and returns the output."
    args_schema: type[BaseModel] = ShellCommandArgs

    def run(self, command: str) -> ToolResult:
        try:
            # For security, we might want to restrict this tool, but for now we follow the architecture.
            # Using shlex.split for safer command parsing if not shell=True,
            # but shell=True is needed for pipes and redirects which are common in agent tasks.

            # Platform detection for shell
            shell = True
            executable = None
            if sys.platform == "win32":
                executable = "powershell.exe" # Or cmd.exe
            else:
                # Use shutil.which to find bash, fallback to sh if bash not found
                bash_path = shutil.which("bash")
                executable = bash_path if bash_path else "/bin/sh"

            result = subprocess.run(
                command,
                shell=True,
                capture_output=True,
                text=True,
                executable=executable,
                timeout=60 # Prevent hanging
            )

            if result.returncode == 0:
                return ToolResult(success=True, output=result.stdout.strip())
            else:
                return ToolResult(success=False, error=result.stderr.strip(), output=result.stdout.strip())
        except subprocess.TimeoutExpired:
            return ToolResult(success=False, error="Command timed out.")
        except Exception as e:
            return ToolResult(success=False, error=str(e))
