import { Meta, moduleMetadata } from '@storybook/angular';

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
export const Dropdown = {
  render: (args: DropdownComponent) => ({
    props: args,
  }),
  args: {},
};
