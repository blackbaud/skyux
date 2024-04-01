import { moduleMetadata } from '@storybook/angular';
import type { Meta, StoryObj } from '@storybook/angular';

import { ValidationComponent } from './validation.component';
import { ValidationModule } from './validation.module';

export default {
  id: 'validationcomponent-validation',
  title: 'Components/Validation',
  component: ValidationComponent,
  decorators: [
    moduleMetadata({
      imports: [ValidationModule],
    }),
  ],
} as Meta<ValidationComponent>;
type Story = StoryObj<ValidationComponent>;
export const Validation: Story = {};
Validation.args = {};
