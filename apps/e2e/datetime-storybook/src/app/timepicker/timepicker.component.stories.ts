import { moduleMetadata } from '@storybook/angular';
import type { Meta, StoryFn } from '@storybook/angular';

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
export const Timepicker12Hr: StoryFn<TimepickerComponent> = (
  args: TimepickerComponent,
) => ({
  props: args,
});

export const Timepicker24Hr = Timepicker12Hr.bind({});
Timepicker24Hr.args = {
  timeFormat: 'HH',
};
