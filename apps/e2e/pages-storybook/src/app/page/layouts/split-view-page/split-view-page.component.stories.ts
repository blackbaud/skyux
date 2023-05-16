import { Meta, Story, moduleMetadata } from '@storybook/angular';

import SplitViewPageComponent from './split-view-page.component';

export default {
  id: 'splitviewpagecomponent-splitviewpage',
  title: 'Components/Page/Layouts/Split View',
  component: SplitViewPageComponent,
  decorators: [
    moduleMetadata({
      imports: [SplitViewPageComponent],
    }),
  ],
} as Meta<SplitViewPageComponent>;
const Template: Story<SplitViewPageComponent> = (
  args: SplitViewPageComponent
) => ({
  props: args,
});
export const SplitViewPage = Template.bind({});
SplitViewPage.args = {};
