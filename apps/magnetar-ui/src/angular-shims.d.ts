declare module '@angular/core' {
  export interface ApplicationConfig {
    providers?: unknown[];
  }

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
  export const NgClass: unknown;
}

declare module '@angular/platform-browser' {
  export function bootstrapApplication(component: unknown, options?: import('@angular/core').ApplicationConfig): Promise<unknown>;
}
