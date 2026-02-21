import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { SwitchControlsComponent } from './switch-controls.component';
import { SwitchControlsModule } from './switch-controls.module';

export default {
  id: 'switchcontrolscomponent-switchcontrols',
  title: 'Components/Switch Controls',
  component: SwitchControlsComponent,
  decorators: [
    moduleMetadata({
      imports: [SwitchControlsModule],
    }),
  ],
} as Meta<SwitchControlsComponent>;
type Story = StoryObj<SwitchControlsComponent>;
export const SwitchControls: Story = {};
SwitchControls.args = {};
