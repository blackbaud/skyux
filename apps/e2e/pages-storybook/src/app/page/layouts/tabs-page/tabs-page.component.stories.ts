import { Meta, Story, moduleMetadata } from '@storybook/angular';

import TabsPageComponent from './tabs-page.component';

export default {
  id: 'tabspagecomponent-tabspage',
  title: 'Components/Page/Layouts/Tabs',
  component: TabsPageComponent,
  decorators: [
    moduleMetadata({
      imports: [TabsPageComponent],
    }),
  ],
} as Meta<TabsPageComponent>;
const Template: Story<TabsPageComponent> = (args: TabsPageComponent) => ({
  props: args,
});
export const TabsPage = Template.bind({});
TabsPage.args = {};
