import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { DropdownVisualComponent } from './dropdown-visual.component';

export default {
  title: 'Components/Popovers/Dropdown',
  component: DropdownVisualComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<DropdownVisualComponent>;

const Template: Story<DropdownVisualComponent> = (
  args: DropdownVisualComponent
) => ({
  props: args,
});

export const Dropdown = Template.bind({});
Dropdown.args = {};
