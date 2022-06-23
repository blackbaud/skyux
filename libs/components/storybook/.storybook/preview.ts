import {
  previewWrapperDecorators,
  previewWrapperGlobalTypes,
  previewWrapperParameters,
} from '@skyux/storybook';

export const parameters = {
  ...previewWrapperParameters,
};

export const globalTypes = {
  ...previewWrapperGlobalTypes,
};

export const decorators = [...previewWrapperDecorators];
