import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { ThemingComponent } from './theming.component';
import { ThemingModule } from './theming.module';

export default {
  id: 'themingcomponent-theming',
  title: 'Components/Theming',
  component: ThemingComponent,
  decorators: [
    moduleMetadata({
      imports: [ThemingModule],
    }),
  ],
} as Meta<ThemingComponent>;
type Story = StoryObj<ThemingComponent>;
export const Theming: Story = {};
Theming.args = {};
