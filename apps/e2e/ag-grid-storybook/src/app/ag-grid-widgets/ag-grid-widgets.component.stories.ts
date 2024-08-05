import type { Meta, StoryObj } from '@storybook/angular';

import { AgGridWidgetsComponent } from './ag-grid-widgets.component';

export default {
  id: 'ag-grid-widgetscomponent',
  title: 'Components/Ag Grid Widgets',
  component: AgGridWidgetsComponent,
} as Meta<AgGridWidgetsComponent>;
type Story = StoryObj<AgGridWidgetsComponent>;
export const AgGridWidgets: Story = {};
AgGridWidgets.args = {};

export const AgGridWidgetsCompact: Story = {};
AgGridWidgetsCompact.args = {
  compact: true,
};
