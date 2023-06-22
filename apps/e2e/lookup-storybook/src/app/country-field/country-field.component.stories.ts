import { Meta, moduleMetadata } from '@storybook/angular';

import { CountryFieldComponent } from './country-field.component';
import { CountryFieldModule } from './country-field.module';

export default {
  id: 'countryfieldcomponent-countryfield',
  title: 'Components/Country Field',
  component: CountryFieldComponent,
  decorators: [
    moduleMetadata({
      imports: [CountryFieldModule],
    }),
  ],
} as Meta<CountryFieldComponent>;
export const CountryField = {
  render: (args: CountryFieldComponent) => ({
    props: args,
  }),
  args: {},
};
