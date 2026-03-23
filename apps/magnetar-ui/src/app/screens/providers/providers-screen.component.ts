import { Component, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UiBadgeComponent, BadgeStatus } from '../../ui/badge.component.js';
import { UiIconComponent } from '../../ui/icon.component.js';
import { ProviderConfig, ProviderPreset } from '../../core/models/provider-config.js';
import { ProviderConfigService } from '../../core/services/provider-config.service.js';

@Component({
  selector: 'screen-providers',
  standalone: true,
  imports: [CommonModule, UiIconComponent, UiBadgeComponent],
  styleUrls: ['./providers-screen.component.css'],
  templateUrl: './providers-screen.component.html',
})
export class ProvidersScreen {
  public readonly accordions = signal({
    quickAdd: true,
    configured: false,
    custom: false
  });
  public readonly providerWorkflowMode = signal<'browse' | 'quickAdd' | 'custom'>('browse');

  public toggleAccordion(section: 'quickAdd' | 'configured' | 'custom'): void {
    this.accordions.update(acc => ({ ...acc, [section]: !acc[section] }));
  }

  public toggleConfiguredAccordion(): void {
    this.providerWorkflowMode.set('browse');
    this.selectedProviderId.set(null);
    this.selectedEndpointId.set(null);
    this.accordions.update((acc) => ({ ...acc, configured: !acc.configured }));
  }

  public isConfiguringNewProvider(): boolean {
    return this.providerWorkflowMode() !== 'browse';
  }

  public isPresetSelected(kind: ProviderPreset['kind']): boolean {
    return this.providerWorkflowMode() === 'quickAdd' && this.selectedProvider()?.kind === kind;
  }

  public isCustomProviderSelected(): boolean {
    return this.providerWorkflowMode() === 'custom';
  }

  public showProviderEditor(): boolean {
    return this.isConfiguringNewProvider() || this.selectedProviderId() !== null;
  }

  public finishProviderConfiguration(): void {
    this.providerWorkflowMode.set('browse');
    this.selectedProviderId.set(null);
    this.configuredJsonProviderId.set(null);
    this.selectedEndpointId.set(null);
    this.accordions.update((accordions) => ({ ...accordions, configured: true }));
  }
  public getPresetColorClasses(kind: string): string {
    switch (kind) {
      case 'openai': return 'bg-emerald-900/30 border-emerald-800/50 group-hover:bg-emerald-900/50 text-emerald-400';
      case 'anthropic': return 'bg-amber-900/30 border-amber-800/50 group-hover:bg-amber-900/50 text-amber-500';
      case 'openrouter': return 'bg-blue-900/30 border-blue-800/50 group-hover:bg-blue-900/50 text-blue-400';
      case 'lm_studio': return 'bg-emerald-900/30 border-emerald-800/50 group-hover:bg-emerald-900/50 text-emerald-400';
      default: return 'bg-white/5 border-white/10 text-zinc-400';
    }
  }

  public getRoleBgClass(role: string): string {
    switch (role) {
      case 'primary': return 'bg-emerald-500';
      case 'backup': return 'bg-amber-500';
      default: return 'bg-zinc-600';
    }
  }

  public getRoleTextClass(role: string): string {
    switch (role) {
      case 'primary': return 'text-emerald-400';
      case 'backup': return 'text-amber-500';
      default: return 'text-zinc-500';
    }
  }

  public getHttpMethodClasses(method: string): string {
    switch (method) {
      case 'GET':
        return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300';
      case 'POST':
        return 'border-cyan-500/30 bg-cyan-500/10 text-cyan-200';
      default:
        return 'border-white/10 bg-white/5 text-zinc-300';
    }
  }

  public readonly providerConfigService = inject(ProviderConfigService);
  private readonly selectedProviderId = signal<string | null>(null);
  private readonly configuredJsonProviderId = signal<string | null>(null);
  public readonly selectedEndpointId = signal<string | null>(null);
  public readonly viewMode = signal<'grid' | 'list'>('grid');
  public readonly selectedProvider = computed(
    () => this.providers().find((provider) => provider.id === this.selectedProviderId()) ?? null,
  );

  public readonly activeEndpoint = computed(() => {
    const provider = this.selectedProvider();
    if (!provider || provider.apiSurface.endpoints.length === 0) return null;
    const id = this.selectedEndpointId();
    if (id) {
      const found = provider.apiSurface.endpoints.find(e => e.id === id);
      if (found) return found;
    }
    return provider.apiSurface.endpoints[0];
  });

  public providers(): ProviderConfig[] {
    return this.providerConfigService.providers();
  }

  public presets(): ProviderPreset[] {
    return this.providerConfigService.presets();
  }

  public primaryProvider(): ProviderConfig | null {
    return this.providerConfigService.primaryProvider();
  }

  public healthyFailoverCount(): number {
    return this.providerConfigService.healthyFailoverProviders().length;
  }

  public setPrimary(providerId: string): void {
    this.providerConfigService.setPrimary(providerId);
  }

  public setBackup(providerId: string): void {
    this.providerConfigService.setBackup(providerId);
  }

  public disable(providerId: string): void {
    this.providerConfigService.disable(providerId);
  }

  public setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode.set(mode);
  }

  public selectProvider(providerId: string): void {
    this.providerWorkflowMode.set('browse');
    this.selectedProviderId.set(providerId);
    this.configuredJsonProviderId.set(null);
    this.selectedEndpointId.set(null);
  }

  public addPreset(kind: ProviderPreset['kind']): void {
    const providerId = this.providerConfigService.addProviderFromPreset(kind);
    this.providerWorkflowMode.set('quickAdd');
    this.accordions.set({
      quickAdd: true,
      configured: false,
      custom: false,
    });
    this.selectedProviderId.set(providerId);
    this.configuredJsonProviderId.set(null);
    this.selectedEndpointId.set(null);
  }

  public addCustomProvider(): void {
    const providerId = this.providerConfigService.addCustomProvider();
    this.providerWorkflowMode.set('custom');
    this.accordions.set({
      quickAdd: false,
      configured: false,
      custom: true,
    });
    this.selectedProviderId.set(providerId);
    this.configuredJsonProviderId.set(null);
    this.selectedEndpointId.set(null);
  }

  public toggleConfiguredJson(providerId: string): void {
    this.configuredJsonProviderId.update((current) => (current === providerId ? null : providerId));
  }

  public isConfiguredJsonVisible(providerId: string): boolean {
    return this.configuredJsonProviderId() === providerId;
  }

  public configuredProviderJson(providerId: string): string {
    return this.providerConfigService.serializeConfiguredProvider(providerId) ?? '{}';
  }

  public updateProviderField(
    providerId: string,
    field: 'name' | 'baseUrl' | 'model' | 'apiKey' | 'description',
    value: string,
  ): void {
    this.providerConfigService.updateProvider(providerId, { [field]: value } as Partial<ProviderConfig>);
  }

  public updateProviderTemplate(providerId: string, requestTemplate: string): void {
    const provider = this.providers().find((candidate) => candidate.id === providerId);
    if (!provider) {
      return;
    }

    this.providerConfigService.updateProvider(providerId, {
      template: {
        ...provider.template,
        requestTemplate,
      },
    });
  }

  public updateProviderPlaceholders(providerId: string, rawValue: string): void {
    const provider = this.providers().find((candidate) => candidate.id === providerId);
    if (!provider) {
      return;
    }

    const placeholders = rawValue
      .split(/[\s,]+/)
      .map((value) => value.trim())
      .filter(Boolean);

    this.providerConfigService.updateProvider(providerId, {
      template: {
        ...provider.template,
        placeholders,
      },
    });
  }

  public updateProviderApiEndpointTemplate(providerId: string, endpointId: string, requestTemplate: string): void {
    const provider = this.providers().find((candidate) => candidate.id === providerId);
    if (!provider) {
      return;
    }

    this.providerConfigService.updateProvider(providerId, {
      apiSurface: {
        ...provider.apiSurface,
        endpoints: provider.apiSurface.endpoints.map((endpoint) =>
          endpoint.id === endpointId ? { ...endpoint, requestTemplate } : endpoint,
        ),
      },
    });
  }

  public updateProviderApiEndpointExample(providerId: string, endpointId: string, requestExample: string): void {
    const provider = this.providers().find((candidate) => candidate.id === providerId);
    if (!provider) {
      return;
    }

    this.providerConfigService.updateProvider(providerId, {
      apiSurface: {
        ...provider.apiSurface,
        endpoints: provider.apiSurface.endpoints.map((endpoint) =>
          endpoint.id === endpointId ? { ...endpoint, requestExample } : endpoint,
        ),
      },
    });
  }

  public updateProviderApiEndpointPlaceholders(providerId: string, endpointId: string, rawValue: string): void {
    const provider = this.providers().find((candidate) => candidate.id === providerId);
    if (!provider) {
      return;
    }

    const placeholders = rawValue
      .split(/[\s,]+/)
      .map((value) => value.trim())
      .filter(Boolean);

    this.providerConfigService.updateProvider(providerId, {
      apiSurface: {
        ...provider.apiSurface,
        endpoints: provider.apiSurface.endpoints.map((endpoint) =>
          endpoint.id === endpointId ? { ...endpoint, placeholders } : endpoint,
        ),
      },
    });
  }

  public applyModelSuggestion(providerId: string, model: string): void {
    this.providerConfigService.updateProvider(providerId, { model });
  }

  public canRemoveProvider(providerId: string): boolean {
    return this.providerConfigService.canRemoveProvider(providerId);
  }

  public resetProvider(providerId: string): void {
    this.providerConfigService.resetProviderConfiguration(providerId);
  }

  public removeProvider(providerId: string): void {
    const didRemove = this.providerConfigService.removeProvider(providerId);
    if (!didRemove) {
      return;
    }

    if (this.configuredJsonProviderId() === providerId) {
      this.configuredJsonProviderId.set(null);
    }
    this.selectedProviderId.set(this.providers()[0]?.id ?? null);
    this.selectedEndpointId.set(null);
    this.providerWorkflowMode.set('browse');
  }

  public readInputValue(event: Event): string {
    return (event.target as HTMLInputElement | HTMLTextAreaElement).value;
  }

  public placeholderEditorValue(provider: ProviderConfig): string {
    return provider.template.placeholders.join(', ');
  }

  public endpointPlaceholdersValue(placeholders: string[]): string {
    return placeholders.join(', ');
  }

  public selectEndpoint(endpointId: string): void {
    this.selectedEndpointId.set(endpointId);
  }

  public describeRole(provider: ProviderConfig): string {
    return this.providerConfigService.describeRole(provider.id);
  }

  public getHealthBadge(provider: ProviderConfig): BadgeStatus {
    return this.providerConfigService.getHealthTone(provider.health);
  }
}
