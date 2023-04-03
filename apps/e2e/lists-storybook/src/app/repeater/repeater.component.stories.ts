import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { RepeaterComponent } from './repeater.component';
import { RepeaterModule } from './repeater.module';

export default {
  id: 'repeatercomponent-repeater',
  title: 'Components/Repeater',
  component: RepeaterComponent,
  decorators: [
    moduleMetadata({
      imports: [RepeaterModule],
    }),
  ],
} as Meta<RepeaterComponent>;
const Template: Story<RepeaterComponent> = (args: RepeaterComponent) => ({
  props: args,
});
export const Repeater = Template.bind({});
Repeater.args = {};
