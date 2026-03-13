import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { InputBoxComponent } from './input-box.component';
import { InputBoxModule } from './input-box.module';

export default {
  id: 'inputboxcomponent-inputbox',
  title: 'Components/Input Box',
  component: InputBoxComponent,
  decorators: [
    moduleMetadata({
      imports: [InputBoxModule],
    }),
  ],
} as Meta<InputBoxComponent>;
type Story = StoryObj<InputBoxComponent>;
export const InputBox: Story = {};
InputBox.args = {};
