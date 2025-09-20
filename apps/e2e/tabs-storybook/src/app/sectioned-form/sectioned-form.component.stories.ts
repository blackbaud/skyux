import { Meta, moduleMetadata } from '@storybook/angular';

import { SectionedFormComponent } from './sectioned-form.component';
import { SectionedFormModule } from './sectioned-form.module';

export default {
  id: 'sectionedformcomponent-sectionedform',
  title: 'Components/Sectioned Form',
  component: SectionedFormComponent,
  decorators: [
    moduleMetadata({
      imports: [SectionedFormModule],
    }),
  ],
} as Meta<SectionedFormComponent>;
export const SectionedForm = {
  render: (args: SectionedFormComponent): { props: unknown } => ({
    props: args,
  }),
  args: {},
};
