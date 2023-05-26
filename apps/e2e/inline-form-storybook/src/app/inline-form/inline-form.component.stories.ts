import { Meta, moduleMetadata } from '@storybook/angular';

import { InlineFormComponent } from './inline-form.component';
import { InlineFormModule } from './inline-form.module';

export default {
  id: 'inlineformcomponent-inlineform',
  title: 'Components/Inline Form',
  component: InlineFormComponent,
  decorators: [
    moduleMetadata({
      imports: [InlineFormModule],
    }),
  ],
} as Meta<InlineFormComponent>;
export const InlineForm = {
  render: (args: InlineFormComponent) => ({
    props: args,
  }),
  args: {},
};
