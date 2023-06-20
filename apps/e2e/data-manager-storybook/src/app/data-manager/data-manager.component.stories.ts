import { Meta, Story, moduleMetadata } from '@storybook/angular';

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
const Template: Story<DataManagerComponent> = (args: DataManagerComponent) => ({
  props: args,
});

export const DataManagerView1 = Template.bind({});
DataManagerView1.args = {
  activeView: 'view-1',
};

export const DataManagerView2 = Template.bind({});
DataManagerView2.args = {
  activeView: 'view-2',
};
