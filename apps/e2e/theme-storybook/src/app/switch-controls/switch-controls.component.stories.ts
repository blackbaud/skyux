import { importProvidersFrom } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  Meta,
  Story,
  applicationConfig,
  moduleMetadata,
} from '@storybook/angular';

import { SwitchControlsComponent } from './switch-controls.component';
import { SwitchControlsModule } from './switch-controls.module';

export default {
  id: 'switchcontrolscomponent-switchcontrols',
  title: 'Components/Switch Controls',
  component: SwitchControlsComponent,
  decorators: [
    moduleMetadata({
      imports: [SwitchControlsModule],
    }),
    // Define application-wide providers with the applicationConfig decorator
    applicationConfig({
      providers: [importProvidersFrom(NoopAnimationsModule)],
    }),
  ],
} as Meta<SwitchControlsComponent>;
const Template: Story<SwitchControlsComponent> = (
  args: SwitchControlsComponent
) => ({
  props: args,
});
export const SwitchControls = Template.bind({});
SwitchControls.args = {};
