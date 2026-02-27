import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { ResponsiveComponent } from './responsive.component';
import { ResponsiveModule } from './responsive.module';

export default {
  id: 'responsivecomponent-responsive',
  title: 'Components/Responsive',
  component: ResponsiveComponent,
  decorators: [
    moduleMetadata({
      imports: [ResponsiveModule],
    }),
  ],
} as Meta<ResponsiveComponent>;
type Story = StoryObj<ResponsiveComponent>;
export const Responsive: Story = {};
Responsive.args = {};
