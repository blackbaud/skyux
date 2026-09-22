import { provideHttpClient } from '@angular/common/http';
import { provideZoneChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  provideRouter,
  withHashLocation,
  withInMemoryScrolling,
} from '@angular/router';
import * as codeExampleExports from '@skyux/code-examples';
import {
  provideSkyDocsCodeExampleTypes,
  SKY_DOCS_CODE_EXAMPLE_ROUTE,
  SkyDocsCodeExampleComponentTypes,
} from '@skyux/docs-tools';
import { provideInitialTheme } from '@skyux/theme';

import {
  provideSkyInstrumentationListener,
  SkyInstrumentationEvent,
  SkyInstrumentationListener,
} from '@skyux/core';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

const CODE_EXAMPLES = codeExampleExports as SkyDocsCodeExampleComponentTypes;

class CodeExamplesUserEventListener implements SkyInstrumentationListener {
  public onEvent(evt: SkyInstrumentationEvent): void {
    console.log('Instrumentation event:', evt);
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),
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
    },
    provideSkyInstrumentationListener(CodeExamplesUserEventListener),
  ],
}).catch((err) => {
  console.error(err);
});
