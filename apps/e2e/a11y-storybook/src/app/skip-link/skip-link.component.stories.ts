import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { SkipLinkComponent } from './skip-link.component';
import { SkipLinkModule } from './skip-link.module';

export default {
  id: 'skiplinkcomponent-skiplink',
  title: 'Components/Skip Link',
  component: SkipLinkComponent,
  decorators: [
    moduleMetadata({
      imports: [SkipLinkModule],
    }),
  ],
} as Meta<SkipLinkComponent>;
const Template: Story<SkipLinkComponent> = (args: SkipLinkComponent) => ({
  props: args,
});
export const SkipLink = Template.bind({});
SkipLink.args = {};
