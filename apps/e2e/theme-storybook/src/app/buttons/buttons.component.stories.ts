import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { ButtonsComponent } from './buttons.component';
import { ButtonsModule } from './buttons.module';

export default {
  id: 'buttonscomponent-buttons',
  title: 'Components/Buttons',
  component: ButtonsComponent,
  decorators: [
    moduleMetadata({
      imports: [ButtonsModule],
    }),
  ],
} as Meta<ButtonsComponent>;
const Template: Story<ButtonsComponent> = (args: ButtonsComponent) => ({
  props: args,
});
export const Buttons = Template.bind({});
Buttons.args = {};
