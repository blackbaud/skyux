import { moduleMetadata } from '@storybook/angular';
import type { Meta, StoryObj } from '@storybook/angular';

import { SplitViewComponent } from './split-view.component';
import { SplitViewModule } from './split-view.module';

export default {
  id: 'splitviewcomponent-splitview',
  title: 'Components/Split View',
  component: SplitViewComponent,
  decorators: [
    moduleMetadata({
      imports: [SplitViewModule],
    }),
  ],
} as Meta<SplitViewComponent>;
type Story = StoryObj<SplitViewComponent>;
export const SplitView: Story = {};
SplitView.args = {};
