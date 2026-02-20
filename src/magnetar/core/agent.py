from typing import List, Dict, Any, Optional
import uuid
import os
import sys
from datetime import datetime
from magnetar.core.model import MagnetarEidolon, Goal, Task, MemoryItem, ToolCall, EnvironmentSnapshot
from magnetar.tools.base import BaseTool
from magnetar.memory.store import MemoryStore
from magnetar.llm.provider import LLMProvider

class MagnetarAgent:
    """
    The Agent Core. Stateless processor that updates the MagnetarEidolon state.
    """
    def __init__(self,
                 state: MagnetarEidolon,
                 tools: List[BaseTool],
                 memory_store: MemoryStore,
                 llm_provider: LLMProvider):
        self.state = state
        self.tools = {t.name: t for t in tools}
        self.memory_store = memory_store
        self.llm = llm_provider

    def run(self, max_steps: int = 10):
        """Run the agent loop for a maximum number of steps."""
        step = 0
        while step < max_steps and self.state.goal.status not in ["completed", "failed"]:
            self.step()
            step += 1

    def step(self):
        # 1. Observe: Update environment snapshot
        """Execute one cycle of Observe, Think, Act, and Reflect."""
        self._observe()

        # 2. Think: Decide next action based on state
        action = self._think()

        # 3. Act: Execute the tool or update plan
        if action:
            self._act(action)

        # 4. Reflect: Store short-term memory to long-term if needed (simplified)
        self._reflect()

    def _observe(self):
        """Update the environment state."""
        self.state.environment = EnvironmentSnapshot(
            os=sys.platform,
            current_directory=os.getcwd(),
            timestamp=datetime.utcnow()
        )

    def _think(self) -> Optional[Dict[str, Any]]:
        """
        Consult the LLM to decide the next action.
        Returns a dict representing the action (e.g., {"tool": "name", "args": {}}).
        """
        # Construct prompt from state
        prompt = self._construct_prompt()

        # Call LLM
        response = self.llm.generate([{"role": "user", "content": prompt}])
        content = response.content.strip()

        # Parse response (Simplified: assuming LLM returns JSON-like string or specific format)
        if content.startswith("TOOL:"):
            lines = content.split("\n")
            tool_name = lines[0].replace("TOOL:", "").strip()
            args_str = "\n".join(lines[1:]).replace("ARGS:", "").strip()
            try:
                import json
                args = json.loads(args_str)
                return {"type": "tool", "name": tool_name, "args": args}
            except:
                return {"type": "error", "message": "Failed to parse arguments"}
        elif content.startswith("FINAL:"):
             return {"type": "finish", "message": content.replace("FINAL:", "").strip()}

        return None

    def _act(self, action: Dict[str, Any]):
        """Execute the decided action.
        
        This function processes an action based on its type, which can either be  a
        "tool" or "finish". If the action type is "tool", it checks if the  specified
        tool exists, executes it with the provided arguments, and  records the call
        along with its result in the tool history. If the tool  is not found, an error
        message is recorded. For the "finish" action,  it updates the goal status to
        "completed" and logs a completion message  in the short-term memory.
        """
        if action["type"] == "tool":
            tool_name = action["name"]
            if tool_name in self.tools:
                tool = self.tools[tool_name]
                result = tool.execute(**action["args"])

                # Record tool call
                call_record = ToolCall(
                    tool_name=tool_name,
                    arguments=action["args"],
                    result=result.output if result.success else None,
                    error=result.error if not result.success else None
                )
                self.state.tool_history.append(call_record)

                # Update memory with result
                self.state.short_term_memory.append(MemoryItem(
                    id=str(uuid.uuid4()),
                    content=f"Tool {tool_name} returned: {result.output or result.error}"
                ))
            else:
                 self.state.short_term_memory.append(MemoryItem(
                    id=str(uuid.uuid4()),
                    content=f"Error: Tool {tool_name} not found."
                ))

        elif action["type"] == "finish":
            self.state.goal.status = "completed"
            self.state.short_term_memory.append(MemoryItem(
                id=str(uuid.uuid4()),
                content=f"Goal Completed: {action['message']}"
            ))

    def _reflect(self):
        # Simplified: just persist the last memory item to Chroma
        """Persist the last memory item to Chroma if available."""
        if self.state.short_term_memory:
            last_mem = self.state.short_term_memory[-1]
            self.memory_store.add_memory(last_mem.content, metadata={"timestamp": str(last_mem.timestamp)})

    def _construct_prompt(self) -> str:
        """Build the prompt from the current state."""
        history = "\n".join([f"- {m.content}" for m in self.state.short_term_memory[-5:]])
        return f"""
You are Magnetar.
Goal: {self.state.goal.description}
Environment: {self.state.environment}
History:
{history}

Available Tools: {", ".join(self.tools.keys())}

Decide the next step.
Format:
TOOL: <name>
ARGS: <json_args>
OR
FINAL: <message>
"""
