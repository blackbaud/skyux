import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { FilterVisualComponent } from './filter-visual.component';

export default {
  title: 'Components/Lists',
  component: FilterVisualComponent,
  decorators: [
    moduleMetadata({
      imports: [],
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
