import pytest
from unittest.mock import MagicMock, patch
from magnetar.llm.provider import LLMProvider, LLMResponse

def test_llm_provider_generate():
    provider = LLMProvider(model="gpt-3.5-turbo")

    # Mock litellm.completion
    with patch('litellm.completion') as mock_completion:
        # Construct a mock response object that mimics the OpenAI API response structure
        mock_response = MagicMock()
        mock_response.choices = [MagicMock(message=MagicMock(content="Hello, world!"))]
        mock_response.usage = MagicMock()
        mock_response.usage.dict.return_value = {"prompt_tokens": 10, "completion_tokens": 5, "total_tokens": 15}
        mock_response.model_dump.return_value = {"id": "chatcmpl-123"}

        mock_completion.return_value = mock_response

        messages = [{"role": "user", "content": "Hi"}]
        result = provider.generate(messages)

        assert isinstance(result, LLMResponse)
        assert result.content == "Hello, world!"
        assert result.usage["total_tokens"] == 15

        # Verify litellm was called correctly
        mock_completion.assert_called_once()
        args, kwargs = mock_completion.call_args
        assert kwargs["model"] == "gpt-3.5-turbo"
        assert kwargs["messages"] == messages
