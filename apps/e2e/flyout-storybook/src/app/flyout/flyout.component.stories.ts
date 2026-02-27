import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

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
type Story = StoryObj<FlyoutComponent>;

export const FlyoutStandard: Story = {};
FlyoutStandard.args = {};

export const FlyoutHeaderButtons: Story = {};
FlyoutHeaderButtons.args = { showHeaderButtons: true };

export const FlyoutResponsiveXs: Story = {};
FlyoutResponsiveXs.args = { responsive: 'xs' };

export const FlyoutResponsiveSm: Story = {};
FlyoutResponsiveSm.args = { responsive: 'sm' };

export const FlyoutResponsiveMd: Story = {};
FlyoutResponsiveMd.args = { responsive: 'md' };

export const FlyoutResponsiveLg: Story = {};
FlyoutResponsiveLg.args = { responsive: 'lg' };
