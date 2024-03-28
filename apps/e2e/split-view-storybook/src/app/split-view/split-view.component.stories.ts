import { moduleMetadata } from '@storybook/angular';
import type { Meta, StoryObj } from '@storybook/angular';

import { SplitViewDockFillComponent } from './split-view.component';
import { SplitViewModule } from './split-view.module';

export default {
  id: 'splitviewcomponent-splitview',
  title: 'Components/Split View',
  component: SplitViewDockFillComponent,
  decorators: [
    moduleMetadata({
      imports: [SplitViewModule],
    }),
  ],
} as Meta<SplitViewDockFillComponent>;
type Story = StoryObj<SplitViewDockFillComponent>;
export const SplitView: Story = {};
SplitView.args = {};
