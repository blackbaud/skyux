import { Meta, moduleMetadata } from '@storybook/angular';

import { ErrorsComponent } from './errors.component';
import { ErrorsModule } from './errors.module';

export default {
  id: 'errorscomponent-errors',
  title: 'Components/Errors',
  component: ErrorsComponent,
  decorators: [
    moduleMetadata({
      imports: [ErrorsModule],
    }),
  ],
} as Meta<ErrorsComponent>;
export const Errors = {
  render: (args: ErrorsComponent) => ({
    props: args,
  }),
  args: {},
};
