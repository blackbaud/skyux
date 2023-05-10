import { importProvidersFrom } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  Meta,
  Story,
  applicationConfig,
  moduleMetadata,
} from '@storybook/angular';

import { PageComponent } from './page.component';
import { PageModule } from './page.module';

export default {
  id: 'pagecomponent-page',
  title: 'Components/Page',
  component: PageComponent,
  decorators: [
    moduleMetadata({
      imports: [PageModule],
    }),
    // Define application-wide providers with the applicationConfig decorator
    applicationConfig({
      providers: [importProvidersFrom(NoopAnimationsModule)],
    }),
  ],
} as Meta<PageComponent>;
const Template: Story<PageComponent> = (args: PageComponent) => ({
  props: args,
});
export const Page = Template.bind({});
Page.args = {};
