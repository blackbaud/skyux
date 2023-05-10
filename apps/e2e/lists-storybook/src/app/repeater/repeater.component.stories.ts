import { importProvidersFrom } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  Meta,
  Story,
  applicationConfig,
  moduleMetadata,
} from '@storybook/angular';

import { RepeaterComponent } from './repeater.component';
import { RepeaterModule } from './repeater.module';

export default {
  id: 'repeatercomponent-repeater',
  title: 'Components/Repeater',
  component: RepeaterComponent,
  decorators: [
    moduleMetadata({
      imports: [RepeaterModule],
    }),
    // Define application-wide providers with the applicationConfig decorator
    applicationConfig({
      providers: [importProvidersFrom(NoopAnimationsModule)],
    }),
  ],
} as Meta<RepeaterComponent>;
const Template: Story<RepeaterComponent> = (args: RepeaterComponent) => ({
  props: args,
});
export const Repeater = Template.bind({});
Repeater.args = {};
