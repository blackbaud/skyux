import type { Meta, StoryObj } from '@storybook/angular';

import { IconsByRowComponent } from './icons-by-row.component';

export default {
  id: 'icons-by-rowcomponent',
  title: 'Components/Icons By Row',
  component: IconsByRowComponent,
  args: {
    page: 1,
    pages: 5,
    variant: 'line',
  },
  argTypes: {
    page: {
      type: 'number',
    },
    pages: {
      type: 'number',
    },
    variant: {
      type: {
        name: 'enum',
        value: ['line', 'solid'],
      },
    },
  },
} as Meta<IconsByRowComponent>;
type Story = StoryObj<IconsByRowComponent>;

export const IconsByRow: Story = {};
