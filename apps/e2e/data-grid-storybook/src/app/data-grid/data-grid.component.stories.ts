import type { Meta, StoryObj } from '@storybook/angular';

import { DataGridComponent } from './data-grid.component';

export default {
  id: 'data-gridcomponent',
  title: 'Components/Data Grid',
  component: DataGridComponent,
} as Meta<DataGridComponent>;
type Story = StoryObj<DataGridComponent>;
export const DataGrid: Story = {};
DataGrid.args = {};
