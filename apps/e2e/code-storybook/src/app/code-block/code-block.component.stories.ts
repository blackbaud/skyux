import type { Meta, StoryObj } from '@storybook/angular';

import { CodeBlockComponent } from './code-block.component';

export default {
  id: 'code-blockcomponent',
  title: 'Components/Code Block',
  component: CodeBlockComponent,
} as Meta<CodeBlockComponent>;
type Story = StoryObj<CodeBlockComponent>;
export const CodeBlock: Story = {
  render: (args) => ({
    props: args,
  }),
  args: {},
};
