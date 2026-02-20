from abc import ABC, abstractmethod
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class MemoryResult(BaseModel):
    success: bool
    data: Optional[Any] = None
    error: Optional[str] = None

class MemoryStore(ABC):
    """Abstract base class for memory storage."""

    @abstractmethod
    def add_memory(self, content: str, metadata: Dict[str, Any] = None) -> MemoryResult:
        """Add a memory item to the store."""
        pass

    @abstractmethod
    def query_memory(self, query: str, n_results: int = 5) -> MemoryResult:
        """Query memory for relevant items."""
        pass

    @abstractmethod
    def delete_memory(self, memory_id: str) -> MemoryResult:
        """Delete a memory item by ID."""
        pass
