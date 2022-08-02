import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { VisualModule } from '../visual.module';

import { FuzzyDatePipeVisualComponent } from './fuzzy-date-pipe-visual.component';

export default {
  id: 'fuzzydatepipevisualcomponent-fuzzydatepipevisual',
  title: 'Components/Fuzzy Date Pipe',
  component: FuzzyDatePipeVisualComponent,
  decorators: [
    moduleMetadata({
      imports: [VisualModule],
    }),
  ],
} as Meta<FuzzyDatePipeVisualComponent>;
const Template: Story<FuzzyDatePipeVisualComponent> = (
  args: FuzzyDatePipeVisualComponent
) => ({
  props: args,
});
export const FuzzyDatePipe = Template.bind({});
FuzzyDatePipe.args = {};
