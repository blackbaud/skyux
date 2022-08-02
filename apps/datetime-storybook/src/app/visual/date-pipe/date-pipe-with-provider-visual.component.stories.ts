import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { VisualModule } from '../visual.module';

import { DatePipeWithProviderVisualComponent } from './date-pipe-with-provider-visual.component';

export default {
  id: 'datepipewithprovidervisualcomponent-datepipewithprovidervisual',
  title: 'Components/Date Pipe With Provider',
  component: DatePipeWithProviderVisualComponent,
  decorators: [
    moduleMetadata({
      imports: [VisualModule],
    }),
  ],
} as Meta<DatePipeWithProviderVisualComponent>;
const Template: Story<DatePipeWithProviderVisualComponent> = (
  args: DatePipeWithProviderVisualComponent
) => ({
  props: args,
});
export const DatePipeWithProvider = Template.bind({});
DatePipeWithProvider.args = {};
