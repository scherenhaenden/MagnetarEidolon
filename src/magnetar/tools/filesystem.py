import os
import shutil
from pathlib import Path
from typing import Optional
from pydantic import BaseModel, Field
from magnetar.tools.base import BaseTool, ToolResult

class FileReadArgs(BaseModel):
    filepath: str = Field(..., description="The path of the file to read.")

class FileReadTool(BaseTool):
    name: str = "read_file"
    description: str = "Reads the content of a file."
    args_schema: type[BaseModel] = FileReadArgs

    def run(self, filepath: str) -> ToolResult:
        try:
            path = Path(filepath)
            if not path.exists():
                return ToolResult(success=False, error=f"File not found: {filepath}")
            if not path.is_file():
                return ToolResult(success=False, error=f"Not a file: {filepath}")

            content = path.read_text(encoding='utf-8')
            return ToolResult(success=True, output=content)
        except Exception as e:
            return ToolResult(success=False, error=str(e))

class FileWriteArgs(BaseModel):
    filepath: str = Field(..., description="The path of the file to write.")
    content: str = Field(..., description="The content to write to the file.")

class FileWriteTool(BaseTool):
    name: str = "write_file"
    description: str = "Writes content to a file, overwriting it if it exists."
    args_schema: type[BaseModel] = FileWriteArgs

    def run(self, filepath: str, content: str) -> ToolResult:
        try:
            path = Path(filepath)
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(content, encoding='utf-8')
            return ToolResult(success=True, output=f"Successfully wrote to {filepath}")
        except Exception as e:
            return ToolResult(success=False, error=str(e))

class ListDirectoryArgs(BaseModel):
    path: str = Field(".", description="The directory path to list.")

class ListDirectoryTool(BaseTool):
    name: str = "list_files"
    description: str = "Lists files and directories in the specified path."
    args_schema: type[BaseModel] = ListDirectoryArgs

    def run(self, path: str = ".") -> ToolResult:
        try:
            dir_path = Path(path)
            if not dir_path.exists():
                return ToolResult(success=False, error=f"Directory not found: {path}")
            if not dir_path.is_dir():
                return ToolResult(success=False, error=f"Not a directory: {path}")

            items = []
            for item in dir_path.iterdir():
                items.append(f"{item.name}{'/' if item.is_dir() else ''}")

            return ToolResult(success=True, output="\n".join(sorted(items)))
        except Exception as e:
            return ToolResult(success=False, error=str(e))
