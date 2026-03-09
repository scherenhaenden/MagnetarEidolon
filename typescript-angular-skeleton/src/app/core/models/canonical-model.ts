export class CanonicalModel {
  constructor(
    public readonly name: string,
    public readonly version: string,
    public readonly purpose: string,
  ) {}

  public summary(): string {
    return `${this.name} v${this.version}: ${this.purpose}`;
  }
}

export class ApplicationDescriptor {
  constructor(
    public readonly appName: string,
    public readonly focus: string,
    public readonly canonicalModel: CanonicalModel,
  ) {}

  public describe(): string {
    return `${this.appName} focuses on ${this.focus}. It uses ${this.canonicalModel.summary()}, but it is not only about the model.`;
  }
}
