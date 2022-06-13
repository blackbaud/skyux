import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { KeyInfoVisualComponent } from './key-info-visual.component';

export default {
  title: 'Components/Indicators/Key Info',
  component: KeyInfoVisualComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<KeyInfoVisualComponent>;

const Template: Story<KeyInfoVisualComponent> = (
  args: KeyInfoVisualComponent
) => ({
  props: args,
});

export const KeyInfo = Template.bind({});
KeyInfo.args = {};
