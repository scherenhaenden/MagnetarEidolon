import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import test from 'node:test';

import {
  ProviderRegistryService,
} from './provider-registry.service.js';

class TestableProviderRegistryService extends ProviderRegistryService {
  public constructor(private readonly configRoots: string[]) {
    super();
  }

  protected override getConfigSearchRoots(): string[] {
    return this.configRoots;
  }
}

const FIXTURE_CONFIG_ROOT = resolve(__dirname, '..', '..', '..', 'tests', 'fixtures', 'provider-config');

test('ProviderRegistryService exposes LM Studio and OpenRouter definitions', (): void => {
  const registry = new ProviderRegistryService();
  const providers = registry.getProviders();

  assert.equal(providers.length, 2);
  assert.equal(providers[0]?.id, 'provider-lmstudio');
  assert.equal(providers[1]?.id, 'provider-openrouter');
});

test('ProviderRegistryService loads provider definitions from the committed catalog JSON', (): void => {
  const registry = new ProviderRegistryService();
  const lmStudio = registry.getProvider('provider-lmstudio');

  assert.deepEqual(lmStudio, {
    id: 'provider-lmstudio',
    displayName: 'LM Studio Local',
    kind: 'lm_studio',
    baseUrl: 'http://127.0.0.1:1234/v1',
    chatPath: '/chat/completions',
    apiStyle: 'openai-compatible',
    authStrategy: 'none',
    defaultModel: 'local-model',
    supportsStreaming: true,
    requestFormat: 'chat-completions',
    responseNormalizer: 'openai-sse',
    apiKey: null,
    extraHeaders: {},
  });
});

test('ProviderRegistryService resolves OpenRouter runtime overrides from env', (): void => {
  process.env.OPENROUTER_BASE_URL = 'https://openrouter.example/api/v1';
  process.env.OPENROUTER_DEFAULT_MODEL = 'anthropic/claude-3.7-sonnet';
  process.env.OPENROUTER_API_KEY = 'secret-openrouter-key';

  const registry = new ProviderRegistryService();
  const provider = registry.getProvider('provider-openrouter');

  assert.deepEqual(provider, {
    id: 'provider-openrouter',
    displayName: 'OpenRouter',
    kind: 'openrouter',
    baseUrl: 'https://openrouter.example/api/v1',
    chatPath: '/chat/completions',
    apiStyle: 'openai-compatible',
    authStrategy: 'bearer',
    defaultModel: 'anthropic/claude-3.7-sonnet',
    supportsStreaming: true,
    requestFormat: 'chat-completions',
    responseNormalizer: 'openai-sse',
    apiKey: 'secret-openrouter-key',
    extraHeaders: {},
  });

  delete process.env.OPENROUTER_BASE_URL;
  delete process.env.OPENROUTER_DEFAULT_MODEL;
  delete process.env.OPENROUTER_API_KEY;
});

test('ProviderRegistryService falls back to defaults and null for missing secrets', (): void => {
  delete process.env.OPENROUTER_BASE_URL;
  delete process.env.OPENROUTER_DEFAULT_MODEL;
  delete process.env.OPENROUTER_API_KEY;

  const registry = new ProviderRegistryService();
  const provider = registry.getProvider('provider-openrouter');

  assert.equal(provider?.baseUrl, 'https://openrouter.ai/api/v1');
  assert.equal(provider?.defaultModel, 'openai/gpt-4.1-mini');
  assert.equal(provider?.apiKey, null);
  assert.deepEqual(provider?.extraHeaders, {});
});

test('ProviderRegistryService applies local JSON overrides before env overrides', (): void => {
  const registry = new TestableProviderRegistryService([
    FIXTURE_CONFIG_ROOT,
  ]);
  const provider = registry.getProvider('provider-lmstudio');

  assert.equal(provider?.baseUrl, 'http://127.0.0.1:2234/v1');
  assert.equal(provider?.defaultModel, 'fixture-model');
});

test('ProviderRegistryService resolves configured provider instances from local JSON', (): void => {
  const registry = new TestableProviderRegistryService([
    FIXTURE_CONFIG_ROOT,
  ]);
  const provider = registry.resolveExecutionProvider({
    configuredProviderId: 'provider-config-lm_studio-default',
    providerId: 'provider-openrouter',
  });

  assert.deepEqual(provider, {
    id: 'provider-config-lm_studio-default',
    displayName: 'LM Studio Local',
    kind: 'lm_studio',
    baseUrl: 'http://127.0.0.1:2234/v1',
    chatPath: '/chat/completions',
    apiStyle: 'openai-compatible',
    authStrategy: 'none',
    defaultModel: 'fixture-model',
    supportsStreaming: true,
    requestFormat: 'chat-completions',
    responseNormalizer: 'openai-sse',
    apiKey: null,
    extraHeaders: {},
  });
});

test('ProviderRegistryService falls back to provider id when configured provider instance is missing', (): void => {
  const registry = new TestableProviderRegistryService([
    FIXTURE_CONFIG_ROOT,
  ]);
  const provider = registry.resolveExecutionProvider({
    configuredProviderId: 'provider-config-missing',
    providerId: 'provider-lmstudio',
  });

  assert.equal(provider?.id, 'provider-lmstudio');
});

test('ProviderRegistryService exposes optional OpenRouter attribution headers from env', (): void => {
  process.env.OPENROUTER_HTTP_REFERER = 'https://magnetar.example/chat';
  process.env.OPENROUTER_APP_TITLE = 'MagnetarEidolon Dev';

  const registry = new ProviderRegistryService();
  const provider = registry.getProvider('provider-openrouter');

  assert.deepEqual(provider?.extraHeaders, {
    'HTTP-Referer': 'https://magnetar.example/chat',
    'X-Title': 'MagnetarEidolon Dev',
  });

  delete process.env.OPENROUTER_HTTP_REFERER;
  delete process.env.OPENROUTER_APP_TITLE;
});

test('ProviderRegistryService returns null for unknown providers', (): void => {
  const registry = new ProviderRegistryService();
  assert.equal(registry.getProvider('missing-provider'), null);
});
