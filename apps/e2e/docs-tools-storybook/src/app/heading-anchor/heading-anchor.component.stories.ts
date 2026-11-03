import { provideRouter } from '@angular/router';
import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';

import { HeadingAnchorComponent } from './heading-anchor.component';

export default {
  id: 'heading-anchorcomponent',
  title: 'Components/Heading Anchor',
  component: HeadingAnchorComponent,
  decorators: [
    // Needed to address the 'No provider for ActivatedRoute!' for standalone components.
    // See: https://github.com/storybookjs/storybook/issues/21218
    applicationConfig({
      providers: [provideRouter([])],
    }),
  ],
} as Meta<HeadingAnchorComponent>;
type Story = StoryObj<HeadingAnchorComponent>;
export const HeadingAnchor: Story = {};
HeadingAnchor.args = {};
