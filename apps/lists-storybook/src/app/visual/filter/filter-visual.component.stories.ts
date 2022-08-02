import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { VisualModule } from '../visual.module';

import { FilterVisualComponent } from './filter-visual.component';

export default {
  id: 'filtervisualcomponent-filtervisual',
  title: 'Components/Filter',
  component: FilterVisualComponent,
  decorators: [
    moduleMetadata({
      imports: [VisualModule],
    }),
  ],
} as Meta<FilterVisualComponent>;
const Template: Story<FilterVisualComponent> = (
  args: FilterVisualComponent
) => ({
  props: args,
});
export const Filter = Template.bind({});
Filter.args = {};
