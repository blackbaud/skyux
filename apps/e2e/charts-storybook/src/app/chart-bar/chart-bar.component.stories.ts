import type { Meta, StoryObj } from '@storybook/angular';

import { ChartBarComponent } from './chart-bar.component';

export default {
  id: 'chart-barcomponent',
  title: 'Components/Chart Bar',
  component: ChartBarComponent,
} as Meta<ChartBarComponent>;
type Story = StoryObj<ChartBarComponent>;

export const Vertical: Story = {};
Vertical.args = {
  orientation: 'vertical',
};

export const Horizontal: Story = {};
Horizontal.args = {
  orientation: 'horizontal',
};
