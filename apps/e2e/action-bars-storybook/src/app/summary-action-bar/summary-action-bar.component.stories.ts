import { Meta, StoryFn, moduleMetadata } from '@storybook/angular';

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
const SummaryActionBar: StoryFn<SummaryActionBarComponent> = (
  args: SummaryActionBarComponent
) => ({
  props: args,
});

export const SummaryActionBarPage = SummaryActionBar.bind({});
SummaryActionBarPage.args = {
  type: 'page',
};

export const SummaryActionBarTabs = SummaryActionBar.bind({});
SummaryActionBarTabs.args = {
  type: 'tab',
};

export const SummaryActionBarSplitView = SummaryActionBar.bind({});
SummaryActionBarSplitView.args = {
  type: 'split-view',
};

export const SummaryActionBarModal = SummaryActionBar.bind({});
SummaryActionBarModal.args = {
  type: 'modal',
};

export const SummaryActionBarModalFullPage = SummaryActionBar.bind({});
SummaryActionBarModalFullPage.args = {
  type: 'modal-full-page',
};
