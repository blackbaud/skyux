import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { DockComponent } from './dock.component';
import { DockModule } from './dock.module';

export default {
  id: 'dockcomponent-dock',
  title: 'Components/Dock',
  component: DockComponent,
  decorators: [
    moduleMetadata({
      imports: [DockModule],
    }),
  ],
} as Meta<DockComponent>;
type Story = StoryObj<DockComponent>;
export const Dock: Story = {};
Dock.args = {};
