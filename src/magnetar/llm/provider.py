from typing import List, Dict, Any, Optional, Union
import litellm
from pydantic import BaseModel

class LLMResponse(BaseModel):
    content: str
    raw_response: Dict[str, Any]
    usage: Dict[str, int]

class LLMProvider:
    """Wrapper around LiteLLM for model-agnostic generation."""

    def __init__(self, model: str = "gpt-3.5-turbo", api_key: Optional[str] = None):
        self.model = model
        self.api_key = api_key
        # litellm handles API keys via environment variables usually, but can be passed explicitly

    def generate(self, messages: List[Dict[str, str]], **kwargs) -> LLMResponse:
        """
        Generate a response from the LLM.
        messages format: [{"role": "user", "content": "..."}]
        """
        try:
            response = litellm.completion(
                model=self.model,
                messages=messages,
                api_key=self.api_key,
                **kwargs
            )

            content = response.choices[0].message.content
            usage = response.usage.dict() if hasattr(response, 'usage') else {}

            return LLMResponse(
                content=content or "",
                raw_response=response.model_dump() if hasattr(response, 'model_dump') else {},
                usage=usage
            )
        except Exception as e:
            # Re-raise or handle gracefully. For now, re-raise with context.
            raise RuntimeError(f"LLM generation failed: {str(e)}") from e
