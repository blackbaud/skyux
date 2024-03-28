import { moduleMetadata } from '@storybook/angular';
import type { Meta, StoryObj } from '@storybook/angular';

import FitPageComponent from './fit-page.component';

export default {
  id: 'fitpagecomponent-fitpage',
  title: 'Components/Page/Layouts/Fit',
  component: FitPageComponent,
  decorators: [
    moduleMetadata({
      imports: [FitPageComponent],
    }),
  ],
} as Meta<FitPageComponent>;
type Story = StoryObj<FitPageComponent>;
export const FitPage: Story = {};
FitPage.args = {};
