import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { EditStopWhenLosesFocusComponent } from './edit-stop-when-loses-focus.component';
import { EditStopWhenLosesFocusModule } from './edit-stop-when-loses-focus.module';

export default {
  id: 'editstopwhenlosesfocuscomponent-editstopwhenlosesfocus',
  title: 'Components/Edit Stop When Loses Focus',
  component: EditStopWhenLosesFocusComponent,
  decorators: [
    moduleMetadata({
      imports: [EditStopWhenLosesFocusModule],
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
