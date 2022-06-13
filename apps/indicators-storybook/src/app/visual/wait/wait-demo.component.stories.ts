import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { SkyWaitDemoComponent } from './wait-demo.component';

export default {
  title: 'Components/Indicators/Wait',
  component: SkyWaitDemoComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<SkyWaitDemoComponent>;

const Template: Story<SkyWaitDemoComponent> = (args: SkyWaitDemoComponent) => ({
  props: args,
});

export const Wait = Template.bind({});
Wait.args = {};
