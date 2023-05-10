import { importProvidersFrom } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  Meta,
  Story,
  applicationConfig,
  moduleMetadata,
} from '@storybook/angular';

import { WaitComponent } from './wait.component';
import { WaitModule } from './wait.module';

export default {
  id: 'waitcomponent-wait',
  title: 'Components/Wait',
  component: WaitComponent,
  decorators: [
    moduleMetadata({
      imports: [WaitModule],
    }),
    // Define application-wide providers with the applicationConfig decorator
    applicationConfig({
      providers: [importProvidersFrom(NoopAnimationsModule)],
    }),
  ],
} as Meta<WaitComponent>;
const Template: Story<WaitComponent> = (args: WaitComponent) => ({
  props: args,
});
export const Wait = Template.bind({});
Wait.args = {};

export const WaitPageBlocking = Template.bind({});
WaitPageBlocking.args = { showFullPageWait: true };
