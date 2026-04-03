import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { ActionHubComponent } from './action-hub.component';
import { ActionHubModule } from './action-hub.module';

export default {
  id: 'actionhubcomponent-actionhub',
  title: 'Components/Action Hub',
  component: ActionHubComponent,
  decorators: [
    moduleMetadata({
      imports: [ActionHubModule],
    }),
  ],
} as Meta<ActionHubComponent>;
type Story = StoryObj<ActionHubComponent>;
export const ActionHub: Story = {};
ActionHub.args = {};
