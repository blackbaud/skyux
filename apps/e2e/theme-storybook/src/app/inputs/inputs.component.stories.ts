import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { InputsComponent } from './inputs.component';
import { InputsModule } from './inputs.module';

export default {
  id: 'inputscomponent-inputs',
  title: 'Components/Inputs',
  component: InputsComponent,
  decorators: [
    moduleMetadata({
      imports: [InputsModule],
    }),
  ],
} as Meta<InputsComponent>;
const Template: Story<InputsComponent> = (args: InputsComponent) => ({
  props: args,
});
export const Inputs = Template.bind({});
Inputs.args = {};
