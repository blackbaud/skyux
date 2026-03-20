import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { BoxComponent } from './box.component';
import { BoxModule } from './box.module';

export default {
  id: 'boxcomponent-box',
  title: 'Components/Box',
  component: BoxComponent,
  decorators: [
    moduleMetadata({
      imports: [BoxModule],
    }),
  ],
} as Meta<BoxComponent>;
type Story = StoryObj<BoxComponent>;
export const Box: Story = {};
Box.args = {};
