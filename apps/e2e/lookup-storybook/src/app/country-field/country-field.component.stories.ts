import { moduleMetadata } from '@storybook/angular';
import type { Meta, StoryObj } from '@storybook/angular';

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
type Story = StoryObj<CountryFieldComponent>;

export const EmptyCountryField: Story = {};
EmptyCountryField.args = {};

export const DisabledCountryField: Story = {};
DisabledCountryField.args = {
  disabledFlag: true,
};

export const PrepopulatedCountryField: Story = {};
PrepopulatedCountryField.args = {
  prePopulatedFlag: true,
};

export const DisabledPrepopulatedCountryField: Story = {};
DisabledPrepopulatedCountryField.args = {
  disabledFlag: true,
  prePopulatedFlag: true,
};
