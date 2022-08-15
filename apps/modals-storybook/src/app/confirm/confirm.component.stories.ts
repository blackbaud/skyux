import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { ConfirmComponent } from './confirm.component';

export default {
  title: 'ConfirmComponent',
  component: ConfirmComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<ConfirmComponent>;

const Template: Story<ConfirmComponent> = (args: ConfirmComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
