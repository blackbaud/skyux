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
const CountryFieldStory: StoryFn<CountryFieldComponent> = (
  args: CountryFieldComponent
) => ({
  props: args,
});

export const CountryField = CountryFieldStory.bind({});
CountryField.args = {};
