import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { EditInModalGridModule } from './edit-in-modal-grid.module';
import { EditInModalComponent } from './edit-in-modal.component';

export default {
  id: 'editinmodalcomponent-editinmodal',
  title: 'Components/Edit In Modal',
  component: EditInModalComponent,
  decorators: [
    moduleMetadata({
      imports: [EditInModalGridModule],
    }),
  ],
} as Meta<EditInModalComponent>;
const Template: Story<EditInModalComponent> = (args: EditInModalComponent) => ({
  props: args,
});
export const EditInModal = Template.bind({});
EditInModal.args = {};
