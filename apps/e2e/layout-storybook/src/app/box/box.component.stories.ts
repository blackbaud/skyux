import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { BoxComponent } from './box.component';
import { BoxModule } from './box.module';

/* spell-checker:ignore boxcomponent */
export default {
  id: 'boxcomponent-box',
  title: 'Components/Box',
  component: BoxComponent,
  decorators: [
    moduleMetadata({
      imports: [BoxModule],
    }),
  ],
} as Meta<BoxComponent>;
const Template: Story<BoxComponent> = (args: BoxComponent) => ({
  props: args,
});
export const Box = Template.bind({});
Box.args = {};
