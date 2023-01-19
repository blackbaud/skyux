import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { TokensComponent } from './tokens.component';
import { TokensModule } from './tokens.module';

/* spell-checker:ignore tokenscomponent */
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
const Template: Story<TokensComponent> = (args: TokensComponent) => ({
  props: args,
});
export const Tokens = Template.bind({});
Tokens.args = {};
