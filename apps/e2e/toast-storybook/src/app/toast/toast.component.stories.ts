import { Meta, moduleMetadata } from '@storybook/angular';

import { ToastComponent } from './toast.component';
import { ToastModule } from './toast.module';

export default {
  id: 'toastcomponent-toast',
  title: 'Components/Toast',
  component: ToastComponent,
  decorators: [
    moduleMetadata({
      imports: [ToastModule],
    }),
  ],
} as Meta<ToastComponent>;
export const Toast = {
  render: (args: ToastComponent): { props: unknown } => ({ props: args }),
  args: {},
};
