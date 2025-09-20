import { Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

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
type Story = StoryObj<AffixComponent>;

export const Affix: Story = {};
Affix.args = {
  wide: false,
};

export const AffixOverflow: Story = {};
AffixOverflow.args = {
  wide: true,
};
