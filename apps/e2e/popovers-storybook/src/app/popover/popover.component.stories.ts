import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

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
type Story = StoryObj<PopoverComponent>;
export const Popover: Story = {};
Popover.args = {};
