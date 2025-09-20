import { Meta, moduleMetadata } from '@storybook/angular';

import { PagingComponent } from './paging.component';
import { PagingModule } from './paging.module';

export default {
  id: 'pagingcomponent-paging',
  title: 'Components/Paging',
  component: PagingComponent,
  decorators: [
    moduleMetadata({
      imports: [PagingModule],
    }),
  ],
} as Meta<PagingComponent>;
export const Paging = {
  render: (args: PagingComponent): { props: unknown } => ({ props: args }),
  args: {},
};
