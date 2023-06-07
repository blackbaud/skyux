import { Meta, StoryFn, moduleMetadata } from '@storybook/angular';

import { LookupComponent } from './lookup.component';
import { LookupModule } from './lookup.module';

export default {
  id: 'lookupcomponent-lookup',
  title: 'Components/Lookup',
  component: LookupComponent,
  decorators: [
    moduleMetadata({
      imports: [LookupModule],
    }),
  ],
} as Meta<LookupComponent>;
const BaseLookup: StoryFn<LookupComponent> = (args: LookupComponent) => ({
  props: args,
});

export const LookupSingleMode = BaseLookup.bind({});
LookupSingleMode.args = {
  selectMode: 'single',
};

export const LookupMultipleMode = BaseLookup.bind({});
LookupMultipleMode.args = {
  selectMode: 'multiple',
};

export const LookupDisabled = BaseLookup.bind({});
LookupDisabled.args = {
  disabledFlag: true,
};
