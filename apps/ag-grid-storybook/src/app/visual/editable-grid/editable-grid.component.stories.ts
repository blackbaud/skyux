import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { EditableGridComponent } from './editable-grid.component';
import { EditableGridModule } from './editable-grid.module';

export default {
  id: 'editablegridcomponent-editablegrid',
  title: 'Components/Editable Grid',
  component: EditableGridComponent,
  decorators: [
    moduleMetadata({
      imports: [EditableGridModule],
    }),
  ],
} as Meta<EditableGridComponent>;
const Template: Story<EditableGridComponent> = (
  args: EditableGridComponent
) => ({
  props: args,
});
export const EditableGrid = Template.bind({});
EditableGrid.args = {};
