import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { VisualModule } from '../visual.module';

import { FuzzyDatepickerVisualComponent } from './fuzzy-datepicker-visual.component';

export default {
  id: 'fuzzydatepickervisualcomponent-fuzzydatepickervisual',
  title: 'Components/Fuzzy Datepicker',
  component: FuzzyDatepickerVisualComponent,
  decorators: [
    moduleMetadata({
      imports: [VisualModule],
    }),
  ],
} as Meta<FuzzyDatepickerVisualComponent>;
const Template: Story<FuzzyDatepickerVisualComponent> = (
  args: FuzzyDatepickerVisualComponent
) => ({
  props: args,
});
export const FuzzyDatepicker = Template.bind({});
FuzzyDatepicker.args = {};
