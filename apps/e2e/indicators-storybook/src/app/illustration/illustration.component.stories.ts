import type { Meta, StoryObj } from '@storybook/angular';

import { IllustrationComponent } from './illustration.component';

export default {
  id: 'illustrationcomponent-illustration',
  title: 'Components/Illustration',
  component: IllustrationComponent,
} as Meta<IllustrationComponent>;
type Story = StoryObj<IllustrationComponent>;
export const Illustration: Story = {};
Illustration.args = {};
