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
        """Sends a JSON payload to the specified path.
        
        This method constructs a POST request with the provided JSON payload  and
        appropriate headers. If authentication is required, it builds  the necessary
        headers using the `self.auth` object. The function  handles various exceptions
        that may arise during the request,  including validation errors, timeouts, HTTP
        status errors, and  request errors, raising a `ConnectorTransportException`
        with  relevant error details.
        
        Args:
            path (str): The endpoint to which the JSON payload is sent.
            payload (Dict[str, Any]): The JSON data to be sent in the request.
        """
        headers = {"Content-Type": "application/json"}
        if self.auth:
            headers.update(self.auth.build_headers())

        try:
            response = self._client.post(path, json=payload, headers=headers)
            response.raise_for_status()
            return response.json()
        except ValueError as exc:
            raise ConnectorTransportException(
                ConnectorError(type=ErrorType.VALIDATION, message=f"Invalid JSON in response: {exc}", retryable=False)
            ) from exc
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
                    message=f"Provider error: {status}",
                    retryable=status in {408, 429, 500, 502, 503, 504},
                    status_code=status,
                )
            ) from exc
        except httpx.RequestError as exc:
            raise ConnectorTransportException(
                ConnectorError(type=ErrorType.NETWORK, message=str(exc), retryable=True)
            ) from exc

    def close(self) -> None:
        """Close the client connection."""
        self._client.close()

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()


class ConnectorTransportException(RuntimeError):
    def __init__(self, error: ConnectorError):
        super().__init__(error.message)
        self.error = error


def _map_status_to_error_type(status_code: int) -> ErrorType:
    """Maps HTTP status codes to corresponding error types.
    
    This function takes an HTTP status code as input and returns the  associated
    ErrorType. It categorizes the status codes into  authentication errors, rate
    limits, timeouts, validation errors,  provider errors, and unknown errors based
    on predefined mappings.  The function utilizes a series of conditional checks
    to determine  the appropriate error type for the given status code.
    """
    if status_code in {401, 403}:
        return ErrorType.AUTHENTICATION
    if status_code == 429:
        return ErrorType.RATE_LIMIT
    if status_code == 408:
        return ErrorType.TIMEOUT
    if status_code in {400, 404, 422}:
        return ErrorType.VALIDATION
    if status_code in {500, 502, 503, 504}:
        return ErrorType.PROVIDER
    return ErrorType.UNKNOWN
