import httpx

from magnetar.api_connectors import (
    ApiHttpClient,
    BearerTokenAuth,
    ErrorType,
    GenerationRequest,
    OllamaAdapter,
    OpenAICompatibleAdapter,
)


def _mock_transport(handler):
    return httpx.MockTransport(handler)


def test_openai_compatible_adapter_success():
    def handler(request: httpx.Request) -> httpx.Response:
        assert request.url.path == "/v1/chat/completions"
        assert request.headers["Authorization"] == "Bearer token"
        return httpx.Response(
            200,
            json={
                "choices": [{"message": {"content": "Hello from openai-compatible"}}],
                "usage": {"prompt_tokens": 3, "completion_tokens": 4, "total_tokens": 7},
            },
        )

    client = ApiHttpClient(
        base_url="http://localhost:8000",
        auth=BearerTokenAuth("token"),
        transport=_mock_transport(handler),
    )
    adapter = OpenAICompatibleAdapter(client)

    response = adapter.generate(
        GenerationRequest(model="gpt-local", messages=[{"role": "user", "content": "hi"}])
    )

    assert response.ok is True
    assert response.content == "Hello from openai-compatible"
    assert response.usage["total_tokens"] == 7


def test_ollama_adapter_success():
    def handler(request: httpx.Request) -> httpx.Response:
        assert request.url.path == "/api/generate"
        return httpx.Response(
            200,
            json={
                "response": "Hello from ollama",
                "prompt_eval_count": 5,
                "eval_count": 6,
            },
        )

    client = ApiHttpClient(
        base_url="http://localhost:11434",
        transport=_mock_transport(handler),
    )
    adapter = OllamaAdapter(client)

    response = adapter.generate(
        GenerationRequest(model="llama3", messages=[{"role": "user", "content": "hi"}])
    )

    assert response.ok is True
    assert response.content == "Hello from ollama"
    assert response.usage["total_tokens"] == 11


def test_adapter_maps_auth_error():
    def handler(_: httpx.Request) -> httpx.Response:
        return httpx.Response(401, json={"error": "Unauthorized"})

    client = ApiHttpClient(
        base_url="http://localhost:8000",
        auth=BearerTokenAuth("bad-token"),
        transport=_mock_transport(handler),
    )
    adapter = OpenAICompatibleAdapter(client)

    response = adapter.generate(
        GenerationRequest(model="gpt-local", messages=[{"role": "user", "content": "hi"}])
    )

    assert response.ok is False
    assert response.error is not None
    assert response.error.type == ErrorType.AUTHENTICATION
