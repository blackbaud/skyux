import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { ConfirmComponent } from './confirm.component';
import { ConfirmModule } from './confirm.module';

export default {
  id: 'confirmcomponent-confirm',
  title: 'Components/Confirm',
  component: ConfirmComponent,
  decorators: [
    moduleMetadata({
      imports: [ConfirmModule],
    }),
  ],
} as Meta<ConfirmComponent>;

type Story = StoryObj<ConfirmComponent>;

export const Confirm: Story = {};
Confirm.args = {};
