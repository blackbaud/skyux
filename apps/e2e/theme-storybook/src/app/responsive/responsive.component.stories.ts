import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { ResponsiveComponent } from './responsive.component';
import { ResponsiveModule } from './responsive.module';

export default {
  id: 'responsivecomponent-responsive',
  title: 'Components/Responsive',
  component: ResponsiveComponent,
  decorators: [
    moduleMetadata({
      imports: [ResponsiveModule],
    }),
  ],
} as Meta<ResponsiveComponent>;
const Template: Story<ResponsiveComponent> = (args: ResponsiveComponent) => ({
  props: args,
});
export const Responsive = Template.bind({});
Responsive.args = {};
