import pytest
from unittest.mock import MagicMock
from magnetar.core.agent import MagnetarAgent
from magnetar.core.model import MagnetarEidolon, Goal, Task, MemoryItem, ToolCall
from magnetar.tools.base import BaseTool, ToolResult
from magnetar.llm.provider import LLMResponse
from pydantic import BaseModel, Field

# Mock Tools
class EchoArgs(BaseModel):
    message: str

class EchoTool(BaseTool):
    name: str = "echo"
    description: str = "Echoes the input."
    args_schema: type[BaseModel] = EchoArgs

    def run(self, message: str) -> ToolResult:
        return ToolResult(success=True, output=f"ECHO: {message}")

# Mock LLM Provider
class MockLLMProvider:
    def generate(self, messages: list) -> LLMResponse:
        content = messages[0]["content"]
        if "Echoes the input" in content: # First call
            return LLMResponse(content='TOOL: echo\nARGS: {"message": "Hello"}', raw_response={}, usage={})
        else: # Subsequent calls
            return LLMResponse(content='FINAL: Done', raw_response={}, usage={})

# Mock Memory Store
class MockMemoryStore:
    def add_memory(self, content, metadata=None):
        pass
    def query_memory(self, query):
        pass
    def delete_memory(self, id):
        pass

def test_agent_loop():
    # Setup state
    goal = Goal(id="g1", description="Test Echo Tool")
    state = MagnetarEidolon(agent_id="test-agent", goal=goal, plan=[], short_term_memory=[], tool_history=[])

    # Setup mocks
    tools = [EchoTool()]
    memory = MockMemoryStore()
    llm = MockLLMProvider()

    agent = MagnetarAgent(state, tools, memory, llm)

    # Run one step
    # We mock _think to return a specific tool call first
    agent.llm.generate = MagicMock(return_value=LLMResponse(content='TOOL: echo\nARGS: {"message": "Hello"}', raw_response={}, usage={}))

    agent.step()

    # Verify tool was called
    assert len(state.tool_history) == 1
    assert state.tool_history[0].tool_name == "echo"
    assert state.tool_history[0].result == "ECHO: Hello"

    # Verify memory updated
    assert len(state.short_term_memory) >= 1
    assert "ECHO: Hello" in state.short_term_memory[-1].content

    # Run finish step
    agent.llm.generate = MagicMock(return_value=LLMResponse(content='FINAL: Finished', raw_response={}, usage={}))
    agent.step()

    assert state.goal.status == "completed"
    assert "Goal Completed" in state.short_term_memory[-1].content
