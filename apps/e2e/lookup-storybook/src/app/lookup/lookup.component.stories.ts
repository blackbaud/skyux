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
const LookupStory: StoryFn<LookupComponent> = (args: LookupComponent) => ({
  props: args,
});

export const Lookup = LookupStory.bind({});
Lookup.args = {};
