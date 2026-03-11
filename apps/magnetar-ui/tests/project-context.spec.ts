import { describe, expect, it } from 'vitest';

import { ProjectContextService } from '../src/app/core/services/project-context.service.js';

describe('ProjectContextService', () => {
  it('describes MagnetarEidolon through the product descriptor', () => {
    const service = new ProjectContextService();
    const descriptor = service.getDescriptor();

    expect(descriptor.appName).toBe('MagnetarEidolon UI');
    expect(descriptor.productDescriptor.name).toBe('MagnetarEidolon');
    expect(descriptor.describe()).toContain('MagnetarEidolon UI');
    expect(descriptor.describe()).toContain('MagnetarEidolon v1.0');
  });
});
