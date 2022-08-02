import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { VisualModule } from '../visual.module';

import { RepeaterVisualComponent } from './repeater-visual.component';

export default {
  id: 'repeatervisualcomponent-repeatervisual',
  title: 'Components/Repeater',
  component: RepeaterVisualComponent,
  decorators: [
    moduleMetadata({
      imports: [VisualModule],
    }),
  ],
} as Meta<RepeaterVisualComponent>;
const Template: Story<RepeaterVisualComponent> = (
  args: RepeaterVisualComponent
) => ({
  props: args,
});
export const Repeater = Template.bind({});
Repeater.args = {};
