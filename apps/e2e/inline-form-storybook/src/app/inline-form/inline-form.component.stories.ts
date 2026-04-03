import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { InlineFormComponent } from './inline-form.component';
import { InlineFormModule } from './inline-form.module';

export default {
  id: 'inlineformcomponent-inlineform',
  title: 'Components/Inline Form',
  component: InlineFormComponent,
  decorators: [
    moduleMetadata({
      imports: [InlineFormModule],
    }),
  ],
} as Meta<InlineFormComponent>;

type Story = StoryObj<InlineFormComponent>;

export const InlineFormCustomButtons: Story = {};
InlineFormCustomButtons.args = {
  inlineFormConfig: {
    buttonLayout: 0,
    buttons: [
      {
        action: 'save',
        text: 'Save',
        styleType: 'primary',
      },
      {
        action: 'delete',
        text: 'Delete',
        styleType: 'default',
      },
      {
        action: 'done',
        text: 'Disabled',
        styleType: 'default',
        disabled: true,
      },
      {
        action: 'cancel',
        text: 'Cancel',
        styleType: 'link',
      },
    ],
  },
};

export const InlineFormDoneCancelButtons: Story = {};
InlineFormDoneCancelButtons.args = {
  inlineFormConfig: {
    buttonLayout: 1,
  },
};

export const InlineFormDoneDeleteCancelButtons: Story = {};
InlineFormDoneDeleteCancelButtons.args = {
  inlineFormConfig: {
    buttonLayout: 2,
  },
};

export const InlineFormSaveCancelButtons: Story = {};
InlineFormSaveCancelButtons.args = {
  inlineFormConfig: {
    buttonLayout: 3,
  },
};

export const InlineFormSaveDeleteCancelButtons: Story = {};
InlineFormSaveDeleteCancelButtons.args = {
  inlineFormConfig: {
    buttonLayout: 4,
  },
};
