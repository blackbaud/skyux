import type { Meta, StoryObj } from '@storybook/angular';

import { ChartPieComponent } from './chart-pie.component';

export default {
  id: 'chart-piecomponent',
  title: 'Components/Chart Pie',
  component: ChartPieComponent,
} as Meta<ChartPieComponent>;
type Story = StoryObj<ChartPieComponent>;

export const Pie: Story = {};
Pie.args = {
  displayMode: 'pie',
};

export const Donut: Story = {};
Donut.args = {
  displayMode: 'donut',
};
