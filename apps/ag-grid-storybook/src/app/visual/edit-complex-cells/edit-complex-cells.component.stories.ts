import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { EditComplexCellsComponent } from './edit-complex-cells.component';

export default {
  title: 'Components/AG Grid/Complex Cells',
  component: EditComplexCellsComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<EditComplexCellsComponent>;

const Template: Story<EditComplexCellsComponent> = (
  args: EditComplexCellsComponent
) => ({
  props: args,
});

export const ComplexCells = Template.bind({});
ComplexCells.args = {};
