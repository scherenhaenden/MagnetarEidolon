import { describe, expect, it, vi } from 'vitest';

import {
  buildConversationSummary,
  extractCanvasDocument,
  extractCopyText,
  parseChatBlocks,
} from '../src/app/core/models/chat.js';
import { ChatSessionService } from '../src/app/core/services/chat-session.service.js';
import { ProviderConfigService } from '../src/app/core/services/provider-config.service.js';

function createSseResponse(chunks: string[], status = 200): Response {
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
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

function createDeferredSseResponse(): {
  response: Response;
  push: (chunk: string) => void;
  close: () => void;
} {
  const encoder = new TextEncoder();
  let controllerRef: ReadableStreamDefaultController<Uint8Array> | null = null;

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controllerRef = controller;
    },
  });

  return {
    response: new Response(stream, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
      },
    }),
    push(chunk: string) {
      controllerRef?.enqueue(encoder.encode(chunk));
    },
    close() {
      controllerRef?.close();
    },
  };
}

describe('chat model helpers', () => {
  it('parses headings, lists, quotes, and code blocks', () => {
    const blocks = parseChatBlocks(`# Heading

Paragraph line one
line two

- alpha
- beta

> quoted

\`\`\`ts
console.log("hi");
\`\`\``);

    expect(blocks).toEqual([
      { type: 'heading', level: 1, text: 'Heading' },
      { type: 'paragraph', text: 'Paragraph line one line two' },
      { type: 'list', ordered: false, items: ['alpha', 'beta'] },
      { type: 'quote', text: 'quoted' },
      { type: 'code', language: 'ts', code: 'console.log("hi");' },
    ]);
  });

  it('returns an empty list for empty markdown', () => {
    expect(parseChatBlocks('   \n')).toEqual([]);
  });

  it('defaults unlabeled code fences to text', () => {
    expect(parseChatBlocks('```\nplain\n```')).toEqual([
      { type: 'code', language: 'text', code: 'plain' },
    ]);
  });

  it('extracts copy-safe text from supported block types', () => {
    expect(extractCopyText({ type: 'paragraph', text: 'hello' })).toBe('hello');
    expect(extractCopyText({ type: 'heading', level: 2, text: 'Title' })).toBe('Title');
    expect(extractCopyText({ type: 'quote', text: 'quoted' })).toBe('quoted');
    expect(extractCopyText({ type: 'list', ordered: true, items: ['a', 'b'] })).toBe('a\nb');
    expect(extractCopyText({ type: 'code', language: 'sql', code: 'select 1;' })).toBe('select 1;');
    expect(extractCopyText({ type: 'unexpected' } as never)).toBe('');
  });

  it('builds summaries and canvas documents from parsed messages', () => {
    const summary = buildConversationSummary({
      id: 'msg-user-1',
      role: 'user',
      phase: 'complete',
      providerLabel: null,
      rawText: 'Create a migration for users',
      blocks: parseChatBlocks('Create a migration for users'),
    });

    expect(summary).toEqual({
      id: 'msg-user-1',
      title: 'Create a migration for users',
      preview: 'Create a migration for users',
    });

    const canvas = extractCanvasDocument({
      id: 'msg-assistant-1',
      role: 'assistant',
      phase: 'complete',
      providerLabel: 'LM Studio Local',
      rawText: '```sql\nselect 1;\n```',
      blocks: parseChatBlocks('```sql\nselect 1;\n```'),
    });

    expect(canvas).toEqual({
      messageId: 'msg-assistant-1',
      title: 'Canvas from LM Studio Local response',
      content: 'select 1;',
      language: 'sql',
      renderKind: 'source',
      renderTitle: null,
    });

    expect(
      extractCanvasDocument({
        id: 'msg-assistant-2',
        role: 'assistant',
        phase: 'complete',
        providerLabel: 'LM Studio Local',
        rawText: 'No code here',
        blocks: parseChatBlocks('No code here'),
      }),
    ).toBeNull();

    expect(
      extractCanvasDocument({
        id: 'msg-assistant-3',
        role: 'assistant',
        phase: 'complete',
        providerLabel: null,
        rawText: '```txt\nartifact\n```',
        blocks: parseChatBlocks('```txt\nartifact\n```'),
      }),
    ).toEqual({
      messageId: 'msg-assistant-3',
      title: 'Canvas from assistant response',
      content: 'artifact',
      language: 'txt',
      renderKind: 'source',
      renderTitle: null,
    });

    expect(
      extractCanvasDocument({
        id: 'msg-assistant-html',
        role: 'assistant',
        phase: 'complete',
        providerLabel: 'LM Studio Local',
        rawText: '```html\n<!DOCTYPE html>\n<html><head><title>Sick Website</title></head><body><div>Hello canvas</div></body></html>\n```',
        blocks: parseChatBlocks(
          '```html\n<!DOCTYPE html>\n<html><head><title>Sick Website</title></head><body><div>Hello canvas</div></body></html>\n```',
        ),
      }),
    ).toEqual({
      messageId: 'msg-assistant-html',
      title: 'Canvas from LM Studio Local response',
      content: '<!DOCTYPE html>\n<html><head><title>Sick Website</title></head><body><div>Hello canvas</div></body></html>',
      language: 'html',
      renderKind: 'html',
      renderTitle: 'Sick Website',
    });

    expect(
      buildConversationSummary({
        id: 'msg-user-empty',
        role: 'user',
        phase: 'complete',
        providerLabel: null,
        rawText: '',
        blocks: [],
      }),
    ).toEqual({
      id: 'msg-user-empty',
      title: 'Untitled conversation',
      preview: '',
    });
  });

  it('detects html renderability from code content even when the language is not html', () => {
    expect(
      extractCanvasDocument({
        id: 'msg-assistant-content-html',
        role: 'assistant',
        phase: 'complete',
        providerLabel: 'LM Studio Local',
        rawText: '```text\n<section><h1>Canvas</h1></section>\n```',
        blocks: parseChatBlocks('```text\n<section><h1>Canvas</h1></section>\n```'),
      }),
    ).toEqual({
      messageId: 'msg-assistant-content-html',
      title: 'Canvas from LM Studio Local response',
      content: '<section><h1>Canvas</h1></section>',
      language: 'text',
      renderKind: 'html',
      renderTitle: null,
    });
  });

  it('returns a null render title when html content has no title tag', () => {
    expect(
      extractCanvasDocument({
        id: 'msg-assistant-html-no-title',
        role: 'assistant',
        phase: 'complete',
        providerLabel: 'LM Studio Local',
        rawText: '```html\n<div>No title here</div>\n```',
        blocks: parseChatBlocks('```html\n<div>No title here</div>\n```'),
      }),
    ).toEqual({
      messageId: 'msg-assistant-html-no-title',
      title: 'Canvas from LM Studio Local response',
      content: '<div>No title here</div>',
      language: 'html',
      renderKind: 'html',
      renderTitle: null,
    });
  });

  it('returns a null render title when the html title is blank', () => {
    expect(
      extractCanvasDocument({
        id: 'msg-assistant-html-empty-title',
        role: 'assistant',
        phase: 'complete',
        providerLabel: 'LM Studio Local',
        rawText: '```html\n<html><head><title>   </title></head><body><div>Blank title</div></body></html>\n```',
        blocks: parseChatBlocks(
          '```html\n<html><head><title>   </title></head><body><div>Blank title</div></body></html>\n```',
        ),
      }),
    ).toEqual({
      messageId: 'msg-assistant-html-empty-title',
      title: 'Canvas from LM Studio Local response',
      content: '<html><head><title>   </title></head><body><div>Blank title</div></body></html>',
      language: 'html',
      renderKind: 'html',
      renderTitle: null,
    });
  });
});

describe('ChatSessionService', () => {
  it('starts with a welcome message and current provider label', () => {
    const service = new ChatSessionService(new ProviderConfigService());

    expect(service.messages()).toHaveLength(1);
    expect(service.draft()).toBe('');
    expect(service.activeProviderLabel()).toBe('LM Studio Local');
    expect(service.conversationHistory()).toEqual([]);
  });

  it('ignores empty prompts', async () => {
    const service = new ChatSessionService(new ProviderConfigService());

    expect(await service.submitPrompt('   ')).toBe(false);
    expect(service.messages()).toHaveLength(1);
  });

  it('adds an error message when no provider is available', async () => {
    const providerConfigService = new ProviderConfigService();
    providerConfigService.disable('provider-lmstudio');
    providerConfigService.disable('provider-openai');
    providerConfigService.disable('provider-anthropic');

    const service = new ChatSessionService(providerConfigService);

    expect(service.activeProviderLabel()).toBe('No provider configured');
    expect(await service.submitPrompt('hello')).toBe(false);
    expect(service.messages().at(-1)?.phase).toBe('error');
    expect(service.messages().at(-1)?.rawText).toContain('No primary provider is configured');
  });

  it('streams a generic response and records conversation history', async () => {
    const providerConfigService = new ProviderConfigService();
    providerConfigService.setPrimary('provider-openai');

    const service = new ChatSessionService(providerConfigService);

    service.setDraft('Plan a provider diagnostic');

    expect(await service.submitDraft()).toBe(true);
    expect(service.isStreaming()).toBe(true);
    expect(service.messages()).toHaveLength(3);
    expect(service.messages()[1].role).toBe('user');
    expect(service.messages()[2].phase).toBe('streaming');

    service.completeStreaming();

    expect(service.isStreaming()).toBe(false);
    expect(service.messages()[2].phase).toBe('complete');
    expect(service.messages()[2].rawText).toContain('Chat Response');
    expect(service.conversationHistory()[0]?.preview).toContain('Plan a provider diagnostic');
  });

  it('streams LM Studio tokens into the chat and creates a canvas document for code responses', async () => {
    const fetchMock = vi.fn(async () =>
      createSseResponse([
        'data: {"type":"content.delta","content":"# SQL Result\\n\\n"}\n\n',
        'data: {"type":"content.delta","content":"```sql\\nALTER TABLE users\\n"}\n\n',
        'data: {"type":"content.delta","content":"ADD COLUMN last_login timestamptz;\\n```"}\n\n',
        'data: [DONE]\n\n',
      ]),
    );

    const service = new ChatSessionService(new ProviderConfigService(), fetchMock);

    expect(await service.submitPrompt('Generate a SQL migration')).toBe(true);
    await service.waitForIdle();

    expect(fetchMock).toHaveBeenCalledOnce();
    expect((fetchMock.mock.calls[0] as unknown as [string, RequestInit])[0]).toBe('/api/chat/stream');
    const requestBody = JSON.parse(
      ((fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1].body as string),
    ) as {
      prompt: string;
      providerId: string;
      model: string | null;
    };
    expect(requestBody).toEqual({
      prompt: 'Generate a SQL migration',
      providerId: 'provider-lmstudio',
      model: 'local-model',
    });
    expect(service.messages()[2].phase).toBe('complete');
    expect(service.canvasDocument()).not.toBeNull();
    expect(service.canvasDocument()?.language).toBe('sql');
    expect(service.canvasDocument()?.content).toContain('ALTER TABLE users');
    expect(service.openCanvasFromMessage('missing')).toBe(false);
  });

  it('streams OpenRouter tokens through the backend when OpenRouter is the primary provider', async () => {
    const fetchMock = vi.fn(async () =>
      createSseResponse([
        'data: {"type":"content.delta","content":"OpenRouter"}\n\n',
        'data: {"type":"content.delta","content":" response"}\n\n',
        'data: [DONE]\n\n',
      ]),
    );

    const providerConfigService = new ProviderConfigService();
    providerConfigService.setPrimary('provider-openrouter');
    const service = new ChatSessionService(providerConfigService, fetchMock);

    expect(await service.submitPrompt('Test OpenRouter')).toBe(true);
    await service.waitForIdle();

    expect(fetchMock).toHaveBeenCalledOnce();
    expect((fetchMock.mock.calls[0] as unknown as [string, RequestInit])[0]).toBe('/api/chat/stream');
    const requestBody = JSON.parse(
      ((fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1].body as string),
    ) as {
      prompt: string;
      providerId: string;
      model: string | null;
    };
    expect(requestBody).toEqual({
      prompt: 'Test OpenRouter',
      providerId: 'provider-openrouter',
      model: 'openai/gpt-4.1-mini',
    });
    expect(service.messages()[2].providerLabel).toBe('OpenRouter');
    expect(service.messages()[2].rawText).toBe('OpenRouter response');
    expect(service.messages()[2].phase).toBe('complete');
  });

  it('exposes live streaming state while LM Studio tokens are still arriving', async () => {
    const deferred = createDeferredSseResponse();
    const fetchMock = vi.fn(async () => deferred.response);
    const service = new ChatSessionService(new ProviderConfigService(), fetchMock);

    expect(await service.submitPrompt('Stream a migration')).toBe(true);
    expect(service.isStreaming()).toBe(true);

    deferred.push('data: {"type":"content.delta","content":"Partial"}\n\n');
    await Promise.resolve();

    expect(service.messages()[2].rawText).toBe('Partial');
    expect(service.messages()[2].phase).toBe('streaming');

    deferred.push('data: {"type":"content.delta","content":" output"}\n\n');
    deferred.push('data: [DONE]\n\n');
    deferred.close();
    await service.waitForIdle();

    expect(service.isStreaming()).toBe(false);
    expect(service.messages()[2].rawText).toBe('Partial output');
    expect(service.messages()[2].phase).toBe('complete');
  });

  it('does not clear a newer active stream promise when an older live stream settles', async () => {
    const deferred = createDeferredSseResponse();
    const fetchMock = vi.fn(async () => deferred.response);
    const service = new ChatSessionService(new ProviderConfigService(), fetchMock);

    expect(await service.submitPrompt('Stream a migration')).toBe(true);

    const replacementPromise = Promise.resolve();
    (service as any).activeStreamPromise = replacementPromise;

    deferred.push('data: {"type":"content.delta","content":"done"}\n\n');
    deferred.push('data: [DONE]\n\n');
    deferred.close();
    await Promise.resolve();
    await Promise.resolve();

    expect((service as any).activeStreamPromise).toBe(replacementPromise);
  });

  it('finalizes streamed content when LM Studio closes the stream without a done marker', async () => {
    const fetchMock = vi.fn(async () =>
      createSseResponse([
        'event: ping\n\n',
        'data: {"type":"content.delta","content":"tail"}',
      ]),
    );

    const service = new ChatSessionService(new ProviderConfigService(), fetchMock);

    expect(await service.submitPrompt('Generate code')).toBe(true);
    await service.waitForIdle();
    await Promise.resolve();

    expect(service.isStreaming()).toBe(false);
    expect(service.messages().at(-1)?.phase).toBe('complete');
    expect(service.messages().at(-1)?.rawText).toBe('tail');
  });

  it('handles an empty trailing stream buffer without failing', async () => {
    const fetchMock = vi.fn(async () =>
      createSseResponse(['data: {"type":"content.delta","content":"ok"}\n\n', '\n\n', 'data: [DONE]\n\n']),
    );

    const service = new ChatSessionService(new ProviderConfigService(), fetchMock);

    expect(await service.submitPrompt('Generate code')).toBe(true);
    await service.waitForIdle();

    expect(service.messages().at(-1)?.phase).toBe('complete');
    expect(service.messages().at(-1)?.rawText).toBe('ok');
  });

  it('accepts trailing LM Studio content from message.content when delta is absent', async () => {
    const fetchMock = vi.fn(async () =>
      createSseResponse(['data: {"type":"content.delta","content":"fallback tail"}']),
    );

    const service = new ChatSessionService(new ProviderConfigService(), fetchMock);

    expect(await service.submitPrompt('Generate code')).toBe(true);
    await service.waitForIdle();

    expect(service.messages().at(-1)?.phase).toBe('complete');
    expect(service.messages().at(-1)?.rawText).toBe('fallback tail');
  });

  it('accepts native LM Studio output items while streaming', async () => {
    const fetchMock = vi.fn(async () =>
      createSseResponse([
        'data: {"output":[{"type":"message","content":"Native "}]}\n\n',
        'data: {"output":[{"type":"message","content":"Native output"}]}\n\n',
        'data: [DONE]\n\n',
      ]),
    );

    const service = new ChatSessionService(new ProviderConfigService(), fetchMock);

    expect(await service.submitPrompt('Generate code')).toBe(true);
    await service.waitForIdle();

    expect(service.messages().at(-1)?.phase).toBe('complete');
    expect(service.messages().at(-1)?.rawText).toBe('Native output');
  });

  it('ignores empty native output items and accepts reasoning output content', async () => {
    const fetchMock = vi.fn(async () =>
      createSseResponse([
        'data: {"output":[{"type":"message"},{"type":"reasoning","content":"Reasoned output"}]}\n\n',
        'data: [DONE]\n\n',
      ]),
    );

    const service = new ChatSessionService(new ProviderConfigService(), fetchMock);

    expect(await service.submitPrompt('Explain this')).toBe(true);
    await service.waitForIdle();

    expect(service.messages().at(-1)?.phase).toBe('complete');
    expect(service.messages().at(-1)?.rawText).toBe('Reasoned output');
  });

  it('builds a backend chat request for OpenAI-compatible LM Studio providers', () => {
    const service = new ChatSessionService(new ProviderConfigService());

    const request = (service as any).buildBackendChatRequest('hello', {
      id: 'provider-lmstudio-openai',
      name: 'LM Studio Compat',
      kind: 'lm_studio',
      baseUrl: 'http://localhost:1234/v1',
      model: 'qwen/test',
      role: 'primary',
      priority: 1,
      health: 'healthy',
      apiStyle: 'openai-compatible',
    });

    expect(request).toEqual({
      prompt: 'hello',
      providerId: 'provider-lmstudio-openai',
      model: 'qwen/test',
    });
  });

  it('ignores empty trailing LM Studio payloads when prior content already exists', async () => {
    const fetchMock = vi.fn(async () =>
      createSseResponse([
        'data: {"choices":[{"delta":{"content":"partial"}}]}\n\n',
        'data: {"choices":[{"delta":{}}]}',
      ]),
    );

    const service = new ChatSessionService(new ProviderConfigService(), fetchMock);

    expect(await service.submitPrompt('Generate code')).toBe(true);
    await service.waitForIdle();

    expect(service.messages().at(-1)?.phase).toBe('complete');
    expect(service.messages().at(-1)?.rawText).toBe('partial');
  });

  it('can close the canvas and reopen it from the assistant message', async () => {
    const providerConfigService = new ProviderConfigService();
    providerConfigService.setPrimary('provider-openai');

    const service = new ChatSessionService(providerConfigService);

    await service.submitPrompt('Generate code');
    service.completeStreaming();

    const assistantMessageId = service.messages().at(-1)?.id ?? '';
    service.closeCanvas();

    expect(service.canvasDocument()).toBeNull();
    expect(service.openCanvasFromMessage(assistantMessageId)).toBe(true);
    expect(service.canvasDocument()?.messageId).toBe(assistantMessageId);
  });

  it('returns false when no stream is active', () => {
    const service = new ChatSessionService(new ProviderConfigService());

    expect(service.streamNextChunk()).toBe(false);
  });

  it('resolves waitForIdle immediately when no live stream is active', async () => {
    const service = new ChatSessionService(new ProviderConfigService());

    await expect(service.waitForIdle()).resolves.toBeUndefined();
  });

  it('handles defensive stream-finalization branches', async () => {
    const providerConfigService = new ProviderConfigService();
    providerConfigService.setPrimary('provider-openai');

    const service = new ChatSessionService(providerConfigService);

    await service.submitPrompt('hello');
    (service as any).pendingStream.remainingChunks = [];

    expect(service.streamNextChunk()).toBe(false);
    expect(service.isStreaming()).toBe(false);

    (service as any).finalizePendingStream();
    expect(service.isStreaming()).toBe(false);
    expect(service.openCanvasFromMessage(service.messages()[0].id)).toBe(false);

    (service as any).pendingStream = {
      messageId: 'missing-message',
      providerLabel: 'LM Studio Local',
      remainingChunks: [],
    };
    (service as any).pendingStreamState.set((service as any).pendingStream);
    (service as any).finalizePendingStream();
    expect(service.isStreaming()).toBe(false);
  });

  it('surfaces LM Studio errors in the assistant message when generation fails', async () => {
    const fetchMock = vi.fn(async () =>
      new Response(
        JSON.stringify({
          error: { message: 'Requested model is not loaded.' },
        }),
        { status: 400 },
      ),
    );

    const service = new ChatSessionService(new ProviderConfigService(), fetchMock);

    expect(await service.submitPrompt('Generate code')).toBe(false);
    expect(service.messages().at(-1)?.phase).toBe('error');
    expect(service.messages().at(-1)?.rawText).toContain('Requested model is not loaded.');
  });

  it('falls back to a generic LM Studio status error when the body has no message', async () => {
    const fetchMock = vi.fn(async () =>
      new Response(
        JSON.stringify({
          error: {},
        }),
        { status: 503 },
      ),
    );

    const service = new ChatSessionService(new ProviderConfigService(), fetchMock);

    expect(await service.submitPrompt('Generate code')).toBe(false);
    expect(service.messages().at(-1)?.rawText).toContain('LM Studio Local request failed with status 503.');
  });

  it('surfaces missing LM Studio completion content as an assistant error', async () => {
    const fetchMock = vi.fn(async () => createSseResponse(['data: {"type":"content.delta"}\n\n']));

    const service = new ChatSessionService(new ProviderConfigService(), fetchMock);

    expect(await service.submitPrompt('Generate code')).toBe(true);
    await service.waitForIdle();
    expect(service.messages().at(-1)?.phase).toBe('error');
    expect(service.messages().at(-1)?.rawText).toContain('LM Studio returned no streamed completion content.');
  });

  it('surfaces backend SSE error events as assistant errors', async () => {
    const fetchMock = vi.fn(async () =>
      createSseResponse(['data: {"type":"error","error":{"message":"LM Studio model is not loaded."}}\n\n']),
    );

    const service = new ChatSessionService(new ProviderConfigService(), fetchMock);

    expect(await service.submitPrompt('Generate code')).toBe(true);
    await service.waitForIdle();

    expect(service.messages().at(-1)?.phase).toBe('error');
    expect(service.messages().at(-1)?.rawText).toContain('LM Studio model is not loaded.');
  });

  it('surfaces trailing backend SSE error events as assistant errors', async () => {
    const fetchMock = vi.fn(async () =>
      createSseResponse(['data: {"type":"error","error":{"message":"LM Studio stream closed unexpectedly."}}']),
    );

    const service = new ChatSessionService(new ProviderConfigService(), fetchMock);

    expect(await service.submitPrompt('Generate code')).toBe(true);
    await service.waitForIdle();

    expect(service.messages().at(-1)?.phase).toBe('error');
    expect(service.messages().at(-1)?.rawText).toContain('LM Studio stream closed unexpectedly.');
  });

  it('surfaces a readable error when LM Studio returns no streaming body', async () => {
    const fetchMock = vi.fn(async () => new Response(null, { status: 200 }));

    const service = new ChatSessionService(new ProviderConfigService(), fetchMock);

    expect(await service.submitPrompt('Generate code')).toBe(false);
    expect(service.messages().at(-1)?.phase).toBe('error');
    expect(service.messages().at(-1)?.rawText).toContain(
      'LM Studio Local did not provide a readable streaming response body.',
    );
  });

  it('surfaces unknown thrown provider errors as a generic assistant error', async () => {
    const fetchMock = vi.fn(async () => {
      throw 'network down';
    });

    const service = new ChatSessionService(new ProviderConfigService(), fetchMock);

    expect(await service.submitPrompt('Generate code')).toBe(false);
    expect(service.messages().at(-1)?.rawText).toContain(
      'Unknown provider error while generating chat response.',
    );
  });

  it('records streaming failures on the assistant message when the LM Studio stream breaks mid-flight', async () => {
    const fetchMock = vi.fn(async () =>
      createSseResponse([
        'data: {"type":"content.delta","content":"partial"}\n\n',
        'data: {"type":"content.delta","content":invalid}\n\n',
      ]),
    );
    const service = new ChatSessionService(new ProviderConfigService(), fetchMock);

    expect(await service.submitPrompt('Generate code')).toBe(true);
    await service.waitForIdle();

    expect(service.messages().at(-1)?.phase).toBe('error');
    expect(service.messages().at(-1)?.rawText).toContain('partial');
    expect(service.messages().at(-1)?.rawText).toContain('Streaming error:');
  });

  it('clears live streaming state even when the target message no longer exists', () => {
    const service = new ChatSessionService(new ProviderConfigService());

    (service as any).liveStreamState.set({
      messageId: 'missing-message',
      providerLabel: 'LM Studio Local',
    });

    (service as any).finalizeLiveStream({
      messageId: 'missing-message',
      providerLabel: 'LM Studio Local',
    });

    expect(service.isStreaming()).toBe(false);
  });

  it('uses the generic provider error text when a non-Error value reaches live-stream failure handling', () => {
    const service = new ChatSessionService(new ProviderConfigService());

    (service as any).messageState.set([
      ...(service as any).messageState(),
      {
        id: 'assistant-999',
        role: 'assistant',
        phase: 'streaming',
        providerLabel: 'LM Studio Local',
        rawText: '',
        blocks: [],
      },
    ]);

    (service as any).failLiveStream(
      {
        messageId: 'assistant-999',
        providerLabel: 'LM Studio Local',
      },
      'network down',
      '',
    );

    expect(service.messages().at(-1)?.phase).toBe('error');
    expect(service.messages().at(-1)?.rawText).toContain(
      'Unknown provider error while generating chat response.',
    );
  });
});
