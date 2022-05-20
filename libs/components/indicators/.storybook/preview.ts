import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PreviewWrapperModule } from '@skyux/storybook';
import { SkyThemeService } from '@skyux/theme';
import { componentWrapperDecorator, moduleMetadata } from '@storybook/angular';

export const parameters = {};

export const decorators = [
  moduleMetadata({
    imports: [CommonModule, NoopAnimationsModule, PreviewWrapperModule],
    providers: [SkyThemeService],
  }),
  componentWrapperDecorator(
    (story) => `<skyux-preview-wrapper>${story}</skyux-preview-wrapper>`,
    ({ globals }) => ({ theme: globals.theme })
  ),
];
