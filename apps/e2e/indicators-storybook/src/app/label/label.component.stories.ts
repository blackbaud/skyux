import { importProvidersFrom } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  Meta,
  Story,
  applicationConfig,
  moduleMetadata,
} from '@storybook/angular';

import { LabelComponent } from './label.component';
import { LabelModule } from './label.module';

export default {
  id: 'labelcomponent-label',
  title: 'Components/Label',
  component: LabelComponent,
  decorators: [
    moduleMetadata({
      imports: [LabelModule],
    }),
    // Define application-wide providers with the applicationConfig decorator
    applicationConfig({
      providers: [importProvidersFrom(NoopAnimationsModule)],
    }),
  ],
} as Meta<LabelComponent>;
const Template: Story<LabelComponent> = (args: LabelComponent) => ({
  props: args,
});
export const Label = Template.bind({});
Label.args = {};
