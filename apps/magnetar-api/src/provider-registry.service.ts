import { Injectable } from '@nestjs/common';

export type BackendProviderApiStyle = 'native' | 'openai-compatible';
export type BackendProviderAuthStrategy = 'none' | 'bearer';
export type BackendProviderRequestFormat = 'chat-completions' | 'prompt-input';
export type BackendProviderResponseNormalizer = 'openai-sse' | 'lmstudio-native';

export interface BackendProviderDefinition {
  id: string;
  displayName: string;
  kind: 'lm_studio' | 'openrouter' | 'openai' | 'anthropic';
  baseUrl: string;
  chatPath: string;
  apiStyle: BackendProviderApiStyle;
  authStrategy: BackendProviderAuthStrategy;
  defaultModel: string;
  supportsStreaming: boolean;
  requestFormat: BackendProviderRequestFormat;
  responseNormalizer: BackendProviderResponseNormalizer;
  apiKey: string | null;
}

@Injectable()
export class ProviderRegistryService {
  public getProvider(providerId: string): BackendProviderDefinition | null {
    return this.getProviders().find((provider) => provider.id === providerId) ?? null;
  }

  public getProviders(): BackendProviderDefinition[] {
    return [
      {
        id: 'provider-lmstudio',
        displayName: 'LM Studio Local',
        kind: 'lm_studio',
        baseUrl: this.readStringEnv('LM_STUDIO_BASE_URL', 'http://127.0.0.1:1234/v1'),
        chatPath: '/chat/completions',
        apiStyle: 'openai-compatible',
        authStrategy: 'none',
        defaultModel: this.readStringEnv('LM_STUDIO_DEFAULT_MODEL', 'local-model'),
        supportsStreaming: true,
        requestFormat: 'chat-completions',
        responseNormalizer: 'openai-sse',
        apiKey: null,
      },
      {
        id: 'provider-openrouter',
        displayName: 'OpenRouter',
        kind: 'openrouter',
        baseUrl: this.readStringEnv('OPENROUTER_BASE_URL', 'https://openrouter.ai/api/v1'),
        chatPath: '/chat/completions',
        apiStyle: 'openai-compatible',
        authStrategy: 'bearer',
        defaultModel: this.readStringEnv('OPENROUTER_DEFAULT_MODEL', 'openai/gpt-4.1-mini'),
        supportsStreaming: true,
        requestFormat: 'chat-completions',
        responseNormalizer: 'openai-sse',
        apiKey: this.readOptionalEnv('OPENROUTER_API_KEY'),
      },
    ];
  }

  private readStringEnv(name: string, fallback: string): string {
    const value = process.env[name]?.trim();
    return value && value.length > 0 ? value : fallback;
  }

  private readOptionalEnv(name: string): string | null {
    const value = process.env[name]?.trim();
    return value && value.length > 0 ? value : null;
  }
}
