import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { SkyIconStackDemoComponent } from './icon-stack-demo.component';

export default {
  title: 'Components/Indicators/Icon Stack',
  component: SkyIconStackDemoComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<SkyIconStackDemoComponent>;

const Template: Story<SkyIconStackDemoComponent> = (
  args: SkyIconStackDemoComponent
) => ({
  props: args,
});

export const IconStack = Template.bind({});
IconStack.args = {};
