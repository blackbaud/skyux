import { provideRouter } from '@angular/router';
import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';

import { ShowcaseComponent } from './showcase.component';

export default {
  id: 'showcasecomponent',
  title: 'Components/Showcase',
  component: ShowcaseComponent,
  decorators: [
    // Needed to address the 'No provider for ActivatedRoute!' for standalone components.
    // See: https://github.com/storybookjs/storybook/issues/21218
    applicationConfig({
      providers: [provideRouter([])],
    }),
  ],
} as Meta<ShowcaseComponent>;
type Story = StoryObj<ShowcaseComponent>;
export const Showcase: Story = {};
Showcase.args = {};
