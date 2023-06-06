import { Meta, StoryFn, moduleMetadata } from '@storybook/angular';

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
const Flyout: StoryFn<FlyoutComponent> = (args: FlyoutComponent) => ({
  props: args,
});

export const FlyoutStandard = Flyout.bind({});

export const FlyoutHeaderButtons = Flyout.bind({});
FlyoutHeaderButtons.args = { showHeaderButtons: true };

export const FlyoutResponsiveXs = Flyout.bind({});
FlyoutResponsiveXs.args = { responsive: 'xs' };

export const FlyoutResponsiveSm = Flyout.bind({});
FlyoutResponsiveSm.args = { responsive: 'sm' };

export const FlyoutResponsiveMd = Flyout.bind({});
FlyoutResponsiveMd.args = { responsive: 'md' };

export const FlyoutResponsiveLg = Flyout.bind({});
FlyoutResponsiveLg.args = { responsive: 'lg' };
