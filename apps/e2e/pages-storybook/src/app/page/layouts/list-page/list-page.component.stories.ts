import { Meta, Story, moduleMetadata } from '@storybook/angular';

import ListPageComponent from './list-page.component';

export default {
  id: 'listpagecomponent-listpage',
  title: 'Components/Page/Layouts/List',
  component: ListPageComponent,
  decorators: [
    moduleMetadata({
      imports: [ListPageComponent],
    }),
  ],
} as Meta<ListPageComponent>;
const Template: Story<ListPageComponent> = (args: ListPageComponent) => ({
  props: args,
});
export const ListPage = Template.bind({});
ListPage.args = {};
