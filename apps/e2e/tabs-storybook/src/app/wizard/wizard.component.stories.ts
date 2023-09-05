import { provideRouter } from '@angular/router';
import {
  Meta,
  Story,
  applicationConfig,
  moduleMetadata,
} from '@storybook/angular';

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
const Template: Story<WizardComponent> = (args: WizardComponent) => ({
  props: args,
});
export const Wizard = Template.bind({});
Wizard.args = {};
