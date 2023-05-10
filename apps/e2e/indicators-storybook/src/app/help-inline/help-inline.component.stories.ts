import { importProvidersFrom } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  Meta,
  Story,
  applicationConfig,
  moduleMetadata,
} from '@storybook/angular';

import { HelpInlineComponent } from './help-inline.component';
import { HelpInlineModule } from './help-inline.module';

export default {
  id: 'helpinlinecomponent-helpinline',
  title: 'Components/Help Inline',
  component: HelpInlineComponent,
  decorators: [
    moduleMetadata({
      imports: [HelpInlineModule],
    }),
    // Define application-wide providers with the applicationConfig decorator
    applicationConfig({
      providers: [importProvidersFrom(NoopAnimationsModule)],
    }),
  ],
} as Meta<HelpInlineComponent>;
const Template: Story<HelpInlineComponent> = (args: HelpInlineComponent) => ({
  props: args,
});
export const HelpInline = Template.bind({});
HelpInline.args = {};
