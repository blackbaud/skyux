import { moduleMetadata } from '@storybook/angular';
import type { Meta, StoryObj } from '@storybook/angular';

import { KeyInfoComponent } from './key-info.component';
import { KeyInfoModule } from './key-info.module';

export default {
  id: 'keyinfocomponent-keyinfo',
  title: 'Components/Key Info',
  component: KeyInfoComponent,
  decorators: [
    moduleMetadata({
      imports: [KeyInfoModule],
    }),
  ],
} as Meta<KeyInfoComponent>;
type Story = StoryObj<KeyInfoComponent>;
export const KeyInfo: Story = {};
KeyInfo.args = {};
