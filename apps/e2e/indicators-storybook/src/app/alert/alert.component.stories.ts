import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { AlertComponent } from './alert.component';
import { AlertModule } from './alert.module';

/* spell-checker:ignore alertcomponent */
export default {
  id: 'alertcomponent-alert',
  title: 'Components/Alert',
  component: AlertComponent,
  decorators: [
    moduleMetadata({
      imports: [AlertModule],
    }),
  ],
} as Meta<AlertComponent>;
const Template: Story<AlertComponent> = (args: AlertComponent) => ({
  props: args,
});
export const Alert = Template.bind({});
Alert.args = {};
