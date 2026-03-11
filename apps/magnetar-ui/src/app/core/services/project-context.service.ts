import { ApplicationDescriptor, ProductDescriptor } from '../models/application-descriptor.js';

export class ProjectContextService {
  private readonly productDescriptor = new ProductDescriptor(
    'MagnetarEidolon',
    '1.0',
    'agent orchestration, observability, and user workflow',
  );

  public getDescriptor(): ApplicationDescriptor {
    return new ApplicationDescriptor(
      'MagnetarEidolon UI',
      'agent orchestration, observability, and user workflow',
      this.productDescriptor,
    );
  }
}
