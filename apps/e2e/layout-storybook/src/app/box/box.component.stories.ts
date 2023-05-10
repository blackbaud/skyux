import { importProvidersFrom } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  Meta,
  Story,
  applicationConfig,
  moduleMetadata,
} from '@storybook/angular';

import { BoxComponent } from './box.component';
import { BoxModule } from './box.module';

export default {
  id: 'boxcomponent-box',
  title: 'Components/Box',
  component: BoxComponent,
  decorators: [
    moduleMetadata({
      imports: [BoxModule],
    }),
    // Define application-wide providers with the applicationConfig decorator
    applicationConfig({
      providers: [importProvidersFrom(NoopAnimationsModule)],
    }),
  ],
} as Meta<BoxComponent>;
const Template: Story<BoxComponent> = (args: BoxComponent) => ({
  props: args,
});
export const Box = Template.bind({});
Box.args = {};
