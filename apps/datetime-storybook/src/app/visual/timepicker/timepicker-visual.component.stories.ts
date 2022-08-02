import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { VisualModule } from '../visual.module';

import { TimepickerVisualComponent } from './timepicker-visual.component';

export default {
  id: 'timepickervisualcomponent-timepickervisual',
  title: 'Components/Timepicker',
  component: TimepickerVisualComponent,
  decorators: [
    moduleMetadata({
      imports: [VisualModule],
    }),
  ],
} as Meta<TimepickerVisualComponent>;
const Template: Story<TimepickerVisualComponent> = (
  args: TimepickerVisualComponent
) => ({
  props: args,
});
export const Timepicker = Template.bind({});
Timepicker.args = {};
