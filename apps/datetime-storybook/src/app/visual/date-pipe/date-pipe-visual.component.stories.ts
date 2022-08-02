import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { VisualModule } from '../visual.module';

import { DatePipeVisualComponent } from './date-pipe-visual.component';

export default {
  id: 'datepipevisualcomponent-datepipevisual',
  title: 'Components/Date Pipe',
  component: DatePipeVisualComponent,
  decorators: [
    moduleMetadata({
      imports: [VisualModule],
    }),
  ],
} as Meta<DatePipeVisualComponent>;
const Template: Story<DatePipeVisualComponent> = (
  args: DatePipeVisualComponent
) => ({
  props: args,
});
export const DatePipe = Template.bind({});
DatePipe.args = {};
