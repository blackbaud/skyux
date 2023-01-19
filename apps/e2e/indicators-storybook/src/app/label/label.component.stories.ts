import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { LabelComponent } from './label.component';
import { LabelModule } from './label.module';

/* spell-checker:ignore labelcomponent */
export default {
  id: 'labelcomponent-label',
  title: 'Components/Label',
  component: LabelComponent,
  decorators: [
    moduleMetadata({
      imports: [LabelModule],
    }),
  ],
} as Meta<LabelComponent>;
const Template: Story<LabelComponent> = (args: LabelComponent) => ({
  props: args,
});
export const Label = Template.bind({});
Label.args = {};
