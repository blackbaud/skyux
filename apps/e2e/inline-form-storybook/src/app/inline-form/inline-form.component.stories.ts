import { Meta, StoryFn, moduleMetadata } from '@storybook/angular';

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
const BaseInlineForm: StoryFn<InlineFormComponent> = (
  args: InlineFormComponent,
) => ({
  props: args,
});

export const InlineFormCustomButtons = BaseInlineForm.bind({});
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

export const InlineFormDoneCancelButtons = BaseInlineForm.bind({});
InlineFormDoneCancelButtons.args = {
  inlineFormConfig: {
    buttonLayout: 1,
  },
};

export const InlineFormDoneDeleteCancelButtons = BaseInlineForm.bind({});
InlineFormDoneDeleteCancelButtons.args = {
  inlineFormConfig: {
    buttonLayout: 2,
  },
};

export const InlineFormSaveCancelButtons = BaseInlineForm.bind({});
InlineFormSaveCancelButtons.args = {
  inlineFormConfig: {
    buttonLayout: 3,
  },
};

export const InlineFormSaveDeleteCancelButtons = BaseInlineForm.bind({});
InlineFormSaveDeleteCancelButtons.args = {
  inlineFormConfig: {
    buttonLayout: 4,
  },
};
