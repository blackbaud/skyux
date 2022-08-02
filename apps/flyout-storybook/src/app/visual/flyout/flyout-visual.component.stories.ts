import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { VisualModule } from '../visual.module';

import { FlyoutVisualComponent } from './flyout-visual.component';

export default {
  id: 'flyoutvisualcomponent-flyoutvisual',
  title: 'Components/Flyout',
  component: FlyoutVisualComponent,
  decorators: [
    moduleMetadata({
      imports: [VisualModule],
    }),
  ],
} as Meta<FlyoutVisualComponent>;
const Template: Story<FlyoutVisualComponent> = (
  args: FlyoutVisualComponent
) => ({
  props: args,
});
export const Flyout = Template.bind({});
Flyout.args = {};
