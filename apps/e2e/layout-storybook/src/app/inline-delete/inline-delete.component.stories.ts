import { Meta, moduleMetadata } from '@storybook/angular';

import { InlineDeleteComponent } from './inline-delete.component';
import { InlineDeleteModule } from './inline-delete.module';

export default {
  id: 'inlinedeletecomponent-inlinedelete',
  title: 'Components/Inline Delete',
  component: InlineDeleteComponent,
  decorators: [
    moduleMetadata({
      imports: [InlineDeleteModule],
    }),
  ],
} as Meta<InlineDeleteComponent>;
export const InlineDelete = {
  render: (args: InlineDeleteComponent): { props: unknown } => ({
    props: args,
  }),
  args: {},
};
