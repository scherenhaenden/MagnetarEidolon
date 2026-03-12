import { Injectable } from '@nestjs/common';
import type { Response as ExpressResponse } from 'express';

import {
  ProviderRegistryService,
  type BackendProviderApiStyle,
  type BackendProviderDefinition,
} from './provider-registry.service.js';

export interface BackendChatRequest {
  prompt: string;
  providerId: string;
  model?: string | null;
}

interface NativeLmStudioRequest {
  model: string;
  input: string;
  stream: boolean;
}

interface OpenAiCompatibleRequest {
  model: string;
  messages: Array<{
    role: 'user';
    content: string;
  }>;
  stream: boolean;
}

interface BackendStreamEvent {
  type: 'content.delta' | 'error';
  content?: string;
  error?: {
    message: string;
  };
}

interface StreamingPayload {
  type?: string;
  delta?: string;
  content?: string;
  message?: string;
  choices?: Array<{
    delta?: {
      content?: string;
    };
    message?: {
      content?: string;
    };
  }>;
  output?: Array<{
    type?: string;
    content?: string;
  }>;
  response?: {
    output?: Array<{
      type?: string;
      content?: string;
    }>;
  };
  result?: {
    output?: Array<{
      type?: string;
      content?: string;
    }>;
  };
  error?: {
    message?: string;
  };
}

interface FetchLike {
  (input: string, init?: RequestInit): Promise<globalThis.Response>;
}

@Injectable()
export class ChatGatewayService {
  public constructor(
    private readonly providerRegistryService: ProviderRegistryService,
  ) {}

  public async streamChat(
    request: BackendChatRequest,
    response: ExpressResponse,
  ): Promise<void> {
    const trimmedPrompt: string = request.prompt.trim();
    if (!trimmedPrompt) {
      response.status(400).json({
        error: {
          message: 'Prompt must not be empty.',
        },
      });
      return;
    }

    const provider = this.providerRegistryService.getProvider(request.providerId);
    if (!provider) {
      response.status(400).json({
        error: {
          message: `Unknown provider id: ${request.providerId}.`,
        },
      });
      return;
    }

    const target = this.buildProviderTarget(request, provider);
    const upstreamResponse = await this.fetchFn(target.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
        ...(target.apiKey ? { Authorization: `Bearer ${target.apiKey}` } : {}),
      },
      body: JSON.stringify(target.body),
    });

    if (!upstreamResponse.ok) {
      const errorText: string = await upstreamResponse.text();
      response.status(upstreamResponse.status).json({
        error: {
          message: errorText || `${provider.displayName} request failed with status ${upstreamResponse.status}.`,
        },
      });
      return;
    }

    if (!upstreamResponse.body) {
      response.status(502).json({
        error: {
          message: `${provider.displayName} did not return a readable response body.`,
        },
      });
      return;
    }

    response.status(200);
    response.setHeader('Content-Type', 'text/event-stream');
    response.setHeader('Cache-Control', 'no-cache');
    response.setHeader('Connection', 'keep-alive');
    response.flushHeaders();

    const reader: ReadableStreamDefaultReader<Uint8Array> = upstreamResponse.body.getReader();
    const decoder: TextDecoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const chunk = await reader.read();
        if (chunk.done) {
          break;
        }

        buffer += decoder.decode(chunk.value, { stream: true });
        buffer = this.flushNormalizedEvents(buffer, response);
      }

      buffer += decoder.decode();
      buffer = this.flushNormalizedEvents(buffer, response);

      if (buffer.trim().length > 0) {
        this.flushTrailingEvent(buffer, response);
      }

      response.write('data: [DONE]\n\n');
      response.end();
    } catch (error: unknown) {
      const message: string =
        error instanceof Error ? error.message : 'Unknown backend streaming error.';
      this.writeBackendEvent(
        {
          type: 'error',
          error: { message },
        },
        response,
      );
      response.end();
    } finally {
      reader.releaseLock();
    }
  }

  private buildProviderTarget(request: BackendChatRequest, provider: BackendProviderDefinition): {
    url: string;
    body: NativeLmStudioRequest | OpenAiCompatibleRequest;
    apiKey: string | null;
  } {
    const baseUrl: string = provider.baseUrl.replace(/\/+$/, '');
    const model: string = request.model?.trim() || provider.defaultModel;

    if (provider.apiStyle === 'native') {
      return {
        url: `${baseUrl}${provider.chatPath}`,
        body: {
          model,
          input: request.prompt,
          stream: true,
        },
        apiKey: provider.apiKey,
      };
    }

    return {
      url: `${baseUrl}${provider.chatPath}`,
      body: {
        model,
        messages: [{ role: 'user', content: request.prompt }],
        stream: true,
      },
      apiKey: provider.apiKey,
    };
  }

  private flushNormalizedEvents(buffer: string, response: ExpressResponse): string {
    const segments: string[] = buffer.split('\n\n');
    const trailingBuffer: string = segments.pop() ?? '';

    for (const segment of segments) {
      this.forwardUpstreamEvent(segment, response);
    }

    return trailingBuffer;
  }

  private flushTrailingEvent(buffer: string, response: ExpressResponse): void {
    this.forwardUpstreamEvent(buffer, response);
  }

  private forwardUpstreamEvent(eventChunk: string, response: ExpressResponse): void {
    const payloadText: string | null = this.parseSseEvent(eventChunk);
    if (!payloadText || payloadText === '[DONE]') {
      return;
    }

    const payload: StreamingPayload = JSON.parse(payloadText) as StreamingPayload;
    const errorMessage: string | null = this.extractErrorMessage(payload);
    if (errorMessage) {
      this.writeBackendEvent(
        {
          type: 'error',
          error: { message: errorMessage },
        },
        response,
      );
      return;
    }

    const contentParts: string[] = this.extractContentParts(payload);
    for (const contentPart of contentParts) {
      this.writeBackendEvent(
        {
          type: 'content.delta',
          content: contentPart,
        },
        response,
      );
    }
  }

  private parseSseEvent(eventChunk: string): string | null {
    const trimmedChunk: string = eventChunk.trim();
    if (!trimmedChunk) {
      return null;
    }

    const payload: string = trimmedChunk
      .split('\n')
      .filter((line) => line.startsWith('data:'))
      .map((line) => line.slice(5).trimStart())
      .join('\n')
      .trim();

    return payload.length > 0 ? payload : null;
  }

  private extractErrorMessage(payload: StreamingPayload): string | null {
    if (typeof payload.error?.message === 'string' && payload.error.message.length > 0) {
      return payload.error.message;
    }

    return null;
  }

  private extractContentParts(payload: StreamingPayload): string[] {
    const directDelta: string | null = this.getNonEmptyString(payload.delta);
    if (directDelta) {
      return [directDelta];
    }

    const directContent: string | null = this.getNonEmptyString(payload.content);
    if (directContent && this.isTerminalNativeEvent(payload.type) === false) {
      return [directContent];
    }

    const openAiDelta: string | null = this.getNonEmptyString(payload.choices?.[0]?.delta?.content);
    if (openAiDelta) {
      return [openAiDelta];
    }

    const openAiMessage: string | null = this.getNonEmptyString(payload.choices?.[0]?.message?.content);
    if (openAiMessage) {
      return [openAiMessage];
    }

    if (!this.isTerminalNativeEvent(payload.type)) {
      return [];
    }

    const nestedOutput: Array<{ type?: string; content?: string }> =
      payload.output ?? payload.response?.output ?? payload.result?.output ?? [];

    return nestedOutput
      .filter((item) => item.type === 'message' || item.type === 'reasoning')
      .map((item) => this.getNonEmptyString(item.content))
      .filter((item): item is string => item !== null);
  }

  private isTerminalNativeEvent(eventType: string | undefined): boolean {
    return eventType === 'chat.end' || eventType === 'response.completed';
  }

  private getNonEmptyString(value: string | undefined): string | null {
    return typeof value === 'string' && value.length > 0 ? value : null;
  }

  private writeBackendEvent(event: BackendStreamEvent, response: ExpressResponse): void {
    response.write(`data: ${JSON.stringify(event)}\n\n`);
  }

  protected getFetchFn(): FetchLike {
    return fetch;
  }

  private get fetchFn(): FetchLike {
    return this.getFetchFn();
  }
}
