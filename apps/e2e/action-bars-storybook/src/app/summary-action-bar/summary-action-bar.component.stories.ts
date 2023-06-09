import { Meta, moduleMetadata } from '@storybook/angular';

import { SummaryActionBarComponent } from './summary-action-bar.component';
import { SummaryActionBarModule } from './summary-action-bar.module';

export default {
  id: 'summaryactionbarcomponent-summaryactionbar',
  title: 'Components/Summary Action Bar',
  component: SummaryActionBarComponent,
  decorators: [
    moduleMetadata({
      imports: [SummaryActionBarModule],
    }),
  ],
} as Meta<SummaryActionBarComponent>;
export const SummaryActionBar = {
  render: (args: SummaryActionBarComponent) => ({
    props: args,
  }),
  args: {},
};
