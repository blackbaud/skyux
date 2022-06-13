import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { SkyHelpInlineDemoComponent } from './help-inline-demo.component';

export default {
  title: 'Components/Indicators/Help Inline',
  component: SkyHelpInlineDemoComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<SkyHelpInlineDemoComponent>;

const Template: Story<SkyHelpInlineDemoComponent> = (
  args: SkyHelpInlineDemoComponent
) => ({
  props: args,
});

export const HelpInline = Template.bind({});
HelpInline.args = {};
