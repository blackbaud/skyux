import { Meta, moduleMetadata } from '@storybook/angular';

import { TextExpandRepeaterComponent } from './text-expand-repeater.component';
import { TextExpandRepeaterModule } from './text-expand-repeater.module';

export default {
  id: 'textexpandrepeatercomponent-textexpandrepeater',
  title: 'Components/Text Expand Repeater',
  component: TextExpandRepeaterComponent,
  decorators: [
    moduleMetadata({
      imports: [TextExpandRepeaterModule],
    }),
  ],
} as Meta<TextExpandRepeaterComponent>;
export const TextExpandRepeater = {
  render: (args: TextExpandRepeaterComponent): { props: unknown } => ({
    props: args,
  }),
  args: {},
};
