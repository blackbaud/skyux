import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { PopoverComponent } from './popover.component';
import { PopoverModule } from './popover.module';

export default {
  id: 'popovercomponent-popover',
  title: 'Components/Popover',
  component: PopoverComponent,
  decorators: [
    moduleMetadata({
      imports: [PopoverModule],
    }),
  ],
} as Meta<PopoverComponent>;
const Template: Story<PopoverComponent> = (args: PopoverComponent) => ({
  props: args,
});
export const Popover = Template.bind({});
Popover.args = {};
