import { Meta, moduleMetadata } from '@storybook/angular';

import { SortComponent } from './sort.component';
import { SortModule } from './sort.module';

export default {
  id: 'sortcomponent-sort',
  title: 'Components/Sort',
  component: SortComponent,
  decorators: [
    moduleMetadata({
      imports: [SortModule],
    }),
  ],
} as Meta<SortComponent>;
export const Sort = {
  render: (args: SortComponent): { props: unknown } => ({ props: args }),
  args: {},
};
