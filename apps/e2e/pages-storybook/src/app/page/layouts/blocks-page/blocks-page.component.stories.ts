import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import BlocksPageComponent from './blocks-page.component';

export default {
  id: 'blockspagecomponent-blockspage',
  title: 'Components/Page/Layouts/Blocks',
  component: BlocksPageComponent,
  decorators: [
    moduleMetadata({
      imports: [BlocksPageComponent],
    }),
  ],
} as Meta<BlocksPageComponent>;
type Story = StoryObj<BlocksPageComponent>;
export const BlocksPage: Story = {};
BlocksPage.args = {};

export const BlocksPageWithLinks: Story = {};
BlocksPageWithLinks.args = {
  showLinks: true,
};
