import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { RadioButtonComponent } from './radio-button.component';
import { RadioButtonModule } from './radio-button.module';

export default {
  id: 'radiobuttoncomponent-radiobutton',
  title: 'Components/Radio Button',
  component: RadioButtonComponent,
  decorators: [
    moduleMetadata({
      imports: [RadioButtonModule],
    }),
  ],
} as Meta<RadioButtonComponent>;
type Story = StoryObj<RadioButtonComponent>;
export const RadioButton: Story = {};
RadioButton.args = {};
