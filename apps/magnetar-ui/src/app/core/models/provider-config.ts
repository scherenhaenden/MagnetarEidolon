export type ProviderKind = 'lm_studio' | 'openai' | 'anthropic' | 'ollama' | 'openrouter';
export type ProviderRole = 'primary' | 'backup' | 'disabled';
export type ProviderHealth = 'healthy' | 'degraded' | 'offline' | 'unknown';
export type ProviderOwnership = 'backend' | 'ui';

export interface ProviderTemplateDefinition {
  requestTemplate: string;
  placeholders: string[];
}

export interface ProviderPreset {
  kind: ProviderKind;
  label: string;
  description: string;
  baseUrl: string;
  defaultModel: string;
  apiStyle: 'openai-compatible' | 'native';
  template: ProviderTemplateDefinition;
  supportsApiKey: boolean;
  ownership: ProviderOwnership;
  suggestedHeaders?: string[];
}

export interface ProviderConfig {
  id: string;
  name: string;
  kind: ProviderKind;
  baseUrl: string;
  model: string;
  role: ProviderRole;
  priority: number;
  health: ProviderHealth;
  apiStyle: 'openai-compatible' | 'native';
  apiKey: string;
  description: string;
  template: ProviderTemplateDefinition;
  supportsApiKey: boolean;
  ownership: ProviderOwnership;
  presetKind: ProviderKind | null;
}

export function describeProviderRole(role: ProviderRole): string {
  switch (role) {
    case 'primary':
      return 'Primary';
    case 'backup':
      return 'Backup';
    case 'disabled':
      return 'Disabled';
    default:
      return 'Unknown';
  }
}

export function sortProvidersByPriority(providers: ProviderConfig[]): ProviderConfig[] {
  return [...providers].sort((left, right) => left.priority - right.priority);
}
