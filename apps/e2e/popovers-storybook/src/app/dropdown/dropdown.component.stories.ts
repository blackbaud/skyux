import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { DropdownComponent } from './dropdown.component';
import { DropdownModule } from './dropdown.module';

export default {
  id: 'dropdowncomponent-dropdown',
  title: 'Components/Dropdown',
  component: DropdownComponent,
  decorators: [
    moduleMetadata({
      imports: [DropdownModule],
    }),
  ],
} as Meta<DropdownComponent>;
type Story = StoryObj<DropdownComponent>;

export const DropdownDefaultButton: Story = {};
DropdownDefaultButton.args = {
  buttonStyle: 'default',
};

export const DropdownPrimaryButton: Story = {};
DropdownPrimaryButton.args = {
  buttonStyle: 'primary',
};

export const DropdownLinkButton: Story = {};
DropdownLinkButton.args = {
  buttonStyle: 'link',
};

export const DropdownDisabledButton: Story = {};
DropdownDisabledButton.args = {
  disabledFlag: true,
};

export const DropdownLeftAligned: Story = {};
DropdownLeftAligned.args = {
  horizontalAlignment: 'left',
};

export const DropdownRightAligned: Story = {};
DropdownRightAligned.args = {
  horizontalAlignment: 'right',
};

export const DropdownCenterAligned: Story = {};
DropdownCenterAligned.args = {
  horizontalAlignment: 'center',
};
