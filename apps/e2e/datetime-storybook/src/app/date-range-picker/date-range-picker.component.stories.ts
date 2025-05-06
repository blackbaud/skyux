import { Meta, moduleMetadata } from '@storybook/angular';

import { DateRangePickerComponent } from './date-range-picker.component';
import { DateRangePickerModule } from './date-range-picker.module';

export default {
  id: 'daterangepickercomponent-daterangepicker',
  title: 'Components/Date Range Picker',
  component: DateRangePickerComponent,
  decorators: [
    moduleMetadata({
      imports: [DateRangePickerModule],
    }),
  ],
} as Meta<DateRangePickerComponent>;
export const DateRangePicker = {
  render: (args: DateRangePickerComponent): { props: unknown } => ({
    props: args,
  }),
  args: {},
};
