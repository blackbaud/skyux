import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { TabsComponent } from './tabs.component';
import { TabsModule } from './tabs.module';

export default {
  id: 'tabscomponent-tabs',
  title: 'Components/Tabs',
  component: TabsComponent,
  decorators: [
    moduleMetadata({
      imports: [TabsModule],
    }),
  ],
} as Meta<TabsComponent>;

type Story = StoryObj<TabsComponent>;
export const Tabs: Story = {};
Tabs.args = {
  active: 1,
  tabs: [
    {
      tabHeading: 'Tab 1',
      tabContent: 'Tab 1 Content',
      disabled: true,
    },
    {
      tabHeading: 'Tab 2',
      tabContent: 'Tab 2 Content',
    },
    {
      tabHeading: 'Tab 3',
      tabContent: 'Tab 3 Content',
      isPermanent: true,
    },
  ],
};

export const TabsDropdown: Story = {};
TabsDropdown.args = {
  active: 0,
  tabs: [
    {
      tabHeading: 'Tab 1 with a really super long name and lots of words',
      tabContent: 'Tab 1 Content',
    },
    {
      tabHeading:
        'Tab 2 with an even longer name than tab one just so many words',
      tabContent: 'Tab 2 Content',
    },
    {
      tabHeading: 'Tab 3 also has a long name with a lot of words',
      tabContent: 'Tab 3 Content',
      isPermanent: true,
    },
    {
      tabHeading: 'Tab 4 has a long name but not as long as tab one',
      tabContent: 'Tab 4 Content',
    },
    {
      tabHeading: 'Tab 5 is the fifth tab and it also has a really long name',
      tabContent: 'Tab 5 Content',
    },
    {
      tabHeading:
        'Tab 6 is the last tab and it has a longer title than any tab before it',
      tabContent: 'Tab 6 Content',
    },
  ],
};
