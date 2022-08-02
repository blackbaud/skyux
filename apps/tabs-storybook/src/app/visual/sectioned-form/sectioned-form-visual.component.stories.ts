import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { VisualModule } from '../visual.module';

import { SectionedFormVisualComponent } from './sectioned-form-visual.component';

export default {
  id: 'sectionedformvisualcomponent-sectionedformvisual',
  title: 'Components/Sectioned Form',
  component: SectionedFormVisualComponent,
  decorators: [
    moduleMetadata({
      imports: [VisualModule],
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
