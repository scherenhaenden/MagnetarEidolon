from __future__ import annotations

from dataclasses import dataclass, field
from typing import Dict


class AuthStrategy:
    """Build authentication headers for connector requests."""

    def build_headers(self) -> Dict[str, str]:
        """Builds and returns an empty dictionary for headers."""
        return {}


@dataclass
class BearerTokenAuth(AuthStrategy):
    token: str = field(repr=False)

    def build_headers(self) -> Dict[str, str]:
        """Builds the authorization headers using the token."""
        return {"Authorization": f"Bearer {self.token}"}


@dataclass
class ApiKeyAuth(AuthStrategy):
    key_name: str
    key_value: str = field(repr=False)

    def build_headers(self) -> Dict[str, str]:
        """Builds a dictionary header with key and value."""
        return {self.key_name: self.key_value}
