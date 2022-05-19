import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { VerticalTabsVisualComponent } from './vertical-tabs-visual.component';

export default {
  title: 'Components/Tabs/Vertical Tabset',
  component: VerticalTabsVisualComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<VerticalTabsVisualComponent>;

const Template: Story<VerticalTabsVisualComponent> = (
  args: VerticalTabsVisualComponent
) => ({
  props: args,
});

export const VerticalTabset = Template.bind({});
VerticalTabset.args = {};
