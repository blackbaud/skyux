import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { IconComponent } from './icon.component';
import { IconModule } from './icon.module';

export default {
  id: 'iconcomponent-icon',
  title: 'Components/Icon',
  component: IconComponent,
  decorators: [
    moduleMetadata({
      imports: [IconModule],
    }),
  ],
} as Meta<IconComponent>;
const Template: Story<IconComponent> = (args: IconComponent) => ({
  props: args,
});
export const Icon = Template.bind({});
Icon.args = {};
