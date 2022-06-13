import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { SkyIconDemoComponent } from './icon-demo.component';

export default {
  title: 'Components/Indicators/Icon',
  component: SkyIconDemoComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<SkyIconDemoComponent>;

const Template: Story<SkyIconDemoComponent> = (args: SkyIconDemoComponent) => ({
  props: args,
});

export const Icon = Template.bind({});
Icon.args = {};
