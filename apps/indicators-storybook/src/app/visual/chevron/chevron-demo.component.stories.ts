import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { SkyChevronDemoComponent } from './chevron-demo.component';

export default {
  title: 'Components/Indicators/Chevron',
  component: SkyChevronDemoComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<SkyChevronDemoComponent>;

const Template: Story<SkyChevronDemoComponent> = (
  args: SkyChevronDemoComponent
) => ({
  props: args,
});

export const Chevron = Template.bind({});
Chevron.args = {};
