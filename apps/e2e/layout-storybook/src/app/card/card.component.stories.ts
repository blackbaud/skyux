import { Meta, moduleMetadata } from '@storybook/angular';

import { CardComponent } from './card.component';
import { CardModule } from './card.module';

export default {
  id: 'cardcomponent-card',
  title: 'Components/Card',
  component: CardComponent,
  decorators: [
    moduleMetadata({
      imports: [CardModule],
    }),
  ],
} as Meta<CardComponent>;
export const Card = {
  render: (args: CardComponent): { props: unknown } => ({
    props: args,
  }),
  args: {},
};
