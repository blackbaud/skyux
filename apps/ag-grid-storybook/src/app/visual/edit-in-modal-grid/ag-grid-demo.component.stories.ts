import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { SkyAgGridDemoComponent } from './ag-grid-demo.component';
import { EditInModalGridModule } from './edit-in-modal-grid.module';

export default {
  id: 'skyaggriddemocomponent-skyaggriddemo',
  title: 'Components/Edit In Modal Grid',
  component: SkyAgGridDemoComponent,
  decorators: [
    moduleMetadata({
      imports: [EditInModalGridModule],
    }),
  ],
} as Meta<SkyAgGridDemoComponent>;
const Template: Story<SkyAgGridDemoComponent> = (
  args: SkyAgGridDemoComponent
) => ({
  props: args,
});
export const EditInModalGrid = Template.bind({});
EditInModalGrid.args = {};
