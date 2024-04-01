import { moduleMetadata } from '@storybook/angular';
import type { Meta, StoryObj } from '@storybook/angular';

import { LabelComponent } from './label.component';
import { LabelModule } from './label.module';

export default {
  id: 'labelcomponent-label',
  title: 'Components/Label',
  component: LabelComponent,
  decorators: [
    moduleMetadata({
      imports: [LabelModule],
    }),
  ],
} as Meta<LabelComponent>;
type Story = StoryObj<LabelComponent>;
export const Label: Story = {};
Label.args = {};
