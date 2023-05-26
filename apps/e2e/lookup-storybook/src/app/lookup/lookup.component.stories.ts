import { Meta, moduleMetadata } from '@storybook/angular';

import { LookupComponent } from './lookup.component';
import { LookupModule } from './lookup.module';

export default {
  id: 'lookupcomponent-lookup',
  title: 'Components/Lookup',
  component: LookupComponent,
  decorators: [
    moduleMetadata({
      imports: [LookupModule],
    }),
  ],
} as Meta<LookupComponent>;
export const Lookup = {
  render: (args: LookupComponent) => ({
    props: args,
  }),
  args: {},
};
