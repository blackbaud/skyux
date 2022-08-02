import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { VisualModule } from '../visual.module';

import { DateRangePickerVisualComponent } from './date-range-picker-visual.component';

export default {
  id: 'daterangepickervisualcomponent-daterangepickervisual',
  title: 'Components/Date Range Picker',
  component: DateRangePickerVisualComponent,
  decorators: [
    moduleMetadata({
      imports: [VisualModule],
    }),
  ],
} as Meta<DateRangePickerVisualComponent>;
const Template: Story<DateRangePickerVisualComponent> = (
  args: DateRangePickerVisualComponent
) => ({
  props: args,
});
export const DateRangePicker = Template.bind({});
DateRangePicker.args = {};
