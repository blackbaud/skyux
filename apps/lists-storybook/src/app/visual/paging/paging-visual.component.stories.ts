import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { PagingVisualComponent } from './paging-visual.component';

export default {
  title: 'Components/Lists',
  component: PagingVisualComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<PagingVisualComponent>;

const Template: Story<PagingVisualComponent> = (
  args: PagingVisualComponent
) => ({
  props: args,
});

export const Paging = Template.bind({});
Paging.args = {};
