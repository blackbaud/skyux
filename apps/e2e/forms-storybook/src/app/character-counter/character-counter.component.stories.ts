import { Meta, moduleMetadata } from '@storybook/angular';

import { CharacterCounterComponent } from './character-counter.component';
import { CharacterCounterModule } from './character-counter.module';

export default {
  id: 'charactercountercomponent-charactercounter',
  title: 'Components/Character Counter',
  component: CharacterCounterComponent,
  decorators: [
    moduleMetadata({
      imports: [CharacterCounterModule],
    }),
  ],
} as Meta<CharacterCounterComponent>;
export const CharacterCounter = {
  render: (args: CharacterCounterComponent): { props: unknown } => ({
    props: args,
  }),
  args: {},
};
