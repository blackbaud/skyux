import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

import { DataManagerWithListToolbarsComponent } from './data-manager-with-list-toolbars.component';
import { DataManagerWithListToolbarsModule } from './data-manager-with-list-toolbars.module';

export default {
  id: 'data-manager-with-list-toolbarscomponent',
  title: 'Components/Data Manager With List Toolbars',
  component: DataManagerWithListToolbarsComponent,
  decorators: [
    moduleMetadata({
      imports: [DataManagerWithListToolbarsModule],
    }),
  ],
} as Meta<DataManagerWithListToolbarsComponent>;
type Story = StoryObj<DataManagerWithListToolbarsComponent>;
export const DataManagerWithListToolbars: Story = {};
DataManagerWithListToolbars.args = {};
