import { Meta, StoryFn, moduleMetadata } from '@storybook/angular';

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
const Template: StoryFn<DropdownComponent> = (args: DropdownComponent) => ({
  props: args,
});

export const DropdownDefaultButton = Template.bind({});
DropdownDefaultButton.args = {
  buttonStyle: 'default',
};

export const DropdownPrimaryButton = Template.bind({});
DropdownPrimaryButton.args = {
  buttonStyle: 'primary',
};

export const DropdownLinkButton = Template.bind({});
DropdownLinkButton.args = {
  buttonStyle: 'link',
};

export const DropdownDisabledButton = Template.bind({});
DropdownDisabledButton.args = {
  disabledFlag: true,
};

export const DropdownLeftAligned = Template.bind({});
DropdownLeftAligned.args = {
  horizontalAlignment: 'left',
};

export const DropdownRightAligned = Template.bind({});
DropdownRightAligned.args = {
  horizontalAlignment: 'right',
};

export const DropdownCenterAligned = Template.bind({});
DropdownCenterAligned.args = {
  horizontalAlignment: 'center',
};
