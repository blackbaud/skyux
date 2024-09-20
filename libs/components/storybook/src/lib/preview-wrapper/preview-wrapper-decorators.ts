import { provideLocationMocks } from '@angular/common/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
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
    imports: [PreviewWrapperModule],
    providers: [provideLocationMocks()],
  }),
  // Define application-wide providers with the applicationConfig decorator
  applicationConfig({
    providers: [
      provideRouter([]),
      provideAnimationsAsync('noop'),
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
