import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { WelcomeComponent } from './welcome.component';
import { WelcomeModule } from './welcome.module';

export default {
  title: 'Sky UX Storybook',
  component: WelcomeComponent,
  decorators: [
    moduleMetadata({
      imports: [WelcomeModule],
    }),
  ],
} as Meta<WelcomeComponent>;

const Template: Story<WelcomeComponent> = (args: WelcomeComponent) => ({
  props: args,
});

export const SkyUXStorybook = Template.bind({});
SkyUXStorybook.args = {};
