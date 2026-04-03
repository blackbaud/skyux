import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { DataVizColorsComponent } from './data-viz-colors.component';
import { DataVizColorsModule } from './data-viz-colors.module';

export default {
  id: 'datavizcolorscomponent-data-viz-colors',
  title: 'Components/Data Viz Colors',
  component: DataVizColorsComponent,
  decorators: [
    moduleMetadata({
      imports: [DataVizColorsModule],
    }),
  ],
} as Meta<DataVizColorsComponent>;
type Story = StoryObj<DataVizColorsComponent>;
export const DataVizColors: Story = {};
DataVizColors.args = {};
