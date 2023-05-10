import { importProvidersFrom } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
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
    moduleMetadata({
      imports: [WizardModule],
    }),
    // Define application-wide providers with the applicationConfig decorator
    applicationConfig({
      providers: [importProvidersFrom(NoopAnimationsModule)],
    }),
  ],
} as Meta<WizardComponent>;
const Template: Story<WizardComponent> = (args: WizardComponent) => ({
  props: args,
});
export const Wizard = Template.bind({});
Wizard.args = {};
