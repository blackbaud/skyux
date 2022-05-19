import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { InfiniteScrollVisualComponent } from './infinite-scroll-visual.component';

export default {
  title: 'Components/Lists',
  component: InfiniteScrollVisualComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<InfiniteScrollVisualComponent>;

const Template: Story<InfiniteScrollVisualComponent> = (
  args: InfiniteScrollVisualComponent
) => ({
  props: args,
});

export const InfiniteScroll = Template.bind({});
InfiniteScroll.args = {};
