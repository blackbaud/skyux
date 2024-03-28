import { moduleMetadata } from '@storybook/angular';
import type { Meta, StoryObj } from '@storybook/angular';

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
type Story = StoryObj<RepeaterComponent>;
export const Repeater: Story = {};
Repeater.args = {};
