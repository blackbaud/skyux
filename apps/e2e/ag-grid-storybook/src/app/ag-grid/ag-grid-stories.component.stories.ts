import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { AgGridStoriesComponent } from './ag-grid-stories.component';
import { AgGridStoriesModule } from './ag-grid-stories.module';

export default {
  id: 'ag-grid',
  title: 'Components/Ag Grid',
  component: AgGridStoriesComponent,
  decorators: [
    moduleMetadata({
      imports: [AgGridStoriesModule],
    }),
  ],
} as Meta<AgGridStoriesComponent>;
type Story = StoryObj<AgGridStoriesComponent>;

export const AgGrid: Story = {};
AgGrid.args = {};

export const AgGridCompact: Story = {};
AgGridCompact.args = {
  compact: true,
};
