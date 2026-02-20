from abc import ABC, abstractmethod
from typing import Any, Dict, Optional, Type
from pydantic import BaseModel, Field

class ToolResult(BaseModel):
    """The result of a tool execution."""
    success: bool
    output: Optional[str] = None
    error: Optional[str] = None
    data: Optional[Dict[str, Any]] = None

class BaseTool(ABC, BaseModel):
    """Abstract base class for all tools."""
    name: str
    description: str
    args_schema: Type[BaseModel]

    @abstractmethod
    def run(self, **kwargs) -> ToolResult:
        """Execute the tool logic."""
        pass

    def execute(self, **kwargs) -> ToolResult:
        """Validate arguments and run the tool."""
        try:
            # Validate arguments against the schema
            validated_args = self.args_schema(**kwargs)
            return self.run(**validated_args.model_dump())
        except Exception as e:
            return ToolResult(success=False, error=str(e))
