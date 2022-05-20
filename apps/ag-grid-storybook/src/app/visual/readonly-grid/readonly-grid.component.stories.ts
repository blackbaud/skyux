import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { ReadonlyGridComponent } from './readonly-grid.component';

export default {
  title: 'Components/AG Grid/Data Grid',
  component: ReadonlyGridComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<ReadonlyGridComponent>;

const Template: Story<ReadonlyGridComponent> = (
  args: ReadonlyGridComponent
) => ({
  props: args,
});

export const DataGrid = Template.bind({});
DataGrid.args = {};
