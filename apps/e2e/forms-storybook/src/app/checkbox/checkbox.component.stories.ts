import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { CheckboxComponent } from './checkbox.component';
import { CheckboxModule } from './checkbox.module';

export default {
  id: 'checkboxcomponent-checkbox',
  title: 'Components/Checkbox',
  component: CheckboxComponent,
  decorators: [
    moduleMetadata({
      imports: [CheckboxModule],
    }),
  ],
} as Meta<CheckboxComponent>;
const Template: Story<CheckboxComponent> = (args: CheckboxComponent) => ({
  props: args,
});
export const Checkbox = Template.bind({});
Checkbox.args = {};
