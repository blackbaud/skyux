import { Meta, moduleMetadata } from '@storybook/angular';

import { PhoneFieldComponent } from './phone-field.component';
import { PhoneFieldModule } from './phone-field.module';

export default {
  id: 'phonefieldcomponent-phonefield',
  title: 'Components/Phone Field',
  component: PhoneFieldComponent,
  decorators: [
    moduleMetadata({
      imports: [PhoneFieldModule],
    }),
  ],
} as Meta<PhoneFieldComponent>;
export const PhoneField = {
  render: (args: PhoneFieldComponent): { props: unknown } => ({ props: args }),
  args: {},
};
