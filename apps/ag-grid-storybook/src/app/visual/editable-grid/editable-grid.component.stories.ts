import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { EditableGridComponent } from './editable-grid.component';

export default {
  title: 'Components/AG Grid/Data Entry Grid',
  component: EditableGridComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<EditableGridComponent>;

const Template: Story<EditableGridComponent> = (
  args: EditableGridComponent
) => ({
  props: args,
});

export const DataEntryGrid = Template.bind({});
DataEntryGrid.args = {};
