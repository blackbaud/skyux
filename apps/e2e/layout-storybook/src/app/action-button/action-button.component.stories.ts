import { Meta, moduleMetadata } from '@storybook/angular';

import { ActionButtonComponent } from './action-button.component';
import { ActionButtonModule } from './action-button.module';

export default {
  id: 'actionbuttoncomponent-actionbutton',
  title: 'Components/Action Button',
  component: ActionButtonComponent,
  decorators: [
    moduleMetadata({
      imports: [ActionButtonModule],
    }),
  ],
} as Meta<ActionButtonComponent>;
export const ActionButton = {
  render: (args: ActionButtonComponent): { props: unknown } => ({
    props: args,
  }),
  args: {},
};
