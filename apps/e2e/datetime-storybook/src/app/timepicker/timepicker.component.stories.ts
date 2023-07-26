import { Meta, moduleMetadata } from '@storybook/angular';

import { TimepickerComponent } from './timepicker.component';
import { TimepickerModule } from './timepicker.module';

export default {
  id: 'timepickercomponent-timepicker',
  title: 'Components/Timepicker',
  component: TimepickerComponent,
  decorators: [
    moduleMetadata({
      imports: [TimepickerModule],
    }),
  ],
} as Meta<TimepickerComponent>;
export const Timepicker = {
  render: (args: TimepickerComponent) => ({
    props: args,
  }),
  args: {},
};
