import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { SkyTextHighlightDemoComponent } from './text-highlight-demo.component';

export default {
  title: 'Components/Indicators/Text Highlight',
  component: SkyTextHighlightDemoComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<SkyTextHighlightDemoComponent>;

const Template: Story<SkyTextHighlightDemoComponent> = (
  args: SkyTextHighlightDemoComponent
) => ({
  props: args,
});

export const TextHighlight = Template.bind({});
TextHighlight.args = {};
