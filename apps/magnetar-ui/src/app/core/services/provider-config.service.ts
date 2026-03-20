import { Injectable, computed, signal } from '@angular/core';

import {
  ProviderApiSurfaceDefinition,
  ProviderConfig,
  ProviderConfigOrigin,
  ProviderHealth,
  ProviderPreset,
  ProviderRole,
  describeProviderRole,
  sortProvidersByPriority,
} from '../models/provider-config.js';

const STORAGE_KEY = 'magnetar.provider-config.v1';

function createOpenAiCompatibleApiSurface(baseChatPath = '/chat/completions'): ProviderApiSurfaceDefinition {
  return {
    endpointComparison: [
      'Streaming responses are supported.',
      'Model discovery is available through a models endpoint.',
      'Chat/message generation uses an OpenAI-style messages payload.',
    ],
    endpoints: [
      {
        id: 'models',
        label: 'List Models',
        method: 'GET',
        path: '/models',
        description: 'Fetch the models available for selection from this provider.',
        requestTemplate: '',
        requestExample: '',
        responseExample: '',
        notes: [],
        placeholders: [],
      },
      {
        id: 'chat',
        label: 'Chat Messages',
        method: 'POST',
        path: baseChatPath,
        description: 'Send a structured chat/messages request for generation and streaming.',
        requestTemplate: `{
  "model": "$model",
  "messages": "$messages",
  "stream": "$stream"
}`,
        requestExample: `{
  "model": "gpt-4.1-mini",
  "messages": [
    {
      "role": "user",
      "content": "Write a short haiku about sunrise."
    }
  ],
  "stream": true
}`,
        responseExample: `{
  "id": "chatcmpl_123",
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "Dawn wakes in soft gold..."
      }
    }
  ]
}`,
        notes: [],
        placeholders: ['$model', '$messages', '$stream'],
      },
    ],
  };
}

function createAnthropicApiSurface(): ProviderApiSurfaceDefinition {
  return {
    endpointComparison: [
      'Streaming responses are supported.',
      'Model selection is request-driven rather than fetched from a provider-owned models endpoint.',
      'Message submission uses a native prompt/message contract rather than OpenAI chat-completions.',
    ],
    endpoints: [
      {
        id: 'messages',
        label: 'Create Messages',
        method: 'POST',
        path: '/v1/messages',
        description: 'Send a native Anthropic messages request for completion or streaming.',
        requestTemplate: `{
  "model": "$model",
  "messages": "$messages",
  "stream": "$stream",
  "max_tokens": "$maxTokens"
}`,
        requestExample: `{
  "model": "claude-3-7-sonnet-latest",
  "messages": [
    {
      "role": "user",
      "content": "Write a short haiku about sunrise."
    }
  ],
  "stream": true,
  "max_tokens": 256
}`,
        responseExample: `{
  "id": "msg_123",
  "content": [
    {
      "type": "text",
      "text": "Dawn leans over hills..."
    }
  ]
}`,
        notes: [],
        placeholders: ['$model', '$messages', '$stream', '$maxTokens'],
      },
    ],
  };
}

function createLmStudioApiSurface(): ProviderApiSurfaceDefinition {
  return {
    endpointComparison: [
      'Streaming is supported.',
      'Stateful chat and LM Studio-specific runtime events are available in the native API family.',
      'Model discovery and lifecycle operations are richer than typical cloud-hosted OpenAI-compatible paths.',
    ],
    endpoints: [
      {
        id: 'models',
        label: 'List Models',
        method: 'GET',
        path: '/models',
        description: 'Fetch the models that LM Studio currently exposes through the OpenAI-compatible path.',
        requestTemplate: '',
        requestExample: '',
        responseExample: `{
  "data": [
    {
      "id": "ibm/granite-4-micro"
    }
  ]
}`,
        notes: [
          'Use this endpoint to discover model identifiers that can be used for inference requests.',
        ],
        placeholders: [],
      },
      {
        id: 'chat',
        label: 'Chat Messages',
        method: 'POST',
        path: '/chat/completions',
        description: 'Send OpenAI-compatible chat/messages requests to the currently loaded model.',
        requestTemplate: `{
  "model": "$model",
  "messages": "$messages",
  "stream": "$stream"
}`,
        requestExample: `{
  "model": "ibm/granite-4-micro",
  "messages": [
    {
      "role": "user",
      "content": "Write a short haiku about sunrise."
    }
  ],
  "stream": true
}`,
        responseExample: `{
  "id": "chatcmpl_lmstudio_123",
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "Dawn wakes the horizon..."
      }
    }
  ]
}`,
        notes: [
          'This is the OpenAI-compatible LM Studio path and expects full messages payloads.',
          'Use this when you want compatibility with OpenAI-style chat contracts.',
        ],
        placeholders: ['$model', '$messages', '$stream'],
      },
      {
        id: 'chat-native',
        label: 'Native Chat Input',
        method: 'POST',
        path: '/chat',
        description: 'Send LM Studio native chat input payloads when using the stateful native inference path.',
        requestTemplate: `{
  "model": "$model",
  "input": "$input",
  "previous_response_id": "$previousResponseId",
  "store": "$store"
}`,
        requestExample: `{
  "model": "ibm/granite-4-micro",
  "input": "What color did I just mention?",
  "previous_response_id": "resp_abc123xyz..."
}`,
        responseExample: `{
  "model_instance_id": "ibm/granite-4-micro",
  "output": [
    {
      "type": "message",
      "content": "You said your favorite color is blue."
    }
  ],
  "response_id": "resp_def456uvw..."
}`,
        notes: [
          'This endpoint is stateful by default: LM Studio stores the conversation thread automatically.',
          'Use the returned response_id as previous_response_id to continue a conversation without resending full history.',
          'Set store to false for one-off stateless requests; LM Studio will not return a response_id in that mode.',
        ],
        placeholders: ['$model', '$input', '$previousResponseId', '$store'],
      },
      {
        id: 'models-load',
        label: 'Load Model',
        method: 'POST',
        path: '/models/load',
        description: 'Request LM Studio to load a model before inference.',
        requestTemplate: `{
  "model": "$model"
}`,
        requestExample: `{
  "model": "ibm/granite-4-micro"
}`,
        responseExample: '',
        notes: [],
        placeholders: ['$model'],
      },
      {
        id: 'models-unload',
        label: 'Unload Model',
        method: 'POST',
        path: '/models/unload',
        description: 'Unload a model from the LM Studio runtime.',
        requestTemplate: `{
  "model": "$model"
}`,
        requestExample: `{
  "model": "ibm/granite-4-micro"
}`,
        responseExample: '',
        notes: [],
        placeholders: ['$model'],
      },
      {
        id: 'models-download',
        label: 'Download Model',
        method: 'POST',
        path: '/models/download',
        description: 'Start a model download in LM Studio.',
        requestTemplate: `{
  "model": "$model"
}`,
        requestExample: `{
  "model": "ibm/granite-4-micro"
}`,
        responseExample: '',
        notes: [],
        placeholders: ['$model'],
      },
      {
        id: 'models-download-status',
        label: 'Download Status',
        method: 'GET',
        path: '/models/download/status',
        description: 'Query the status of an LM Studio model download.',
        requestTemplate: '',
        requestExample: '',
        responseExample: '',
        notes: [],
        placeholders: [],
      },
    ],
  };
}

const PROVIDER_PRESETS: ProviderPreset[] = [
  {
    kind: 'lm_studio',
    label: 'LM Studio Local',
    description: 'Local OpenAI-compatible provider for development and smoke validation.',
    baseUrl: 'http://127.0.0.1:1234/v1',
    defaultModel: 'local-model',
    apiStyle: 'openai-compatible',
    supportsApiKey: false,
    ownership: 'backend',
    modelSuggestions: ['local-model', 'gemma-3-1b-it-qat', 'llama-3.2-3b-instruct'],
    template: {
      requestTemplate: `{
  "model": "$model",
  "messages": "$messages",
  "stream": "$stream"
}`,
      placeholders: ['$model', '$messages', '$stream'],
    },
    apiSurface: createLmStudioApiSurface(),
  },
  {
    kind: 'openrouter',
    label: 'OpenRouter',
    description: 'Cloud router with backend-owned key handling and OpenAI-compatible streaming.',
    baseUrl: 'https://openrouter.ai/api/v1',
    defaultModel: 'openai/gpt-4.1-mini',
    apiStyle: 'openai-compatible',
    supportsApiKey: true,
    ownership: 'backend',
    modelSuggestions: ['openai/gpt-4.1-mini', 'anthropic/claude-3.7-sonnet', 'google/gemini-2.5-flash'],
    suggestedHeaders: ['HTTP-Referer', 'X-Title'],
    template: {
      requestTemplate: `{
  "model": "$model",
  "messages": "$messages",
  "stream": "$stream"
}`,
      placeholders: ['$model', '$messages', '$stream'],
    },
    apiSurface: createOpenAiCompatibleApiSurface(),
  },
  {
    kind: 'openai',
    label: 'OpenAI Cloud',
    description: 'Known hosted provider preset with OpenAI-compatible request semantics.',
    baseUrl: 'https://api.openai.com/v1',
    defaultModel: 'gpt-4.1-mini',
    apiStyle: 'openai-compatible',
    supportsApiKey: true,
    ownership: 'backend',
    modelSuggestions: ['gpt-4.1-mini', 'gpt-4.1', 'gpt-4o-mini'],
    template: {
      requestTemplate: `{
  "model": "$model",
  "messages": "$messages",
  "stream": "$stream"
}`,
      placeholders: ['$model', '$messages', '$stream'],
    },
    apiSurface: createOpenAiCompatibleApiSurface(),
  },
  {
    kind: 'anthropic',
    label: 'Anthropic',
    description: 'Known hosted provider preset for future native request support.',
    baseUrl: 'https://api.anthropic.com',
    defaultModel: 'claude-3-7-sonnet-latest',
    apiStyle: 'native',
    supportsApiKey: true,
    ownership: 'backend',
    modelSuggestions: ['claude-3-7-sonnet-latest', 'claude-3-5-sonnet-latest', 'claude-3-5-haiku-latest'],
    template: {
      requestTemplate: `{
  "model": "$model",
  "prompt": "$prompt",
  "stream": "$stream"
}`,
      placeholders: ['$model', '$prompt', '$stream'],
    },
    apiSurface: createAnthropicApiSurface(),
  },
  {
    kind: 'custom',
    label: 'Custom Provider',
    description: 'Start from a generic provider definition and adapt endpoint, model, keys, and templates by hand.',
    baseUrl: 'https://api.example.com/v1',
    defaultModel: 'example/model-name',
    apiStyle: 'openai-compatible',
    supportsApiKey: true,
    ownership: 'backend',
    modelSuggestions: ['example/model-name'],
    template: {
      requestTemplate: `{
  "model": "$model",
  "messages": "$messages",
  "stream": "$stream"
}`,
      placeholders: ['$model', '$messages', '$stream'],
    },
    apiSurface: createOpenAiCompatibleApiSurface('/chat/completions'),
  },
];

const DEFAULT_PROVIDERS: ProviderConfig[] = [
  createProviderFromPreset(PROVIDER_PRESETS[0], 'primary', 1, 'healthy', 'system'),
  createProviderFromPreset(PROVIDER_PRESETS[2], 'backup', 2, 'unknown', 'system'),
  createProviderFromPreset(PROVIDER_PRESETS[1], 'disabled', 3, 'unknown', 'system'),
  createProviderFromPreset(PROVIDER_PRESETS[3], 'disabled', 4, 'offline', 'system'),
];

@Injectable({
  providedIn: 'root',
})
export class ProviderConfigService {
  private static readonly fallbackStorage = new Map<string, string>();
  private readonly providerState = signal<ProviderConfig[]>(this.loadProviders());

  public readonly providers = computed(() => sortProvidersByPriority(this.providerState()));
  public readonly presets = computed(() => PROVIDER_PRESETS);
  public readonly primaryProvider = computed(
    () => this.providers().find((provider) => provider.role === 'primary') ?? null,
  );
  public readonly backupProviders = computed(() =>
    this.providers().filter((provider) => provider.role === 'backup'),
  );
  public readonly healthyFailoverProviders = computed(() =>
    this.backupProviders().filter((provider) => provider.health !== 'offline'),
  );

  public setPrimary(providerId: string): void {
    this.providerState.update((providers) =>
      providers.map((provider) => {
        if (provider.id === providerId) {
          return { ...provider, role: 'primary', priority: 1 };
        }

        if (provider.role === 'primary') {
          return { ...provider, role: 'backup', priority: 2 };
        }

        return provider.role === 'backup'
          ? { ...provider, priority: Math.max(provider.priority, 2) + 1 }
          : provider;
      }),
    );
    this.normalizePriorities();
  }

  public setBackup(providerId: string): void {
    const wasPrimary = this.providerState().some(
      (provider) => provider.id === providerId && provider.role === 'primary',
    );

    this.providerState.update((providers) =>
      providers.map((provider) =>
        provider.id === providerId
          ? {
              ...provider,
              role: 'backup',
              priority: provider.role === 'primary' ? 2 : provider.priority,
            }
          : provider,
      ),
    );
    this.ensurePrimaryExists(wasPrimary ? providerId : undefined);
    this.normalizePriorities();
  }

  public disable(providerId: string): void {
    this.providerState.update((providers) =>
      providers.map((provider) =>
        provider.id === providerId
          ? { ...provider, role: 'disabled', priority: 99 }
          : provider,
      ),
    );
    this.ensurePrimaryExists();
    this.normalizePriorities();
  }

  public addProviderFromPreset(kind: ProviderPreset['kind']): string {
    const preset = PROVIDER_PRESETS.find((candidate) => candidate.kind === kind);
    if (!preset) {
      throw new Error(`Unknown provider preset: ${kind}`);
    }

    const providerId = createProviderConfigId(kind);
    const nextPriority = this.nextAvailablePriority();

    this.providerState.update((providers) => [
      ...providers,
      createProviderFromPreset(preset, 'disabled', nextPriority, 'unknown', 'user', providerId),
    ]);
    this.normalizePriorities();
    return providerId;
  }

  public addCustomProvider(): string {
    return this.addProviderFromPreset('custom');
  }

  public updateProvider(providerId: string, patch: Partial<ProviderConfig>): void {
    this.providerState.update((providers) =>
      providers.map((provider) => {
        if (provider.id !== providerId) {
          return provider;
        }

        return {
          ...provider,
          ...patch,
          id: provider.id,
        };
      }),
    );
    this.persistProviders();
  }

  public removeProvider(providerId: string): boolean {
    const target = this.providerState().find((provider) => provider.id === providerId);
    if (!target || target.origin !== 'user') {
      return false;
    }

    this.providerState.update((providers) => providers.filter((provider) => provider.id !== providerId));
    this.ensurePrimaryExists();
    this.normalizePriorities();
    return true;
  }

  public canRemoveProvider(providerId: string): boolean {
    return this.providerState().some((provider) => provider.id === providerId && provider.origin === 'user');
  }

  public resetProviderConfiguration(providerId: string): boolean {
    const target = this.providerState().find((provider) => provider.id === providerId);
    if (!target) {
      return false;
    }

    const resetProvider = createResetProviderConfig(target);
    this.providerState.update((providers) =>
      providers.map((provider) => (provider.id === providerId ? resetProvider : provider)),
    );
    this.persistProviders();
    return true;
  }

  public getPreset(kind: ProviderPreset['kind']): ProviderPreset | null {
    return PROVIDER_PRESETS.find((preset) => preset.kind === kind) ?? null;
  }

  public describeRole(providerId: string): string {
    const provider = this.providerState().find((candidate) => candidate.id === providerId);
    return provider ? describeProviderRole(provider.role) : 'Unknown';
  }

  public getHealthTone(health: ProviderHealth): 'active' | 'idle' | 'pending_approval' | 'failed' {
    switch (health) {
      case 'healthy':
        return 'active';
      case 'degraded':
        return 'pending_approval';
      case 'offline':
        return 'failed';
      case 'unknown':
      default:
        return 'idle';
    }
  }

  public static resetTestStorage(): void {
    ProviderConfigService.fallbackStorage.delete(STORAGE_KEY);
  }

  private ensurePrimaryExists(preferredFallbackProviderId?: string): void {
    if (this.providerState().some((provider) => provider.role === 'primary')) {
      return;
    }

    const orderedProviders = sortProvidersByPriority(this.providerState());
    const firstBackup =
      orderedProviders.find(
        (provider) =>
          provider.role === 'backup' && provider.id !== preferredFallbackProviderId,
      ) ??
      orderedProviders.find((provider) => provider.role !== 'disabled');

    if (!firstBackup) {
      return;
    }

    this.providerState.update((providers) =>
      providers.map((provider) =>
        provider.id === firstBackup.id ? { ...provider, role: 'primary', priority: 1 } : provider,
      ),
    );
  }

  private normalizePriorities(): void {
    const ordered = sortProvidersByPriority(this.providerState());
    let nextBackupPriority = 2;

    this.providerState.set(
      ordered.map((provider) => {
        if (provider.role === 'primary') {
          return { ...provider, priority: 1 };
        }

        if (provider.role === 'backup') {
          const normalized = { ...provider, priority: nextBackupPriority };
          nextBackupPriority += 1;
          return normalized;
        }

        return { ...provider, priority: 99 };
      }),
    );
    this.persistProviders();
  }

  private nextAvailablePriority(): number {
    const providers = this.providerState();
    const activePriorities = providers
      .filter((provider) => provider.role !== 'disabled')
      .map((provider) => provider.priority);
    return Math.max(2, ...activePriorities, 1) + 1;
  }

  private loadProviders(): ProviderConfig[] {
    try {
      const rawValue = this.readStorageValue(STORAGE_KEY);
      if (!rawValue) {
        return DEFAULT_PROVIDERS.map((provider) => cloneProviderConfig(provider));
      }

      const parsed = JSON.parse(rawValue) as ProviderConfig[];
      if (!Array.isArray(parsed) || parsed.length === 0) {
        return DEFAULT_PROVIDERS;
      }

      return parsed.map((provider) => this.hydrateProviderConfig(provider));
    } catch {
      return DEFAULT_PROVIDERS.map((provider) => cloneProviderConfig(provider));
    }
  }

  private persistProviders(): void {
    this.writeStorageValue(STORAGE_KEY, JSON.stringify(this.providerState()));
  }

  private readStorageValue(key: string): string | null {
    try {
      return globalThis.localStorage?.getItem(key) ?? ProviderConfigService.fallbackStorage.get(key) ?? null;
    } catch {
      return ProviderConfigService.fallbackStorage.get(key) ?? null;
    }
  }

  private writeStorageValue(key: string, value: string): void {
    try {
      globalThis.localStorage?.setItem(key, value);
    } catch {
      ProviderConfigService.fallbackStorage.set(key, value);
      return;
    }

    ProviderConfigService.fallbackStorage.set(key, value);
  }

  private hydrateProviderConfig(provider: ProviderConfig): ProviderConfig {
    const preset = provider.presetKind ? this.getPreset(provider.presetKind) : null;
    return {
      ...provider,
      id: normalizeProviderConfigId(provider.id, provider.kind),
      origin: provider.origin ?? inferProviderOrigin(provider),
      template: cloneTemplateDefinition(provider.template ?? preset?.template ?? { requestTemplate: '', placeholders: [] }),
      apiSurface: cloneApiSurfaceDefinition(provider.apiSurface ?? preset?.apiSurface ?? createOpenAiCompatibleApiSurface()),
      modelSuggestions: provider.modelSuggestions ?? preset?.modelSuggestions ?? [],
    };
  }
}

function createProviderFromPreset(
  preset: ProviderPreset,
  role: ProviderRole,
  priority: number,
  health: ProviderHealth,
  origin: ProviderConfigOrigin,
  id = createProviderConfigId(preset.kind),
): ProviderConfig {
  return {
    id,
    origin,
    name: preset.label,
    kind: preset.kind,
    baseUrl: preset.baseUrl,
    model: preset.defaultModel,
    role,
    priority,
    health,
    apiStyle: preset.apiStyle,
    apiKey: '',
    description: preset.description,
    template: cloneTemplateDefinition(preset.template),
    supportsApiKey: preset.supportsApiKey,
    ownership: preset.ownership,
    presetKind: preset.kind,
    modelSuggestions: preset.modelSuggestions ?? [],
    apiSurface: cloneApiSurfaceDefinition(preset.apiSurface),
  };
}

function createProviderConfigId(kind: ProviderPreset['kind']): string {
  const randomValue =
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  return `provider-config-${kind}-${randomValue}`;
}

function normalizeProviderConfigId(id: string, kind: ProviderPreset['kind']): string {
  return id.startsWith('provider-config-') ? id : createProviderConfigId(kind);
}

function inferProviderOrigin(provider: Pick<ProviderConfig, 'id' | 'presetKind'>): ProviderConfigOrigin {
  const legacySystemPresetKinds: ProviderPreset['kind'][] = ['lm_studio', 'openai', 'openrouter', 'anthropic'];
  return provider.id.startsWith('provider-') && provider.presetKind && legacySystemPresetKinds.includes(provider.presetKind)
    ? 'system'
    : 'user';
}

function cloneTemplateDefinition(template: ProviderConfig['template']): ProviderConfig['template'] {
  return {
    requestTemplate: template.requestTemplate,
    placeholders: [...template.placeholders],
  };
}

function cloneApiSurfaceDefinition(apiSurface: ProviderConfig['apiSurface']): ProviderConfig['apiSurface'] {
  return {
    endpointComparison: [...apiSurface.endpointComparison],
    endpoints: apiSurface.endpoints.map((endpoint) => ({
      ...endpoint,
      notes: [...endpoint.notes],
      placeholders: [...endpoint.placeholders],
    })),
  };
}

function cloneProviderConfig(provider: ProviderConfig): ProviderConfig {
  return {
    ...provider,
    template: cloneTemplateDefinition(provider.template),
    apiSurface: cloneApiSurfaceDefinition(provider.apiSurface),
    modelSuggestions: [...provider.modelSuggestions],
  };
}

function createResetProviderConfig(provider: ProviderConfig): ProviderConfig {
  const preset = provider.presetKind ? PROVIDER_PRESETS.find((candidate) => candidate.kind === provider.presetKind) : null;
  const baselinePreset = preset ?? PROVIDER_PRESETS.find((candidate) => candidate.kind === 'custom') ?? null;

  if (!baselinePreset) {
    return cloneProviderConfig(provider);
  }

  return {
    ...provider,
    name: baselinePreset.label,
    kind: baselinePreset.kind,
    baseUrl: baselinePreset.baseUrl,
    model: baselinePreset.defaultModel,
    apiStyle: baselinePreset.apiStyle,
    apiKey: '',
    description: baselinePreset.description,
    template: cloneTemplateDefinition(baselinePreset.template),
    supportsApiKey: baselinePreset.supportsApiKey,
    ownership: baselinePreset.ownership,
    presetKind: baselinePreset.kind,
    modelSuggestions: [...(baselinePreset.modelSuggestions ?? [])],
    apiSurface: cloneApiSurfaceDefinition(baselinePreset.apiSurface),
  };
}
