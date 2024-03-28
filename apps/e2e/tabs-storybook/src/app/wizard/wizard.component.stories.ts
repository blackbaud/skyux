import { provideRouter } from '@angular/router';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import type { Meta, StoryObj } from '@storybook/angular';

import { WizardComponent } from './wizard.component';
import { WizardModule } from './wizard.module';

export default {
  id: 'wizardcomponent-wizard',
  title: 'Components/Wizard',
  component: WizardComponent,
  decorators: [
    // Needed to address the 'No provider for ActivatedRoute!' for standalone components.
    // See: https://github.com/storybookjs/storybook/issues/21218
    applicationConfig({
      providers: [provideRouter([])],
    }),
    moduleMetadata({
      imports: [WizardModule],
    }),
  ],
} as Meta<WizardComponent>;
type Story = StoryObj<WizardComponent>;
export const Wizard: Story = {};
Wizard.args = {};
