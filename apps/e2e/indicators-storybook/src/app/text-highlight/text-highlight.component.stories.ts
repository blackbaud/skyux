import { Meta, moduleMetadata } from '@storybook/angular';

import { TextHighlightComponent } from './text-highlight.component';
import { TextHighlightModule } from './text-highlight.module';

export default {
  id: 'texthighlightcomponent-texthighlight',
  title: 'Components/Text Highlight',
  component: TextHighlightComponent,
  decorators: [
    moduleMetadata({
      imports: [TextHighlightModule],
    }),
  ],
} as Meta<TextHighlightComponent>;
export const TextHighlight = {
  render: (args: TextHighlightComponent): { props: unknown } => ({
    props: args,
  }),
  args: {},
};
