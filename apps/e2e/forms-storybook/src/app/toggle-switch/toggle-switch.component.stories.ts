import { Meta, moduleMetadata } from '@storybook/angular';

import { ToggleSwitchComponent } from './toggle-switch.component';
import { ToggleSwitchModule } from './toggle-switch.module';

export default {
  id: 'toggleswitchcomponent-toggleswitch',
  title: 'Components/Toggle Switch',
  component: ToggleSwitchComponent,
  decorators: [
    moduleMetadata({
      imports: [ToggleSwitchModule],
    }),
  ],
} as Meta<ToggleSwitchComponent>;
export const ToggleSwitch = {
  render: (args: ToggleSwitchComponent): { props: unknown } => ({
    props: args,
  }),
  args: {},
};
