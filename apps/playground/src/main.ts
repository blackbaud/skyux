import { provideZoneChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideRouter,
  withComponentInputBinding,
  withHashLocation,
} from '@angular/router';
import { SKY_LOG_LEVEL, SkyHelpService, SkyLogLevel } from '@skyux/core';
import { provideIconPreview } from '@skyux/storybook/icon-preview';
import { provideInitialTheme } from '@skyux/theme';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { PlaygroundHelpService } from './app/shared/help.service';

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),
    provideAnimations(),
    provideIconPreview(),
    provideInitialTheme('modern'),
    provideRouter(routes, withHashLocation(), withComponentInputBinding()),
    { provide: SkyHelpService, useClass: PlaygroundHelpService },
    { provide: SKY_LOG_LEVEL, useValue: SkyLogLevel.Info },
  ],
}).catch((err) => console.error(err));
