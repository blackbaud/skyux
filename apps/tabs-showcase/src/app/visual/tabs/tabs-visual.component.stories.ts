import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { TabsVisualComponent } from './tabs-visual.component';

export default {
  title: 'Components/Tabs/Tabs',
  component: TabsVisualComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<TabsVisualComponent>;

const Template: Story<TabsVisualComponent> = (args: TabsVisualComponent) => ({
  props: args,
});

export const Tabs = Template.bind({});
Tabs.args = {};
