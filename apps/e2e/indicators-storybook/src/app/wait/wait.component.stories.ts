import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { WaitComponent } from './wait.component';
import { WaitModule } from './wait.module';

/* spell-checker:ignore waitcomponent */
export default {
  id: 'waitcomponent-wait',
  title: 'Components/Wait',
  component: WaitComponent,
  decorators: [
    moduleMetadata({
      imports: [WaitModule],
    }),
  ],
} as Meta<WaitComponent>;
const Template: Story<WaitComponent> = (args: WaitComponent) => ({
  props: args,
});
export const Wait = Template.bind({});
Wait.args = {};

export const WaitPageBlocking = Template.bind({});
WaitPageBlocking.args = { showFullPageWait: true };
