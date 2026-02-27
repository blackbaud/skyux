import { provideZoneChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  provideRouter,
  withComponentInputBinding,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { provideInitialTheme } from '@skyux/theme';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),
    provideInitialTheme('modern'),
    provideRouter(
      routes,
      withEnabledBlockingInitialNavigation(),
      withComponentInputBinding(),
    )],
}).catch((err) => console.error(err));
