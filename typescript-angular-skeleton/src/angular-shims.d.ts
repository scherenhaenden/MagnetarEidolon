declare module '@angular/core' {
  export function Component(metadata: {
    selector: string;
    standalone?: boolean;
    imports?: unknown[];
    template?: string;
    templateUrl?: string;
    styleUrl?: string;
    styleUrls?: string[];
    styles?: string[];
    encapsulation?: unknown;
  }): ClassDecorator;

  export function Input(): PropertyDecorator;
  export function signal<T>(value: T): {
    (): T;
    set(next: T): void;
  };
  export function computed<T>(derive: () => T): () => T;

  export enum ViewEncapsulation {
    Emulated,
    None,
    ShadowDom,
  }
}

declare module '@angular/common' {
  export const CommonModule: unknown;
}

declare module '@angular/platform-browser' {
  export function bootstrapApplication(component: unknown): Promise<unknown>;
}
