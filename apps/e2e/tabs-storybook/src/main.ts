import { provideZoneChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';

import { provideInitialTheme } from '@skyux/theme';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),
    provideRouter(routes, withEnabledBlockingInitialNavigation()),
    provideInitialTheme('modern'),
  ],
}).catch((err) => console.error(err));
