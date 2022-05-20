import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { FlyoutVisualComponent } from './flyout-visual.component';

export default {
  title: 'Components/Flyout',
  component: FlyoutVisualComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<FlyoutVisualComponent>;

const Template: Story<FlyoutVisualComponent> = (
  args: FlyoutVisualComponent
) => ({
  props: args,
});

export const Flyout = Template.bind({});
Flyout.args = {};
