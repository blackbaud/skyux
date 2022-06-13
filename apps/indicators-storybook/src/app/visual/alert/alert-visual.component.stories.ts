import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { AlertVisualComponent } from './alert-visual.component';

export default {
  title: 'Components/Indicators/Alert',
  component: AlertVisualComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<AlertVisualComponent>;

const Template: Story<AlertVisualComponent> = (args: AlertVisualComponent) => ({
  props: args,
});

export const Alert = Template.bind({});
Alert.args = {};
