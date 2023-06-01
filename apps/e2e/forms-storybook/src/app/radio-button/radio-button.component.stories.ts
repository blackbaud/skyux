import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { RadioButtonComponent } from './radio-button.component';
import { RadioButtonModule } from './radio-button.module';

export default {
  id: 'radiobuttoncomponent-radiobutton',
  title: 'Components/Radio Button',
  component: RadioButtonComponent,
  decorators: [
    moduleMetadata({
      imports: [RadioButtonModule],
    }),
  ],
} as Meta<RadioButtonComponent>;
const Template: Story<RadioButtonComponent> = (args: RadioButtonComponent) => ({
  props: args,
});
export const RadioButton = Template.bind({});
RadioButton.args = {};
