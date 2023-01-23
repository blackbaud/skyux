import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { ValidationComponent } from './validation.component';
import { ValidationModule } from './validation.module';

export default {
  id: 'validationcomponent-validation',
  title: 'Components/Validation',
  component: ValidationComponent,
  decorators: [
    moduleMetadata({
      imports: [ValidationModule],
    }),
  ],
} as Meta<ValidationComponent>;
const Template: Story<ValidationComponent> = (args: ValidationComponent) => ({
  props: args,
});
export const Validation = Template.bind({});
Validation.args = {};
