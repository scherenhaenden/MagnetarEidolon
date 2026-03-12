import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { AppComponent } from './app/app.component.js';
import { APP_ROUTES } from './app/app.routes.js';

bootstrapApplication(AppComponent, {
  providers: [provideRouter(APP_ROUTES)],
})
  .catch((error: unknown) => {
    console.error('Angular bootstrap failed', error);
  });
