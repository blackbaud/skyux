import { Meta, moduleMetadata } from '@storybook/angular';

import { ProgressIndicatorComponent } from './progress-indicator.component';
import { ProgressIndicatorModule } from './progress-indicator.module';

export default {
  id: 'progressindicatorcomponent-progressindicator',
  title: 'Components/Progress Indicator',
  component: ProgressIndicatorComponent,
  decorators: [
    moduleMetadata({
      imports: [ProgressIndicatorModule],
    }),
  ],
} as Meta<ProgressIndicatorComponent>;
export const ProgressIndicator = {
  render: (args: ProgressIndicatorComponent): { props: unknown } => ({
    props: args,
  }),
  args: {},
};
