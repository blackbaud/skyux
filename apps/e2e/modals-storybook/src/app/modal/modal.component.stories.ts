import { moduleMetadata } from '@storybook/angular';
import type { Meta, StoryObj } from '@storybook/angular';

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
type Story = StoryObj<ModalComponent>;
export const Modal: Story = {};
Modal.args = {};
