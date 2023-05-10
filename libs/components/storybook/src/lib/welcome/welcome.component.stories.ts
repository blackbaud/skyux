import { importProvidersFrom } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  Meta,
  Story,
  applicationConfig,
  moduleMetadata,
} from '@storybook/angular';

import { WelcomeComponent } from './welcome.component';
import { WelcomeModule } from './welcome.module';

export default {
  title: 'Sky UX Storybook',
  component: WelcomeComponent,
  decorators: [
    moduleMetadata({
      imports: [WelcomeModule],
    }),
    // Define application-wide providers with the applicationConfig decorator
    applicationConfig({
      providers: [importProvidersFrom(NoopAnimationsModule)],
    }),
  ],
} as Meta<WelcomeComponent>;

const Template: Story<WelcomeComponent> = (args: WelcomeComponent) => ({
  props: args,
});

export const SkyUXStorybook = Template.bind({});
SkyUXStorybook.args = {};
