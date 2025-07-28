import { Meta, moduleMetadata } from '@storybook/angular';

import { ListViewGridComponent } from './list-view-grid.component';
import { ListViewGridModule } from './list-view-grid.module';

export default {
  id: 'listviewgridcomponent-listviewgrid',
  title: 'Components/List View Grid',
  component: ListViewGridComponent,
  decorators: [
    moduleMetadata({
      imports: [ListViewGridModule],
    }),
  ],
} as Meta<ListViewGridComponent>;
export const ListViewGrid = {
  render: (args: ListViewGridComponent): { props: unknown } => ({
    props: args,
  }),
  args: {},
};
