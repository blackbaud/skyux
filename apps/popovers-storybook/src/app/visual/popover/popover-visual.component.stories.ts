import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { VisualModule } from '../visual.module';

import { PopoverVisualComponent } from './popover-visual.component';

export default {
  id: 'popovervisualcomponent-popovervisual',
  title: 'Components/Popover',
  component: PopoverVisualComponent,
  decorators: [
    moduleMetadata({
      imports: [VisualModule],
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
