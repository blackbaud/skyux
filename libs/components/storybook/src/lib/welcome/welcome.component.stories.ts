import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { WelcomeComponent } from './welcome.component';

export default {
  title: 'Sky UX Storybook',
  component: WelcomeComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<WelcomeComponent>;

const Template: Story<WelcomeComponent> = (args: WelcomeComponent) => ({
  props: args,
});

export const SkyUXStorybook = Template.bind({});
SkyUXStorybook.args = {};
