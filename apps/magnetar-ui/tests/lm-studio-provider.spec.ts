import { firstValueFrom } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';

import { LMStudioProvider } from '@magnetar/magnetar-sdk/providers/lm-studio';

describe('LMStudioProvider', () => {
  it('posts chat completions to the OpenAI-compatible LM Studio endpoint', async () => {
    const fetchMock = vi.fn(async (input: string, init?: RequestInit) => {
      expect(input).toBe('http://localhost:1234/v1/chat/completions');
      expect(init?.method).toBe('POST');
      expect(init?.headers).toMatchObject({
        'Content-Type': 'application/json',
        Authorization: 'Bearer lm-studio',
      });
      expect(init?.body).toBe(
        JSON.stringify({
          model: 'llama-3.2-3b-instruct',
          messages: [{ role: 'user', content: 'Hello' }],
          temperature: 0.7,
        }),
      );

      return new Response(
        JSON.stringify({
          choices: [{ message: { content: 'Hi from LM Studio' } }],
          usage: {
            prompt_tokens: 4,
            completion_tokens: 5,
            total_tokens: 9,
          },
        }),
        { status: 200 },
      );
    });

    const provider = new LMStudioProvider(
      {
        model: 'llama-3.2-3b-instruct',
        temperature: 0.7,
      },
      fetchMock,
    );

    const result = await firstValueFrom(
      provider.generate([{ role: 'user', content: 'Hello' }]),
    );

    expect(result).toEqual({
      content: 'Hi from LM Studio',
      usage: {
        promptTokens: 4,
        completionTokens: 5,
        totalTokens: 9,
      },
    });
  });

  it('lists models from the LM Studio model endpoint', async () => {
    const provider = new LMStudioProvider(
      { model: 'llama-3.2-3b-instruct' },
      vi.fn(async () =>
        new Response(
          JSON.stringify({
            data: [
              { id: 'llama-3.2-3b-instruct', object: 'model', owned_by: 'lmstudio' },
              { id: 'mistral-nemo-instruct', object: 'model', owned_by: 'lmstudio' },
            ],
          }),
          { status: 200 },
        ),
      ),
    );

    const models = await firstValueFrom(provider.listModels());

    expect(models).toEqual([
      { id: 'llama-3.2-3b-instruct', object: 'model', ownedBy: 'lmstudio' },
      { id: 'mistral-nemo-instruct', object: 'model', ownedBy: 'lmstudio' },
    ]);
  });

  it('reports a healthy provider state when the configured model is available', async () => {
    const provider = new LMStudioProvider(
      { model: 'llama-3.2-3b-instruct' },
      vi.fn(async () =>
        new Response(
          JSON.stringify({
            data: [{ id: 'llama-3.2-3b-instruct' }],
          }),
          { status: 200 },
        ),
      ),
    );

    const health = await firstValueFrom(provider.healthcheck());

    expect(health).toEqual({
      reachable: true,
      configuredModel: 'llama-3.2-3b-instruct',
      modelAvailable: true,
      availableModels: ['llama-3.2-3b-instruct'],
    });
  });

  it('reports an unhealthy provider state when LM Studio is unreachable', async () => {
    const provider = new LMStudioProvider(
      { model: 'llama-3.2-3b-instruct' },
      vi.fn(async () => {
        throw new Error('connect ECONNREFUSED 127.0.0.1:1234');
      }),
    );

    const health = await firstValueFrom(provider.healthcheck());

    expect(health).toEqual({
      reachable: false,
      configuredModel: 'llama-3.2-3b-instruct',
      modelAvailable: false,
      availableModels: [],
      error: 'connect ECONNREFUSED 127.0.0.1:1234',
    });
  });

  it('throws a readable error when LM Studio returns a failed completion response', async () => {
    const provider = new LMStudioProvider(
      { model: 'llama-3.2-3b-instruct' },
      vi.fn(async () =>
        new Response(
          JSON.stringify({
            error: {
              message: 'Requested model is not loaded.',
            },
          }),
          { status: 400 },
        ),
      ),
    );

    await expect(
      firstValueFrom(provider.generate([{ role: 'user', content: 'Hello' }])),
    ).rejects.toThrow('Requested model is not loaded.');
  });

  it('throws when LM Studio returns no completion content', async () => {
    const provider = new LMStudioProvider(
      { model: 'llama-3.2-3b-instruct' },
      vi.fn(async () =>
        new Response(
          JSON.stringify({
            choices: [{ message: {} }],
          }),
          { status: 200 },
        ),
      ),
    );

    await expect(
      firstValueFrom(provider.generate([{ role: 'user', content: 'Hello' }])),
    ).rejects.toThrow('LM Studio returned no completion content.');
  });
});
