import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { VisualModule } from '../visual.module';

import { InfiniteScrollVisualComponent } from './infinite-scroll-visual.component';

export default {
  id: 'infinitescrollvisualcomponent-infinitescrollvisual',
  title: 'Components/Infinite Scroll',
  component: InfiniteScrollVisualComponent,
  decorators: [
    moduleMetadata({
      imports: [VisualModule],
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
