import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { KeyInfoComponent } from './key-info.component';
import { KeyInfoModule } from './key-info.module';

/* spell-checker:ignore keyinfocomponent */
export default {
  id: 'keyinfocomponent-keyinfo',
  title: 'Components/Key Info',
  component: KeyInfoComponent,
  decorators: [
    moduleMetadata({
      imports: [KeyInfoModule],
    }),
  ],
} as Meta<KeyInfoComponent>;
const Template: Story<KeyInfoComponent> = (args: KeyInfoComponent) => ({
  props: args,
});
export const KeyInfo = Template.bind({});
KeyInfo.args = {};
