import assert from 'node:assert/strict';
import test from 'node:test';

import type { Response as ExpressResponse } from 'express';

import {
  ChatGatewayService,
  type BackendChatRequest,
} from './chat.gateway.service.js';

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
  overrides?: Partial<BackendChatRequest['provider']> & { prompt?: string },
): BackendChatRequest {
  return {
    prompt: overrides?.prompt ?? 'Hello from MagnetarEidolon',
    provider: {
      baseUrl: overrides?.baseUrl ?? 'http://127.0.0.1:1234/api/v1',
      model: overrides?.model ?? 'ibm/granite-4-micro',
      apiStyle: overrides?.apiStyle ?? 'native',
      apiKey: overrides?.apiKey ?? null,
    },
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

  const service = new ChatGatewayService(fetchMock);
  const recorder = createResponseRecorder();

  await service.streamChat(createBackendRequest(), recorder.response);

  assert.equal(fetchCalls.length, 1);
  assert.equal(fetchCalls[0]?.input, 'http://127.0.0.1:1234/api/v1/chat');
  assert.match(recorder.body, /"type":"content\.delta","content":"Hello"/);
  assert.match(recorder.body, /"type":"content\.delta","content":" world"/);
  assert.match(recorder.body, /\[DONE\]/);
  assert.equal(recorder.statusCode, 200);
  assert.equal(recorder.headers['Content-Type'], 'text/event-stream');
  assert.equal(recorder.ended, true);
});

test('ChatGatewayService normalizes OpenAI-compatible deltas for the browser', async (): Promise<void> => {
  const fetchMock = async (
    _input: string,
    _init?: RequestInit,
  ): Promise<globalThis.Response> =>
    createSseResponse([
      'data: {"choices":[{"delta":{"content":"Alpha"}}]}\n\n',
      'data: {"choices":[{"delta":{"content":" Beta"}}]}\n\n',
      'data: [DONE]\n\n',
    ]);

  const service = new ChatGatewayService(fetchMock);
  const recorder = createResponseRecorder();

  await service.streamChat(
    createBackendRequest({
      apiStyle: 'openai-compatible',
      baseUrl: 'http://127.0.0.1:1234/v1',
    }),
    recorder.response,
  );

  assert.match(recorder.body, /"content":"Alpha"/);
  assert.match(recorder.body, /"content":" Beta"/);
  assert.match(recorder.body, /\[DONE\]/);
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

  const service = new ChatGatewayService(fetchMock);
  const recorder = createResponseRecorder();

  await service.streamChat(createBackendRequest(), recorder.response);

  assert.equal(recorder.statusCode, 400);
  assert.deepEqual(recorder.jsonPayload, {
    error: {
      message: '{"error":{"message":"messages field is required"}}',
    },
  });
});
