import { importProvidersFrom } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  Meta,
  Story,
  applicationConfig,
  moduleMetadata,
} from '@storybook/angular';

import { InputBoxComponent } from './input-box.component';
import { InputBoxModule } from './input-box.module';

export default {
  id: 'inputboxcomponent-inputbox',
  title: 'Components/Input Box',
  component: InputBoxComponent,
  decorators: [
    moduleMetadata({
      imports: [InputBoxModule],
    }),
    // Define application-wide providers with the applicationConfig decorator
    applicationConfig({
      providers: [importProvidersFrom(NoopAnimationsModule)],
    }),
  ],
} as Meta<InputBoxComponent>;
const Template: Story<InputBoxComponent> = (args: InputBoxComponent) => ({
  props: args,
});
export const InputBox = Template.bind({});
InputBox.args = {};
