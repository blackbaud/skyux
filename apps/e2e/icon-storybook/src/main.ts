import { provideZoneChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideIconPreview } from '@skyux/storybook/icon-preview';
import { provideInitialTheme } from '@skyux/theme';

import { routes } from './app/app-routes';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),
    provideRouter(routes),
    provideInitialTheme('modern'),
    provideIconPreview(),
  ],
}).catch((err) => console.error(err));
