import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { SwitchControlsComponent } from './switch-controls.component';
import { SwitchControlsModule } from './switch-controls.module';

/* spell-checker:ignore switchcontrolscomponent, switchcontrols */
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
const Template: Story<SwitchControlsComponent> = (
  args: SwitchControlsComponent
) => ({
  props: args,
});
export const SwitchControls = Template.bind({});
SwitchControls.args = {};
