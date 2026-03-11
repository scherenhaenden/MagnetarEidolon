import { Injectable } from '@nestjs/common';
import type { Response } from 'express';

export type ProviderApiStyle = 'native' | 'openai-compatible';

export interface BackendChatRequest {
  prompt: string;
  provider: {
    baseUrl: string;
    model: string;
    apiStyle: ProviderApiStyle;
    apiKey?: string | null;
  };
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

@Injectable()
export class ChatGatewayService {
  public async streamChat(request: BackendChatRequest, response: Response): Promise<void> {
    const trimmedPrompt: string = request.prompt.trim();
    if (!trimmedPrompt) {
      response.status(400).json({
        error: {
          message: 'Prompt must not be empty.',
        },
      });
      return;
    }

    const target = this.buildLmStudioTarget(request);
    const upstreamResponse = await fetch(target.url, {
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
          message: errorText || `LM Studio request failed with status ${upstreamResponse.status}.`,
        },
      });
      return;
    }

    if (!upstreamResponse.body) {
      response.status(502).json({
        error: {
          message: 'LM Studio did not return a readable response body.',
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

    try {
      while (true) {
        const chunk = await reader.read();
        if (chunk.done) {
          break;
        }

        response.write(decoder.decode(chunk.value, { stream: true }));
      }

      response.write(decoder.decode());
      response.end();
    } catch (error: unknown) {
      const message: string =
        error instanceof Error ? error.message : 'Unknown backend streaming error.';
      response.write(`data: ${JSON.stringify({ error: { message } })}\n\n`);
      response.end();
    } finally {
      reader.releaseLock();
    }
  }

  private buildLmStudioTarget(request: BackendChatRequest): {
    url: string;
    body: NativeLmStudioRequest | OpenAiCompatibleRequest;
    apiKey: string | null;
  } {
    const baseUrl: string = request.provider.baseUrl.replace(/\/+$/, '');
    const apiKey: string | null = request.provider.apiKey?.trim() || null;

    if (request.provider.apiStyle === 'native') {
      return {
        url: `${baseUrl}/chat`,
        body: {
          model: request.provider.model,
          input: request.prompt,
          stream: true,
        },
        apiKey,
      };
    }

    return {
      url: `${baseUrl}/chat/completions`,
      body: {
        model: request.provider.model,
        messages: [{ role: 'user', content: request.prompt }],
        stream: true,
      },
      apiKey,
    };
  }
}
