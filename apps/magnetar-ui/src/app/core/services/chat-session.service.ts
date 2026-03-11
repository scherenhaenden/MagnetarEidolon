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

interface FetchLike {
  (input: string, init?: RequestInit): Promise<Response>;
}

interface LMStudioChatCompletionResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message?: string;
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
  private pendingStream: PendingStream | null = null;
  private nextId = 1;

  public readonly messages = computed(() => this.messageState());
  public readonly draft = computed(() => this.draftState());
  public readonly activeProviderLabel = computed(
    () => this.providerConfigService.primaryProvider()?.name ?? 'No provider configured',
  );
  public readonly isStreaming = computed(() => this.pendingStreamState() !== null);
  public readonly conversationHistory = computed<ChatConversationSummary[]>(() =>
    this.messageState()
      .filter((message) => message.role === 'user')
      .map((message) => buildConversationSummary(message))
      .reverse(),
  );
  public readonly canvasDocument = computed(() => this.canvasState());

  public constructor(
    private readonly providerConfigService: ProviderConfigService,
    private readonly fetchFn: FetchLike = fetch,
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

    let responseText: string;
    try {
      responseText = await this.resolveResponseText(trimmedPrompt, provider);
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

  private async resolveResponseText(prompt: string, provider: ProviderConfig): Promise<string> {
    if (provider.kind !== 'lm_studio') {
      return generateAssistantResponse(prompt, provider.name);
    }

    const response = await this.fetchFn(`${provider.baseUrl.replace(/\/+$/, '')}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer lm-studio',
      },
      body: JSON.stringify({
        model: provider.model,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const json = (await response.json()) as LMStudioChatCompletionResponse;

    if (!response.ok) {
      throw new Error(json.error?.message ?? `LM Studio request failed with status ${response.status}.`);
    }

    const content = json.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('LM Studio returned no completion content.');
    }

    return content;
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
