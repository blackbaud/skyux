import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { EditStopWhenLosesFocusComponent } from './edit-stop-when-loses-focus.component';

export default {
  title: 'Components/AG Grid',
  component: EditStopWhenLosesFocusComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<EditStopWhenLosesFocusComponent>;

const Template: Story<EditStopWhenLosesFocusComponent> = (
  args: EditStopWhenLosesFocusComponent
) => ({
  props: args,
});

export const EditStopWhenLosesFocus = Template.bind({});
EditStopWhenLosesFocus.args = {};
