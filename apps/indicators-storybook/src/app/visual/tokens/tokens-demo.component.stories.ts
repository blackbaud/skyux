import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { SkyTokensDemoComponent } from './tokens-demo.component';

export default {
  title: 'Components/Indicators/Tokens',
  component: SkyTokensDemoComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<SkyTokensDemoComponent>;

const Template: Story<SkyTokensDemoComponent> = (
  args: SkyTokensDemoComponent
) => ({
  props: args,
});

export const Tokens = Template.bind({});
Tokens.args = {};
