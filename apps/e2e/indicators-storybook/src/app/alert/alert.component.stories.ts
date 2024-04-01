import { moduleMetadata } from '@storybook/angular';
import type { Meta, StoryObj } from '@storybook/angular';

import { AlertComponent } from './alert.component';
import { AlertModule } from './alert.module';

export default {
  id: 'alertcomponent-alert',
  title: 'Components/Alert',
  component: AlertComponent,
  decorators: [
    moduleMetadata({
      imports: [AlertModule],
    }),
  ],
} as Meta<AlertComponent>;
type Story = StoryObj<AlertComponent>;
export const Alert: Story = {};
Alert.args = {};
