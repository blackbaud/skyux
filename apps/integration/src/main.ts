import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideZoneChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withHashLocation } from '@angular/router';
import { SkyAppAssetsService } from '@skyux/assets';
import { provideInitialTheme } from '@skyux/theme';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),
    provideHttpClient(withInterceptorsFromDi()),
    provideInitialTheme('modern'),
    provideRouter(routes, withHashLocation()),
    {
      provide: SkyAppAssetsService,
      useValue: {
        getUrl: (path: string): string => `/assets/${path}`,
      },
    }],
}).catch((err) => console.error(err));
