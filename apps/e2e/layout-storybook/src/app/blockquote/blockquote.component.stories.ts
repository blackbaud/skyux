import type { Meta, StoryObj } from '@storybook/angular';

import { BlockquoteComponent } from './blockquote.component';

export default {
  id: 'blockquotecomponent',
  title: 'Components/Blockquote',
  component: BlockquoteComponent,
} as Meta<BlockquoteComponent>;
type Story = StoryObj<BlockquoteComponent>;
export const Blockquote: Story = {};
Blockquote.args = {};
