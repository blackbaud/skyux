import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { ReadonlyGridComponent } from './readonly-grid.component';
import { ReadonlyGridModule } from './readonly-grid.module';

export default {
  id: 'readonlygridcomponent-readonlygrid',
  title: 'Components/Readonly Grid',
  component: ReadonlyGridComponent,
  decorators: [
    moduleMetadata({
      imports: [ReadonlyGridModule],
    }),
  ],
} as Meta<ReadonlyGridComponent>;
const Template: Story<ReadonlyGridComponent> = (
  args: ReadonlyGridComponent
) => ({
  props: args,
});
export const ReadonlyGrid = Template.bind({});
ReadonlyGrid.args = {};
