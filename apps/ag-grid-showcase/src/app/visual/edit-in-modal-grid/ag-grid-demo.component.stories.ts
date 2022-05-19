import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { SkyAgGridDemoComponent } from './ag-grid-demo.component';

export default {
  title: 'Components/AG Grid',
  component: SkyAgGridDemoComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<SkyAgGridDemoComponent>;

const Template: Story<SkyAgGridDemoComponent> = (
  args: SkyAgGridDemoComponent
) => ({
  props: args,
});

export const EditInModal = Template.bind({});
EditInModal.args = {};
