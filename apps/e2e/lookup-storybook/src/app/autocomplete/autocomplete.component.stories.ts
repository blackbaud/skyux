import { Meta, moduleMetadata } from '@storybook/angular';

import { AutocompleteComponent } from './autocomplete.component';
import { AutocompleteModule } from './autocomplete.module';

export default {
  id: 'autocompletecomponent-autocomplete',
  title: 'Components/Autocomplete',
  component: AutocompleteComponent,
  decorators: [
    moduleMetadata({
      imports: [AutocompleteModule],
    }),
  ],
} as Meta<AutocompleteComponent>;
export const Autocomplete = {
  render: (args: AutocompleteComponent): { props: unknown } => ({
    props: args,
  }),
  args: {},
};
