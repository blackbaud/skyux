import { moduleMetadata } from '@storybook/angular';
import type { Meta, StoryObj } from '@storybook/angular';

import { LookupComponent } from './lookup.component';
import { LookupModule } from './lookup.module';

export default {
  id: 'lookupcomponent-lookup',
  title: 'Components/Lookup',
  component: LookupComponent,
  decorators: [
    moduleMetadata({
      imports: [LookupModule],
    }),
  ],
} as Meta<LookupComponent>;
type Story = StoryObj<LookupComponent>;

export const LookupSingleMode: Story = {};
LookupSingleMode.args = {
  selectMode: 'single',
};

export const LookupMultipleMode: Story = {};
LookupMultipleMode.args = {
  selectMode: 'multiple',
};

export const LookupSingleModeDisabled: Story = {};
LookupSingleModeDisabled.args = {
  selectMode: 'single',
  disabledFlag: true,
};

export const LookupMultipleModeDisabled: Story = {};
LookupMultipleModeDisabled.args = {
  selectMode: 'multiple',
  disabledFlag: true,
};
