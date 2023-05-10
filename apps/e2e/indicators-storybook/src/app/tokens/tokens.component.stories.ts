import { importProvidersFrom } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  Meta,
  Story,
  applicationConfig,
  moduleMetadata,
} from '@storybook/angular';

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
    // Define application-wide providers with the applicationConfig decorator
    applicationConfig({
      providers: [importProvidersFrom(NoopAnimationsModule)],
    }),
  ],
} as Meta<TokensComponent>;
const Template: Story<TokensComponent> = (args: TokensComponent) => ({
  props: args,
});
export const Tokens = Template.bind({});
Tokens.args = {};
