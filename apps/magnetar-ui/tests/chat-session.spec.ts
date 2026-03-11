import { describe, expect, it, vi } from 'vitest';

import {
  buildConversationSummary,
  extractCanvasDocument,
  extractCopyText,
  parseChatBlocks,
} from '../src/app/core/models/chat.js';
import { ChatSessionService } from '../src/app/core/services/chat-session.service.js';
import { ProviderConfigService } from '../src/app/core/services/provider-config.service.js';

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

  it('calls LM Studio when it is the primary provider and creates a canvas document for code responses', async () => {
    const fetchMock = vi.fn(async () =>
      new Response(
        JSON.stringify({
          choices: [
            {
              message: {
                content: '# SQL Result\n\n```sql\nALTER TABLE users\nADD COLUMN last_login timestamptz;\n```',
              },
            },
          ],
        }),
        { status: 200 },
      ),
    );

    const service = new ChatSessionService(new ProviderConfigService(), fetchMock);

    expect(await service.submitPrompt('Generate a SQL migration')).toBe(true);
    service.completeStreaming();

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(service.canvasDocument()).not.toBeNull();
    expect(service.canvasDocument()?.language).toBe('sql');
    expect(service.canvasDocument()?.content).toContain('ALTER TABLE users');
    expect(service.openCanvasFromMessage('missing')).toBe(false);
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
    expect(service.messages().at(-1)?.rawText).toContain('LM Studio request failed with status 503.');
  });

  it('surfaces missing LM Studio completion content as an assistant error', async () => {
    const fetchMock = vi.fn(async () =>
      new Response(
        JSON.stringify({
          choices: [{ message: {} }],
        }),
        { status: 200 },
      ),
    );

    const service = new ChatSessionService(new ProviderConfigService(), fetchMock);

    expect(await service.submitPrompt('Generate code')).toBe(false);
    expect(service.messages().at(-1)?.phase).toBe('error');
    expect(service.messages().at(-1)?.rawText).toContain('LM Studio returned no completion content.');
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
});
