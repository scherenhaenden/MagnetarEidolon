from __future__ import annotations

from typing import Any, Dict, Optional

import httpx

from magnetar.api_connectors.auth import AuthStrategy
from magnetar.api_connectors.contracts import ConnectorError, ErrorType


class ApiHttpClient:
    """Thin HTTP client wrapper with auth + normalized error handling."""

    def __init__(
        self,
        base_url: str,
        timeout: float = 20.0,
        auth: Optional[AuthStrategy] = None,
        transport: Optional[httpx.BaseTransport] = None,
    ):
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout
        self.auth = auth
        self._client = httpx.Client(base_url=self.base_url, timeout=self.timeout, transport=transport)

    def post_json(self, path: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        headers = {"Content-Type": "application/json"}
        if self.auth:
            headers.update(self.auth.build_headers())

        try:
            response = self._client.post(path, json=payload, headers=headers)
            response.raise_for_status()
            return response.json()
        except httpx.TimeoutException as exc:
            raise ConnectorTransportException(
                ConnectorError(type=ErrorType.TIMEOUT, message=str(exc), retryable=True)
            ) from exc
        except httpx.HTTPStatusError as exc:
            status = exc.response.status_code
            mapped = _map_status_to_error_type(status)
            raise ConnectorTransportException(
                ConnectorError(
                    type=mapped,
                    message=exc.response.text,
                    retryable=status in {408, 429, 500, 502, 503, 504},
                    status_code=status,
                )
            ) from exc
        except httpx.RequestError as exc:
            raise ConnectorTransportException(
                ConnectorError(type=ErrorType.NETWORK, message=str(exc), retryable=True)
            ) from exc

    def close(self) -> None:
        self._client.close()


class ConnectorTransportException(RuntimeError):
    def __init__(self, error: ConnectorError):
        super().__init__(error.message)
        self.error = error


def _map_status_to_error_type(status_code: int) -> ErrorType:
    if status_code in {401, 403}:
        return ErrorType.AUTHENTICATION
    if status_code == 429:
        return ErrorType.RATE_LIMIT
    if status_code in {400, 404, 422}:
        return ErrorType.VALIDATION
    if status_code in {500, 502, 503, 504}:
        return ErrorType.PROVIDER
    return ErrorType.UNKNOWN
