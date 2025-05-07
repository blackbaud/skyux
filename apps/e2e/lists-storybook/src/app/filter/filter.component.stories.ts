import { Meta, moduleMetadata } from '@storybook/angular';

import { FilterComponent } from './filter.component';
import { FilterModule } from './filter.module';

export default {
  id: 'filtercomponent-filter',
  title: 'Components/Filter',
  component: FilterComponent,
  decorators: [
    moduleMetadata({
      imports: [FilterModule],
    }),
  ],
} as Meta<FilterComponent>;
export const Filter = {
  render: (args: FilterComponent): { props: unknown } => ({ props: args }),
  args: {},
};
