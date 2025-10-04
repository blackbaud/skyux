import type { Meta, StoryObj } from '@storybook/angular';

import { IconsComponent } from './icons.component';

export default {
  id: 'iconscomponent',
  title: 'Components/Icons',
  component: IconsComponent,
  args: {
    size: 'm',
    variant: 'line',
  },
  argTypes: {
    size: {
      type: {
        name: 'enum',
        value: ['xxxs', 'xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl'],
      },
    },
    variant: {
      type: {
        name: 'enum',
        value: ['line', 'solid'],
      },
    },
  },
} as Meta<IconsComponent>;
type Story = StoryObj<IconsComponent>;

export const Icons: Story = {};
