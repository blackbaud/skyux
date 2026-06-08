import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { CheckboxComponent } from './checkbox.component';
import { CheckboxModule } from './checkbox.module';

export default {
  id: 'checkboxcomponent-checkbox',
  title: 'Components/Checkbox',
  component: CheckboxComponent,
  decorators: [
    moduleMetadata({
      imports: [CheckboxModule],
    }),
  ],
} as Meta<CheckboxComponent>;
type Story = StoryObj<CheckboxComponent>;
export const Checkbox: Story = {};
Checkbox.args = {};
