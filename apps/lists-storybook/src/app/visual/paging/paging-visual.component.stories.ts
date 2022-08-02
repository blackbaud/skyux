import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { VisualModule } from '../visual.module';

import { PagingVisualComponent } from './paging-visual.component';

export default {
  id: 'pagingvisualcomponent-pagingvisual',
  title: 'Components/Paging',
  component: PagingVisualComponent,
  decorators: [
    moduleMetadata({
      imports: [VisualModule],
    }),
  ],
} as Meta<PagingVisualComponent>;
const Template: Story<PagingVisualComponent> = (
  args: PagingVisualComponent
) => ({
  props: args,
});
export const Paging = Template.bind({});
Paging.args = {};
