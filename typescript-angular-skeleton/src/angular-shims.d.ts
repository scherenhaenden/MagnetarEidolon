declare module '@angular/core' {
  export function Component(metadata: {
    selector: string;
    standalone?: boolean;
    templateUrl?: string;
    styleUrl?: string;
    styleUrls?: string[];
  }): ClassDecorator;
}

declare module '@angular/platform-browser' {
  export function bootstrapApplication(component: unknown): Promise<unknown>;
}
