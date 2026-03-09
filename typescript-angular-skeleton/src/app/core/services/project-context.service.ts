import { ApplicationDescriptor, CanonicalModel } from '../models/canonical-model.js';

export class ProjectContextService {
  private readonly canonicalModel = new CanonicalModel(
    'MagnetarEidolon Canonical Project Model',
    '1.0',
    'a reusable governance and execution baseline',
  );

  public getDescriptor(): ApplicationDescriptor {
    return new ApplicationDescriptor(
      'Magnetar Angular UI Shell',
      'project orchestration and user workflow',
      this.canonicalModel,
    );
  }
}
