import { moduleMetadata } from '@storybook/angular';
import type { Meta, StoryObj } from '@storybook/angular';

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

type Story = StoryObj<TimepickerComponent>;

export const Timepicker12Hr: Story = {};
Timepicker12Hr.args = {};

export const Timepicker24Hr: Story = {};
Timepicker24Hr.args = {
  timeFormat: 'HH',
};
