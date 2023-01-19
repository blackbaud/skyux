import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { DockComponent } from './dock.component';
import { DockModule } from './dock.module';

/* spell-checker:ignore dockcomponent */
export default {
  id: 'dockcomponent-dock',
  title: 'Components/Dock',
  component: DockComponent,
  decorators: [
    moduleMetadata({
      imports: [DockModule],
    }),
  ],
} as Meta<DockComponent>;
const Template: Story<DockComponent> = (args: DockComponent) => ({
  props: args,
});
export const Dock = Template.bind({});
Dock.args = {};
