import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { VisualModule } from '../visual.module';

import { VerticalTabsVisualComponent } from './vertical-tabs-visual.component';

export default {
  id: 'verticaltabsvisualcomponent-verticaltabsvisual',
  title: 'Components/Vertical Tabs',
  component: VerticalTabsVisualComponent,
  decorators: [
    moduleMetadata({
      imports: [VisualModule],
    }),
  ],
} as Meta<VerticalTabsVisualComponent>;
const Template: Story<VerticalTabsVisualComponent> = (
  args: VerticalTabsVisualComponent
) => ({
  props: args,
});
export const VerticalTabs = Template.bind({});
VerticalTabs.args = {};
