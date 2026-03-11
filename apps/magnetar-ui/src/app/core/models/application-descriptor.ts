export class ProductDescriptor {
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
    public readonly productDescriptor: ProductDescriptor,
  ) {}

  public describe(): string {
    return `${this.appName} focuses on ${this.focus}. Current product baseline: ${this.productDescriptor.summary()}.`;
  }
}
