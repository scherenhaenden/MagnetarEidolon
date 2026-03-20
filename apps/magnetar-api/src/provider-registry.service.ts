import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { Injectable } from '@nestjs/common';

export type BackendProviderApiStyle = 'native' | 'openai-compatible';
export type BackendProviderAuthStrategy = 'none' | 'bearer';
export type BackendProviderRequestFormat = 'chat-completions' | 'prompt-input';
export type BackendProviderResponseNormalizer = 'openai-sse' | 'lmstudio-native';
export type BackendProviderKind = 'lm_studio' | 'openrouter' | 'openai' | 'anthropic' | 'custom';

interface ProviderRequestTemplateDefinition {
  bodyTemplate: Record<string, unknown>;
  placeholders: string[];
}

interface ProviderRuntimeBindingDefinition {
  apiKeyEnvVar?: string;
  baseUrlEnvVar?: string;
  defaultModelEnvVar?: string;
}

interface ProviderCatalogEntry {
  id: string;
  displayName: string;
  kind: BackendProviderKind;
  baseUrl: string;
  chatPath: string;
  apiStyle: BackendProviderApiStyle;
  authStrategy: BackendProviderAuthStrategy;
  defaultModel: string;
  supportsStreaming: boolean;
  requestFormat: BackendProviderRequestFormat;
  responseNormalizer: BackendProviderResponseNormalizer;
  extraHeaders?: Record<string, string>;
  requestTemplate?: ProviderRequestTemplateDefinition;
  runtimeBindings?: ProviderRuntimeBindingDefinition;
}

interface ProviderCatalogFile {
  providers: ProviderCatalogEntry[];
}

interface ProviderLocalOverrideEntry {
  id: string;
  baseUrl?: string;
  defaultModel?: string;
  extraHeaders?: Record<string, string>;
}

interface ProviderLocalOverrideFile {
  providers: ProviderLocalOverrideEntry[];
}

export interface BackendProviderDefinition {
  id: string;
  displayName: string;
  kind: BackendProviderKind;
  baseUrl: string;
  chatPath: string;
  apiStyle: BackendProviderApiStyle;
  authStrategy: BackendProviderAuthStrategy;
  defaultModel: string;
  supportsStreaming: boolean;
  requestFormat: BackendProviderRequestFormat;
  responseNormalizer: BackendProviderResponseNormalizer;
  apiKey: string | null;
  extraHeaders: Record<string, string>;
}

const PROVIDER_CATALOG_FILE = 'providers.catalog.json';
const PROVIDER_LOCAL_FILE = 'providers.local.json';

@Injectable()
export class ProviderRegistryService {
  public getProvider(providerId: string): BackendProviderDefinition | null {
    return this.getProviders().find((provider) => provider.id === providerId) ?? null;
  }

  public getProviders(): BackendProviderDefinition[] {
    const catalog = this.readProviderCatalog();
    const localOverrides = this.readLocalOverrides();

    return catalog.providers.map((provider) => {
      const localOverride = localOverrides.get(provider.id);
      const runtimeBindings = provider.runtimeBindings ?? {};

      const baseUrl = this.readStringEnv(
        runtimeBindings.baseUrlEnvVar,
        localOverride?.baseUrl ?? provider.baseUrl,
      );
      const defaultModel = this.readStringEnv(
        runtimeBindings.defaultModelEnvVar,
        localOverride?.defaultModel ?? provider.defaultModel,
      );

      return {
        id: provider.id,
        displayName: provider.displayName,
        kind: provider.kind,
        baseUrl,
        chatPath: provider.chatPath,
        apiStyle: provider.apiStyle,
        authStrategy: provider.authStrategy,
        defaultModel,
        supportsStreaming: provider.supportsStreaming,
        requestFormat: provider.requestFormat,
        responseNormalizer: provider.responseNormalizer,
        apiKey: this.readOptionalEnv(runtimeBindings.apiKeyEnvVar),
        extraHeaders: {
          ...(provider.extraHeaders ?? {}),
          ...(localOverride?.extraHeaders ?? {}),
          ...(provider.kind === 'openrouter' ? this.readOpenRouterHeaders() : {}),
        },
      };
    });
  }

  private readOpenRouterHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};
    const referer = this.readOptionalEnv('OPENROUTER_HTTP_REFERER');
    const title = this.readOptionalEnv('OPENROUTER_APP_TITLE');

    if (referer) {
      headers['HTTP-Referer'] = referer;
    }

    if (title) {
      headers['X-Title'] = title;
    }

    return headers;
  }

  protected getConfigSearchRoots(): string[] {
    return [
      resolve(process.cwd(), 'config'),
      resolve(process.cwd(), '..', 'config'),
      resolve(process.cwd(), '..', '..', 'config'),
      resolve(__dirname, '..', '..', 'config'),
      resolve(__dirname, '..', '..', '..', 'config'),
    ];
  }

  private resolveConfigFilePath(fileName: string): string | null {
    for (const root of this.getConfigSearchRoots()) {
      const candidatePath = resolve(root, fileName);
      if (existsSync(candidatePath)) {
        return candidatePath;
      }
    }

    return null;
  }

  private readProviderCatalog(): ProviderCatalogFile {
    const catalogPath = this.resolveConfigFilePath(PROVIDER_CATALOG_FILE);
    if (!catalogPath) {
      throw new Error(`Provider catalog file "${PROVIDER_CATALOG_FILE}" was not found.`);
    }

    const raw = readFileSync(catalogPath, 'utf8');
    const parsed = JSON.parse(raw) as ProviderCatalogFile;

    if (!Array.isArray(parsed.providers) || parsed.providers.length === 0) {
      throw new Error(`Provider catalog file "${catalogPath}" does not contain any providers.`);
    }

    return parsed;
  }

  private readLocalOverrides(): Map<string, ProviderLocalOverrideEntry> {
    const overridePath = this.resolveConfigFilePath(PROVIDER_LOCAL_FILE);
    if (!overridePath) {
      return new Map();
    }

    const raw = readFileSync(overridePath, 'utf8');
    const parsed = JSON.parse(raw) as ProviderLocalOverrideFile;
    if (!Array.isArray(parsed.providers)) {
      return new Map();
    }

    return new Map(parsed.providers.map((provider) => [provider.id, provider]));
  }

  private readStringEnv(name: string | undefined, fallback: string): string {
    if (!name) {
      return fallback;
    }

    const value = process.env[name]?.trim();
    return value && value.length > 0 ? value : fallback;
  }

  private readOptionalEnv(name: string | undefined): string | null {
    if (!name) {
      return null;
    }

    const value = process.env[name]?.trim();
    return value && value.length > 0 ? value : null;
  }
}
