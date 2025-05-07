import { Meta, moduleMetadata } from '@storybook/angular';

import { ChevronComponent } from './chevron.component';
import { ChevronModule } from './chevron.module';

export default {
  id: 'chevroncomponent-chevron',
  title: 'Components/Chevron',
  component: ChevronComponent,
  decorators: [
    moduleMetadata({
      imports: [ChevronModule],
    }),
  ],
} as Meta<ChevronComponent>;
export const Chevron = {
  render: (args: ChevronComponent): { props: unknown } => ({ props: args }),
  args: {},
};
