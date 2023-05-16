import { Meta, Story, moduleMetadata } from '@storybook/angular';

import BoxPageComponent from './box-page.component';

export default {
  id: 'boxpagecomponent-boxpage',
  title: 'Components/Page/Layouts/Box',
  component: BoxPageComponent,
  decorators: [
    moduleMetadata({
      imports: [BoxPageComponent],
    }),
  ],
} as Meta<BoxPageComponent>;
const Template: Story<BoxPageComponent> = (args: BoxPageComponent) => ({
  props: args,
});
export const BoxPage = Template.bind({});
BoxPage.args = {};
