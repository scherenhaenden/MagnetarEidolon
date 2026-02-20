from pydantic import BaseModel, Field, PrivateAttr

from magnetar.tools.base import BaseTool, ToolResult
from magnetar.tools.system_interaction import AuditLogger, PermissionPolicy, SystemInteractionModule


class ShellCommandArgs(BaseModel):
    command: str = Field(..., description="The shell command to execute.")


class ShellCommandTool(BaseTool):
    _module: SystemInteractionModule = PrivateAttr()
    name: str = "run_shell"
    description: str = "Executes a shell command and returns the output."
    args_schema: type[BaseModel] = ShellCommandArgs

    def __init__(self, **data):
        super().__init__(**data)
        policy = PermissionPolicy(denied_commands=["rm", "shutdown", "reboot"])
        self._module = SystemInteractionModule(policy=policy, audit_logger=AuditLogger())

    def run(self, command: str) -> ToolResult:
        try:
            result = self._module.run_command(command=command, timeout_s=60)
            if result is None:
                latest_event = self._module.audit.events()[-1]
                return ToolResult(success=False, error=latest_event.reason)

            if result.returncode == 0:
                return ToolResult(success=True, output=result.stdout.strip())
            return ToolResult(success=False, error=result.stderr.strip(), output=result.stdout.strip())
        except Exception as e:
            return ToolResult(success=False, error=str(e))
