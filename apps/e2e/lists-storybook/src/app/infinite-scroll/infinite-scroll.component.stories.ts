import { Meta, moduleMetadata } from '@storybook/angular';

import { InfiniteScrollComponent } from './infinite-scroll.component';
import { InfiniteScrollModule } from './infinite-scroll.module';

export default {
  id: 'infinitescrollcomponent-infinitescroll',
  title: 'Components/Infinite Scroll',
  component: InfiniteScrollComponent,
  decorators: [
    moduleMetadata({
      imports: [InfiniteScrollModule],
    }),
  ],
} as Meta<InfiniteScrollComponent>;
export const InfiniteScroll = {
  render: (args: InfiniteScrollComponent) => ({
    props: args,
  }),
  args: {},
};
