from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any, Dict

from magnetar.api_connectors.contracts import (
    ConnectorError,
    ErrorType,
    GenerationRequest,
    GenerationResponse,
)
from magnetar.api_connectors.http_client import ApiHttpClient, ConnectorTransportException


class BaseConnectorAdapter(ABC):
    provider_name: str

    @abstractmethod
    def generate(self, request: GenerationRequest) -> GenerationResponse:
        """Generates a response based on the given request."""
        raise NotImplementedError


class OpenAICompatibleAdapter(BaseConnectorAdapter):
    provider_name = "openai_compatible"

    def __init__(self, client: ApiHttpClient):
        self.client = client

    def generate(self, request: GenerationRequest) -> GenerationResponse:
        """def generate(self, request: GenerationRequest) -> GenerationResponse:
        Generates a response based on the provided generation request.  This function
        constructs a payload from the given GenerationRequest,  including optional
        parameters such as temperature and max_tokens.  It then sends a request to the
        chat completions endpoint and processes  the response. If the response is
        valid, it extracts the content and  usage information, returning a
        GenerationResponse. In case of errors,  it handles specific exceptions and
        returns an appropriate error message  within the GenerationResponse.
        
        Args:
            request (GenerationRequest): The request object containing model"""
        payload: Dict[str, Any] = {
            "model": request.model,
            "messages": request.messages,
        }
        if request.temperature is not None:
            payload["temperature"] = request.temperature
        if request.max_tokens is not None:
            payload["max_tokens"] = request.max_tokens

        try:
            raw = self.client.post_json("/v1/chat/completions", payload)
            content = raw["choices"][0]["message"]["content"]
            usage = raw.get("usage", {})
            return GenerationResponse(
                provider=self.provider_name,
                model=request.model,
                content=content,
                raw_response=raw,
                usage={k: int(v) for k, v in usage.items() if isinstance(v, (int, float))},
            )
        except ConnectorTransportException as exc:
            return GenerationResponse(
                provider=self.provider_name,
                model=request.model,
                content="",
                error=exc.error,
            )
        except (KeyError, IndexError, TypeError, ValueError) as exc:
            return GenerationResponse(
                provider=self.provider_name,
                model=request.model,
                content="",
                error=ConnectorError(
                    type=ErrorType.PROVIDER,
                    message=f"Invalid response format: {exc}",
                    retryable=False,
                ),
            )


class OllamaAdapter(BaseConnectorAdapter):
    provider_name = "ollama"

    def __init__(self, client: ApiHttpClient):
        self.client = client

    def generate(self, request: GenerationRequest) -> GenerationResponse:
        """Generates a response based on the provided generation request."""
        try:
            prompt = "\n".join([f"{m['role']}: {m['content']}" for m in request.messages])
            payload: Dict[str, Any] = {
                "model": request.model,
                "prompt": prompt,
                "stream": False,
            }

            raw = self.client.post_json("/api/generate", payload)
            content = raw.get("response", "")
            usage = {
                "prompt_tokens": int(raw.get("prompt_eval_count", 0)),
                "completion_tokens": int(raw.get("eval_count", 0)),
                "total_tokens": int(raw.get("prompt_eval_count", 0)) + int(raw.get("eval_count", 0)),
            }
            return GenerationResponse(
                provider=self.provider_name,
                model=request.model,
                content=content,
                raw_response=raw,
                usage=usage,
            )
        except ConnectorTransportException as exc:
            return GenerationResponse(
                provider=self.provider_name,
                model=request.model,
                content="",
                error=exc.error,
            )
        except (KeyError, TypeError, ValueError) as exc:
            return GenerationResponse(
                provider=self.provider_name,
                model=request.model,
                content="",
                error=ConnectorError(
                    type=ErrorType.PROVIDER,
                    message=f"Invalid response format: {exc}",
                    retryable=False,
                ),
            )
