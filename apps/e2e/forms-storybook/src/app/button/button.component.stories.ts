import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { ButtonComponent } from './button.component';
import { ButtonModule } from './button.module';

export default {
  id: 'buttoncomponent-button',
  title: 'Components/Button',
  component: ButtonComponent,
  decorators: [
    moduleMetadata({
      imports: [ButtonModule],
    }),
  ],
} as Meta<ButtonComponent>;
type Story = StoryObj<ButtonComponent>;
export const Buttons: Story = {};
Buttons.args = {};
