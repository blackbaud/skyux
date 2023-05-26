import { moduleMetadata } from '@storybook/angular';

import { previewWrapperDecorators } from '../src/lib/preview-wrapper/preview-wrapper-decorators';
import { previewWrapperGlobalTypes } from '../src/lib/preview-wrapper/preview-wrapper-global-types';
import { previewWrapperParameters } from '../src/lib/preview-wrapper/preview-wrapper-parameters';

export const parameters = {
  ...previewWrapperParameters,
};

export const globalTypes = {
  ...previewWrapperGlobalTypes,
};

export const decorators = [
  ...previewWrapperDecorators,
  moduleMetadata({
    imports: [],
  }),
];
