import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { VisualModule } from '../visual.module';

import { DropdownVisualComponent } from './dropdown-visual.component';

export default {
  id: 'dropdownvisualcomponent-dropdownvisual',
  title: 'Components/Dropdown',
  component: DropdownVisualComponent,
  decorators: [
    moduleMetadata({
      imports: [VisualModule],
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
