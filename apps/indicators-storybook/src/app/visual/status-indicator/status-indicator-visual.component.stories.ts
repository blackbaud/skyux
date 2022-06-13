import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { StatusIndicatorVisualComponent } from './status-indicator-visual.component';

export default {
  title: 'Components/Indicators/Status Indicator',
  component: StatusIndicatorVisualComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<StatusIndicatorVisualComponent>;

const Template: Story<StatusIndicatorVisualComponent> = (
  args: StatusIndicatorVisualComponent
) => ({
  props: args,
});

export const StatusIndicator = Template.bind({});
StatusIndicator.args = {};
