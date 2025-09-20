import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import ListPageComponent from './list-page.component';

export default {
  id: 'listpagecomponent-listpage',
  title: 'Components/Page/Layouts/List',
  component: ListPageComponent,
  decorators: [
    moduleMetadata({
      imports: [ListPageComponent],
    }),
  ],
} as Meta<ListPageComponent>;
type Story = StoryObj<ListPageComponent>;
export const ListPage: Story = {};
ListPage.args = {};

export const ListPageWithLinks: Story = {};
ListPageWithLinks.args = {
  showLinks: true,
};
