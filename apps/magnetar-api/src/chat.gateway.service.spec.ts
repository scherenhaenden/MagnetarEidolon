import assert from 'node:assert/strict';
import test from 'node:test';

import type { Response as ExpressResponse } from 'express';

import {
  ChatGatewayService,
  type BackendChatRequest,
} from './chat.gateway.service.js';
import { ProviderRegistryService } from './provider-registry.service.js';

class TestChatGatewayService extends ChatGatewayService {
  public constructor(private readonly mockedFetchFn: (input: string, init?: RequestInit) => Promise<globalThis.Response>) {
    super(new ProviderRegistryService());
  }

  protected override getFetchFn(): (input: string, init?: RequestInit) => Promise<globalThis.Response> {
    return this.mockedFetchFn;
  }
}

function createSseResponse(chunks: string[], status = 200): globalThis.Response {
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    start(controller): void {
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(chunk));
      }

      controller.close();
    },
  });

  return new Response(stream, {
    status,
    headers: {
      'Content-Type': 'text/event-stream',
    },
  });
}

function createBackendRequest(
  overrides?: Partial<BackendChatRequest> & { prompt?: string },
): BackendChatRequest {
  return {
    prompt: overrides?.prompt ?? 'Hello from MagnetarEidolon',
    providerId: overrides?.providerId ?? 'provider-lmstudio',
    model: overrides?.model ?? 'ibm/granite-4-micro',
  };
}

function createResponseRecorder(): {
  response: ExpressResponse;
  statusCode: number | null;
  headers: Record<string, string>;
  body: string;
  jsonPayload: unknown;
  ended: boolean;
} {
  const state = {
    statusCode: null as number | null,
    headers: {} as Record<string, string>,
    body: '',
    jsonPayload: null as unknown,
    ended: false,
  };

  const response = {
    status(code: number): ExpressResponse {
      state.statusCode = code;
      return response as ExpressResponse;
    },
    json(payload: unknown): ExpressResponse {
      state.jsonPayload = payload;
      state.ended = true;
      return response as ExpressResponse;
    },
    setHeader(name: string, value: string): ExpressResponse {
      state.headers[name] = value;
      return response as ExpressResponse;
    },
    flushHeaders(): ExpressResponse {
      return response as ExpressResponse;
    },
    write(chunk: string): ExpressResponse {
      state.body += chunk;
      return response as ExpressResponse;
    },
    end(): ExpressResponse {
      state.ended = true;
      return response as ExpressResponse;
    },
  } as unknown as Partial<ExpressResponse>;

  return {
    response: response as ExpressResponse,
    get statusCode(): number | null {
      return state.statusCode;
    },
    get headers(): Record<string, string> {
      return state.headers;
    },
    get body(): string {
      return state.body;
    },
    get jsonPayload(): unknown {
      return state.jsonPayload;
    },
    get ended(): boolean {
      return state.ended;
    },
  };
}

test('ChatGatewayService normalizes native LM Studio deltas for the browser', async (): Promise<void> => {
  const fetchCalls: Array<{ input: string; init?: RequestInit }> = [];
  const fetchMock = async (
    input: string,
    init?: RequestInit,
  ): Promise<globalThis.Response> => {
    fetchCalls.push({ input, init });
    return createSseResponse([
      'event: message.delta\ndata: {"type":"message.delta","delta":"Hello"}\n\n',
      'event: message.delta\ndata: {"type":"message.delta","delta":" world"}\n\n',
      'event: chat.end\ndata: {"type":"chat.end","response":{"output":[{"type":"message","content":"Hello world"}]}}\n\n',
    ]);
  };

  const service = new TestChatGatewayService(fetchMock);
  const recorder = createResponseRecorder();

  await service.streamChat(createBackendRequest(), recorder.response);

  assert.equal(fetchCalls.length, 1);
  assert.ok(fetchCalls[0]?.input);
  assert.match(fetchCalls[0].input, /^http:\/\/127\.0\.0\.1:1234(?:\/[^/]+)*\/chat\/completions$/);
  assert.equal(fetchCalls[0]?.init?.method, 'POST');
  assert.equal(fetchCalls[0]?.init?.headers?.['Content-Type'], 'application/json');
  const requestBody = JSON.parse(String(fetchCalls[0]?.init?.body)) as {
    model: string;
    stream: boolean;
    messages: Array<{ role: string; content: string }>;
  };
  assert.equal(requestBody.model, 'ibm/granite-4-micro');
  assert.equal(requestBody.stream, true);
  assert.deepEqual(requestBody.messages, [
    {
      role: 'user',
      content: 'Hello from MagnetarEidolon',
    },
  ]);
  assert.match(recorder.body, /"type":"content\.delta","content":"Hello"/);
  assert.match(recorder.body, /"type":"content\.delta","content":" world"/);
  assert.match(recorder.body, /\[DONE\]/);
  assert.equal(recorder.statusCode, 200);
  assert.equal(recorder.headers['Content-Type'], 'text/event-stream');
  assert.equal(recorder.ended, true);
});

test('ChatGatewayService normalizes OpenAI-compatible deltas for the browser', async (): Promise<void> => {
  process.env.OPENROUTER_API_KEY = 'secret-openrouter-key';
  process.env.OPENROUTER_HTTP_REFERER = 'https://magnetar.example/chat';
  process.env.OPENROUTER_APP_TITLE = 'MagnetarEidolon Dev';
  const fetchCalls: Array<{ input: string; init?: RequestInit }> = [];
  const fetchMock = async (
    input: string,
    init?: RequestInit,
  ): Promise<globalThis.Response> => {
    fetchCalls.push({ input, init });
    return createSseResponse([
      'data: {"choices":[{"delta":{"content":"Alpha"}}]}\n\n',
      'data: {"choices":[{"delta":{"content":" Beta"}}]}\n\n',
      'data: [DONE]\n\n',
    ]);
  };

  const service = new TestChatGatewayService(fetchMock);
  const recorder = createResponseRecorder();

  await service.streamChat(
    createBackendRequest({
      providerId: 'provider-openrouter',
      model: 'openai/gpt-4.1-mini',
    }),
    recorder.response,
  );

  assert.equal(fetchCalls.length, 1);
  assert.match(fetchCalls[0]?.input ?? '', /^https:\/\/openrouter\.ai\/api\/v1\/chat\/completions$/);
  assert.equal(fetchCalls[0]?.init?.headers?.Authorization, 'Bearer secret-openrouter-key');
  assert.equal(fetchCalls[0]?.init?.headers?.['HTTP-Referer'], 'https://magnetar.example/chat');
  assert.equal(fetchCalls[0]?.init?.headers?.['X-Title'], 'MagnetarEidolon Dev');
  assert.match(recorder.body, /"content":"Alpha"/);
  assert.match(recorder.body, /"content":" Beta"/);
  assert.match(recorder.body, /\[DONE\]/);

  delete process.env.OPENROUTER_API_KEY;
  delete process.env.OPENROUTER_HTTP_REFERER;
  delete process.env.OPENROUTER_APP_TITLE;
});

test('ChatGatewayService returns upstream errors before opening the SSE stream', async (): Promise<void> => {
  const fetchMock = async (
    _input: string,
    _init?: RequestInit,
  ): Promise<globalThis.Response> =>
    new Response('{"error":{"message":"messages field is required"}}', {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  const service = new TestChatGatewayService(fetchMock);
  const recorder = createResponseRecorder();

  await service.streamChat(createBackendRequest(), recorder.response);

  assert.equal(recorder.statusCode, 400);
  assert.deepEqual(recorder.jsonPayload, {
    error: {
      message: '{"error":{"message":"messages field is required"}}',
    },
  });
});

test('ChatGatewayService rejects unknown provider ids before opening the SSE stream', async (): Promise<void> => {
  const fetchMock = async (): Promise<globalThis.Response> => {
    throw new Error('fetch should not be called');
  };

  const service = new TestChatGatewayService(fetchMock);
  const recorder = createResponseRecorder();

  await service.streamChat(
    {
      prompt: 'Hello from MagnetarEidolon',
      providerId: 'provider-missing',
      model: null,
    },
    recorder.response,
  );

  assert.equal(recorder.statusCode, 400);
  assert.deepEqual(recorder.jsonPayload, {
    error: {
      message: 'Unknown provider id: provider-missing.',
    },
  });
});

test('ChatGatewayService rejects OpenRouter requests when the backend API key is missing', async (): Promise<void> => {
  delete process.env.OPENROUTER_API_KEY;
  const fetchMock = async (): Promise<globalThis.Response> => {
    throw new Error('fetch should not be called');
  };

  const service = new TestChatGatewayService(fetchMock);
  const recorder = createResponseRecorder();

  await service.streamChat(
    {
      prompt: 'Hello from MagnetarEidolon',
      providerId: 'provider-openrouter',
      model: 'openai/gpt-4.1-mini',
    },
    recorder.response,
  );

  assert.equal(recorder.statusCode, 400);
  assert.deepEqual(recorder.jsonPayload, {
    error: {
      message: 'OpenRouter is not configured. Set the required backend API key before using this provider.',
    },
  });
});
