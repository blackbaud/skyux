import { Meta, moduleMetadata } from '@storybook/angular';

import { AffixComponent } from './affix.component';
import { AffixModule } from './affix.module';

export default {
  id: 'affixcomponent-affix',
  title: 'Components/Affix',
  component: AffixComponent,
  decorators: [
    moduleMetadata({
      imports: [AffixModule],
    }),
  ],
} as Meta<AffixComponent>;
export const Affix = {
  render: (args: AffixComponent) => ({
    props: args,
  }),
  args: {},
};
