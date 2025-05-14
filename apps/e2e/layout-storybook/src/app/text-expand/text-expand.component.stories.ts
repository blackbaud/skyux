import { Meta, moduleMetadata } from '@storybook/angular';

import { TextExpandComponent } from './text-expand.component';
import { TextExpandModule } from './text-expand.module';

export default {
  id: 'textexpandcomponent-textexpand',
  title: 'Components/Text Expand',
  component: TextExpandComponent,
  decorators: [
    moduleMetadata({
      imports: [TextExpandModule],
    }),
  ],
} as Meta<TextExpandComponent>;
export const TextExpand = {
  render: (args: TextExpandComponent): { props: unknown } => ({ props: args }),
  args: {},
};
