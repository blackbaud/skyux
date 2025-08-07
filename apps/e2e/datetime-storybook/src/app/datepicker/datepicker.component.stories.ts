import { Meta, moduleMetadata } from '@storybook/angular';

import { DatepickerComponent } from './datepicker.component';
import { DatepickerModule } from './datepicker.module';

export default {
  id: 'datepickercomponent-datepicker',
  title: 'Components/Datepicker',
  component: DatepickerComponent,
  decorators: [
    moduleMetadata({
      imports: [DatepickerModule],
    }),
  ],
} as Meta<DatepickerComponent>;
export const Datepicker = {
  render: (args: DatepickerComponent): { props: unknown } => ({
    props: args,
  }),
  args: {},
};
