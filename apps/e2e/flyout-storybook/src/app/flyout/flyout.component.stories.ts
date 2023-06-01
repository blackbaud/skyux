import { Meta, moduleMetadata } from '@storybook/angular';

import { FlyoutComponent } from './flyout.component';
import { FlyoutModule } from './flyout.module';

export default {
  id: 'flyoutcomponent-flyout',
  title: 'Components/Flyout',
  component: FlyoutComponent,
  decorators: [
    moduleMetadata({
      imports: [FlyoutModule],
    }),
  ],
} as Meta<FlyoutComponent>;
export const Flyout = {
  render: (args: FlyoutComponent) => ({
    props: args,
  }),
  args: {},
};
