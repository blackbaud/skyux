import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { SkyLabelDemoComponent } from './label-demo.component';

export default {
  title: 'Components/Indicators/Label',
  component: SkyLabelDemoComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<SkyLabelDemoComponent>;

const Template: Story<SkyLabelDemoComponent> = (
  args: SkyLabelDemoComponent
) => ({
  props: args,
});

export const Label = Template.bind({});
Label.args = {};
