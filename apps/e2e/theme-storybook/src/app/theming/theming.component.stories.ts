import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { ThemingComponent } from './theming.component';
import { ThemingModule } from './theming.module';

export default {
  id: 'themingcomponent-theming',
  title: 'Components/Theming',
  component: ThemingComponent,
  decorators: [
    moduleMetadata({
      imports: [ThemingModule],
    }),
  ],
} as Meta<ThemingComponent>;
const Template: Story<ThemingComponent> = (args: ThemingComponent) => ({
  props: args,
});
export const Theming = Template.bind({});
Theming.args = {};
