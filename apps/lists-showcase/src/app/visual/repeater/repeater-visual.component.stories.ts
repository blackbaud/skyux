import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { RepeaterVisualComponent } from './repeater-visual.component';

export default {
  title: 'Components/Lists',
  component: RepeaterVisualComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<RepeaterVisualComponent>;

const Template: Story<RepeaterVisualComponent> = (
  args: RepeaterVisualComponent
) => ({
  props: args,
});

export const Repeater = Template.bind({});
Repeater.args = {};
