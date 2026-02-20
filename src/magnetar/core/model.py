import json
from datetime import datetime
from typing import List, Dict, Optional, Any, Union
from pydantic import BaseModel, Field

class Goal(BaseModel):
    """Represents the high-level objective of the agent."""
    id: str
    description: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    status: str = "pending"  # pending, active, completed, failed

class Task(BaseModel):
    """A single unit of work derived from the goal."""
    id: str
    description: str
    status: str = "planned"  # planned, in_progress, completed, failed
    result: Optional[str] = None

class MemoryItem(BaseModel):
    """A piece of information stored in short-term or long-term memory."""
    id: str
    content: str
    embedding_id: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    metadata: Dict[str, Any] = Field(default_factory=dict)

class ToolCall(BaseModel):
    """Record of a tool invocation."""
    tool_name: str
    arguments: Dict[str, Any]
    result: Optional[str] = None
    error: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class EnvironmentSnapshot(BaseModel):
    """Snapshot of the environment state (e.g., current directory, OS)."""
    os: str
    current_directory: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class MagnetarEidolon(BaseModel):
    """
    The structured cognition state of the Magnetar agent.
    This model encapsulates the entire 'mind' of the agent and is serializable.
    """
    agent_id: str
    goal: Optional[Goal] = None
    plan: List[Task] = Field(default_factory=list)
    short_term_memory: List[MemoryItem] = Field(default_factory=list)
    tool_history: List[ToolCall] = Field(default_factory=list)
    environment: Optional[EnvironmentSnapshot] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)

    def to_json(self) -> str:
        """Serialize the state to a JSON string."""
        return self.model_dump_json(indent=2)

    @classmethod
    def from_json(cls, json_str: str) -> "MagnetarEidolon":
        """Deserialize the state from a JSON string."""
        return cls.model_validate_json(json_str)
