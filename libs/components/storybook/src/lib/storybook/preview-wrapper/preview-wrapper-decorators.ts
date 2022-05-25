import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { componentWrapperDecorator, moduleMetadata } from '@storybook/angular';

import { PreviewWrapperComponent } from './preview-wrapper.component';
import { PreviewWrapperModule } from './preview-wrapper.module';

export const previewWrapperDecorators = [
  moduleMetadata({
    imports: [
      CommonModule,
      NoopAnimationsModule,
      PreviewWrapperModule,
      RouterTestingModule.withRoutes([]),
    ],
  }),
  componentWrapperDecorator(PreviewWrapperComponent, ({ globals }) => ({
    theme: globals.theme,
  })),
];
