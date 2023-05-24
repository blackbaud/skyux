import { CommonModule } from '@angular/common';
import { importProvidersFrom } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyThemeService } from '@skyux/theme';
import {
  applicationConfig,
  componentWrapperDecorator,
  moduleMetadata,
} from '@storybook/angular';
import { AngularRenderer } from '@storybook/angular/dist/client/types';
import { DecoratorFunction } from '@storybook/types';

import { PreviewWrapperComponent } from './preview-wrapper.component';
import { PreviewWrapperModule } from './preview-wrapper.module';

export const previewWrapperDecorators: DecoratorFunction<
  AngularRenderer,
  unknown[]
>[] = [
  moduleMetadata({
    imports: [CommonModule, PreviewWrapperModule],
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
