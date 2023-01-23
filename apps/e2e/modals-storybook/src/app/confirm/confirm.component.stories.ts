import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { ConfirmComponent } from './confirm.component';
import { ConfirmModule } from './confirm.module';

export default {
  id: 'confirmcomponent-confirm',
  title: 'Components/Confirm',
  component: ConfirmComponent,
  decorators: [
    moduleMetadata({
      imports: [ConfirmModule],
    }),
  ],
} as Meta<ConfirmComponent>;

const Template: Story<ConfirmComponent> = (args: ConfirmComponent) => ({
  props: args,
});

export const Confirm = Template.bind({});
Confirm.args = {};
