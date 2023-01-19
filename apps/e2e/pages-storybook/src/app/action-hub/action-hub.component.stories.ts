import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { ActionHubComponent } from './action-hub.component';
import { ActionHubModule } from './action-hub.module';

/* spell-checker:ignore actionhubcomponent, actionhub */
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
const Template: Story<ActionHubComponent> = (args: ActionHubComponent) => ({
  props: args,
});
export const ActionHub = Template.bind({});
ActionHub.args = {};
