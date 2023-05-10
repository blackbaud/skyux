import { importProvidersFrom } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  Meta,
  Story,
  applicationConfig,
  moduleMetadata,
} from '@storybook/angular';

import { ButtonsComponent } from './buttons.component';
import { ButtonsModule } from './buttons.module';

export default {
  id: 'buttonscomponent-buttons',
  title: 'Components/Buttons',
  component: ButtonsComponent,
  decorators: [
    moduleMetadata({
      imports: [ButtonsModule],
    }),
    // Define application-wide providers with the applicationConfig decorator
    applicationConfig({
      providers: [importProvidersFrom(NoopAnimationsModule)],
    }),
  ],
} as Meta<ButtonsComponent>;
const Template: Story<ButtonsComponent> = (args: ButtonsComponent) => ({
  props: args,
});
export const Buttons = Template.bind({});
Buttons.args = {};
