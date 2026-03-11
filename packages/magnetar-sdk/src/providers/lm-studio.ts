import { Observable, defer, from, map, of, catchError } from 'rxjs';
import type { LLMProvider, LLMResponse } from '../interfaces.js';

export interface LMStudioMessage {
  role: string;
  content: string;
}

export interface LMStudioProviderConfig {
  model: string;
  baseUrl?: string;
  apiKey?: string;
  temperature?: number;
  timeoutMs?: number;
}

export interface LMStudioModelSummary {
  id: string;
  object?: string;
  ownedBy?: string;
}

export interface LMStudioHealthcheck {
  reachable: boolean;
  configuredModel: string;
  modelAvailable: boolean;
  availableModels: string[];
  error?: string;
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
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
  error?: {
    message?: string;
  };
}

interface LMStudioModelsResponse {
  data?: Array<{
    id?: string;
    object?: string;
    owned_by?: string;
  }>;
}

export class LMStudioProvider implements LLMProvider {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly temperature?: number;
  private readonly timeoutMs: number;
  private readonly fetchFn: FetchLike;

  constructor(
    private readonly config: LMStudioProviderConfig,
    fetchFn: FetchLike = fetch,
  ) {
    this.baseUrl = (config.baseUrl ?? 'http://localhost:1234/v1').replace(/\/+$/, '');
    this.apiKey = config.apiKey ?? 'lm-studio';
    this.temperature = config.temperature;
    this.timeoutMs = config.timeoutMs ?? 30_000;
    this.fetchFn = fetchFn;
  }

  public generate(messages: LMStudioMessage[]): Observable<LLMResponse> {
    return defer(() =>
      from(
        this.requestJson<LMStudioChatCompletionResponse>('/chat/completions', {
          model: this.config.model,
          messages,
          ...(this.temperature !== undefined ? { temperature: this.temperature } : {}),
        }),
      ).pipe(
        map((response) => {
          const content = response.choices?.[0]?.message?.content;

          if (!content) {
            throw new Error(response.error?.message ?? 'LM Studio returned no completion content.');
          }

          return {
            content,
            usage: response.usage
              ? {
                  promptTokens: response.usage.prompt_tokens ?? 0,
                  completionTokens: response.usage.completion_tokens ?? 0,
                  totalTokens: response.usage.total_tokens ?? 0,
                }
              : undefined,
          };
        }),
      ),
    );
  }

  public listModels(): Observable<LMStudioModelSummary[]> {
    return defer(() =>
      from(this.requestJson<LMStudioModelsResponse>('/models')).pipe(
        map((response) =>
          (response.data ?? [])
            .filter((model) => typeof model.id === 'string' && model.id.length > 0)
            .map((model) => ({
              id: model.id as string,
              object: model.object,
              ownedBy: model.owned_by,
            })),
        ),
      ),
    );
  }

  public healthcheck(): Observable<LMStudioHealthcheck> {
    return this.listModels().pipe(
      map((models) => {
        const availableModels = models.map((model) => model.id);
        return {
          reachable: true,
          configuredModel: this.config.model,
          modelAvailable: availableModels.includes(this.config.model),
          availableModels,
        };
      }),
      catchError((error: unknown) =>
        of({
          reachable: false,
          configuredModel: this.config.model,
          modelAvailable: false,
          availableModels: [],
          error: error instanceof Error ? error.message : 'Unknown LM Studio healthcheck error.',
        }),
      ),
    );
  }

  private async requestJson<T>(path: string, body?: Record<string, unknown>): Promise<T> {
    const response = await this.fetchWithTimeout(this.buildUrl(path), {
      method: body ? 'POST' : 'GET',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    const json = (await response.json()) as T | LMStudioChatCompletionResponse;

    if (!response.ok) {
      const errorMessage =
        typeof (json as LMStudioChatCompletionResponse).error?.message === 'string'
          ? (json as LMStudioChatCompletionResponse).error?.message
          : `LM Studio request failed with status ${response.status}.`;
      throw new Error(errorMessage);
    }

    return json as T;
  }

  private buildUrl(path: string): string {
    return `${this.baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
  }

  private async fetchWithTimeout(url: string, init: RequestInit): Promise<Response> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      return await this.fetchFn(url, {
        ...init,
        signal: controller.signal,
      });
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`LM Studio request timed out after ${this.timeoutMs} ms.`);
      }
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }
}
