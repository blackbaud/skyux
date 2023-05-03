import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { InputBoxComponent } from './input-box.component';
import { InputBoxModule } from './input-box.module';

export default {
  id: 'inputboxcomponent-inputbox',
  title: 'Components/Input Box',
  component: InputBoxComponent,
  decorators: [
    moduleMetadata({
      imports: [InputBoxModule],
    }),
  ],
} as Meta<InputBoxComponent>;
const Template: Story<InputBoxComponent> = (args: InputBoxComponent) => ({
  props: args,
});
export const InputBox = Template.bind({});
InputBox.args = {};
