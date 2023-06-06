import { Meta, StoryFn, moduleMetadata } from '@storybook/angular';

import { ErrorComponent } from './error.component';
import { ErrorModule } from './error.module';

export default {
  id: 'errorcomponent-error',
  title: 'Components/Error',
  component: ErrorComponent,
  decorators: [
    moduleMetadata({
      imports: [ErrorModule],
    }),
  ],
} as Meta<ErrorComponent>;
const Error: StoryFn<ErrorComponent> = (args: ErrorComponent) => ({
  props: args,
});

export const ErrorBroken = Error.bind({});
ErrorBroken.args = {};

export const ErrorConstruction = Error.bind({});
ErrorConstruction.args = {
  errorType: 'construction',
};

export const ErrorNotFound = Error.bind({});
ErrorNotFound.args = {
  errorType: 'notfound',
};

export const ErrorSecurity = Error.bind({});
ErrorSecurity.args = {
  errorType: 'security',
};

export const ErrorTextOnly = Error.bind({});
ErrorTextOnly.args = {
  showImage: false,
};

export const ErrorCustomAction = Error.bind({});
ErrorCustomAction.args = {
  customAction: true,
};

export const ErrorCustomImage = Error.bind({});
ErrorCustomImage.args = {
  errorType: undefined,
  customImage: true,
  customTitleAndDescription: true,
};

export const ErrorCustomTitleAndDescriptionAppended = Error.bind({});
ErrorCustomTitleAndDescriptionAppended.args = {
  customTitleAndDescription: true,
};

export const ErrorCustomTitleAndDescriptionReplaced = Error.bind({});
ErrorCustomTitleAndDescriptionReplaced.args = {
  customTitleAndDescription: true,
  replaceDefaultTitleAndDescription: true,
};

export const ErrorElement = Error.bind({});
ErrorElement.args = {
  pageError: false,
};
