import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { DataManagerVisualComponent } from './data-manager-visual.component';
import { DataManagerModule } from './data-manager.module';

export default {
  id: 'datamanagervisualcomponent-datamanagervisual',
  title: 'Components/Data Manager Visual',
  component: DataManagerVisualComponent,
  decorators: [
    moduleMetadata({
      imports: [DataManagerModule],
    }),
  ],
} as Meta<DataManagerVisualComponent>;
const Template: Story<DataManagerVisualComponent> = (
  args: DataManagerVisualComponent
) => ({
  props: args,
});
export const DataManagerVisual = Template.bind({});
DataManagerVisual.args = {};
