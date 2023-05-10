import { importProvidersFrom } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  Meta,
  Story,
  applicationConfig,
  moduleMetadata,
} from '@storybook/angular';

import { ResponsiveComponent } from './responsive.component';
import { ResponsiveModule } from './responsive.module';

export default {
  id: 'responsivecomponent-responsive',
  title: 'Components/Responsive',
  component: ResponsiveComponent,
  decorators: [
    moduleMetadata({
      imports: [ResponsiveModule],
    }),
    // Define application-wide providers with the applicationConfig decorator
    applicationConfig({
      providers: [importProvidersFrom(NoopAnimationsModule)],
    }),
  ],
} as Meta<ResponsiveComponent>;
const Template: Story<ResponsiveComponent> = (args: ResponsiveComponent) => ({
  props: args,
});
export const Responsive = Template.bind({});
Responsive.args = {};
