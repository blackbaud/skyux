import { Meta, moduleMetadata } from '@storybook/angular';

import { ActionBarsComponent } from './action-bars.component';
import { ActionBarsModule } from './action-bars.module';

export default {
  id: 'actionbarscomponent-actionbars',
  title: 'Components/Action Bars',
  component: ActionBarsComponent,
  decorators: [
    moduleMetadata({
      imports: [ActionBarsModule],
    }),
  ],
} as Meta<ActionBarsComponent>;
export const ActionBars = {
  render: (args: ActionBarsComponent) => ({
    props: args,
  }),
  args: {},
};
