import { Meta, Story, moduleMetadata } from '@storybook/angular';

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
const Template: Story<BlocksPageComponent> = (args: BlocksPageComponent) => ({
  props: args,
});
export const BlocksPage = Template.bind({});
BlocksPage.args = {};
