import type { Meta, StoryObj } from '@storybook/angular';

import { CodeComponent } from './code.component';

export default {
  id: 'codecomponent',
  title: 'Components/Code',
  component: CodeComponent,
} as Meta<CodeComponent>;
type Story = StoryObj<CodeComponent>;
export const Code: Story = {
  render: (args) => ({
    props: args,
  }),
  args: {},
};
