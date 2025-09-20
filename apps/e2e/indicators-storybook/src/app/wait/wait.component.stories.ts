import { moduleMetadata } from '@storybook/angular';
import type { Meta, StoryObj } from '@storybook/angular';

import { WaitComponent } from './wait.component';
import { WaitModule } from './wait.module';

export default {
  id: 'waitcomponent-wait',
  title: 'Components/Wait',
  component: WaitComponent,
  decorators: [
    moduleMetadata({
      imports: [WaitModule],
    }),
  ],
} as Meta<WaitComponent>;
type Story = StoryObj<WaitComponent>;
export const Wait: Story = {};
Wait.args = {};

export const WaitPageBlocking: Story = {};
WaitPageBlocking.args = { showFullPageWait: true };
