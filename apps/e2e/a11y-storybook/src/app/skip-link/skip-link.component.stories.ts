import { moduleMetadata } from '@storybook/angular';
import type { Meta, StoryObj } from '@storybook/angular';

import { SkipLinkComponent } from './skip-link.component';
import { SkipLinkModule } from './skip-link.module';

export default {
  id: 'skiplinkcomponent-skiplink',
  title: 'Components/Skip Link',
  component: SkipLinkComponent,
  decorators: [
    moduleMetadata({
      imports: [SkipLinkModule],
    }),
  ],
} as Meta<SkipLinkComponent>;
type Story = StoryObj<SkipLinkComponent>;
export const SkipLink: Story = {};
SkipLink.args = {};
