import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { DataManagerVisualComponent } from './data-manager-visual.component';

export default {
  title: 'Components/AG Grid/Data Manager',
  component: DataManagerVisualComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<DataManagerVisualComponent>;

const Template: Story<DataManagerVisualComponent> = (
  args: DataManagerVisualComponent
) => ({
  props: args,
});

export const DataManager = Template.bind({});
DataManager.args = {};
