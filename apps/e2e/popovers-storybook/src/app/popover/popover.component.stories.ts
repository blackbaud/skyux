import type { Meta, StoryObj } from '@storybook/angular';

import PopoverComponent from './popover.component';

export default {
  id: 'popovercomponent-popover',
  title: 'Components/Popover',
  component: PopoverComponent,
} as Meta<PopoverComponent>;
type Story = StoryObj<PopoverComponent>;
export const Popover: Story = {};
Popover.args = {};
