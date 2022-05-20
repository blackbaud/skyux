import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { PopoverVisualComponent } from './popover-visual.component';

export default {
  title: 'Components/Popovers/Popover',
  component: PopoverVisualComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<PopoverVisualComponent>;

const Template: Story<PopoverVisualComponent> = (
  args: PopoverVisualComponent
) => ({
  props: args,
});

export const Popover = Template.bind({});
Popover.args = {};
