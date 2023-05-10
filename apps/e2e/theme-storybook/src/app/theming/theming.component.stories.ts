import { importProvidersFrom } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  Meta,
  Story,
  applicationConfig,
  moduleMetadata,
} from '@storybook/angular';

import { ThemingComponent } from './theming.component';
import { ThemingModule } from './theming.module';

export default {
  id: 'themingcomponent-theming',
  title: 'Components/Theming',
  component: ThemingComponent,
  decorators: [
    moduleMetadata({
      imports: [ThemingModule],
    }),
    // Define application-wide providers with the applicationConfig decorator
    applicationConfig({
      providers: [importProvidersFrom(NoopAnimationsModule)],
    }),
  ],
} as Meta<ThemingComponent>;
const Template: Story<ThemingComponent> = (args: ThemingComponent) => ({
  props: args,
});
export const Theming = Template.bind({});
Theming.args = {};
