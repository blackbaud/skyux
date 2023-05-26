import { Meta, moduleMetadata } from '@storybook/angular';

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
export const DataManager = {
  render: (args: DataManagerComponent) => ({
    props: args,
  }),
  args: {},
};
