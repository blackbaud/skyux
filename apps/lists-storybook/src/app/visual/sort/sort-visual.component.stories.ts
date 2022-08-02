import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { VisualModule } from '../visual.module';

import { SortVisualComponent } from './sort-visual.component';

export default {
  id: 'sortvisualcomponent-sortvisual',
  title: 'Components/Sort',
  component: SortVisualComponent,
  decorators: [
    moduleMetadata({
      imports: [VisualModule],
    }),
  ],
} as Meta<SortVisualComponent>;
const Template: Story<SortVisualComponent> = (args: SortVisualComponent) => ({
  props: args,
});
export const Sort = Template.bind({});
Sort.args = {};
