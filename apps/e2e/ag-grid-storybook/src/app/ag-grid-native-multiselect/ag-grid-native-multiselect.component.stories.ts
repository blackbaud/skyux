import type { Meta, StoryObj } from '@storybook/angular';

import { AgGridMultiselectComponent } from './ag-grid-native-multiselect.component';

export default {
  id: 'ag-grid-native-multiselectcomponent',
  title: 'Components/Ag Grid Native Multiselect',
  component: AgGridMultiselectComponent,
} as Meta<AgGridMultiselectComponent>;
type Story = StoryObj<AgGridMultiselectComponent>;

export const AgGridNativeMultiselect: Story = {};
AgGridNativeMultiselect.args = {};

export const AgGridNativeMultiselectCompact: Story = {};
AgGridNativeMultiselectCompact.args = {
  compact: true,
};
