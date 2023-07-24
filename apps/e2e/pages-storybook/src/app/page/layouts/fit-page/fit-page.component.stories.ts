import { Meta, Story, moduleMetadata } from '@storybook/angular';

import FitPageComponent from './fit-page.component';

export default {
  id: 'fitpagecomponent-fitpage',
  title: 'Components/Page/Layouts/Fit',
  component: FitPageComponent,
  decorators: [
    moduleMetadata({
      imports: [FitPageComponent],
    }),
  ],
} as Meta<FitPageComponent>;
const Template: Story<FitPageComponent> = (args: FitPageComponent) => ({
  props: args,
});
export const FitPage = Template.bind({});
FitPage.args = {};
