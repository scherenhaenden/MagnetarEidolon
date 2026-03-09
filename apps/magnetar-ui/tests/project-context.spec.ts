import { describe, expect, it } from 'vitest';

import { ProjectContextService } from '../src/app/core/services/project-context.service.js';

describe('ProjectContextService', () => {
  it('describes MagnetarEidolon as the product while keeping the canonical model as context', () => {
    const service = new ProjectContextService();
    const descriptor = service.getDescriptor();

    expect(descriptor.appName).toBe('MagnetarEidolon UI');
    expect(descriptor.canonicalModel.name).toBe('Magnetar Canonical Project Model');
    expect(descriptor.describe()).toContain('MagnetarEidolon UI');
    expect(descriptor.describe()).toContain('Magnetar Canonical Project Model');
  });
});
