import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { BordersComponent } from './borders.component';
import { BordersModule } from './borders.module';

export default {
  id: 'borderscomponent-borders',
  title: 'Components/Borders',
  component: BordersComponent,
  decorators: [
    moduleMetadata({
      imports: [BordersModule],
    }),
  ],
} as Meta<BordersComponent>;
type Story = StoryObj<BordersComponent>;
export const Borders: Story = {};
Borders.args = {};
