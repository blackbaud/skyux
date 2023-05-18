import { CommonModule } from '@angular/common';
import { SkyThemeService } from '@skyux/theme';
import {
  applicationConfig,
  componentWrapperDecorator,
  moduleMetadata,
} from '@storybook/angular';

import { PreviewWrapperComponent } from './preview-wrapper.component';
import { PreviewWrapperModule } from './preview-wrapper.module';

export const previewWrapperDecorators = [
  moduleMetadata({
    imports: [CommonModule, PreviewWrapperModule],
  }),
  // Define application-wide providers with the applicationConfig decorator
  applicationConfig({
    providers: [
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
