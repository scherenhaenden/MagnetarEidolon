from __future__ import annotations

from dataclasses import dataclass
from typing import Dict


class AuthStrategy:
    """Build authentication headers for connector requests."""

    def build_headers(self) -> Dict[str, str]:
        return {}


@dataclass
class BearerTokenAuth(AuthStrategy):
    token: str

    def build_headers(self) -> Dict[str, str]:
        return {"Authorization": f"Bearer {self.token}"}


@dataclass
class ApiKeyAuth(AuthStrategy):
    key_name: str
    key_value: str

    def build_headers(self) -> Dict[str, str]:
        return {self.key_name: self.key_value}
