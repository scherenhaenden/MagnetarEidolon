export type ProviderKind = 'lm_studio' | 'openai' | 'anthropic' | 'ollama' | 'openrouter' | 'custom';
export type ProviderRole = 'primary' | 'backup' | 'disabled';
export type ProviderHealth = 'healthy' | 'degraded' | 'offline' | 'unknown';
export type ProviderOwnership = 'backend' | 'ui';
export type ProviderApiStyle = 'openai-compatible' | 'native';
export type ProviderHttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ProviderApiEndpointDefinition {
  id: string;
  label: string;
  method: ProviderHttpMethod;
  path: string;
  description: string;
  requestTemplate: string;
  requestExample: string;
  responseExample: string;
  notes: string[];
  placeholders: string[];
}

export interface ProviderTemplateDefinition {
  requestTemplate: string;
  placeholders: string[];
}

export interface ProviderApiSurfaceDefinition {
  endpointComparison: string[];
  endpoints: ProviderApiEndpointDefinition[];
}

export interface ProviderPreset {
  kind: ProviderKind;
  label: string;
  description: string;
  baseUrl: string;
  defaultModel: string;
  apiStyle: ProviderApiStyle;
  template: ProviderTemplateDefinition;
  supportsApiKey: boolean;
  ownership: ProviderOwnership;
  modelSuggestions?: string[];
  suggestedHeaders?: string[];
  apiSurface: ProviderApiSurfaceDefinition;
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
  apiStyle: ProviderApiStyle;
  apiKey: string;
  description: string;
  template: ProviderTemplateDefinition;
  supportsApiKey: boolean;
  ownership: ProviderOwnership;
  presetKind: ProviderKind | null;
  modelSuggestions: string[];
  apiSurface: ProviderApiSurfaceDefinition;
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
