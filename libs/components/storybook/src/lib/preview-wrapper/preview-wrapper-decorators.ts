import { importProvidersFrom } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { SkyThemeService } from '@skyux/theme';
import type { AngularRenderer } from '@storybook/angular';
import {
  applicationConfig,
  componentWrapperDecorator,
  moduleMetadata,
} from '@storybook/angular';
import type { DecoratorFunction } from '@storybook/types';

import { PreviewWrapperComponent } from './preview-wrapper.component';
import { PreviewWrapperModule } from './preview-wrapper.module';

export const previewWrapperDecorators: DecoratorFunction<
  AngularRenderer,
  unknown[]
>[] = [
  moduleMetadata({
    imports: [PreviewWrapperModule, RouterTestingModule],
  }),
  // Define application-wide providers with the applicationConfig decorator
  applicationConfig({
    providers: [
      importProvidersFrom(NoopAnimationsModule),
      SkyThemeService,
      {
        provide: 'BODY',
        useValue: document.body,
      },
    ],
  }),
  componentWrapperDecorator(PreviewWrapperComponent, ({ globals }) => ({
    theme: globals['theme'],
  })),
];
