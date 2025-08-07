import { Meta, moduleMetadata } from '@storybook/angular';

import { StatusIndicatorComponent } from './status-indicator.component';
import { StatusIndicatorModule } from './status-indicator.module';

export default {
  id: 'statusindicatorcomponent-statusindicator',
  title: 'Components/Status Indicator',
  component: StatusIndicatorComponent,
  decorators: [
    moduleMetadata({
      imports: [StatusIndicatorModule],
    }),
  ],
} as Meta<StatusIndicatorComponent>;
export const StatusIndicator = {
  render: (args: StatusIndicatorComponent): { props: unknown } => ({
    props: args,
  }),
  args: {},
};
