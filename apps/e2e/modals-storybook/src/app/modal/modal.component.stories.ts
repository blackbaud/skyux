import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { ModalComponent } from './modal.component';
import { ModalModule } from './modal.module';

export default {
  id: 'modalcomponent-modal',
  title: 'Components/Modal',
  component: ModalComponent,
  decorators: [
    moduleMetadata({
      imports: [ModalModule],
    }),
  ],
} as Meta<ModalComponent>;
const Template: Story<ModalComponent> = (args: ModalComponent) => ({
  props: args,
});
export const Modal = Template.bind({});
Modal.args = {};

// export const InlineHelpModal = Template.bind({});
// InlineHelpModal.args = { showInlineHelp: true };
