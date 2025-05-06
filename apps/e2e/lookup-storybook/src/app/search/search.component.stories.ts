import { Meta, moduleMetadata } from '@storybook/angular';

import { SearchComponent } from './search.component';
import { SearchModule } from './search.module';

export default {
  id: 'searchcomponent-search',
  title: 'Components/Search',
  component: SearchComponent,
  decorators: [
    moduleMetadata({
      imports: [SearchModule],
    }),
  ],
} as Meta<SearchComponent>;
export const Search = {
  render: (args: SearchComponent): { props: unknown } => ({ props: args }),
  args: {},
};
