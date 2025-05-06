import { Meta, moduleMetadata } from '@storybook/angular';

import { SelectionBoxComponent } from './selection-box.component';
import { SelectionBoxModule } from './selection-box.module';

export default {
  id: 'selectionboxcomponent-selectionbox',
  title: 'Components/Selection Box',
  component: SelectionBoxComponent,
  decorators: [
    moduleMetadata({
      imports: [SelectionBoxModule],
    }),
  ],
} as Meta<SelectionBoxComponent>;
export const SelectionBox = {
  render: (args: SelectionBoxComponent): { props: unknown } => ({
    props: args,
  }),
  args: {},
};
