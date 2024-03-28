import { moduleMetadata } from '@storybook/angular';
import type { Meta, StoryObj } from '@storybook/angular';

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
  ],
} as Meta<PageComponent>;
type Story = StoryObj<PageComponent>;
export const Page: Story = {};
Page.args = {};
