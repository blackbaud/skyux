import {
  previewWrapperDecorators,
  previewWrapperGlobalTypes,
  previewWrapperParameters,
} from '@skyux/storybook';
import { moduleMetadata } from '@storybook/angular';

import { VisualModule } from '../src/app/visual/visual.module';

export const parameters = {
  ...previewWrapperParameters,
};

export const globalTypes = {
  ...previewWrapperGlobalTypes,
};

export const decorators = [
  ...previewWrapperDecorators,
  moduleMetadata({
    imports: [VisualModule],
  }),
];
