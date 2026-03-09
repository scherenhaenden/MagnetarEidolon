import { ApplicationDescriptor, CanonicalModel } from '../models/canonical-model.js';

export class ProjectContextService {
  private readonly canonicalModel = new CanonicalModel(
    'Magnetar Canonical Project Model',
    '1.0',
    'a reusable governance and execution baseline',
  );

  public getDescriptor(): ApplicationDescriptor {
    return new ApplicationDescriptor(
      'MagnetarEidolon UI',
      'agent orchestration, observability, and user workflow',
      this.canonicalModel,
    );
  }
}
