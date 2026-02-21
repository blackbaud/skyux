import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

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
type Story = StoryObj<InfiniteScrollComponent>;

export const InfiniteScrollReady: Story = {};
InfiniteScrollReady.args = {};

export const InfiniteScrollReadyScrollableParent: Story = {};
InfiniteScrollReadyScrollableParent.args = { scrollableParent: true };

export const InfiniteScrollLoading: Story = {};
InfiniteScrollLoading.args = { loading: true };

export const InfiniteScrollLoadingScrollableParent: Story = {};
InfiniteScrollLoadingScrollableParent.args = {
  loading: true,
  scrollableParent: true,
};
