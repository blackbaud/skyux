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
    provideInitialTheme('modern'),
    provideRouter(routes, withEnabledBlockingInitialNavigation()),
  ],
}).catch((err) => console.error(err));
