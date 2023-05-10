import { importProvidersFrom } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  Meta,
  Story,
  applicationConfig,
  moduleMetadata,
} from '@storybook/angular';

import { KeyInfoComponent } from './key-info.component';
import { KeyInfoModule } from './key-info.module';

export default {
  id: 'keyinfocomponent-keyinfo',
  title: 'Components/Key Info',
  component: KeyInfoComponent,
  decorators: [
    moduleMetadata({
      imports: [KeyInfoModule],
    }),
    // Define application-wide providers with the applicationConfig decorator
    applicationConfig({
      providers: [importProvidersFrom(NoopAnimationsModule)],
    }),
  ],
} as Meta<KeyInfoComponent>;
const Template: Story<KeyInfoComponent> = (args: KeyInfoComponent) => ({
  props: args,
});
export const KeyInfo = Template.bind({});
KeyInfo.args = {};
