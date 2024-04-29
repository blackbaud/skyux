import { moduleMetadata } from '@storybook/angular';
import type { Meta, StoryObj } from '@storybook/angular';

import { HelpInlineComponent } from './help-inline.component';
import { HelpInlineModule } from './help-inline.module';

export default {
  id: 'helpinlinecomponent-helpinline',
  title: 'Components/Help Inline',
  component: HelpInlineComponent,
  decorators: [
    moduleMetadata({
      imports: [HelpInlineModule],
    }),
  ],
} as Meta<HelpInlineComponent>;
type Story = StoryObj<HelpInlineComponent>;
export const HelpInline: Story = {};
HelpInline.args = {};
