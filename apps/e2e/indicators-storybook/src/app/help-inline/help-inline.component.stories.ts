import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { HelpInlineComponent } from './help-inline.component';
import { HelpInlineModule } from './help-inline.module';

export default {
  id: 'help-inlinecomponent-help-inline',
  title: 'Components/HelpInline',
  component: HelpInlineComponent,
  decorators: [
    moduleMetadata({
      imports: [HelpInlineModule],
    }),
  ],
} as Meta<HelpInlineComponent>;
const Template: Story<HelpInlineComponent> = (args: HelpInlineComponent) => ({
  props: args,
});
export const HelpInline = Template.bind({});
HelpInline.args = {};
