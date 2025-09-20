import { moduleMetadata } from '@storybook/angular';
import type { Meta, StoryObj } from '@storybook/angular';

import { WelcomeComponent } from './welcome.component';
import { WelcomeModule } from './welcome.module';

export default {
  title: 'Sky UX Storybook',
  component: WelcomeComponent,
  decorators: [
    moduleMetadata({
      imports: [WelcomeModule],
    }),
  ],
} as Meta<WelcomeComponent>;

type Story = StoryObj<WelcomeComponent>;

export const SkyUXStorybook: Story = {};
SkyUXStorybook.args = {};
