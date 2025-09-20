import { Meta, moduleMetadata } from '@storybook/angular';

import { DescriptionListComponent } from './description-list.component';
import { DescriptionListModule } from './description-list.module';

export default {
  id: 'descriptionlistcomponent-descriptionlist',
  title: 'Components/Description List',
  component: DescriptionListComponent,
  decorators: [
    moduleMetadata({
      imports: [DescriptionListModule],
    }),
  ],
} as Meta<DescriptionListComponent>;
export const DescriptionList = {
  render: (args: DescriptionListComponent): { props: unknown } => ({
    props: args,
  }),
  args: {},
};
