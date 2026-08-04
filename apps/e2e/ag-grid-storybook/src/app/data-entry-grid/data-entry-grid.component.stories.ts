import type { Meta, StoryObj } from '@storybook/angular';

import { DataEntryGridComponent } from './data-entry-grid.component';

export default {
  id: 'dataentrygridcomponent-dataentrygrid',
  title: 'Components/Data Entry Grid',
  component: DataEntryGridComponent,
  argTypes: {
    variation: {
      control: {
        type: 'select',
        options: ['date-and-lookup', 'edit-lookup'],
      },
    },
  },
} as Meta<DataEntryGridComponent>;
type Story = StoryObj<DataEntryGridComponent>;

export const DataEntryGridDateAndLookup: Story = {};
DataEntryGridDateAndLookup.args = {
  variation: 'date-and-lookup',
};

export const DataEntryGridDateAndLookupCompact: Story = {};
DataEntryGridDateAndLookupCompact.args = {
  compact: true,
  variation: 'date-and-lookup',
};

export const DataEntryGridEditLookup: Story = {};
DataEntryGridEditLookup.args = {
  variation: 'edit-lookup',
};

export const DataEntryGridEditLookupCompact: Story = {};
DataEntryGridEditLookupCompact.args = {
  compact: true,
  variation: 'edit-lookup',
};
