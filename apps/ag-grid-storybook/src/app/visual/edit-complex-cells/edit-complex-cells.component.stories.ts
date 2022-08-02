import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { EditComplexCellsComponent } from './edit-complex-cells.component';
import { EditComplexCellsModule } from './edit-complex-cells.module';

export default {
  id: 'editcomplexcellscomponent-editcomplexcells',
  title: 'Components/Edit Complex Cells',
  component: EditComplexCellsComponent,
  decorators: [
    moduleMetadata({
      imports: [EditComplexCellsModule],
    }),
  ],
} as Meta<EditComplexCellsComponent>;
const Template: Story<EditComplexCellsComponent> = (
  args: EditComplexCellsComponent
) => ({
  props: args,
});
export const EditComplexCells = Template.bind({});
EditComplexCells.args = {};
