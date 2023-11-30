import { Meta, StoryFn, moduleMetadata } from '@storybook/angular';

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
const BaseCountryField: StoryFn<CountryFieldComponent> = (
  args: CountryFieldComponent
) => ({
  props: args,
});

export const EmptyCountryField = BaseCountryField.bind({});

export const PhoneInfoCountryField = BaseCountryField.bind({});
PhoneInfoCountryField.args = {
  phoneInfoFlag: true,
};

export const DisabledCountryField = BaseCountryField.bind({});
DisabledCountryField.args = {
  disabledFlag: true,
};

export const PrepopulatedCountryField = BaseCountryField.bind({});
PrepopulatedCountryField.args = {
  prePopulatedFlag: true,
};

export const HideFlagPrepopulatedCountryField = BaseCountryField.bind({});
HideFlagPrepopulatedCountryField.args = {
  hideCountryFlag: true,
  prePopulatedFlag: true,
};

export const DisabledPrepopulatedCountryField = BaseCountryField.bind({});
DisabledPrepopulatedCountryField.args = {
  disabledFlag: true,
  prePopulatedFlag: true,
};
