import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { VisualModule } from '../visual.module';

import { PageHeaderVisualComponent } from './page-header-visual.component';

export default {
  id: 'pageheadervisualcomponent-pageheadervisual',
  title: 'Components/Page Header',
  component: PageHeaderVisualComponent,
  decorators: [
    moduleMetadata({
      imports: [VisualModule],
    }),
  ],
} as Meta<PageHeaderVisualComponent>;
const Template: Story<PageHeaderVisualComponent> = (
  args: PageHeaderVisualComponent
) => ({
  props: args,
});
export const PageHeader = Template.bind({});
PageHeader.args = {};
