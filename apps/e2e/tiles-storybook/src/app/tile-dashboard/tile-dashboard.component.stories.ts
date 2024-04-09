import { moduleMetadata } from '@storybook/angular';
import type { Meta, StoryObj } from '@storybook/angular';

import { TileDashboardComponent } from './tile-dashboard.component';
import { TileDashboardModule } from './tile-dashboard.module';

export default {
  id: 'tiledashboardcomponent-tiledashboard',
  title: 'Components/Tile Dashboard',
  component: TileDashboardComponent,
  decorators: [
    moduleMetadata({
      imports: [TileDashboardModule],
    }),
  ],
} as Meta<TileDashboardComponent>;
type Story = StoryObj<TileDashboardComponent>;
export const TileDashboard: Story = {};
TileDashboard.args = {};
