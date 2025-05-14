import { Meta, moduleMetadata } from '@storybook/angular';

import { VerticalTabsComponent } from './vertical-tabs.component';
import { VerticalTabsModule } from './vertical-tabs.module';

export default {
  id: 'verticaltabscomponent-verticaltabs',
  title: 'Components/Vertical Tabs',
  component: VerticalTabsComponent,
  decorators: [
    moduleMetadata({
      imports: [VerticalTabsModule],
    }),
  ],
} as Meta<VerticalTabsComponent>;
export const VerticalTabs = {
  render: (args: VerticalTabsComponent): { props: unknown } => ({
    props: args,
  }),
  args: {},
};
