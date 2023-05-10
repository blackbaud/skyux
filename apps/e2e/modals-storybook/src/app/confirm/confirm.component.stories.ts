import { importProvidersFrom } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  Meta,
  Story,
  applicationConfig,
  moduleMetadata,
} from '@storybook/angular';

import { ConfirmComponent } from './confirm.component';
import { ConfirmModule } from './confirm.module';

export default {
  id: 'confirmcomponent-confirm',
  title: 'Components/Confirm',
  component: ConfirmComponent,
  decorators: [
    moduleMetadata({
      imports: [ConfirmModule],
    }),
    // Define application-wide providers with the applicationConfig decorator
    applicationConfig({
      providers: [importProvidersFrom(NoopAnimationsModule)],
    }),
  ],
} as Meta<ConfirmComponent>;

const Template: Story<ConfirmComponent> = (args: ConfirmComponent) => ({
  props: args,
});

export const Confirm = Template.bind({});
Confirm.args = {};
