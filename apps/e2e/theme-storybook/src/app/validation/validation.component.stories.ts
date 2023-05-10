import { importProvidersFrom } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  Meta,
  Story,
  applicationConfig,
  moduleMetadata,
} from '@storybook/angular';

import { ValidationComponent } from './validation.component';
import { ValidationModule } from './validation.module';

export default {
  id: 'validationcomponent-validation',
  title: 'Components/Validation',
  component: ValidationComponent,
  decorators: [
    moduleMetadata({
      imports: [ValidationModule],
    }),
    // Define application-wide providers with the applicationConfig decorator
    applicationConfig({
      providers: [importProvidersFrom(NoopAnimationsModule)],
    }),
  ],
} as Meta<ValidationComponent>;
const Template: Story<ValidationComponent> = (args: ValidationComponent) => ({
  props: args,
});
export const Validation = Template.bind({});
Validation.args = {};
