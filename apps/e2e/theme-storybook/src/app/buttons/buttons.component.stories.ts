import { moduleMetadata } from '@storybook/angular';
import type { Meta, StoryObj } from '@storybook/angular';

import { ButtonsComponent } from './buttons.component';
import { ButtonsModule } from './buttons.module';

export default {
  id: 'buttonscomponent-buttons',
  title: 'Components/Buttons',
  component: ButtonsComponent,
  decorators: [
    moduleMetadata({
      imports: [ButtonsModule],
    }),
  ],
} as Meta<ButtonsComponent>;
type Story = StoryObj<ButtonsComponent>;
export const Buttons: Story = {};
Buttons.args = {};
