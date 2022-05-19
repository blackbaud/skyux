import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { SectionedFormVisualComponent } from './sectioned-form-visual.component';

export default {
  title: 'Components/Tabs/Sectioned Form',
  component: SectionedFormVisualComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<SectionedFormVisualComponent>;

const Template: Story<SectionedFormVisualComponent> = (
  args: SectionedFormVisualComponent
) => ({
  props: args,
});

export const SectionedForm = Template.bind({});
SectionedForm.args = {};
