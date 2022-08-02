import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { VisualModule } from '../visual.module';

import { TabsVisualComponent } from './tabs-visual.component';

export default {
  id: 'tabsvisualcomponent-tabsvisual',
  title: 'Components/Tabs',
  component: TabsVisualComponent,
  decorators: [
    moduleMetadata({
      imports: [VisualModule],
    }),
  ],
} as Meta<TabsVisualComponent>;
const Template: Story<TabsVisualComponent> = (args: TabsVisualComponent) => ({
  props: args,
});
export const Tabs = Template.bind({});
Tabs.args = {};
