import { importProvidersFrom } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  Meta,
  Story,
  applicationConfig,
  moduleMetadata,
} from '@storybook/angular';

import { AlertComponent } from './alert.component';
import { AlertModule } from './alert.module';

export default {
  id: 'alertcomponent-alert',
  title: 'Components/Alert',
  component: AlertComponent,
  decorators: [
    moduleMetadata({
      imports: [AlertModule],
    }),
    // Define application-wide providers with the applicationConfig decorator
    applicationConfig({
      providers: [importProvidersFrom(NoopAnimationsModule)],
    }),
  ],
} as Meta<AlertComponent>;
const Template: Story<AlertComponent> = (args: AlertComponent) => ({
  props: args,
});
export const Alert = Template.bind({});
Alert.args = {};
