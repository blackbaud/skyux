import { Meta, moduleMetadata } from '@storybook/angular';

import { ExpansionIndicatorComponent } from './expansion-indicator.component';
import { ExpansionIndicatorModule } from './expansion-indicator.module';

export default {
  id: 'expansionindicatorcomponent-expansionindicator',
  title: 'Components/Expansion Indicator',
  component: ExpansionIndicatorComponent,
  decorators: [
    moduleMetadata({
      imports: [ExpansionIndicatorModule],
    }),
  ],
} as Meta<ExpansionIndicatorComponent>;
export const ExpansionIndicator = {
  render: (args: ExpansionIndicatorComponent): { props: unknown } => ({
    props: args,
  }),
  args: {},
};
