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
BlocksPage.args = {
  showDescriptionList: true,
};

export const BlocksPageWithDescriptionListNoAvatar: Story = {};
BlocksPageWithDescriptionListNoAvatar.args = {
  hideActions: true,
  hideAlert: true,
  hideAvatar: true,
  showDescriptionList: true,
};

export const BlocksPageWithLinks: Story = {};
BlocksPageWithLinks.args = {
  showLinks: true,
  showDescriptionList: true,
};

export const BlocksPageWithLinksNoAlert: Story = {};
BlocksPageWithLinksNoAlert.args = {
  hideAlert: true,
  showLinks: true,
};

export const BlocksPageWithLinksNoAvatar: Story = {};
BlocksPageWithLinksNoAvatar.args = {
  hideAvatar: true,
  showLinks: true,
};

export const BlocksPageWithLinksNoAvatarNoAlert: Story = {};
BlocksPageWithLinksNoAvatarNoAlert.args = {
  hideAlert: true,
  hideAvatar: true,
  showLinks: true,
};

export const BlocksPageAllHidden: Story = {};
BlocksPageAllHidden.args = {
  hideAlert: true,
  hideActions: true,
  hideAvatar: true,
  hideDetails: true,
};

export const BlocksPageAllHiddenWithLinks: Story = {};
BlocksPageAllHiddenWithLinks.args = {
  hideAlert: true,
  hideActions: true,
  hideAvatar: true,
  hideDetails: true,
  showLinks: true,
};
