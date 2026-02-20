from __future__ import annotations

from enum import Enum
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class ErrorType(str, Enum):
    """Normalized error kinds produced by providers/adapters."""

    AUTHENTICATION = "authentication"
    RATE_LIMIT = "rate_limit"
    NETWORK = "network"
    PROVIDER = "provider"
    VALIDATION = "validation"
    TIMEOUT = "timeout"
    UNKNOWN = "unknown"


class ConnectorError(BaseModel):
    """Portable error contract for all connectors."""

    type: ErrorType = ErrorType.UNKNOWN
    message: str
    retryable: bool = False
    provider: Optional[str] = None
    status_code: Optional[int] = None
    details: Dict[str, Any] = Field(default_factory=dict)


class GenerationRequest(BaseModel):
    """Canonical generation request independent of provider API shape."""

    model: str
    messages: List[Dict[str, str]]
    temperature: Optional[float] = None
    max_tokens: Optional[int] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)


class GenerationResponse(BaseModel):
    """Canonical generation response independent of provider API shape."""

    provider: str
    model: str
    content: str
    raw_response: Dict[str, Any] = Field(default_factory=dict)
    usage: Dict[str, int] = Field(default_factory=dict)
    error: Optional[ConnectorError] = None

    @property
    def ok(self) -> bool:
        return self.error is None
