# LM Studio Integration Notes

## Local Startup
Load a model in LM Studio, then start the local API server.

GUI path:
- LM Studio
- Developer
- Start Server

CLI path:
```bash
lms server start
```

Default base URL:
```text
http://localhost:1234
```

## Current Magnetar Baseline
The first Magnetar integration target uses the **OpenAI-compatible LM Studio API**:

- `GET /v1/models`
- `POST /v1/chat/completions`

Default SDK assumptions:
- base URL: `http://localhost:1234/v1`
- API key: `lm-studio` (dummy value for compatibility)
- model: contributor-supplied

## Example Request Shape
```bash
curl http://localhost:1234/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama-3.2-3b-instruct",
    "messages": [
      {"role": "user", "content": "Hello"}
    ],
    "temperature": 0.7
  }'
```

## Integration Intent
- Keep LM Studio-specific transport inside the SDK provider adapter.
- Keep the Angular UI dependent on shared provider/runtime contracts only.
- Use the future in-app chat module as the main browser-side provider validation surface.

## Testing Focus
- provider reachable and model listed
- provider unreachable
- configured model missing
- successful chat completion
- readable error mapping for failed completion requests
