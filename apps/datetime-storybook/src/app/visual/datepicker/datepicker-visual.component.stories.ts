import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { VisualModule } from '../visual.module';

import { DatepickerVisualComponent } from './datepicker-visual.component';

export default {
  id: 'datepickervisualcomponent-datepickervisual',
  title: 'Components/Datepicker',
  component: DatepickerVisualComponent,
  decorators: [
    moduleMetadata({
      imports: [VisualModule],
    }),
  ],
} as Meta<DatepickerVisualComponent>;
const Template: Story<DatepickerVisualComponent> = (
  args: DatepickerVisualComponent
) => ({
  props: args,
});
export const Datepicker = Template.bind({});
Datepicker.args = {};
