import { moduleMetadata } from '@storybook/angular';
import type { Meta, StoryObj } from '@storybook/angular';

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
type Story = StoryObj<SummaryActionBarComponent>;

export const SummaryActionBarPage: Story = {};
SummaryActionBarPage.args = {
  type: 'page',
};

export const SummaryActionBarTabs: Story = {};
SummaryActionBarTabs.args = {
  type: 'tab',
};

export const SummaryActionBarSplitView: Story = {};
SummaryActionBarSplitView.args = {
  type: 'split-view',
};

export const SummaryActionBarModal: Story = {};
SummaryActionBarModal.args = {
  type: 'modal',
};

export const SummaryActionBarModalFullPage: Story = {};
SummaryActionBarModalFullPage.args = {
  type: 'modal-full-page',
};

export const SummaryActionBarSingleError: Story = {};
SummaryActionBarSingleError.args = {
  errors: [{ message: 'This is an error inside a SAB.' }],
};

export const SummaryActionBarMultipleErrors: Story = {};
SummaryActionBarMultipleErrors.args = {
  errors: [
    { message: 'This is an error inside a SAB.' },
    { message: 'A different error.' },
  ],
};

export const SummaryActionBarModalErrors: Story = {};
SummaryActionBarModalErrors.args = {
  errors: [
    { message: 'This is an error inside a SAB.' },
    { message: 'A different error.' },
  ],
  type: 'modal',
};
