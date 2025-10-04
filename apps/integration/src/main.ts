import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withHashLocation } from '@angular/router';
import { SkyAppAssetsService } from '@skyux/assets';
import { provideInitialTheme } from '@skyux/theme';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideInitialTheme('modern'),
    provideNoopAnimations(),
    provideRouter(routes, withHashLocation()),
    {
      provide: SkyAppAssetsService,
      useValue: {
        getUrl: (path: string): string => `/assets/${path}`,
      },
    },
  ],
}).catch((err) => console.error(err));
