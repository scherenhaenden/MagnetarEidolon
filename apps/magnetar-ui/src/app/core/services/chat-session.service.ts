import { computed, signal } from '@angular/core';

import {
  ChatCanvasDocument,
  ChatConversationSummary,
  ChatMessage,
  buildConversationSummary,
  extractCanvasDocument,
  parseChatBlocks,
} from '../models/chat.js';
import type { ProviderConfig } from '../models/provider-config.js';
import { ProviderConfigService } from './provider-config.service.js';

interface PendingStream {
  messageId: string;
  providerLabel: string;
  remainingChunks: string[];
}

interface ActiveLiveStream {
  messageId: string;
  providerLabel: string;
}

interface FetchLike {
  (input: string, init?: RequestInit): Promise<Response>;
}

interface LMStudioChatCompletionResponse {
  choices?: Array<{
    delta?: {
      content?: string;
    };
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message?: string;
  };
  output?: Array<{
    type?: string;
    content?: string;
  }>;
}

interface BackendChatStreamRequest {
  prompt: string;
  provider: {
    baseUrl: string;
    model: string;
    apiStyle: 'native' | 'openai-compatible';
    apiKey: string | null;
  };
}

const WELCOME_MESSAGE = buildAssistantMessage(
  'msg-assistant-welcome',
  'Magnetar chat is ready. Ask for a task, inspect provider behavior, or open generated code in the canvas panel.',
  'System Ready',
  'complete',
);

export class ChatSessionService {
  private readonly messageState = signal<ChatMessage[]>([WELCOME_MESSAGE]);
  private readonly draftState = signal('');
  private readonly canvasState = signal<ChatCanvasDocument | null>(null);
  private readonly pendingStreamState = signal<PendingStream | null>(null);
  private readonly liveStreamState = signal<ActiveLiveStream | null>(null);
  private pendingStream: PendingStream | null = null;
  private activeStreamPromise: Promise<void> | null = null;
  private nextId = 1;

  public readonly messages = computed(() => this.messageState());
  public readonly draft = computed(() => this.draftState());
  public readonly activeProviderLabel = computed(
    () => this.providerConfigService.primaryProvider()?.name ?? 'No provider configured',
  );
  public readonly isStreaming = computed(
    () => this.pendingStreamState() !== null || this.liveStreamState() !== null,
  );
  public readonly conversationHistory = computed<ChatConversationSummary[]>(() =>
    this.messageState()
      .filter((message) => message.role === 'user')
      .map((message) => buildConversationSummary(message))
      .reverse(),
  );
  public readonly canvasDocument = computed(() => this.canvasState());

  public constructor(
    private readonly providerConfigService: ProviderConfigService,
    private readonly fetchFn: FetchLike = globalThis.fetch.bind(globalThis),
  ) {}

  public setDraft(value: string): void {
    this.draftState.set(value);
  }

  public submitDraft(): Promise<boolean> {
    return this.submitPrompt(this.draftState());
  }

  public async submitPrompt(prompt: string): Promise<boolean> {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) {
      return false;
    }

    this.draftState.set('');
    this.canvasState.set(null);

    const provider = this.providerConfigService.primaryProvider();
    if (!provider) {
      this.messageState.update((messages) => [
        ...messages,
        buildAssistantMessage(
          this.allocateMessageId('assistant-error'),
          'No primary provider is configured. Configure a provider before using chat.',
          'Provider Missing',
          'error',
        ),
      ]);
      return false;
    }

    const userMessage = buildUserMessage(this.allocateMessageId('user'), trimmedPrompt);
    const assistantMessageId = this.allocateMessageId('assistant');

    this.messageState.update((messages) => [
      ...messages,
      userMessage,
      buildAssistantMessage(assistantMessageId, '', provider.name, 'streaming'),
    ]);

    if (provider.kind === 'lm_studio') {
      try {
        await this.startLiveLMStudioStream(trimmedPrompt, provider, assistantMessageId);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown provider error while generating chat response.';
        this.messageState.update((messages) =>
          messages.map((message) =>
            message.id === assistantMessageId
              ? buildAssistantMessage(assistantMessageId, errorMessage, provider.name, 'error')
              : message,
          ),
        );
        return false;
      }

      return true;
    }

    const responseText = await this.resolveSyntheticResponseText(trimmedPrompt, provider);
    const responseChunks = chunkText(responseText, 96);
    this.pendingStream = {
      messageId: assistantMessageId,
      providerLabel: provider.name,
      remainingChunks: responseChunks,
    };
    this.pendingStreamState.set(this.pendingStream);

    this.streamNextChunk();
    return true;
  }

  public streamNextChunk(): boolean {
    if (!this.pendingStream) {
      return false;
    }

    const nextChunk = this.pendingStream.remainingChunks.shift();
    if (nextChunk === undefined) {
      this.finalizePendingStream();
      return false;
    }

    this.messageState.update((messages) =>
      messages.map((message) => {
        if (message.id !== this.pendingStream?.messageId) {
          return message;
        }

        const rawText = `${message.rawText}${nextChunk}`;
        return {
          ...message,
          rawText,
          blocks: parseChatBlocks(rawText),
          phase: this.pendingStream.remainingChunks.length === 0 ? 'complete' : 'streaming',
        };
      }),
    );

    if (this.pendingStream.remainingChunks.length === 0) {
      this.finalizePendingStream();
    }

    return true;
  }

  public completeStreaming(): void {
    while (this.streamNextChunk()) {
      continue;
    }
  }

  public async waitForIdle(): Promise<void> {
    if (this.activeStreamPromise) {
      await this.activeStreamPromise;
    }
  }

  public openCanvasFromMessage(messageId: string): boolean {
    const message = this.messageState().find((candidate) => candidate.id === messageId);
    if (!message) {
      return false;
    }

    const canvasDocument = extractCanvasDocument(message);
    if (!canvasDocument) {
      return false;
    }

    this.canvasState.set(canvasDocument);
    return true;
  }

  public closeCanvas(): void {
    this.canvasState.set(null);
  }

  private finalizePendingStream(): void {
    if (!this.pendingStream) {
      return;
    }

    const completedMessage = this.messageState().find(
      (message) => message.id === this.pendingStream?.messageId,
    );
    if (completedMessage) {
      const canvasDocument = extractCanvasDocument(completedMessage);
      if (canvasDocument) {
        this.canvasState.set(canvasDocument);
      }
    }

    this.pendingStream = null;
    this.pendingStreamState.set(null);
  }

  private allocateMessageId(prefix: string): string {
    const id = `${prefix}-${this.nextId}`;
    this.nextId += 1;
    return id;
  }

  private async startLiveLMStudioStream(
    prompt: string,
    provider: ProviderConfig,
    assistantMessageId: string,
  ): Promise<void> {
    const request = this.buildBackendChatRequest(prompt, provider);
    const response = await this.fetchFn('/api/chat/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const json = (await response.json()) as LMStudioChatCompletionResponse;
      throw new Error(json.error?.message ?? `LM Studio request failed with status ${response.status}.`);
    }

    if (!response.body) {
      throw new Error('LM Studio did not provide a readable streaming response body.');
    }

    const liveStream = {
      messageId: assistantMessageId,
      providerLabel: provider.name,
    };
    this.liveStreamState.set(liveStream);

    const streamPromise = this.consumeLMStudioStream(response.body, liveStream);
    const settledStreamPromise = streamPromise.catch(() => undefined);
    this.activeStreamPromise = settledStreamPromise;

    try {
      await Promise.resolve();
    } finally {
      void settledStreamPromise.finally(() => {
        if (this.activeStreamPromise === settledStreamPromise) {
          this.activeStreamPromise = null;
        }
      });
    }
  }

  private async consumeLMStudioStream(
    stream: ReadableStream<Uint8Array>,
    liveStream: ActiveLiveStream,
  ): Promise<void> {
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let accumulatedContent = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const segments = buffer.split('\n\n');
        buffer = segments.pop() as string;

        for (const segment of segments) {
          const data = parseSseEvent(segment);
          if (!data) {
            continue;
          }

          if (data === '[DONE]') {
            this.finalizeLiveStream(liveStream);
            return;
          }

          const payload = JSON.parse(data) as LMStudioChatCompletionResponse;
          const nextText = extractStreamText(payload);
          if (typeof nextText !== 'string' || nextText.length === 0) {
            continue;
          }

          accumulatedContent = mergeStreamText(accumulatedContent, nextText);
          this.appendAssistantChunk(liveStream.messageId, accumulatedContent);
        }
      }

      buffer += decoder.decode();
      const trailingData = parseSseEvent(buffer);
      if (trailingData && trailingData !== '[DONE]') {
        const payload = JSON.parse(trailingData) as LMStudioChatCompletionResponse;
        const nextText = extractStreamText(payload);
        if (typeof nextText === 'string' && nextText.length > 0) {
          accumulatedContent = mergeStreamText(accumulatedContent, nextText);
          this.appendAssistantChunk(liveStream.messageId, accumulatedContent);
        }
      }

      if (!accumulatedContent.trim()) {
        throw new Error('LM Studio returned no streamed completion content.');
      }

      this.finalizeLiveStream(liveStream);
    } catch (error) {
      this.failLiveStream(liveStream, error, accumulatedContent);
      throw error;
    } finally {
      reader.releaseLock();
    }
  }

  private appendAssistantChunk(messageId: string, rawText: string): void {
    this.messageState.update((messages) =>
      messages.map((message) =>
        message.id === messageId
          ? {
              ...message,
              rawText,
              blocks: parseChatBlocks(rawText),
              phase: 'streaming',
            }
          : message,
      ),
    );
  }

  private finalizeLiveStream(liveStream: ActiveLiveStream): void {
    const completedMessage = this.messageState().find((message) => message.id === liveStream.messageId);

    if (completedMessage) {
      this.messageState.update((messages) =>
        messages.map((message) =>
          message.id === liveStream.messageId ? { ...message, phase: 'complete' } : message,
        ),
      );

      const canvasDocument = extractCanvasDocument(completedMessage);
      if (canvasDocument) {
        this.canvasState.set(canvasDocument);
      }
    }

    this.liveStreamState.set(null);
  }

  private failLiveStream(
    liveStream: ActiveLiveStream,
    error: unknown,
    accumulatedContent: string,
  ): void {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown provider error while generating chat response.';

    this.messageState.update((messages) =>
      messages.map((message) => {
        if (message.id !== liveStream.messageId) {
          return message;
        }

        const rawText =
          accumulatedContent.trim().length > 0
            ? `${accumulatedContent}\n\n[Streaming error: ${errorMessage}]`
            : errorMessage;
        return {
          ...message,
          rawText,
          blocks: parseChatBlocks(rawText),
          phase: 'error',
        };
      }),
    );

    this.liveStreamState.set(null);
  }

  private async resolveSyntheticResponseText(prompt: string, provider: ProviderConfig): Promise<string> {
    return generateAssistantResponse(prompt, provider.name);
  }

  private buildBackendChatRequest(
    prompt: string,
    provider: ProviderConfig,
  ): BackendChatStreamRequest {
    return {
      prompt,
      provider: {
        baseUrl: provider.baseUrl,
        model: provider.model,
        apiStyle: provider.apiStyle,
        apiKey: null,
      },
    };
  }
}

function buildUserMessage(id: string, prompt: string): ChatMessage {
  return {
    id,
    role: 'user',
    phase: 'complete',
    providerLabel: null,
    rawText: prompt,
    blocks: parseChatBlocks(prompt),
  };
}

function buildAssistantMessage(
  id: string,
  text: string,
  providerLabel: string,
  phase: ChatMessage['phase'],
): ChatMessage {
  return {
    id,
    role: 'assistant',
    phase,
    providerLabel,
    rawText: text,
    blocks: parseChatBlocks(text),
  };
}

function chunkText(text: string, chunkSize: number): string[] {
  const chunks: string[] = [];

  for (let index = 0; index < text.length; index += chunkSize) {
    chunks.push(text.slice(index, index + chunkSize));
  }

  return chunks;
}

function parseSseEvent(eventChunk: string): string | null {
  const trimmed = eventChunk.trim();
  if (!trimmed) {
    return null;
  }

  const payload = trimmed
    .split('\n')
    .filter((line) => line.startsWith('data:'))
    .map((line) => line.slice(5).trimStart())
    .join('\n')
    .trim();

  return payload || null;
}

function extractStreamText(payload: LMStudioChatCompletionResponse): string | null {
  const openAiCompatibleText =
    payload.choices?.[0]?.delta?.content ?? payload.choices?.[0]?.message?.content;
  if (typeof openAiCompatibleText === 'string' && openAiCompatibleText.length > 0) {
    return openAiCompatibleText;
  }

  const nativeOutputText = (payload.output ?? [])
    .filter((item) => item.type === 'message' || item.type === 'reasoning')
    .map((item) => item.content ?? '')
    .join('');

  return nativeOutputText.length > 0 ? nativeOutputText : null;
}

function mergeStreamText(previousText: string, nextText: string): string {
  if (nextText.startsWith(previousText)) {
    return nextText;
  }

  return `${previousText}${nextText}`;
}

function generateAssistantResponse(prompt: string, providerLabel: string): string {
  const normalizedPrompt = prompt.toLowerCase();

  if (
    normalizedPrompt.includes('migration') ||
    normalizedPrompt.includes('sql') ||
    normalizedPrompt.includes('code')
  ) {
    return `# Delivery Plan

Provider: ${providerLabel}

I prepared a structured response for your request.

- Validate the current schema first.
- Generate the change in an isolated artifact.
- Keep approval in the loop before applying anything.

> The first concrete artifact is ready for inspection.

\`\`\`sql
ALTER TABLE users
ADD COLUMN last_login timestamptz;

CREATE INDEX idx_users_last_login
ON users(last_login);
\`\`\``;
  }

  return `## Chat Response

Provider: ${providerLabel}

I can help turn that request into a tracked execution plan inside MagnetarEidolon.

1. Clarify the goal.
2. Select the provider path.
3. Produce the next artifact or answer.

> Ask for code, a plan, or a provider diagnostic to continue.`;
}
