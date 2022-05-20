import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { SortVisualComponent } from './sort-visual.component';

export default {
  title: 'Components/Lists',
  component: SortVisualComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<SortVisualComponent>;

const Template: Story<SortVisualComponent> = (args: SortVisualComponent) => ({
  props: args,
});

export const Sort = Template.bind({});
Sort.args = {};
