import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PreviewWrapperModule } from '@skyux/storybook';
import { SkyThemeService } from '@skyux/theme';
import { componentWrapperDecorator, moduleMetadata } from '@storybook/angular';

import { VisualModule } from '../src/app/visual/visual.module';

export const parameters = {};

export const decorators = [
  moduleMetadata({
    imports: [
      CommonModule,
      NoopAnimationsModule,
      PreviewWrapperModule,
      VisualModule,
    ],
    providers: [SkyThemeService],
  }),
  componentWrapperDecorator(
    (story) => `<sky-preview-wrapper>${story}</sky-preview-wrapper>`,
    ({ globals }) => ({ theme: globals.theme })
  ),
];
