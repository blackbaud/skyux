import type { Meta, StoryObj } from '@storybook/angular';

import { ListSummaryComponent } from './list-summary.component';

export default {
  id: 'list-summarycomponent',
  title: 'Components/List Summary',
  component: ListSummaryComponent,
} as Meta<ListSummaryComponent>;
type Story = StoryObj<ListSummaryComponent>;
export const ListSummary: Story = {};
ListSummary.args = {};
