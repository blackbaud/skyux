import { moduleMetadata } from '@storybook/angular';
import type { Meta, StoryObj } from '@storybook/angular';

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
type Story = StoryObj<ErrorComponent>;

export const ErrorBroken: Story = {};
ErrorBroken.args = {};

export const ErrorConstruction: Story = {};
ErrorConstruction.args = {
  errorType: 'construction',
};

export const ErrorNotFound: Story = {};
ErrorNotFound.args = {
  errorType: 'notfound',
};

export const ErrorSecurity: Story = {};
ErrorSecurity.args = {
  errorType: 'security',
};

export const ErrorTextOnly: Story = {};
ErrorTextOnly.args = {
  showImage: false,
};

export const ErrorCustomAction: Story = {};
ErrorCustomAction.args = {
  customAction: true,
};

export const ErrorCustomImage: Story = {};
ErrorCustomImage.args = {
  errorType: undefined,
  customImage: true,
  customTitleAndDescription: true,
};

export const ErrorCustomTitleAndDescriptionAppended: Story = {};
ErrorCustomTitleAndDescriptionAppended.args = {
  customTitleAndDescription: true,
};

export const ErrorCustomTitleAndDescriptionReplaced: Story = {};
ErrorCustomTitleAndDescriptionReplaced.args = {
  customTitleAndDescription: true,
  replaceDefaultTitleAndDescription: true,
};

export const ErrorElement: Story = {};
ErrorElement.args = {
  pageError: false,
};
