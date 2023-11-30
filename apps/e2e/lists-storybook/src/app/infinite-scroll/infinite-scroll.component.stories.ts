import { Meta, StoryFn, moduleMetadata } from '@storybook/angular';

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
const InfiniteScroll: StoryFn<InfiniteScrollComponent> = (
  args: InfiniteScrollComponent
) => ({
  props: args,
});

export const InfiniteScrollReady = InfiniteScroll.bind({});
InfiniteScrollReady.args = {};

export const InfiniteScrollReadyScrollableParent = InfiniteScroll.bind({});
InfiniteScrollReadyScrollableParent.args = { scrollableParent: true };

export const InfiniteScrollLoading = InfiniteScroll.bind({});
InfiniteScrollLoading.args = { loading: true };

export const InfiniteScrollLoadingScrollableParent = InfiniteScroll.bind({});
InfiniteScrollLoadingScrollableParent.args = {
  loading: true,
  scrollableParent: true,
};
