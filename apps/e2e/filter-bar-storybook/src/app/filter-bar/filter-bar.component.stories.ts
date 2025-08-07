import type { Meta, StoryObj } from '@storybook/angular';

import { FilterBarComponent } from './filter-bar.component';

export default {
  id: 'filter-barcomponent',
  title: 'Components/Filter Bar',
  component: FilterBarComponent,
} as Meta<FilterBarComponent>;
type Story = StoryObj<FilterBarComponent>;
export const FilterBar: Story = {};
FilterBar.args = {};
