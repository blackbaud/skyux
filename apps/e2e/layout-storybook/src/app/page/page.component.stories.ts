import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { PageComponent } from './page.component';
import { PageModule } from './page.module';

export default {
  id: 'pagecomponent-page',
  title: 'Components/Page',
  component: PageComponent,
  decorators: [
    moduleMetadata({
      imports: [PageModule],
    }),
  ],
} as Meta<PageComponent>;
const Template: Story<PageComponent> = (args: PageComponent) => ({
  props: args,
});
export const Page = Template.bind({});
Page.args = {};
