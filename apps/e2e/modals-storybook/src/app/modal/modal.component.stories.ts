import { importProvidersFrom } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  Meta,
  Story,
  applicationConfig,
  moduleMetadata,
} from '@storybook/angular';

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
    // Define application-wide providers with the applicationConfig decorator
    applicationConfig({
      providers: [importProvidersFrom(NoopAnimationsModule)],
    }),
  ],
} as Meta<ModalComponent>;
const Template: Story<ModalComponent> = (args: ModalComponent) => ({
  props: args,
});
export const Modal = Template.bind({});
Modal.args = {};
