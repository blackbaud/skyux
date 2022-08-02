import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { VisualModule } from '../visual.module';

import { ActionHubVisualComponent } from './action-hub-visual.component';

export default {
  id: 'actionhubvisualcomponent-actionhubvisual',
  title: 'Components/Action Hub',
  component: ActionHubVisualComponent,
  decorators: [
    moduleMetadata({
      imports: [VisualModule],
    }),
  ],
} as Meta<ActionHubVisualComponent>;
const Template: Story<ActionHubVisualComponent> = (
  args: ActionHubVisualComponent
) => ({
  props: args,
});
export const ActionHub = Template.bind({});
ActionHub.args = {};
