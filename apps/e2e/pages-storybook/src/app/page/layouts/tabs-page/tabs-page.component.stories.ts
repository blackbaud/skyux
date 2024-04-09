import { moduleMetadata } from '@storybook/angular';
import type { Meta, StoryObj } from '@storybook/angular';

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
type Story = StoryObj<TabsPageComponent>;
export const TabsPage: Story = {};
TabsPage.args = {};
