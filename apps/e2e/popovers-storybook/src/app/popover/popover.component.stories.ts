import { importProvidersFrom } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  Meta,
  Story,
  applicationConfig,
  moduleMetadata,
} from '@storybook/angular';

import { PopoverComponent } from './popover.component';
import { PopoverModule } from './popover.module';

export default {
  id: 'popovercomponent-popover',
  title: 'Components/Popover',
  component: PopoverComponent,
  decorators: [
    moduleMetadata({
      imports: [PopoverModule],
    }),
    // Define application-wide providers with the applicationConfig decorator
    applicationConfig({
      providers: [importProvidersFrom(NoopAnimationsModule)],
    }),
  ],
} as Meta<PopoverComponent>;
const Template: Story<PopoverComponent> = (args: PopoverComponent) => ({
  props: args,
});
export const Popover = Template.bind({});
Popover.args = {};
