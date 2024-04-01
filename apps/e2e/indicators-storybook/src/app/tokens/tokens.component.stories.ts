import { moduleMetadata } from '@storybook/angular';
import type { Meta, StoryObj } from '@storybook/angular';

import { TokensComponent } from './tokens.component';
import { TokensModule } from './tokens.module';

export default {
  id: 'tokenscomponent-tokens',
  title: 'Components/Tokens',
  component: TokensComponent,
  decorators: [
    moduleMetadata({
      imports: [TokensModule],
    }),
  ],
} as Meta<TokensComponent>;
type Story = StoryObj<TokensComponent>;
export const Tokens: Story = {};
Tokens.args = {};
