import { moduleMetadata } from '@storybook/angular';
import type { Meta, StoryObj } from '@storybook/angular';

import { IconComponent } from './icon.component';
import { IconModule } from './icon.module';

export default {
  id: 'iconcomponent-icon',
  title: 'Components/Icon',
  component: IconComponent,
  decorators: [
    moduleMetadata({
      imports: [IconModule],
    }),
  ],
} as Meta<IconComponent>;
type Story = StoryObj<IconComponent>;
export const Icon: Story = {};
Icon.args = {};
