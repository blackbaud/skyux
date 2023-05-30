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

export const DropdownSelectLeftAligned = Template.bind({});
DropdownSelectLeftAligned.args = {
  buttonType: 'select',
  horizontalAlignment: 'left',
};

export const DropdownSelectRightAligned = Template.bind({});
DropdownSelectLeftAligned.args = {
  buttonType: 'select',
  horizontalAlignment: 'right',
};

export const DropdownSelectCenterAligned = Template.bind({});
DropdownSelectLeftAligned.args = {
  buttonType: 'select',
  horizontalAlignment: 'center',
};

export const DropdownContextMenuLeftAligned = Template.bind({});
DropdownSelectLeftAligned.args = {
  buttonType: 'context-menu',
  horizontalAlignment: 'left',
};

export const DropdownContextMenuRightAligned = Template.bind({});
DropdownSelectLeftAligned.args = {
  buttonType: 'context-menu',
  horizontalAlignment: 'right',
};

export const DropdownContextMenuCenterAligned = Template.bind({});
DropdownSelectLeftAligned.args = {
  buttonType: 'context-menu',
  horizontalAlignment: 'center',
};

export const DropdownTabLeftAligned = Template.bind({});
DropdownSelectLeftAligned.args = {
  buttonType: 'tab',
  horizontalAlignment: 'left',
};

export const DropdownTabRightAligned = Template.bind({});
DropdownSelectLeftAligned.args = {
  buttonType: 'tab',
  horizontalAlignment: 'right',
};

export const DropdownTabCenterAligned = Template.bind({});
DropdownSelectLeftAligned.args = {
  buttonType: 'tab',
  horizontalAlignment: 'center',
};
