import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { DataManagerComponent } from './data-manager.component';
import { DataManagerModule } from './data-manager.module';

export default {
  id: 'datamanagercomponent-datamanager',
  title: 'Components/Data Manager',
  component: DataManagerComponent,
  decorators: [
    moduleMetadata({
      imports: [DataManagerModule],
    }),
  ],
} as Meta<DataManagerComponent>;

type Story = StoryObj<DataManagerComponent>;

export const DataManagerView1: Story = {};
DataManagerView1.args = {
  activeView: 'view-1',
};

export const DataManagerView2: Story = {};
DataManagerView2.args = {
  activeView: 'view-2',
};
