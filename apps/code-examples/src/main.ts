import { provideHttpClient } from '@angular/common/http';
import { provideZoneChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  provideRouter,
  withHashLocation,
  withInMemoryScrolling,
} from '@angular/router';
import * as codeExampleExports from '@skyux/code-examples';
import {
  SKY_DOCS_CODE_EXAMPLE_ROUTE,
  SkyDocsCodeExampleComponentTypes,
  provideSkyDocsCodeExampleTypes,
} from '@skyux/docs-tools';
import { provideInitialTheme } from '@skyux/theme';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

const CODE_EXAMPLES = codeExampleExports as SkyDocsCodeExampleComponentTypes;

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideInitialTheme('modern'),
    provideRouter(
      routes,
      withHashLocation(),
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
      }),
    ),
    provideSkyDocsCodeExampleTypes(CODE_EXAMPLES),
    {
      provide: SKY_DOCS_CODE_EXAMPLE_ROUTE,
      useValue: 'examples',
    }],
}).catch((err) => {
  console.error(err);
});
