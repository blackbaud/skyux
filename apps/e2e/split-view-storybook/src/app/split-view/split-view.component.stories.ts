import { Meta, Story, moduleMetadata } from '@storybook/angular';

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
const Template: Story<SplitViewDockFillComponent> = (
  args: SplitViewDockFillComponent
) => ({
  props: args,
});
export const SplitView = Template.bind({});
SplitView.args = {};
